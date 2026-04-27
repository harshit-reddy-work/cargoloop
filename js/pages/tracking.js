// ===== Real-Time Tracking Page =====
function renderTracking() {
    const shipments = DB.getCachedShipments();
    const activeShipments = shipments.filter(s => s.status !== 'Completed' && s.status !== 'Pending');

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div><h2>📍 Real-Time Tracking</h2><p>Simulated GPS tracking of active shipments</p></div>
            <span class="badge badge-cyan">${activeShipments.length} Active Shipments</span>
        </div>
        <div class="grid-2 mb-24" style="grid-template-columns:1fr 380px">
            <div class="card" style="padding:0;overflow:hidden">
                <div class="map-container" id="trackingMap" style="height:500px"></div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;max-height:540px;overflow-y:auto">
                ${activeShipments.map((s, i) => `
                    <div class="listing-card" onclick="focusShipment(${i})" style="cursor:pointer;padding:14px">
                        <div class="flex items-center justify-between">
                            <span style="font-weight:700;font-size:0.85rem">${s.id}</span>
                            <span class="badge badge-${getStatusColor(s.status)}">${s.status}</span>
                        </div>
                        <div style="font-size:0.82rem;margin-top:6px;font-weight:600">${s.origin} → ${s.destination}</div>
                        <div class="flex items-center justify-between mt-8">
                            <span style="font-size:0.72rem;color:var(--text-muted)">${s.transporter}</span>
                            <span style="font-size:0.72rem;color:var(--text-secondary)">ETA: ${s.eta}</span>
                        </div>
                        <div class="progress-bar mt-8"><div class="progress-fill" style="width:${s.progress}%"></div></div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="card mb-24">
            <div class="card-header">
                <h3 class="card-title">Shipment Timeline</h3>
                <select class="form-select" style="width:200px" id="timelineShipment">
                    ${activeShipments.map((s, i) => `<option value="${i}">${s.id} — ${s.origin}→${s.destination}</option>`).join('')}
                </select>
            </div>
            <div class="timeline" style="margin-top:16px">
                ${STATUS_FLOW.map((status, i) => {
                    const currentIdx = STATUS_FLOW.indexOf(activeShipments[0]?.status || 'Pending');
                    const isCompleted = i < currentIdx;
                    const isActive = i === currentIdx;
                    return `<div class="timeline-item">
                        <div class="timeline-dot ${isCompleted ? 'completed' : isActive ? 'active' : ''}"></div>
                        <div class="timeline-content">
                            <h4 style="${!isCompleted && !isActive ? 'opacity:0.4' : ''}">${status}</h4>
                            <p>${isCompleted ? 'Completed' : isActive ? 'In progress...' : 'Pending'}</p>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3 class="card-title">All Shipments</h3></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>ID</th><th>Route</th><th>Company</th><th>Transporter</th><th>Status</th><th>Progress</th><th>ETA</th></tr></thead>
                    <tbody>
                        ${shipments.map(s => `
                            <tr>
                                <td style="font-weight:600">${s.id}</td>
                                <td>${s.origin} → ${s.destination}</td>
                                <td>${s.company || s.shipper || '—'}</td>
                                <td>${s.transporter}</td>
                                <td><span class="badge badge-${getStatusColor(s.status)}">${s.status}</span></td>
                                <td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${s.progress}%"></div></div></td>
                                <td>${s.eta}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function initTrackingMap() {
    const mapEl = document.getElementById('trackingMap');
    if (!mapEl || !window.L) return;
    try {
        const map = L.map(mapEl).setView([22, 78], 5);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '©CartoDB' }).addTo(map);
        const shipments = DB.getCachedShipments();
        shipments.forEach(s => {
            if (s.status === 'Completed' || s.status === 'Pending') return;
            L.polyline([[s.originLat, s.originLng], [s.destLat, s.destLng]], {
                color: '#6366f1', weight: 2, opacity: 0.3, dashArray: '5, 5'
            }).addTo(map);
            const truckIcon = L.divIcon({
                html: `<div style="width:24px;height:24px;background:#6366f1;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(99,102,241,0.5);display:flex;align-items:center;justify-content:center;font-size:10px">🚛</div>`,
                iconSize: [24, 24], className: ''
            });
            L.marker([s.currentLat, s.currentLng], { icon: truckIcon })
                .bindPopup(`<b>${s.id}</b><br>${s.origin} → ${s.destination}<br>Status: ${s.status}<br>ETA: ${s.eta}`)
                .addTo(map);
        });
        window._trackingMap = map;
    } catch(e) { console.warn('Map init error:', e); }
}

function focusShipment(idx) {
    const shipments = DB.getCachedShipments().filter(s => s.status !== 'Completed' && s.status !== 'Pending');
    const s = shipments[idx];
    if (s && window._trackingMap) {
        window._trackingMap.setView([s.currentLat, s.currentLng], 8);
    }
}
