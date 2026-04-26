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
        return `<div class="listing-card animate-slideUp">
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
                <div class="meta-item">📦 ${load.weight} Tons</div>
                <div class="meta-item">📏 ${load.distance} km</div>
                <div class="meta-item">🏷️ ${load.loadType}</div>
                <div class="meta-item">🚛 ${load.truckTypeRequired}</div>
            </div>
            <div class="listing-footer">
                <div class="price-tag">${formatCurrency(load.price)}</div>
                ${showActions ? `<div class="flex gap-8">
                    ${load.bids > 0 ? `<span class="badge badge-cyan">${load.bids} bids</span>` : ''}
                    <button class="btn btn-primary btn-sm" onclick="App.navigate('findtruck')">Find Truck</button>
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
