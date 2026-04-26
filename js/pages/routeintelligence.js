// ===== Route Intelligence Page =====
function renderRouteIntelligence() {
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🗺️ Route Intelligence</h2>
                <p>Smart multi-stop routing and geographic clustering</p>
            </div>
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <h3 class="card-title mb-16">Route Optimizer</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Start City</label>
                        <select class="form-select" id="riOrigin">
                            ${CITIES.map(c => `<option value="${c.name}" ${c.name==='Mumbai'?'selected':''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Final Destination</label>
                        <select class="form-select" id="riDest">
                            ${CITIES.map(c => `<option value="${c.name}" ${c.name==='Delhi'?'selected':''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary w-full" onclick="optimizeRoute()">🧠 Optimize Route</button>
            </div>

            <div class="card">
                <h3 class="card-title mb-16">Why Multi-Stop?</h3>
                <div style="display:flex;flex-direction:column;gap:12px">
                    <div class="flex items-center gap-12">
                        <div style="width:40px;height:40px;border-radius:10px;background:rgba(99,102,241,0.15);display:flex;align-items:center;justify-content:center">💰</div>
                        <div><div style="font-weight:600">30% Cost Reduction</div><div style="font-size:0.78rem;color:var(--text-secondary)">Combine loads along optimal routes</div></div>
                    </div>
                    <div class="flex items-center gap-12">
                        <div style="width:40px;height:40px;border-radius:10px;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center">🌍</div>
                        <div><div style="font-weight:600">Reduce Empty KM</div><div style="font-size:0.78rem;color:var(--text-secondary)">Keep trucks loaded throughout journeys</div></div>
                    </div>
                    <div class="flex items-center gap-12">
                        <div style="width:40px;height:40px;border-radius:10px;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center">⚡</div>
                        <div><div style="font-weight:600">Faster Deliveries</div><div style="font-size:0.78rem;color:var(--text-secondary)">Geographic clustering reduces distances</div></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mb-24">
            <div class="card-header"><h3 class="card-title">Route Map</h3></div>
            <div class="map-container" id="routeMap"></div>
        </div>

        <div id="routeResults"></div>

        <div class="card">
            <div class="card-header"><h3 class="card-title">📊 Route Cluster Analysis</h3></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>Cluster</th><th>Cities</th><th>Active Loads</th><th>Avg Distance</th><th>Demand</th></tr></thead>
                    <tbody>
                        <tr><td><span class="badge badge-primary">Western</span></td><td>Mumbai, Pune, Surat, Ahmedabad</td><td>23</td><td>420 km</td><td><div class="progress-bar" style="width:100px"><div class="progress-fill" style="width:92%"></div></div></td></tr>
                        <tr><td><span class="badge badge-cyan">Northern</span></td><td>Delhi, Jaipur, Chandigarh, Ludhiana</td><td>18</td><td>350 km</td><td><div class="progress-bar" style="width:100px"><div class="progress-fill" style="width:85%"></div></div></td></tr>
                        <tr><td><span class="badge badge-green">Southern</span></td><td>Bangalore, Chennai, Coimbatore, Kochi</td><td>15</td><td>380 km</td><td><div class="progress-bar" style="width:100px"><div class="progress-fill" style="width:78%"></div></div></td></tr>
                        <tr><td><span class="badge badge-yellow">Central</span></td><td>Nagpur, Indore, Bhopal</td><td>9</td><td>290 km</td><td><div class="progress-bar" style="width:100px"><div class="progress-fill" style="width:55%"></div></div></td></tr>
                        <tr><td><span class="badge badge-purple">Eastern</span></td><td>Kolkata, Guwahati, Varanasi</td><td>11</td><td>520 km</td><td><div class="progress-bar" style="width:100px"><div class="progress-fill" style="width:62%"></div></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function initRouteMap() {
    const mapEl = document.getElementById('routeMap');
    if (!mapEl || !window.L) return;
    try {
        const map = L.map(mapEl).setView([22, 78], 5);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '©CartoDB'
        }).addTo(map);
        // Add city markers
        CITIES.forEach(c => {
            const color = c.hub ? '#6366f1' : '#64748b';
            L.circleMarker([c.lat, c.lng], { radius: c.hub ? 8 : 5, fillColor: color, color: color, fillOpacity: 0.8, weight: 1 })
                .bindPopup(`<b>${c.name}</b><br>${c.state}${c.hub ? '<br><em>Major Hub</em>' : ''}`)
                .addTo(map);
        });
        window._routeMap = map;
    } catch(e) { console.warn('Map init error:', e); }
}

function optimizeRoute() {
    const origin = document.getElementById('riOrigin').value;
    const dest = document.getElementById('riDest').value;
    const o = CITIES.find(c => c.name === origin);
    const d = CITIES.find(c => c.name === dest);
    if (!o || !d) return;

    // Find intermediate stops
    const stops = MatchingEngine.suggestMultiStopRoute(o, MockData.loads);
    const totalDist = calcDistance(o, d);

    // Draw on map
    if (window._routeMap) {
        // Clear previous
        window._routeMap.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) window._routeMap.removeLayer(l); });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(window._routeMap);

        const points = [[o.lat, o.lng]];
        stops.forEach(s => points.push([s.originLat, s.originLng]));
        points.push([d.lat, d.lng]);

        L.polyline(points, { color: '#6366f1', weight: 3, opacity: 0.8, dashArray: '10, 5' }).addTo(window._routeMap);
        L.marker([o.lat, o.lng]).bindPopup(`<b>Start: ${origin}</b>`).addTo(window._routeMap);
        L.marker([d.lat, d.lng]).bindPopup(`<b>End: ${dest}</b>`).addTo(window._routeMap);
        stops.forEach((s, i) => {
            L.circleMarker([s.originLat, s.originLng], { radius: 6, fillColor: '#10b981', color: '#10b981', fillOpacity: 0.9 })
                .bindPopup(`<b>Stop ${i+1}: ${s.origin}</b><br>${s.loadType}, ${s.weight}T`)
                .addTo(window._routeMap);
        });
        window._routeMap.fitBounds(L.latLngBounds(points), { padding: [30, 30] });
    }

    document.getElementById('routeResults').innerHTML = `
        <div class="card mb-24">
            <div class="card-header">
                <h3 class="card-title">Optimized Route: ${origin} → ${dest}</h3>
                <span class="badge badge-green">${totalDist} km total</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px">
                <div class="flex items-center gap-12" style="padding:12px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                    <div style="width:30px;height:30px;border-radius:50%;background:var(--accent-green);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.75rem">A</div>
                    <div><div style="font-weight:600">${origin}</div><div style="font-size:0.72rem;color:var(--text-muted)">Start Point</div></div>
                </div>
                ${stops.map((s, i) => `
                    <div class="flex items-center gap-12" style="padding:12px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                        <div style="width:30px;height:30px;border-radius:50%;background:var(--accent-primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.75rem">${i + 1}</div>
                        <div class="flex-1"><div style="font-weight:600">${s.origin}</div><div style="font-size:0.72rem;color:var(--text-muted)">Pickup: ${s.loadType} • ${s.weight}T • ${formatCurrency(s.price)}</div></div>
                        <span class="badge badge-cyan">${s.distFromOrigin} km</span>
                    </div>
                `).join('')}
                <div class="flex items-center gap-12" style="padding:12px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                    <div style="width:30px;height:30px;border-radius:50%;background:var(--accent-red);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.75rem">B</div>
                    <div><div style="font-weight:600">${dest}</div><div style="font-size:0.72rem;color:var(--text-muted)">End Point</div></div>
                </div>
            </div>
        </div>`;

    UI.toast(`Route optimized! ${stops.length} pickup stops added`, 'success');
}
