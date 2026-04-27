// ===== Shared UI Components =====
const UI = {
    toast(msg, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '✓', error: '✕', info: 'ℹ' };
        toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
    },

    modal(title, content) {
        const overlay = document.getElementById('modalOverlay');
        const container = document.getElementById('modalContainer');
        container.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="UI.closeModal()">✕</button>
            </div>
            <div class="modal-body">${content}</div>`;
        overlay.classList.add('active');
    },

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    },

    statCard(icon, value, label, change, positive, bgColor) {
        return `<div class="stat-card animate-slideUp">
            <div class="stat-icon" style="background:${bgColor || 'rgba(99,102,241,0.15)'}; color:${bgColor ? 'white' : '#818cf8'}">${icon}</div>
            <div class="stat-value">${value}</div>
            <div class="stat-label">${label}</div>
            ${change ? `<div class="stat-change ${positive ? 'positive' : 'negative'}">${positive ? '↑' : '↓'} ${change}</div>` : ''}
        </div>`;
    },

    loadCard(load, showActions = true) {
        const isAdmin = Auth.isAdmin();
        const session = Auth.getSession();
        const username = session?.username || '';
        const isMyLoad = load.acceptedBy === username || load.postedBy === username;
        const bidCount = load.bidders ? load.bidders.length : (load.bids || 0);

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
                ${showActions ? `<div class="flex gap-6">
                    ${bidCount > 0 ? `<span class="badge badge-cyan" style="cursor:pointer" onclick="viewBids('${load.id}')">${bidCount} bid${bidCount>1?'s':''}</span>` : ''}
                    ${load.status === 'Pending' && !isAdmin ? `
                        <button class="btn btn-sm" style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3);font-weight:600" onclick="openBidModal('${load.id}')">💰 Bid</button>
                        <button class="btn btn-primary btn-sm" onclick="acceptLoad('${load.id}')">✅ Accept</button>
                    ` : ''}
                    ${load.status === 'Pending' && isAdmin ? `<button class="btn btn-primary btn-sm" onclick="App.navigate('findtruck')">Find Truck</button>` : ''}
                    ${isMyLoad ? `<span class="badge badge-green">Your Load</span>` : ''}
                </div>` : ''}
            </div>
            ${load.urgent ? '<div style="position:absolute;top:12px;right:12px"><span class="badge badge-red">⚡ URGENT</span></div>' : ''}
        </div>`;
    },

    truckCard(truck, showActions = true) {
        return `<div class="listing-card animate-slideUp">
            <div class="flex items-center justify-between">
                <span class="badge badge-${getStatusColor(truck.status)}">${truck.status}</span>
                ${truck.kycVerified ? '<span class="badge badge-green">✓ KYC</span>' : '<span class="badge badge-yellow">⏳ KYC</span>'}
            </div>
            <div style="margin:12px 0">
                <div style="font-weight:700;font-size:1rem">${truck.vehicleNumber}</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px">${truck.make} ${truck.truckType}</div>
            </div>
            <div class="listing-meta">
                <div class="meta-item">📍 ${truck.currentCity}</div>
                <div class="meta-item">🎯 ${truck.heading}</div>
                <div class="meta-item">⚖️ ${truck.capacity}T</div>
                <div class="meta-item">⭐ ${truck.rating}</div>
            </div>
            <div style="margin-top:12px">
                <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px">Reliability ${truck.reliability}%</div>
                <div class="progress-bar"><div class="progress-fill" style="width:${truck.reliability}%"></div></div>
            </div>
            ${showActions ? `<div class="listing-footer">
                <span style="font-size:0.78rem;color:var(--text-muted)">${truck.owner}</span>
                <button class="btn btn-primary btn-sm" onclick="App.navigate('findreturnload')">Find Load</button>
            </div>` : ''}
        </div>`;
    },

    scoreRing(score) {
        return MatchingEngine.getScoreRingSVG(score, 48);
    },

    stars(rating) {
        let html = '<div class="stars">';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="star ${i <= Math.round(rating) ? 'filled' : ''}">★</span>`;
        }
        return html + '</div>';
    },

    pagination(current, total) {
        let html = '<div class="flex items-center justify-between mt-16">';
        html += `<span style="font-size:0.78rem;color:var(--text-muted)">Page ${current} of ${total}</span>`;
        html += '<div class="flex gap-8">';
        html += `<button class="btn btn-secondary btn-sm" ${current <= 1 ? 'disabled' : ''}>← Previous</button>`;
        html += `<button class="btn btn-secondary btn-sm" ${current >= total ? 'disabled' : ''}>Next →</button>`;
        html += '</div></div>';
        return html;
    }
};

// Init modal close on overlay click
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) UI.closeModal();
});

// ===== Bidding System =====
function openBidModal(loadId) {
    const load = DB.getCachedLoads().find(l => l.id === loadId);
    if (!load) return;
    const suggested = Math.round(load.price * 0.9);
    UI.modal('💰 Place Your Bid', `
        <div style="margin-bottom:16px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <span style="color:#10b981;font-weight:700">●</span><strong>${load.origin}</strong>
                <span style="color:var(--text-muted)">→</span>
                <span style="color:#ef4444;font-weight:700">●</span><strong>${load.destination}</strong>
            </div>
            <div style="font-size:0.82rem;color:var(--text-secondary)">📦 ${load.weight}T ${load.loadType} • 📏 ${load.distance} km</div>
        </div>
        <div style="background:var(--bg-glass);padding:14px;border-radius:var(--radius-md);margin-bottom:16px;text-align:center">
            <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:4px">Listed Price</div>
            <div style="font-size:1.6rem;font-weight:800;color:var(--accent-primary)">${formatCurrency(load.price)}</div>
            <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">₹${load.pricePerKm || Math.round(load.price/load.distance)}/km</div>
        </div>
        <div style="margin-bottom:14px">
            <label style="display:block;font-size:0.78rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Your Bid Amount (₹)</label>
            <input type="number" id="bidAmount" class="form-input" value="${suggested}" min="1000" style="font-size:1.1rem;font-weight:700;text-align:center">
        </div>
        <div style="display:flex;gap:8px;margin-bottom:14px">
            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="document.getElementById('bidAmount').value=${Math.round(load.price*0.8)}">-20%</button>
            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="document.getElementById('bidAmount').value=${Math.round(load.price*0.9)}">-10%</button>
            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="document.getElementById('bidAmount').value=${load.price}">Listed</button>
            <button class="btn btn-secondary btn-sm" style="flex:1" onclick="document.getElementById('bidAmount').value=${Math.round(load.price*1.1)}">+10%</button>
        </div>
        <div style="margin-bottom:14px">
            <label style="display:block;font-size:0.78rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Message (Optional)</label>
            <textarea id="bidMessage" class="form-textarea" rows="2" placeholder="e.g. Available immediately, experienced with ${load.loadType}..."></textarea>
        </div>
        <button class="btn btn-primary w-full" style="font-size:1rem;padding:14px" onclick="submitBid('${loadId}')">Submit Bid</button>
    `);
}

async function submitBid(loadId) {
    const amount = parseInt(document.getElementById('bidAmount').value);
    const message = document.getElementById('bidMessage')?.value || '';
    const session = Auth.getSession();
    if (!amount || amount < 100) { UI.toast('Enter a valid bid amount', 'error'); return; }

    const load = DB.getCachedLoads().find(l => l.id === loadId);
    if (!load) return;

    const bidders = load.bidders || [];
    bidders.push({ username: session.username, displayName: session.displayName, amount, message, time: new Date().toISOString() });
    await DB.updateLoad(loadId, { bidders, bids: bidders.length });
    UI.closeModal();
    UI.toast(`Bid of ${formatCurrency(amount)} placed on ${loadId}! 🎉`, 'success');
    if (App.currentPage === 'marketplace') App.navigate('marketplace');
}

function viewBids(loadId) {
    const load = DB.getCachedLoads().find(l => l.id === loadId);
    if (!load || !load.bidders || load.bidders.length === 0) {
        UI.toast('No bids on this load yet', 'info');
        return;
    }
    const sorted = [...load.bidders].sort((a, b) => a.amount - b.amount);
    UI.modal(`📊 Bids on ${loadId}`, `
        <div style="margin-bottom:14px;font-size:0.82rem;color:var(--text-secondary)">
            ${load.origin} → ${load.destination} • Listed at ${formatCurrency(load.price)}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
            ${sorted.map((b, i) => `
                <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--bg-glass);border-radius:var(--radius-sm);border-left:3px solid ${i === 0 ? '#10b981' : 'var(--border-subtle)'}">
                    <div>
                        <div style="font-weight:600;font-size:0.85rem">${b.displayName}</div>
                        ${b.message ? `<div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">"${b.message}"</div>` : ''}
                    </div>
                    <div style="text-align:right">
                        <div style="font-weight:700;color:var(--accent-primary);font-size:1rem">${formatCurrency(b.amount)}</div>
                        ${i === 0 ? '<div style="font-size:0.68rem;color:#10b981;font-weight:600">LOWEST</div>' : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        ${Auth.isAdmin() ? `<button class="btn btn-primary w-full mt-16" onclick="acceptBid('${loadId}','${sorted[0]?.username}')">Accept Lowest Bid</button>` : ''}
    `);
}

async function acceptLoad(loadId) {
    const session = Auth.getSession();
    await DB.updateLoad(loadId, { status: 'Picked Up', acceptedBy: session.username, acceptedName: session.displayName });
    UI.toast(`Load ${loadId} accepted! Check "My Loads" to track it. ✅`, 'success');
    if (App.currentPage === 'marketplace') App.navigate('marketplace');
}

async function acceptBid(loadId, bidderUsername) {
    await DB.updateLoad(loadId, { status: 'Matched', acceptedBy: bidderUsername });
    UI.closeModal();
    UI.toast(`Bid accepted! Load ${loadId} matched.`, 'success');
    if (App.currentPage === 'marketplace') App.navigate('marketplace');
}
