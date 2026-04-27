// ===== Marketplace Page =====
function renderMarketplace() {
    const loads = DB.getCachedLoads();
    const trucks = DB.getCachedTrucks();
    const pendingLoads = loads.filter(l => l.status === 'Pending');
    const availTrucks = trucks.filter(t => t.status === 'Available');

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🏪 Marketplace</h2>
                <p>Dual marketplace for load ↔ truck matching</p>
            </div>
            <div class="flex gap-8">
                <button class="btn btn-primary btn-sm" onclick="App.navigate('postload')">+ Post Load</button>
            </div>
        </div>
        <div class="tabs" id="marketplaceTabs">
            <button class="tab-btn active" onclick="switchMarketTab('loads')">📦 Available Loads (${pendingLoads.length})</button>
            <button class="tab-btn" onclick="switchMarketTab('trucks')">🚛 Available Trucks (${availTrucks.length})</button>
            <button class="tab-btn" onclick="switchMarketTab('matched')">✅ Matched (${loads.filter(l=>l.status==='Matched').length})</button>
        </div>
        <div class="filters-bar">
            <button class="filter-chip active" onclick="filterMarket('all', this)">All</button>
            ${LOAD_TYPES.slice(0, 6).map(t => `<button class="filter-chip" onclick="filterMarket('${t}', this)">${t}</button>`).join('')}
        </div>
        <div class="grid-auto" id="marketplaceContent">
            ${pendingLoads.slice(0, 12).map(l => UI.loadCard(l)).join('')}
        </div>
    </div>`;
}

function switchMarketTab(tab) {
    document.querySelectorAll('#marketplaceTabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const content = document.getElementById('marketplaceContent');
    if (tab === 'loads') {
        const loads = DB.getCachedLoads().filter(l => l.status === 'Pending');
        content.innerHTML = loads.slice(0, 12).map(l => UI.loadCard(l)).join('') || '<div class="empty-state"><h3>No loads</h3></div>';
    } else if (tab === 'trucks') {
        const trucks = DB.getCachedTrucks().filter(t => t.status === 'Available');
        content.innerHTML = trucks.slice(0, 12).map(t => UI.truckCard(t)).join('') || '<div class="empty-state"><h3>No trucks</h3></div>';
    } else {
        const matched = DB.getCachedLoads().filter(l => l.status === 'Matched');
        content.innerHTML = matched.map(l => UI.loadCard(l, false)).join('') || '<div class="empty-state"><h3>No matched loads</h3></div>';
    }
}

function filterMarket(type, el) {
    document.querySelectorAll('.filters-bar .filter-chip').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const content = document.getElementById('marketplaceContent');
    let loads = DB.getCachedLoads().filter(l => l.status === 'Pending');
    if (type !== 'all') loads = loads.filter(l => l.loadType === type);
    content.innerHTML = loads.slice(0, 12).map(l => UI.loadCard(l)).join('') || '<div class="empty-state"><h3>No loads found</h3></div>';
}
