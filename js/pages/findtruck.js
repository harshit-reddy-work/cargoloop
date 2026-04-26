// ===== Find Truck Page =====
function renderFindTruck() {
    const availableTrucks = MockData.trucks.filter(t => t.status === 'Available');
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🔍 Find Truck</h2>
                <p>Search available trucks by route, capacity, and type</p>
            </div>
            <span class="badge badge-green">${availableTrucks.length} Available</span>
        </div>

        <div class="card mb-24">
            <div class="flex gap-12" style="flex-wrap:wrap;align-items:flex-end">
                <div class="form-group" style="flex:1;min-width:180px;margin:0">
                    <label class="form-label">Pickup City</label>
                    <select class="form-select" id="ftOrigin">
                        <option value="">Any City</option>
                        ${CITIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group" style="flex:1;min-width:180px;margin:0">
                    <label class="form-label">Truck Type</label>
                    <select class="form-select" id="ftType">
                        <option value="">All Types</option>
                        ${TRUCK_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group" style="flex:1;min-width:120px;margin:0">
                    <label class="form-label">Min Capacity (T)</label>
                    <input type="number" class="form-input" id="ftCapacity" placeholder="Any" min="1">
                </div>
                <button class="btn btn-primary" onclick="filterTrucks()" style="height:42px">Search</button>
            </div>
        </div>

        <div class="grid-auto" id="truckResults">
            ${availableTrucks.slice(0, 12).map(t => UI.truckCard(t)).join('')}
        </div>
    </div>`;
}

function filterTrucks() {
    const origin = document.getElementById('ftOrigin').value;
    const type = document.getElementById('ftType').value;
    const cap = parseInt(document.getElementById('ftCapacity').value) || 0;
    let trucks = MockData.trucks.filter(t => t.status === 'Available');
    if (origin) trucks = trucks.filter(t => t.currentCity === origin);
    if (type) trucks = trucks.filter(t => t.truckType === type);
    if (cap) trucks = trucks.filter(t => t.capacity >= cap);
    document.getElementById('truckResults').innerHTML = trucks.length ?
        trucks.map(t => UI.truckCard(t)).join('') :
        '<div class="empty-state"><h3>No trucks found</h3><p>Try adjusting your search filters</p></div>';
    UI.toast(`Found ${trucks.length} trucks`, 'info');
}
