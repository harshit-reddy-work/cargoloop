// ===== Analytics Dashboard Page =====
function renderAnalytics() {
    const d = MockData.analytics;
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>📊 Analytics Dashboard</h2>
                <p>Platform-wide metrics, insights, and performance tracking</p>
            </div>
            <div class="flex gap-8">
                <select class="form-select" style="width:140px">
                    <option>Last 7 days</option>
                    <option selected>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last year</option>
                </select>
                <button class="btn btn-secondary btn-sm">📥 Export</button>
            </div>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('📏', formatNumber(d.emptyKmReduced) + ' km', 'Empty KM Reduced', '+33% vs last quarter', true, 'rgba(16,185,129,0.15)')}
            ${UI.statCard('💰', formatCurrency(d.costSavings), 'Total Cost Savings', '+18% MoM', true, 'rgba(245,158,11,0.15)')}
            ${UI.statCard('🚛', d.truckUtilization + '%', 'Truck Utilization', '+12% YoY', true, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('🌱', formatNumber(d.co2Saved) + ' kg', 'CO₂ Saved', '= ${Math.round(d.co2Saved/21)} trees', true, 'rgba(6,182,212,0.15)')}
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <div class="card-header"><h3 class="card-title">📈 Loads vs Matches</h3></div>
                <canvas id="analyticsChart1" height="250"></canvas>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">💰 Cost Savings Trend</h3></div>
                <canvas id="analyticsChart2" height="250"></canvas>
            </div>
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <div class="card-header"><h3 class="card-title">🕐 Demand by Time of Day</h3></div>
                <canvas id="analyticsChart3" height="220"></canvas>
            </div>
            <div class="card">
                <div class="card-header"><h3 class="card-title">🚛 Truck Utilization Breakdown</h3></div>
                <canvas id="analyticsChart4" height="220"></canvas>
            </div>
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <div class="card-header"><h3 class="card-title">🌍 Carbon Impact</h3></div>
                <div style="text-align:center;padding:30px">
                    <div style="font-size:3.5rem;font-weight:900;background:linear-gradient(135deg,#10b981,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${formatNumber(d.co2Saved)} kg</div>
                    <div style="color:var(--text-secondary);margin:8px 0">CO₂ Emissions Prevented</div>
                    <div class="flex gap-16 justify-between" style="margin-top:20px;justify-content:center">
                        <div style="text-align:center">
                            <div style="font-size:1.5rem">🌳</div>
                            <div style="font-weight:700">${Math.round(d.co2Saved / 21)}</div>
                            <div style="font-size:0.7rem;color:var(--text-muted)">Trees Equivalent</div>
                        </div>
                        <div style="text-align:center">
                            <div style="font-size:1.5rem">🚗</div>
                            <div style="font-weight:700">${formatNumber(Math.round(d.co2Saved / 0.12))}</div>
                            <div style="font-size:0.7rem;color:var(--text-muted)">Car KM Saved</div>
                        </div>
                        <div style="text-align:center">
                            <div style="font-size:1.5rem">⛽</div>
                            <div style="font-weight:700">${formatNumber(Math.round(d.co2Saved / 2.3))}</div>
                            <div style="font-size:0.7rem;color:var(--text-muted)">Liters Fuel</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3 class="card-title">🔥 Top Performing Routes</h3></div>
                <div style="display:flex;flex-direction:column;gap:10px">
                    ${d.routeHotspots.map((r, i) => `
                        <div class="flex items-center gap-12" style="padding:10px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                            <span style="font-weight:800;color:${i < 3 ? 'var(--accent-yellow)' : 'var(--text-muted)'};width:24px">#${i+1}</span>
                            <span style="flex:1;font-weight:500;font-size:0.85rem">${r.route}</span>
                            <div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${r.demand}%"></div></div>
                            <span style="font-weight:600;font-size:0.78rem;width:35px;text-align:right">${r.demand}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

function initAnalyticsCharts() {
    const d = MockData.analytics;
    const chartOpts = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { size: 11 } } }
        }
    };

    const ctx1 = document.getElementById('analyticsChart1');
    if (ctx1) new Chart(ctx1, {
        type: 'bar', data: {
            labels: d.monthlyData.map(m => m.month),
            datasets: [
                { label: 'Loads Posted', data: d.monthlyData.map(m => m.loads), backgroundColor: 'rgba(99,102,241,0.6)', borderRadius: 6, borderSkipped: false },
                { label: 'Backhaul Matches', data: d.monthlyData.map(m => m.matches), backgroundColor: 'rgba(16,185,129,0.6)', borderRadius: 6, borderSkipped: false }
            ]
        }, options: chartOpts
    });

    const ctx2 = document.getElementById('analyticsChart2');
    if (ctx2) new Chart(ctx2, {
        type: 'line', data: {
            labels: d.monthlyData.map(m => m.month),
            datasets: [{
                label: 'Savings (₹K)', data: d.monthlyData.map(m => m.savings / 1000),
                borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4,
                pointRadius: 5, pointBackgroundColor: '#f59e0b'
            }]
        }, options: { ...chartOpts, plugins: { legend: { display: false } } }
    });

    const ctx3 = document.getElementById('analyticsChart3');
    if (ctx3) new Chart(ctx3, {
        type: 'bar', data: {
            labels: d.demandByHour.map(h => h.hour),
            datasets: [{
                label: 'Demand %', data: d.demandByHour.map(h => h.demand),
                backgroundColor: d.demandByHour.map(h => h.demand > 70 ? 'rgba(239,68,68,0.6)' : h.demand > 50 ? 'rgba(245,158,11,0.6)' : 'rgba(99,102,241,0.4)'),
                borderRadius: 4, borderSkipped: false
            }]
        }, options: { ...chartOpts, plugins: { legend: { display: false } } }
    });

    const ctx4 = document.getElementById('analyticsChart4');
    if (ctx4) new Chart(ctx4, {
        type: 'doughnut', data: {
            labels: ['Fully Loaded', 'Partially Loaded', 'Empty Return', 'Idle'],
            datasets: [{
                data: [45, 28, 15, 12],
                backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(99,102,241,0.8)', 'rgba(239,68,68,0.8)', 'rgba(100,116,139,0.6)'],
                borderWidth: 0
            }]
        }, options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { family: 'Inter', size: 11 } } } }
        }
    });
}
