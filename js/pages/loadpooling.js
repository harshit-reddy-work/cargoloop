// ===== Load Pooling Page =====
function renderLoadPooling() {
    const pools = MatchingEngine.findPoolableLoads(MockData.loads);
    const smallLoads = MockData.loads.filter(l => l.poolable && l.status === 'Pending');

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🧩 Load Pooling</h2>
                <p>Combine small shipments to maximize truck utilization and reduce costs</p>
            </div>
            <span class="badge badge-green">${pools.length} Pools Available</span>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('🧩', pools.length.toString(), 'Active Pools', null, false, 'rgba(139,92,246,0.15)')}
            ${UI.statCard('📦', smallLoads.length.toString(), 'Poolable Loads', 'Under 10T', false, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('💰', '~25%', 'Avg Cost Savings', 'Per pooled load', true, 'rgba(16,185,129,0.15)')}
            ${UI.statCard('🚛', '85%', 'Truck Utilization', '+20% vs solo', true, 'rgba(6,182,212,0.15)')}
        </div>

        <div class="card mb-24" style="background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(99,102,241,0.05));border-color:rgba(139,92,246,0.2)">
            <h3 class="card-title mb-8">💡 How Load Pooling Works</h3>
            <div class="grid-3" style="margin-top:16px">
                <div style="text-align:center">
                    <div style="font-size:2rem;margin-bottom:8px">📦📦📦</div>
                    <div style="font-weight:600;font-size:0.85rem">1. Small Loads Detected</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Loads under 10T on similar routes are identified</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:2rem;margin-bottom:8px">🔗</div>
                    <div style="font-weight:600;font-size:0.85rem">2. Smart Grouping</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">AI groups compatible loads by route and timing</div>
                </div>
                <div style="text-align:center">
                    <div style="font-size:2rem;margin-bottom:8px">🚛💰</div>
                    <div style="font-weight:600;font-size:0.85rem">3. Shared Savings</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Costs split proportionally, everyone saves 20-35%</div>
                </div>
            </div>
        </div>

        ${pools.length ? pools.map(pool => `
            <div class="card mb-16 animate-slideUp">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${pool.id} — ${pool.route}</h3>
                        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">${pool.loadCount} loads combined • ${pool.totalWeight}T total</div>
                    </div>
                    <div class="flex gap-8">
                        <span class="badge badge-green">Save ~${pool.savingsPercent}%</span>
                        <button class="btn btn-primary btn-sm" onclick="UI.toast('Pool ${pool.id} booked! Splitting cost among ${pool.loadCount} shippers.','success')">Book Pool</button>
                    </div>
                </div>
                <div class="flex items-center gap-16 mb-16">
                    <div>
                        <div style="font-size:0.7rem;color:var(--text-muted)">Total Value</div>
                        <div style="font-weight:700;font-size:1.1rem">${formatCurrency(pool.totalPrice)}</div>
                    </div>
                    <div>
                        <div style="font-size:0.7rem;color:var(--text-muted)">Utilization</div>
                        <div class="flex items-center gap-8">
                            <div class="progress-bar" style="width:100px"><div class="progress-fill" style="width:${pool.utilization}%"></div></div>
                            <span style="font-weight:600;font-size:0.82rem">${pool.utilization}%</span>
                        </div>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead><tr><th>Load</th><th>Shipper</th><th>Type</th><th>Weight</th><th>Share</th></tr></thead>
                        <tbody>
                            ${pool.loads.map(l => `
                                <tr>
                                    <td style="font-weight:600">${l.id}</td>
                                    <td>${l.shipper}</td>
                                    <td>${l.loadType}</td>
                                    <td>${l.weight}T</td>
                                    <td style="font-weight:600">${formatCurrency(Math.round(l.price * (1 - pool.savingsPercent/100)))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `).join('') : '<div class="empty-state"><h3>No poolable loads found</h3><p>Loads under 10T on similar routes will be grouped here</p></div>'}
    </div>`;
}
