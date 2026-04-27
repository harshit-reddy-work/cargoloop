// ===== Find Return Load (Backhaul) Page — FIXED =====
function renderFindReturnLoad() {
    const trucks = DB.getCachedTrucks().filter(t => t.status === 'Delivering' || t.status === 'In Transit' || t.status === 'Available');
    const sampleTruck = trucks[0] || DB.getCachedTrucks()[0];
    const loads = DB.getCachedLoads();
    const backhaulLoads = sampleTruck ? MatchingEngine.findBackhaulLoads(sampleTruck, loads) : [];

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🔄 Find Return Load</h2>
                <p>Find loads for your return trip — reduce empty kilometers</p>
            </div>
            <span class="badge badge-green" id="bhMatchCount">${backhaulLoads.length} Matches</span>
        </div>

        <div class="card mb-24">
            <h3 class="card-title mb-16">Select Your Truck</h3>
            <div class="flex gap-12" style="flex-wrap:wrap;align-items:flex-end">
                <div class="form-group" style="flex:1;min-width:200px;margin:0">
                    <label class="form-label">Truck</label>
                    <select class="form-select" id="bhTruck" onchange="refreshBackhaul()">
                        ${trucks.slice(0, 15).map((t, i) => `<option value="${i}" ${i === 0 ? 'selected' : ''}>${t.vehicleNumber} — ${t.currentCity} → ${t.heading}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group" style="min-width:120px;margin:0">
                    <label class="form-label">Max Deviation</label>
                    <select class="form-select" id="bhDeviation" onchange="refreshBackhaul()">
                        <option value="100">100 km</option>
                        <option value="200" selected>200 km</option>
                        <option value="300">300 km</option>
                        <option value="500">500 km</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="refreshBackhaul()" style="height:40px">🔍 Find Loads</button>
            </div>
        </div>

        <div id="bhStats" class="stat-grid mb-24">
            ${renderBackhaulStats(backhaulLoads)}
        </div>

        <div id="bhBestMatch">
            ${renderBestMatch(backhaulLoads)}
        </div>

        <div class="grid-auto" id="backhaulResults">
            ${renderBackhaulCards(backhaulLoads)}
        </div>
    </div>`;
}

function renderBackhaulStats(backhaulLoads) {
    return `
        ${UI.statCard('🔄', backhaulLoads.length.toString(), 'Return Loads Found', null, false, '#eef2ff')}
        ${UI.statCard('📊', backhaulLoads.length ? Math.round(backhaulLoads.reduce((s, l) => s + l.backhaulScore, 0) / backhaulLoads.length).toString() + '/100' : '—', 'Avg Match Score', null, false, '#dcfce7')}
        ${UI.statCard('💰', backhaulLoads.length ? formatCurrency(backhaulLoads.reduce((s, l) => s + l.price, 0)) : '₹0', 'Potential Revenue', null, false, '#fef9c3')}
    `;
}

function renderBestMatch(backhaulLoads) {
    if (!backhaulLoads.length) return '';
    const best = backhaulLoads[0];
    return `<div class="card mb-16" style="border-left:3px solid var(--accent-primary)">
        <div style="font-weight:600;margin-bottom:4px">💡 Best Match: ${best.origin} → ${best.destination}</div>
        <div style="font-size:0.78rem;color:var(--text-secondary)">
            Only ${best.routeDeviationKm}km deviation, match score ${best.backhaulScore}/100. 
            Taking this load saves an estimated ${formatCurrency(best.distance * 40)} in empty return costs.
        </div>
    </div>`;
}

function renderBackhaulCards(backhaulLoads) {
    if (!backhaulLoads.length) {
        return '<div class="empty-state"><h3>No return loads found</h3><p>Try selecting a different truck or increasing max deviation</p></div>';
    }
    return backhaulLoads.slice(0, 10).map(l => `
        <div class="listing-card animate-slideUp">
            <div class="flex items-center justify-between">
                <span class="badge ${l.backhaulScore >= 70 ? 'badge-green' : l.backhaulScore >= 40 ? 'badge-yellow' : 'badge-red'}">
                    Score: ${l.backhaulScore}/100
                </span>
                <span style="font-size:0.72rem;color:var(--text-muted)">${l.id}</span>
            </div>
            <div class="route-line">
                <div><span class="route-dot origin"></span><div style="font-weight:600;margin-top:4px">${l.origin}</div></div>
                <div class="route-line-connector"></div>
                <div style="text-align:right"><span class="route-dot dest"></span><div style="font-weight:600;margin-top:4px">${l.destination}</div></div>
            </div>
            <div class="listing-meta">
                <div class="meta-item">📦 ${l.weight}T</div>
                <div class="meta-item">📏 ${l.distance} km</div>
                <div class="meta-item">🏷️ ${l.loadType}</div>
                <div class="meta-item">↗️ ${l.routeDeviationKm}km deviation</div>
            </div>
            <div class="listing-footer">
                <div class="price-tag">${formatCurrency(l.price)}</div>
                <button class="btn btn-primary btn-sm" onclick="UI.toast('Return load accepted! 🎉','success')">Accept</button>
            </div>
        </div>
    `).join('');
}

// FIX: This function now actually re-renders the results
function refreshBackhaul() {
    const idx = parseInt(document.getElementById('bhTruck').value);
    const maxDeviation = parseInt(document.getElementById('bhDeviation').value) || 200;
    const trucks = DB.getCachedTrucks().filter(t => t.status === 'Delivering' || t.status === 'In Transit' || t.status === 'Available');
    const truck = trucks[idx] || DB.getCachedTrucks()[0];
    
    if (!truck) {
        UI.toast('No truck selected', 'error');
        return;
    }

    const allLoads = DB.getCachedLoads();
    let loads = MatchingEngine.findBackhaulLoads(truck, allLoads);
    
    // Apply deviation filter
    loads = loads.filter(l => l.routeDeviationKm <= maxDeviation);

    // Update the stats
    document.getElementById('bhStats').innerHTML = renderBackhaulStats(loads);
    
    // Update the best match
    document.getElementById('bhBestMatch').innerHTML = renderBestMatch(loads);
    
    // Update the results grid
    document.getElementById('backhaulResults').innerHTML = renderBackhaulCards(loads);
    
    // Update match count badge
    document.getElementById('bhMatchCount').textContent = loads.length + ' Matches';

    UI.toast(`Found ${loads.length} return loads for ${truck.vehicleNumber}`, 'info');
}
