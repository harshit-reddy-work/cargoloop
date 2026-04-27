// ===== Marketplace Page =====
function renderMarketplace() {
    const loads = DB.getCachedLoads();
    const trucks = DB.getCachedTrucks();
    const pendingLoads = loads.filter(l => l.status === 'Pending');
    const matchedLoads = loads.filter(l => l.status === 'Matched' || l.status === 'Picked Up');
    const availTrucks = trucks.filter(t => t.status === 'Available');
    const isAdmin = Auth.isAdmin();

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🏪 Marketplace</h2>
                <p>${isAdmin ? 'Manage loads and trucks' : 'Browse available loads, place bids, and accept shipments'}</p>
            </div>
            <div class="flex gap-8">
                <button class="btn btn-primary btn-sm" onclick="App.navigate('postload')">+ Post Load</button>
            </div>
        </div>
        <div class="tabs" id="marketplaceTabs">
            <button class="tab-btn active" onclick="switchMarketTab('loads')">📦 Available Loads (${pendingLoads.length})</button>
            <button class="tab-btn" onclick="switchMarketTab('trucks')">🚛 Available Trucks (${availTrucks.length})</button>
            <button class="tab-btn" onclick="switchMarketTab('matched')">✅ Matched (${matchedLoads.length})</button>
        </div>
        <div class="filters-bar">
            <button class="filter-chip active" onclick="filterMarket('all', this)">All</button>
            ${LOAD_TYPES.slice(0, 6).map(t => `<button class="filter-chip" onclick="filterMarket('${t}', this)">${t}</button>`).join('')}
        </div>
        <div class="grid-auto" id="marketplaceContent">
            ${pendingLoads.slice(0, 12).map(l => renderMarketLoadCard(l)).join('')}
        </div>
    </div>`;
}

function renderMarketLoadCard(load) {
    const isAdmin = Auth.isAdmin();
    const session = Auth.getSession();
    const username = session ? session.username : '';
    const isMyLoad = load.acceptedBy === username || load.postedBy === username;
    const bidCount = (load.bidders && Array.isArray(load.bidders)) ? load.bidders.length : (load.bids || 0);

    let actionButtons = '';
    if (load.status === 'Pending') {
        if (isAdmin) {
            actionButtons = `<button class="btn btn-primary btn-sm" onclick="viewLoadDetails('${load.id}')">View Details</button>`;
        } else {
            actionButtons = `
                <button class="btn btn-sm" style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3);font-weight:600" onclick="openBidModal('${load.id}')">💰 Bid</button>
                <button class="btn btn-primary btn-sm" onclick="acceptLoad('${load.id}')">✅ Accept</button>
            `;
        }
    }

    return `<div class="listing-card animate-slideUp" style="position:relative">
        <div class="flex items-center justify-between">
            <span class="badge badge-${getStatusColor(load.status)}">${load.status}</span>
            <span style="font-size:0.72rem;color:var(--text-muted)">${load.id}</span>
        </div>
        <div class="route-line">
            <div><span class="route-dot origin"></span><div style="font-weight:600;font-size:0.9rem;margin-top:4px">${load.origin}</div><div style="font-size:0.7rem;color:var(--text-muted)">${load.originState}</div></div>
            <div class="route-line-connector"></div>
            <div style="text-align:right"><span class="route-dot dest"></span><div style="font-weight:600;font-size:0.9rem;margin-top:4px">${load.destination}</div><div style="font-size:0.7rem;color:var(--text-muted)">${load.destState}</div></div>
        </div>
        <div class="listing-meta">
            <div class="meta-item">📦 ${load.weight}T</div>
            <div class="meta-item">📏 ${load.distance} km</div>
            <div class="meta-item">🏷️ ${load.loadType}</div>
            <div class="meta-item">🏢 ${load.company}</div>
        </div>
        <div class="listing-footer">
            <div class="price-tag">${formatCurrency(load.price)}</div>
            <div class="flex gap-6">
                ${bidCount > 0 ? `<span class="badge badge-cyan" style="cursor:pointer" onclick="viewBids('${load.id}')">${bidCount} bid${bidCount > 1 ? 's' : ''}</span>` : ''}
                ${actionButtons}
                ${isMyLoad ? '<span class="badge badge-green">Your Load</span>' : ''}
            </div>
        </div>
        ${load.urgent ? '<div style="position:absolute;top:12px;right:12px"><span class="badge badge-red">⚡ URGENT</span></div>' : ''}
    </div>`;
}

function switchMarketTab(tab) {
    document.querySelectorAll('#marketplaceTabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const content = document.getElementById('marketplaceContent');
    if (tab === 'loads') {
        const loads = DB.getCachedLoads().filter(l => l.status === 'Pending');
        content.innerHTML = loads.slice(0, 12).map(l => renderMarketLoadCard(l)).join('') || '<div class="empty-state"><h3>No loads available</h3></div>';
    } else if (tab === 'trucks') {
        const trucks = DB.getCachedTrucks().filter(t => t.status === 'Available');
        content.innerHTML = trucks.slice(0, 12).map(t => UI.truckCard(t)).join('') || '<div class="empty-state"><h3>No trucks</h3></div>';
    } else {
        const matched = DB.getCachedLoads().filter(l => l.status === 'Matched' || l.status === 'Picked Up');
        content.innerHTML = matched.map(l => renderMarketLoadCard(l)).join('') || '<div class="empty-state"><h3>No matched loads</h3></div>';
    }
}

function filterMarket(type, el) {
    document.querySelectorAll('.filters-bar .filter-chip').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const content = document.getElementById('marketplaceContent');
    let loads = DB.getCachedLoads().filter(l => l.status === 'Pending');
    if (type !== 'all') loads = loads.filter(l => l.loadType === type);
    content.innerHTML = loads.slice(0, 12).map(l => renderMarketLoadCard(l)).join('') || '<div class="empty-state"><h3>No loads found</h3></div>';
}

function viewLoadDetails(loadId) {
    const load = DB.getCachedLoads().find(l => l.id === loadId);
    if (!load) return;
    UI.modal(`📦 Load ${loadId}`, `
        <div style="margin-bottom:16px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <span style="color:#10b981;font-weight:700">●</span><strong>${load.origin}</strong>
                <span style="color:var(--text-muted)">→</span>
                <span style="color:#ef4444;font-weight:700">●</span><strong>${load.destination}</strong>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.82rem;color:var(--text-secondary)">
                <div>📦 Weight: ${load.weight}T</div>
                <div>📏 Distance: ${load.distance} km</div>
                <div>🏷️ Type: ${load.loadType}</div>
                <div>🚛 Truck: ${load.truckTypeRequired}</div>
                <div>🏢 Company: ${load.company}</div>
                <div>💰 Price: ${formatCurrency(load.price)}</div>
            </div>
        </div>
        ${load.bidders && load.bidders.length > 0 ? `
            <h4 style="margin:12px 0 8px;font-size:0.85rem">Bids (${load.bidders.length})</h4>
            ${load.bidders.sort((a,b) => a.amount - b.amount).map((b, i) => `
                <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-glass);border-radius:var(--radius-sm);margin-bottom:4px;border-left:3px solid ${i===0?'#10b981':'var(--border-subtle)'}">
                    <span style="font-weight:600;font-size:0.82rem">${b.displayName}</span>
                    <span style="font-weight:700;color:var(--accent-primary)">${formatCurrency(b.amount)}</span>
                </div>
            `).join('')}
        ` : '<p style="color:var(--text-muted);font-size:0.82rem">No bids yet</p>'}
    `);
}
