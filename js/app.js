// ===== CargoLoop Main App =====
const App = {
    currentPage: 'dashboard',
    currentRole: 'user',

    navItems: {
        user: [
            { section: 'Main', items: [
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
                { id: 'myloads', label: 'My Loads', icon: '📋' },
                { id: 'postload', label: 'Post Load', icon: '📦' },
                { id: 'findtruck', label: 'Find Truck', icon: '🔍' },
                { id: 'findreturnload', label: 'Find Return Load', icon: '🔄' },
            ]},
            { section: 'Manage', items: [
                { id: 'tracking', label: 'Track Shipment', icon: '📍' },
                { id: 'scheduling', label: 'Scheduling', icon: '📅' },
                { id: 'pricing', label: 'Pricing & Bids', icon: '💰' },
                { id: 'payments', label: 'Payments', icon: '💳' },
            ]},
        ],
        admin: [
            { section: 'Overview', items: [
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
                { id: 'tracking', label: 'All Shipments', icon: '📍' },
            ]},
            { section: 'Administration', items: [
                { id: 'manageloads', label: 'Manage Loads', icon: '📦' },
                { id: 'managetrucks', label: 'Manage Trucks', icon: '🚛' },
                { id: 'findreturnload', label: 'Backhaul Matching', icon: '🔄' },
                { id: 'scheduling', label: 'Scheduling', icon: '📅' },
                { id: 'pricing', label: 'Pricing', icon: '💰' },
                { id: 'payments', label: 'Payments', icon: '💳' },
            ]},
        ]
    },

    pages: {
        dashboard: { render: renderDashboard },
        postload: { render: renderPostLoad },
        findtruck: { render: renderFindTruck },
        findreturnload: { render: renderFindReturnLoad },
        marketplace: { render: renderMarketplace },
        scheduling: { render: renderScheduling },
        tracking: { render: renderTracking, init: initTrackingMap },
        pricing: { render: renderPricing },
        payments: { render: renderPayments },
        myloads: { render: renderMyLoads },
        manageloads: { render: renderManageLoads },
        managetrucks: { render: renderManageTrucks },
    },

    async init() {
        // Check authentication
        if (!Auth.requireAuth()) return;

        const session = Auth.getSession();
        this.currentRole = session.role;

        // Update UI with user info
        this.updateUserUI(session);

        // Initialize database — this is instant (local data loads synchronously)
        DB.init();

        // Hide loading overlay immediately
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 300);
        }

        this.renderSidebar();
        this.setupMenuToggle();
        this.navigate('dashboard');
    },

    updateUserUI(session) {
        document.getElementById('userName').textContent = session.displayName;
        document.getElementById('userRoleLabel').textContent = session.role === 'admin' ? 'Administrator' : 'User';
        document.getElementById('userAvatar').textContent = session.role === 'admin' ? 'AD' : 'RS';
        document.getElementById('roleIcon').textContent = session.role === 'admin' ? '🛡️' : '👤';
        document.getElementById('roleLabel').textContent = session.role === 'admin' ? 'Admin Panel' : 'User Panel';
        document.getElementById('roleIndicator').className = 'role-indicator role-' + session.role;
    },

    renderSidebar() {
        const nav = document.getElementById('sidebarNav');
        const items = this.navItems[this.currentRole];
        nav.innerHTML = items.map(section => `
            <div class="nav-section-label">${section.section}</div>
            ${section.items.map(item => `
                <div class="nav-item ${item.id === this.currentPage ? 'active' : ''}" onclick="App.navigate('${item.id}')" data-page="${item.id}">
                    <span>${item.icon}</span>
                    <span>${item.label}</span>
                    ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                </div>
            `).join('')}
        `).join('');
    },

    navigate(pageId) {
        if (!this.pages[pageId]) return;
        this.currentPage = pageId;
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.page === pageId);
        });
        const content = document.getElementById('pageContent');
        content.scrollTop = 0;
        content.innerHTML = this.pages[pageId].render();
        if (this.pages[pageId].init) {
            setTimeout(() => this.pages[pageId].init(), 100);
        }
        document.getElementById('sidebar').classList.remove('open');
    },

    setupMenuToggle() {
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
