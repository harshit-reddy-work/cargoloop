// ===== Demand Heatmap Page =====
function renderDemandHeatmap() {
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🔥 Predictive Demand Heatmap</h2>
                <p>High-demand routes and times — plan your trips ahead</p>
            </div>
            <div class="flex gap-8">
                <select class="form-select" style="width:140px" id="heatmapPeriod">
                    <option value="today">Today</option>
                    <option value="week" selected>This Week</option>
                    <option value="month">This Month</option>
                </select>
            </div>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('🔥', 'Mumbai→Delhi', 'Hottest Route', '95% demand', true, 'rgba(239,68,68,0.15)')}
            ${UI.statCard('⏰', '10 AM', 'Peak Hour', 'Highest bookings', true, 'rgba(245,158,11,0.15)')}
            ${UI.statCard('📍', 'Western India', 'Top Region', '38% of total', true, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('📈', '+15%', 'Demand Growth', 'Week over week', true, 'rgba(16,185,129,0.15)')}
        </div>

        <div class="card mb-24">
            <div class="card-header"><h3 class="card-title">Demand Map</h3></div>
            <div class="map-container" id="heatmapMap" style="height:450px"></div>
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <div class="card-header"><h3 class="card-title">🔥 Route Demand Ranking</h3></div>
                <div style="display:flex;flex-direction:column;gap:8px">
                    ${MockData.analytics.routeHotspots.map((r, i) => `
                        <div class="flex items-center gap-12" style="padding:10px 12px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                            <span style="font-weight:800;font-size:1.1rem;width:30px;color:${i < 3 ? '#fbbf24' : 'var(--text-muted)'}">${i + 1}</span>
                            <div class="flex-1">
                                <div style="font-weight:600;font-size:0.85rem">${r.route}</div>
                                <div style="font-size:0.7rem;color:var(--text-muted)">Avg ${r.avgLoad}T per load</div>
                            </div>
                            <div style="width:120px">
                                <div class="progress-bar"><div class="progress-fill" style="width:${r.demand}%;background:${r.demand > 80 ? 'linear-gradient(90deg,#ef4444,#f59e0b)' : 'var(--accent-gradient)'}"></div></div>
                            </div>
                            <span style="font-weight:700;font-size:0.85rem;width:40px;text-align:right">${r.demand}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3 class="card-title">⏰ Demand by Hour</h3></div>
                <canvas id="heatmapTimeChart" height="280"></canvas>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3 class="card-title">🤖 AI Insights</h3></div>
            <div class="grid-2" style="gap:12px">
                <div style="padding:16px;background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(6,182,212,0.05));border-radius:var(--radius-md);border:1px solid rgba(99,102,241,0.15)">
                    <div style="font-weight:700;margin-bottom:6px">📦 Predicted Surge: Delhi-Jaipur</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">Based on festival season patterns, expect 40% demand increase on Delhi-Jaipur route next week. Position trucks in Delhi for best returns.</div>
                </div>
                <div style="padding:16px;background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(6,182,212,0.05));border-radius:var(--radius-md);border:1px solid rgba(16,185,129,0.15)">
                    <div style="font-weight:700;margin-bottom:6px">🚛 Backhaul Opportunity: Chennai</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">15 trucks arriving in Chennai this week with no return loads. High availability for outbound shipments from Chennai area.</div>
                </div>
                <div style="padding:16px;background:linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.05));border-radius:var(--radius-md);border:1px solid rgba(245,158,11,0.15)">
                    <div style="font-weight:700;margin-bottom:6px">💰 Price Drop Alert: Mumbai-Pune</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">Over-supply of trucks on Mumbai-Pune route. Rates expected to drop 12% this week. Good time to book outbound loads.</div>
                </div>
                <div style="padding:16px;background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(236,72,153,0.05));border-radius:var(--radius-md);border:1px solid rgba(139,92,246,0.15)">
                    <div style="font-weight:700;margin-bottom:6px">🔄 Multi-Stop Opportunity</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">3 loads with compatible routes detected: Ahmedabad→Mumbai→Pune. Combined trip saves 25% vs individual bookings.</div>
                </div>
            </div>
        </div>
    </div>`;
}

function initHeatmap() {
    const mapEl = document.getElementById('heatmapMap');
    if (!mapEl || !window.L) return;
    try {
        const map = L.map(mapEl).setView([22, 78], 5);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '©CartoDB' }).addTo(map);

        // Simulated heatmap using circles
        CITIES.forEach(c => {
            const demand = randInt(20, 100);
            const color = demand > 75 ? '#ef4444' : demand > 50 ? '#f59e0b' : demand > 30 ? '#6366f1' : '#64748b';
            const radius = demand * 300;
            L.circle([c.lat, c.lng], {
                radius: radius, fillColor: color, color: 'transparent', fillOpacity: 0.25
            }).addTo(map);
            L.circleMarker([c.lat, c.lng], {
                radius: 6, fillColor: color, color: color, fillOpacity: 0.9, weight: 1
            }).bindPopup(`<b>${c.name}</b><br>Demand: ${demand}%<br>${c.hub ? '⭐ Major Hub' : 'Secondary'}`).addTo(map);
        });

        // Draw top route lines
        const hotRoutes = [
            ['Mumbai', 'Delhi'], ['Delhi', 'Jaipur'], ['Bangalore', 'Chennai'],
            ['Ahmedabad', 'Mumbai'], ['Hyderabad', 'Bangalore']
        ];
        hotRoutes.forEach(([from, to]) => {
            const c1 = CITIES.find(c => c.name === from);
            const c2 = CITIES.find(c => c.name === to);
            if (c1 && c2) {
                L.polyline([[c1.lat, c1.lng], [c2.lat, c2.lng]], {
                    color: '#ef4444', weight: 2, opacity: 0.5
                }).addTo(map);
            }
        });
    } catch(e) { console.warn('Heatmap init error:', e); }
}

function initHeatmapTimeChart() {
    const ctx = document.getElementById('heatmapTimeChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: MockData.analytics.demandByHour.map(h => h.hour),
            datasets: [{
                label: 'Demand',
                data: MockData.analytics.demandByHour.map(h => h.demand),
                backgroundColor: MockData.analytics.demandByHour.map(h =>
                    h.demand > 70 ? 'rgba(239,68,68,0.6)' : h.demand > 50 ? 'rgba(245,158,11,0.6)' : 'rgba(99,102,241,0.4)'
                ),
                borderRadius: 6, borderSkipped: false
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } },
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b' } }
            }
        }
    });
}
