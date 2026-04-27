// ===== My Loads Page (User's accepted/posted loads) =====
function renderMyLoads() {
    const session = Auth.getSession();
    const allLoads = DB.getCachedLoads();
    const username = session?.username || '';

    // User's own posted loads and accepted loads
    const myPosted = allLoads.filter(l => l.postedBy === username);
    const myAccepted = allLoads.filter(l => l.acceptedBy === username);
    const myBids = allLoads.filter(l => l.bidders && l.bidders.some(b => b.username === username));

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>📋 My Loads</h2>
                <p>Track your posted loads, accepted loads, and bids</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="App.navigate('postload')">+ Post New Load</button>
        </div>

        <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 20px;">
            ${UI.statCard('📤', myPosted.length, 'Posted by Me', '', true, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('📥', myAccepted.length, 'Accepted by Me', '', true, 'rgba(16,185,129,0.15)')}
            ${UI.statCard('💰', myBids.length, 'My Bids', '', true, 'rgba(245,158,11,0.15)')}
            ${UI.statCard('🚛', myAccepted.filter(l => l.status === 'In Transit').length, 'In Transit', '', true, 'rgba(59,130,246,0.15)')}
        </div>

        <div class="tabs" id="myLoadsTabs">
            <button class="tab-btn active" onclick="switchMyLoadsTab('accepted')">📥 Accepted Loads (${myAccepted.length})</button>
            <button class="tab-btn" onclick="switchMyLoadsTab('posted')">📤 Posted Loads (${myPosted.length})</button>
            <button class="tab-btn" onclick="switchMyLoadsTab('bids')">💰 My Bids (${myBids.length})</button>
        </div>

        <div id="myLoadsContent">
            ${myAccepted.length > 0 ? myAccepted.map(l => myLoadRow(l, 'accepted')).join('') : emptyMyLoads('accepted')}
        </div>
    </div>`;
}

function switchMyLoadsTab(tab) {
    document.querySelectorAll('#myLoadsTabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const content = document.getElementById('myLoadsContent');
    const session = Auth.getSession();
    const username = session?.username || '';
    const allLoads = DB.getCachedLoads();

    if (tab === 'accepted') {
        const loads = allLoads.filter(l => l.acceptedBy === username);
        content.innerHTML = loads.length > 0 ? loads.map(l => myLoadRow(l, 'accepted')).join('') : emptyMyLoads('accepted');
    } else if (tab === 'posted') {
        const loads = allLoads.filter(l => l.postedBy === username);
        content.innerHTML = loads.length > 0 ? loads.map(l => myLoadRow(l, 'posted')).join('') : emptyMyLoads('posted');
    } else {
        const loads = allLoads.filter(l => l.bidders && l.bidders.some(b => b.username === username));
        content.innerHTML = loads.length > 0 ? loads.map(l => myLoadRow(l, 'bid')).join('') : emptyMyLoads('bids');
    }
}

function myLoadRow(load, type) {
    const statusColors = { 'Pending': '#f59e0b', 'Picked Up': '#3b82f6', 'In Transit': '#6366f1', 'Delivered': '#10b981', 'Matched': '#06b6d4' };
    const statusColor = statusColors[load.status] || '#94a3b8';
    const session = Auth.getSession();
    const username = session?.username || '';
    const myBid = load.bidders?.find(b => b.username === username);

    return `
    <div class="card mb-12" style="border-left: 4px solid ${statusColor}; padding: 16px 20px;">
        <div class="flex items-center justify-between" style="margin-bottom: 12px;">
            <div class="flex items-center gap-12">
                <span style="font-weight: 700; font-size: 0.82rem; color: var(--text-muted);">${load.id}</span>
                <span class="badge badge-${getStatusColor(load.status)}">${load.status}</span>
                ${load.urgent ? '<span class="badge badge-red">⚡ URGENT</span>' : ''}
            </div>
            <div class="flex items-center gap-8">
                ${type === 'accepted' && load.status === 'Picked Up' ? `<button class="btn btn-primary btn-sm" onclick="updateMyLoadStatus('${load.id}', 'In Transit')">🚛 Mark In Transit</button>` : ''}
                ${type === 'accepted' && load.status === 'In Transit' ? `<button class="btn btn-sm" style="background:#10b981;color:white" onclick="updateMyLoadStatus('${load.id}', 'Delivered')">✅ Mark Delivered</button>` : ''}
                ${type === 'bid' && myBid ? `<span style="font-size:0.78rem;color:var(--accent-primary);font-weight:600">Your bid: ${formatCurrency(myBid.amount)}</span>` : ''}
            </div>
        </div>
        <div class="flex items-center gap-16" style="margin-bottom: 10px;">
            <div style="display:flex;align-items:center;gap:8px;flex:1">
                <span style="color:#10b981;font-weight:700">●</span>
                <span style="font-weight:600">${load.origin}</span>
                <span style="color:var(--text-muted);font-size:0.8rem">→</span>
                <span style="color:#ef4444;font-weight:700">●</span>
                <span style="font-weight:600">${load.destination}</span>
            </div>
            <span class="price-tag" style="font-size:1rem">${formatCurrency(load.price)}</span>
        </div>
        <div class="flex gap-16" style="font-size:0.78rem;color:var(--text-secondary)">
            <span>📦 ${load.weight}T ${load.loadType}</span>
            <span>📏 ${load.distance} km</span>
            <span>🏢 ${load.company}</span>
            ${load.pickupDate ? `<span>📅 ${load.pickupDate}</span>` : ''}
        </div>
    </div>`;
}

function emptyMyLoads(type) {
    const msgs = {
        accepted: { icon: '📥', title: 'No accepted loads yet', sub: 'Go to the Marketplace to accept loads' },
        posted: { icon: '📤', title: 'No posted loads yet', sub: 'Click "Post New Load" to create one' },
        bids: { icon: '💰', title: 'No bids placed yet', sub: 'Go to the Marketplace to bid on loads' }
    };
    const m = msgs[type] || msgs.accepted;
    return `<div class="card" style="text-align:center;padding:40px">
        <div style="font-size:2.5rem;margin-bottom:12px">${m.icon}</div>
        <h3 style="margin-bottom:6px;color:var(--text-primary)">${m.title}</h3>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:16px">${m.sub}</p>
        <button class="btn btn-primary" onclick="App.navigate('marketplace')">Go to Marketplace</button>
    </div>`;
}

async function updateMyLoadStatus(loadId, newStatus) {
    await DB.updateLoad(loadId, { status: newStatus });
    UI.toast(`Load ${loadId} marked as ${newStatus}!`, 'success');
    App.navigate('myloads');
}
