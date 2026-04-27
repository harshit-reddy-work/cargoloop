// ===== Pricing Page =====
function renderPricing() {
    const loads = DB.getCachedLoads();
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div><h2>💰 Pricing & Bidding</h2><p>Get fair price estimates and place bids on loads</p></div>
        </div>
        <div class="stat-grid mb-24">
            ${UI.statCard('💰', '₹48/km', 'Avg Market Rate', null, false, '#fef9c3')}
            ${UI.statCard('📊', '156', 'Active Bids', '12 new today', true, '#eef2ff')}
            ${UI.statCard('✅', '89%', 'Bid Acceptance Rate', null, false, '#dcfce7')}
        </div>
        <div class="grid-2 mb-24">
            <div class="card">
                <h3 class="card-title mb-16">Price Calculator</h3>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Origin</label>
                        <select class="form-select" id="priceOrigin">${CITIES.map(c => `<option value="${c.name}" ${c.name==='Mumbai'?'selected':''}>${c.name}</option>`).join('')}</select>
                    </div>
                    <div class="form-group"><label class="form-label">Destination</label>
                        <select class="form-select" id="priceDest">${CITIES.map(c => `<option value="${c.name}" ${c.name==='Delhi'?'selected':''}>${c.name}</option>`).join('')}</select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Weight (Tons)</label>
                        <input type="number" class="form-input" id="priceWeight" value="8" min="1">
                    </div>
                    <div class="form-group"><label class="form-label">Load Type</label>
                        <select class="form-select" id="priceLoadType">${LOAD_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}</select>
                    </div>
                </div>
                <button class="btn btn-primary w-full" onclick="calcPrice()">Calculate Fair Price</button>
                <div id="priceResult" class="mt-16"></div>
            </div>
            <div class="card">
                <h3 class="card-title mb-16">Popular Route Rates</h3>
                <div style="display:flex;flex-direction:column;gap:8px">
                    ${[
                        { route: 'Mumbai → Delhi', rate: '₹52/km', trend: '↑' },
                        { route: 'Delhi → Bangalore', rate: '₹68/km', trend: '↓' },
                        { route: 'Chennai → Hyderabad', rate: '₹42/km', trend: '→' },
                        { route: 'Ahmedabad → Mumbai', rate: '₹38/km', trend: '↑' },
                        { route: 'Pune → Nagpur', rate: '₹45/km', trend: '→' },
                        { route: 'Kolkata → Guwahati', rate: '₹55/km', trend: '↑' },
                    ].map(r => `
                        <div class="avail-item">
                            <div class="avail-info"><div class="name">${r.route}</div></div>
                            <span style="font-weight:700;font-size:0.85rem">${r.rate}</span>
                            <span style="font-size:0.8rem;color:${r.trend === '↑' ? 'var(--accent-red)' : r.trend === '↓' ? 'var(--accent-green)' : 'var(--text-muted)'}">${r.trend}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><h3 class="card-title">Active Bids</h3></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>Load</th><th>Route</th><th>Bids</th><th>Lowest Bid</th><th>Closes In</th><th>Action</th></tr></thead>
                    <tbody>
                        ${loads.filter(l => l.bids > 0).slice(0, 8).map(l => `
                            <tr>
                                <td style="font-weight:600">${l.id}</td>
                                <td>${l.origin} → ${l.destination}</td>
                                <td><span class="badge badge-primary">${l.bids} bids</span></td>
                                <td style="font-weight:700">${formatCurrency(Math.round(l.price * 0.85))}</td>
                                <td>${randInt(1, 24)}h</td>
                                <td><button class="btn btn-primary btn-sm" onclick="UI.toast('Bid placed!','success')">Bid</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function calcPrice() {
    const origin = document.getElementById('priceOrigin').value;
    const dest = document.getElementById('priceDest').value;
    const weight = parseFloat(document.getElementById('priceWeight').value) || 5;
    const loadType = document.getElementById('priceLoadType').value;
    const result = MatchingEngine.suggestPrice(origin, dest, weight, loadType);
    document.getElementById('priceResult').innerHTML = `
        <div style="text-align:center;padding:20px;background:var(--bg-glass);border-radius:var(--radius-md);border:1px solid var(--border-color)">
            <div style="font-size:0.72rem;color:var(--text-muted)">${origin} → ${dest} • ${result.distance} km</div>
            <div style="font-size:2rem;font-weight:800;color:var(--accent-primary);margin:8px 0">${formatCurrency(result.suggested)}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">₹${result.perKm}/km • Range: ${formatCurrency(result.low)} – ${formatCurrency(result.high)}</div>
        </div>`;
}
