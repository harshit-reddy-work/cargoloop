// ===== CargoLoop Main App (Simplified) =====
const App = {
    currentPage: 'dashboard',
    currentRole: 'shipper',

    navItems: {
        shipper: [
            { section: 'Main', items: [
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'postload', label: 'Post Load', icon: '📦' },
                { id: 'findtruck', label: 'Find Truck', icon: '🔍' },
                { id: 'marketplace', label: 'Marketplace', icon: '🏪', badge: '12' },
            ]},
            { section: 'Manage', items: [
                { id: 'tracking', label: 'Track Shipment', icon: '📍' },
                { id: 'scheduling', label: 'Scheduling', icon: '📅' },
                { id: 'pricing', label: 'Pricing & Bids', icon: '💰' },
                { id: 'payments', label: 'Payments', icon: '💳' },
            ]},
        ],
        transporter: [
            { section: 'Main', items: [
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'findreturnload', label: 'Find Return Load', icon: '🔄', badge: '5' },
                { id: 'marketplace', label: 'Marketplace', icon: '🏪', badge: '12' },
                { id: 'tracking', label: 'Track Shipment', icon: '📍' },
            ]},
            { section: 'Manage', items: [
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
            { section: 'Operations', items: [
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
    },

    init() {
        this.renderSidebar();
        this.setupRoleSwitcher();
        this.setupMenuToggle();
        this.navigate('dashboard');
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

    setupRoleSwitcher() {
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentRole = btn.dataset.role;
                document.getElementById('userRoleLabel').textContent =
                    this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
                this.renderSidebar();
                this.navigate('dashboard');
                UI.toast(`Switched to ${this.currentRole} view`, 'info');
            });
        });
    },

    setupMenuToggle() {
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
