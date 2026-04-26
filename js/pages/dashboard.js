// ===== Dashboard Page (Simplified) =====
function renderDashboard() {
    const pendingLoads = MockData.loads.filter(l => l.status === 'Pending');
    const availTrucks = MockData.trucks.filter(t => t.status === 'Available');
    const inTransit = MockData.shipments.filter(s => s.status === 'In Transit');
    const delivered = MockData.shipments.filter(s => s.status === 'Delivered' || s.status === 'Completed');

    // Recent activities
    const activities = [
        { dot: 'green', text: 'Load LD01003 matched with truck TK02005', time: '5 min ago' },
        { dot: 'blue', text: 'New load posted: Mumbai → Delhi, 8T Electronics', time: '12 min ago' },
        { dot: 'green', text: 'Shipment SH03004 delivered successfully', time: '30 min ago' },
        { dot: 'yellow', text: 'Bid received on Load LD01012 — ₹18,500', time: '1 hr ago' },
        { dot: 'blue', text: 'Truck TK02018 now available in Pune', time: '1.5 hrs ago' },
        { dot: 'green', text: 'Return load assigned: Delhi → Jaipur', time: '2 hrs ago' },
        { dot: 'red', text: 'Shipment SH03009 delayed by 2 hours', time: '3 hrs ago' },
        { dot: 'blue', text: 'New transporter registered: Sai Transport', time: '4 hrs ago' },
    ];

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>Dashboard</h2>
                <p>Welcome back, Rajesh! Here's what's happening today.</p>
            </div>
            <button class="btn btn-primary" onclick="App.navigate('postload')">+ Post Load</button>
        </div>

        <div class="stat-grid">
            ${UI.statCard('📦', pendingLoads.length.toString(), 'Available Loads', '+4 today', true, '#eef2ff')}
            ${UI.statCard('🚛', availTrucks.length.toString(), 'Available Trucks', '+2 today', true, '#dcfce7')}
            ${UI.statCard('🔄', inTransit.length.toString(), 'In Transit', 'Active now', false, '#fef9c3')}
            ${UI.statCard('✅', delivered.length.toString(), 'Delivered', 'This week', true, '#e0f2fe')}
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Available Trucks Nearby</h3>
                    <button class="btn btn-ghost btn-sm" onclick="App.navigate('findtruck')">View All →</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px">
                    ${availTrucks.slice(0, 5).map(t => `
                        <div class="avail-item">
                            <div class="avail-icon" style="background:#eef2ff">🚛</div>
                            <div class="avail-info">
                                <div class="name">${t.vehicleNumber}</div>
                                <div class="detail">${t.make} ${t.truckType} • ${t.capacity}T • ${t.currentCity}</div>
                            </div>
                            <span class="badge badge-green">Available</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Activity</h3>
                </div>
                <div style="display:flex;flex-direction:column">
                    ${activities.map(a => `
                        <div class="activity-item">
                            <div class="activity-dot ${a.dot}"></div>
                            <div class="flex-1">
                                <div style="font-size:0.82rem">${a.text}</div>
                                <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px">${a.time}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Latest Loads</h3>
                    <button class="btn btn-ghost btn-sm" onclick="App.navigate('marketplace')">View All →</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px">
                    ${pendingLoads.slice(0, 5).map(l => `
                        <div class="avail-item">
                            <div class="avail-icon" style="background:#fef9c3">📦</div>
                            <div class="avail-info">
                                <div class="name">${l.origin} → ${l.destination}</div>
                                <div class="detail">${l.loadType} • ${l.weight}T • ${formatCurrency(l.price)}</div>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="App.navigate('findtruck')">Match</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Active Shipments</h3>
                    <button class="btn btn-ghost btn-sm" onclick="App.navigate('tracking')">Track All →</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px">
                    ${MockData.shipments.filter(s => s.status !== 'Pending' && s.status !== 'Completed').slice(0, 5).map(s => `
                        <div class="avail-item">
                            <div class="avail-icon" style="background:${s.status === 'Delivered' ? '#dcfce7' : '#e0f2fe'}">
                                ${s.status === 'Delivered' ? '✅' : '🔄'}
                            </div>
                            <div class="avail-info">
                                <div class="name">${s.origin} → ${s.destination}</div>
                                <div class="detail">${s.transporter} • ${s.loadType}</div>
                            </div>
                            <span class="badge badge-${getStatusColor(s.status)}">${s.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}
