// ===== CargoLoop Database Layer (Supabase REST API) =====
const SUPABASE_URL = 'https://dncofxskhacrbupoxumy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuY29meHNraGFjcmJ1cG94dW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTc4MjMsImV4cCI6MjA5Mjg3MzgyM30.mj8P6yX-WRBE7SILFwIL9_T8f2NE9sYouYpp6xbeAAs';

const _headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

async function _sbGet(table) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers: _headers });
    if (!res.ok) throw new Error(`GET ${table} failed: ${res.status}`);
    return res.json();
}
async function _sbInsert(table, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: 'POST', headers: _headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(`INSERT ${table} failed: ${res.status}`);
    return res.json();
}
async function _sbUpdate(table, id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method: 'PATCH', headers: _headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(`UPDATE ${table} failed: ${res.status}`);
    return res.json();
}
async function _sbDelete(table, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method: 'DELETE', headers: _headers });
    if (!res.ok) throw new Error(`DELETE ${table} failed: ${res.status}`);
}
async function _sbCount(table) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, { headers: { ..._headers, 'Prefer': 'count=exact' } });
    return parseInt(res.headers.get('content-range')?.split('/')[1] || '0');
}

// ===== DB Object =====
const DB = {
    _cache: { loads: null, trucks: null, shipments: null, analytics: null },
    _online: false,

    async init() {
        // Load local data instantly
        this._loadLocal();
        console.log('DB: Local data ready');

        // Try Supabase in background
        this._syncSupabase();
    },

    _loadLocal() {
        this._cache.loads = generateLoads(60);
        this._cache.trucks = generateTrucks(45);
        this._cache.shipments = generateShipments();
        this._cache.analytics = generateAnalytics();
    },

    async _syncSupabase() {
        try {
            const count = await _sbCount('loads');
            if (count > 0) {
                // Supabase has data — load it
                const [loads, trucks, shipments] = await Promise.all([
                    _sbGet('loads'), _sbGet('trucks'), _sbGet('shipments')
                ]);
                this._cache.loads = loads;
                this._cache.trucks = trucks;
                this._cache.shipments = shipments;
                this._online = true;
                console.log(`DB: Supabase synced (${loads.length} loads, ${trucks.length} trucks, ${shipments.length} shipments)`);
            } else {
                // Seed Supabase with local data
                console.log('DB: Seeding Supabase...');
                // Insert in smaller batches to avoid payload limits
                for (let i = 0; i < this._cache.loads.length; i += 20) {
                    await _sbInsert('loads', this._cache.loads.slice(i, i + 20));
                }
                for (let i = 0; i < this._cache.trucks.length; i += 20) {
                    await _sbInsert('trucks', this._cache.trucks.slice(i, i + 20));
                }
                await _sbInsert('shipments', this._cache.shipments);
                this._online = true;
                console.log('DB: Supabase seeded!');
            }
        } catch (e) {
            console.log('DB: Supabase unavailable, using local:', e.message);
        }
    },

    // ===== READ (cached) =====
    getCachedLoads() { return this._cache.loads || []; },
    getCachedTrucks() { return this._cache.trucks || []; },
    getCachedShipments() { return this._cache.shipments || []; },

    // ===== READ (fresh from DB) =====
    async getLoads() {
        if (this._online) { try { this._cache.loads = await _sbGet('loads'); } catch(e) {} }
        return this._cache.loads || [];
    },
    async getTrucks() {
        if (this._online) { try { this._cache.trucks = await _sbGet('trucks'); } catch(e) {} }
        return this._cache.trucks || [];
    },
    async getShipments() {
        if (this._online) { try { this._cache.shipments = await _sbGet('shipments'); } catch(e) {} }
        return this._cache.shipments || [];
    },

    // ===== CREATE =====
    async addLoad(load) {
        load.id = load.id || ('LD' + Date.now().toString(36).toUpperCase() + randInt(100, 999));
        load.createdAt = new Date().toISOString();
        this._cache.loads.push(load);
        if (this._online) { try { await _sbInsert('loads', load); } catch(e) { console.warn('DB write fail:', e); } }
        return load;
    },
    async addTruck(truck) {
        truck.id = truck.id || ('TK' + Date.now().toString(36).toUpperCase() + randInt(100, 999));
        this._cache.trucks.push(truck);
        if (this._online) { try { await _sbInsert('trucks', truck); } catch(e) { console.warn('DB write fail:', e); } }
        return truck;
    },

    // ===== UPDATE =====
    async updateLoad(id, data) {
        const idx = this._cache.loads.findIndex(l => l.id === id);
        if (idx >= 0) Object.assign(this._cache.loads[idx], data);
        if (this._online) { try { await _sbUpdate('loads', id, data); } catch(e) { console.warn('DB update fail:', e); } }
    },
    async updateTruck(id, data) {
        const idx = this._cache.trucks.findIndex(t => t.id === id);
        if (idx >= 0) Object.assign(this._cache.trucks[idx], data);
        if (this._online) { try { await _sbUpdate('trucks', id, data); } catch(e) { console.warn('DB update fail:', e); } }
    },
    async updateShipment(id, data) {
        const idx = this._cache.shipments.findIndex(s => s.id === id);
        if (idx >= 0) Object.assign(this._cache.shipments[idx], data);
        if (this._online) { try { await _sbUpdate('shipments', id, data); } catch(e) { console.warn('DB update fail:', e); } }
    },

    // ===== DELETE =====
    async deleteLoad(id) {
        this._cache.loads = this._cache.loads.filter(l => l.id !== id);
        if (this._online) { try { await _sbDelete('loads', id); } catch(e) { console.warn('DB delete fail:', e); } }
    },
    async deleteTruck(id) {
        this._cache.trucks = this._cache.trucks.filter(t => t.id !== id);
        if (this._online) { try { await _sbDelete('trucks', id); } catch(e) { console.warn('DB delete fail:', e); } }
    },
    async deleteShipment(id) {
        this._cache.shipments = this._cache.shipments.filter(s => s.id !== id);
        if (this._online) { try { await _sbDelete('shipments', id); } catch(e) { console.warn('DB delete fail:', e); } }
    },

    // ===== ANALYTICS =====
    async getAnalytics() { return this._cache.analytics || generateAnalytics(); },

    // ===== RESET =====
    async resetDatabase() {
        if (this._online) {
            try {
                await fetch(`${SUPABASE_URL}/rest/v1/loads?id=neq.null`, { method: 'DELETE', headers: _headers });
                await fetch(`${SUPABASE_URL}/rest/v1/trucks?id=neq.null`, { method: 'DELETE', headers: _headers });
                await fetch(`${SUPABASE_URL}/rest/v1/shipments?id=neq.null`, { method: 'DELETE', headers: _headers });
            } catch(e) { console.warn('DB reset fail:', e); }
        }
        this._cache = { loads: null, trucks: null, shipments: null, analytics: null };
        this._loadLocal();
        if (this._online) {
            for (let i = 0; i < this._cache.loads.length; i += 20) {
                await _sbInsert('loads', this._cache.loads.slice(i, i + 20));
            }
            for (let i = 0; i < this._cache.trucks.length; i += 20) {
                await _sbInsert('trucks', this._cache.trucks.slice(i, i + 20));
            }
            await _sbInsert('shipments', this._cache.shipments);
        }
    }
};

