// ===== Post Load Page =====
function renderPostLoad() {
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>📦 Post a Load</h2>
                <p>Create a new shipment to find available trucks</p>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <h3 class="card-title mb-16">Shipment Details</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Origin City</label>
                        <select class="form-select" id="postOrigin">
                            <option value="">Select origin...</option>
                            ${CITIES.map(c => `<option value="${c.name}">${c.name}, ${c.state}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Destination City</label>
                        <select class="form-select" id="postDest">
                            <option value="">Select destination...</option>
                            ${CITIES.map(c => `<option value="${c.name}">${c.name}, ${c.state}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Load Type</label>
                        <select class="form-select" id="postLoadType">
                            ${LOAD_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Truck Type Required</label>
                        <select class="form-select" id="postTruckType">
                            ${TRUCK_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Weight (Tons)</label>
                        <input type="number" class="form-input" id="postWeight" placeholder="e.g. 5" min="1" max="25" value="5">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Budget (₹)</label>
                        <input type="number" class="form-input" id="postBudget" placeholder="Enter budget">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Pickup Date</label>
                        <input type="date" class="form-input" id="postPickup" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Delivery Deadline</label>
                        <input type="date" class="form-input" id="postDelivery" value="${new Date(Date.now() + 3*86400000).toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Company Name</label>
                    <input type="text" class="form-input" id="postCompany" placeholder="Your company name">
                </div>
                <div class="form-group">
                    <label class="form-label">Pricing Model</label>
                    <select class="form-select" id="postPricingModel">
                        <option value="fixed">Fixed Price</option>
                        <option value="bidding">Open for Bidding</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes (Optional)</label>
                    <textarea class="form-textarea" id="postInstructions" placeholder="Special handling instructions..."></textarea>
                </div>

                <div class="flex gap-8 mt-16">
                    <button class="btn btn-primary btn-lg" onclick="submitLoad()">Post Load</button>
                    <button class="btn btn-secondary btn-lg" onclick="getAIPrice()">Get Price Estimate</button>
                </div>
            </div>

            <div>
                <div class="card mb-16" id="priceSuggestionCard" style="display:none">
                    <h3 class="card-title mb-16">Price Estimate</h3>
                    <div id="priceSuggestionContent"></div>
                </div>

                <div class="card mb-16">
                    <h3 class="card-title mb-16">💡 Tips</h3>
                    <div style="display:flex;flex-direction:column;gap:10px">
                        <div style="padding:10px 12px;background:var(--bg-glass);border-radius:var(--radius-sm);border-left:3px solid var(--accent-primary)">
                            <div style="font-weight:600;font-size:0.82rem">Use Bidding for Better Rates</div>
                            <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:3px">Bidding gets 40% more responses from transporters</div>
                        </div>
                        <div style="padding:10px 12px;background:var(--bg-glass);border-radius:var(--radius-sm);border-left:3px solid var(--accent-green)">
                            <div style="font-weight:600;font-size:0.82rem">Flexible Dates = Lower Cost</div>
                            <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:3px">Wider delivery windows get matched faster</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-title mb-16">🔥 High Demand Routes</h3>
                    <div style="display:flex;flex-direction:column;gap:6px">
                        ${[
                            { route: 'Mumbai → Delhi', demand: 95 },
                            { route: 'Delhi → Jaipur', demand: 82 },
                            { route: 'Bangalore → Chennai', demand: 78 },
                            { route: 'Ahmedabad → Mumbai', demand: 88 },
                        ].map(r => `
                            <div class="avail-item">
                                <div class="avail-info">
                                    <div class="name">${r.route}</div>
                                </div>
                                <span class="badge ${r.demand > 80 ? 'badge-red' : 'badge-yellow'}">${r.demand > 80 ? 'High' : 'Medium'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function getAIPrice() {
    const origin = document.getElementById('postOrigin').value;
    const dest = document.getElementById('postDest').value;
    const weight = parseFloat(document.getElementById('postWeight').value) || 5;
    const loadType = document.getElementById('postLoadType').value;
    if (!origin || !dest) { UI.toast('Please select origin and destination', 'error'); return; }

    const s = MatchingEngine.suggestPrice(origin, dest, weight, loadType);
    const card = document.getElementById('priceSuggestionCard');
    card.style.display = 'block';
    document.getElementById('priceSuggestionContent').innerHTML = `
        <div style="text-align:center;padding:16px;background:var(--bg-glass);border-radius:var(--radius-md)">
            <div style="font-size:0.72rem;color:var(--text-muted)">${origin} → ${dest} (${s.distance} km)</div>
            <div style="font-size:2.2rem;font-weight:800;color:var(--accent-primary);margin:8px 0">${formatCurrency(s.suggested)}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">₹${s.perKm}/km</div>
        </div>
        <div class="flex gap-12 mt-16" style="justify-content:center">
            <div style="text-align:center;padding:10px 16px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                <div style="font-size:0.68rem;color:var(--text-muted)">Low</div>
                <div style="font-weight:700;color:var(--accent-green)">${formatCurrency(s.low)}</div>
            </div>
            <div style="text-align:center;padding:10px 16px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                <div style="font-size:0.68rem;color:var(--text-muted)">Market</div>
                <div style="font-weight:700;color:var(--accent-primary)">${formatCurrency(s.suggested)}</div>
            </div>
            <div style="text-align:center;padding:10px 16px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                <div style="font-size:0.68rem;color:var(--text-muted)">High</div>
                <div style="font-weight:700;color:var(--accent-yellow)">${formatCurrency(s.high)}</div>
            </div>
        </div>
        <button class="btn btn-primary w-full mt-16" onclick="document.getElementById('postBudget').value=${s.suggested};UI.toast('Price applied!','success')">Apply Price</button>
    `;
    document.getElementById('postBudget').value = s.suggested;
}

async function submitLoad() {
    const origin = document.getElementById('postOrigin').value;
    const dest = document.getElementById('postDest').value;
    if (!origin || !dest) { UI.toast('Please fill origin and destination', 'error'); return; }

    const originCity = CITIES.find(c => c.name === origin);
    const destCity = CITIES.find(c => c.name === dest);
    const weight = parseInt(document.getElementById('postWeight').value) || 5;
    const distance = calcDistance(originCity, destCity);
    const price = parseInt(document.getElementById('postBudget').value) || (distance * randInt(35, 85));

    const load = {
        company: document.getElementById('postCompany').value || 'Unknown Company',
        origin: origin,
        originState: originCity.state,
        originLat: originCity.lat,
        originLng: originCity.lng,
        destination: dest,
        destState: destCity.state,
        destLat: destCity.lat,
        destLng: destCity.lng,
        weight: weight,
        loadType: document.getElementById('postLoadType').value,
        truckTypeRequired: document.getElementById('postTruckType').value,
        distance: distance,
        price: price,
        pricePerKm: Math.round(price / distance),
        pickupDate: document.getElementById('postPickup').value,
        deliveryDate: document.getElementById('postDelivery').value,
        status: 'Pending',
        isBackhaul: false,
        poolable: weight < 10,
        bids: 0,
        urgent: false,
        postedBy: Auth.getSession()?.username || '',
        bidders: []
    };

    try {
        const saved = await DB.addLoad(load);
        UI.toast(`Load posted successfully! ID: ${saved.id} 🎉`, 'success');
        setTimeout(() => App.navigate('marketplace'), 1000);
    } catch (e) {
        UI.toast('Error posting load: ' + e.message, 'error');
    }
}