// ===== Auth Helper (Supabase-backed) =====
const Auth = {
    _users: null,

    async _fetchUsers() {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, { headers: _headers });
            if (res.ok) {
                this._users = await res.json();
                localStorage.setItem('cargoloop_users', JSON.stringify(this._users));
                return this._users;
            }
        } catch (e) { console.warn('Auth: Supabase fetch failed:', e); }
        // Fallback to localStorage
        return this._getLocalUsers();
    },

    _getLocalUsers() {
        if (this._users) return this._users;
        const stored = localStorage.getItem('cargoloop_users');
        if (stored) {
            this._users = JSON.parse(stored);
        } else {
            this._users = [
                { username: 'admin', password: 'admin123', role: 'admin', displayName: 'Admin Panel' },
                { username: 'user', password: 'user123', role: 'user', displayName: 'Rajesh Singh' }
            ];
            localStorage.setItem('cargoloop_users', JSON.stringify(this._users));
        }
        return this._users;
    },

    async login(username, password) {
        // Try Supabase first
        try {
            const res = await fetch(
                `${SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(username)}&password=eq.${encodeURIComponent(password)}&select=*`,
                { headers: _headers }
            );
            if (res.ok) {
                const users = await res.json();
                if (users.length > 0) {
                    const u = users[0];
                    const session = { role: u.role, username: u.username, displayName: u.displayName, loginTime: Date.now() };
                    localStorage.setItem('cargoloop_auth', JSON.stringify(session));
                    return session;
                }
                return null; // Wrong credentials
            }
        } catch (e) { console.warn('Auth: Supabase login failed, trying local:', e); }

        // Fallback to local
        const localUsers = this._getLocalUsers();
        const user = localUsers.find(u => u.username === username && u.password === password);
        if (user) {
            const session = { role: user.role, username: user.username, displayName: user.displayName, loginTime: Date.now() };
            localStorage.setItem('cargoloop_auth', JSON.stringify(session));
            return session;
        }
        return null;
    },

    async signup(username, password, displayName) {
        if (username.length < 3) return { error: 'Username must be at least 3 characters' };
        if (password.length < 4) return { error: 'Password must be at least 4 characters' };

        // Check if username exists in Supabase
        try {
            const checkRes = await fetch(
                `${SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=id`,
                { headers: _headers }
            );
            if (checkRes.ok) {
                const existing = await checkRes.json();
                if (existing.length > 0) return { error: 'Username already taken' };
            }

            // Insert into Supabase
            const newUser = { username, password, role: 'user', displayName: displayName || username, createdAt: new Date().toISOString() };
            const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
                method: 'POST', headers: _headers, body: JSON.stringify(newUser)
            });
            if (insertRes.ok) {
                const session = { role: 'user', username, displayName: newUser.displayName, loginTime: Date.now() };
                localStorage.setItem('cargoloop_auth', JSON.stringify(session));
                return session;
            }
        } catch (e) { console.warn('Auth: Supabase signup failed:', e); }

        // Fallback: store locally
        const localUsers = this._getLocalUsers();
        if (localUsers.find(u => u.username === username)) return { error: 'Username already taken' };
        const newUser = { username, password, role: 'user', displayName: displayName || username };
        localUsers.push(newUser);
        localStorage.setItem('cargoloop_users', JSON.stringify(localUsers));
        const session = { role: 'user', username, displayName: newUser.displayName, loginTime: Date.now() };
        localStorage.setItem('cargoloop_auth', JSON.stringify(session));
        return session;
    },

    getSession() { try { const d = localStorage.getItem('cargoloop_auth'); return d ? JSON.parse(d) : null; } catch { return null; } },
    isLoggedIn() { return this.getSession() !== null; },
    getRole() { const s = this.getSession(); return s ? s.role : null; },
    isAdmin() { return this.getRole() === 'admin'; },
    logout() { localStorage.removeItem('cargoloop_auth'); window.location.href = 'login.html'; },
    requireAuth() { if (!this.isLoggedIn()) { window.location.href = 'login.html'; return false; } return true; }
};
