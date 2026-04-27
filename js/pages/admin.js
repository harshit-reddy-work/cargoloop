// ===== Admin Management Pages =====
function renderManageLoads() {
    const loads = DB.getCachedLoads();
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>📦 Manage Loads</h2>
                <p>View, edit, and delete all loads in the system</p>
            </div>
            <div class="flex gap-8">
                <button class="btn btn-danger btn-sm" onclick="confirmResetDB()">🗑️ Reset Database</button>
                <button class="btn btn-primary" onclick="App.navigate('postload')">+ Add Load</button>
            </div>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('📦', loads.length.toString(), 'Total Loads', null, false, '#eef2ff')}
            ${UI.statCard('⏳', loads.filter(l => l.status === 'Pending').length.toString(), 'Pending', null, false, '#fef9c3')}
            ${UI.statCard('🚛', loads.filter(l => l.status === 'In Transit').length.toString(), 'In Transit', null, false, '#e0f2fe')}
            ${UI.statCard('✅', loads.filter(l => l.status === 'Delivered' || l.status === 'Completed').length.toString(), 'Completed', null, false, '#dcfce7')}
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">All Loads (${loads.length})</h3>
                <div class="flex gap-8">
                    <input type="text" class="form-input" placeholder="Search loads..." id="adminLoadSearch" 
                        oninput="filterAdminLoads()" style="width:200px;padding:6px 12px;font-size:0.78rem">
                </div>
            </div>
            <div class="table-container">
                <table class="data-table" id="adminLoadsTable">
                    <thead><tr>
                        <th>ID</th><th>Route</th><th>Company</th><th>Type</th><th>Weight</th><th>Price</th><th>Status</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                        ${loads.map(l => `
                            <tr data-id="${l.id}">
                                <td style="font-weight:600">${l.id}</td>
                                <td>${l.origin} → ${l.destination}</td>
                                <td>${l.company || l.shipper || '—'}</td>
                                <td>${l.loadType}</td>
                                <td>${l.weight}T</td>
                                <td style="font-weight:700">${formatCurrency(l.price)}</td>
                                <td><span class="badge badge-${getStatusColor(l.status)}">${l.status}</span></td>
                                <td>
                                    <div class="flex gap-4">
                                        <button class="btn btn-ghost btn-sm admin-action-btn" onclick="editLoadModal('${l.id}')" title="Edit">✏️</button>
                                        <button class="btn btn-ghost btn-sm admin-action-btn admin-delete-btn" onclick="confirmDeleteLoad('${l.id}')" title="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function renderManageTrucks() {
    const trucks = DB.getCachedTrucks();
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🚛 Manage Trucks</h2>
                <p>View, edit, and delete all trucks in the fleet</p>
            </div>
            <button class="btn btn-primary" onclick="showAddTruckModal()">+ Add Truck</button>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('🚛', trucks.length.toString(), 'Total Trucks', null, false, '#eef2ff')}
            ${UI.statCard('✅', trucks.filter(t => t.status === 'Available').length.toString(), 'Available', null, false, '#dcfce7')}
            ${UI.statCard('🔄', trucks.filter(t => t.status === 'In Transit').length.toString(), 'In Transit', null, false, '#fef9c3')}
            ${UI.statCard('⭐', (trucks.reduce((s, t) => s + parseFloat(t.rating), 0) / trucks.length).toFixed(1), 'Avg Rating', null, false, '#e0f2fe')}
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">All Trucks (${trucks.length})</h3>
                <input type="text" class="form-input" placeholder="Search trucks..." id="adminTruckSearch" 
                    oninput="filterAdminTrucks()" style="width:200px;padding:6px 12px;font-size:0.78rem">
            </div>
            <div class="table-container">
                <table class="data-table" id="adminTrucksTable">
                    <thead><tr>
                        <th>ID</th><th>Vehicle</th><th>Owner</th><th>Type</th><th>Capacity</th><th>Location</th><th>Status</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                        ${trucks.map(t => `
                            <tr data-id="${t.id}">
                                <td style="font-weight:600">${t.id}</td>
                                <td>${t.vehicleNumber}</td>
                                <td>${t.owner}</td>
                                <td>${t.make} ${t.truckType}</td>
                                <td>${t.capacity}T</td>
                                <td>${t.currentCity} → ${t.heading}</td>
                                <td><span class="badge badge-${getStatusColor(t.status)}">${t.status}</span></td>
                                <td>
                                    <div class="flex gap-4">
                                        <button class="btn btn-ghost btn-sm admin-action-btn" onclick="editTruckModal('${t.id}')" title="Edit">✏️</button>
                                        <button class="btn btn-ghost btn-sm admin-action-btn admin-delete-btn" onclick="confirmDeleteTruck('${t.id}')" title="Delete">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

// ===== Admin Actions =====
function editLoadModal(loadId) {
    const load = DB.getCachedLoads().find(l => l.id === loadId);
    if (!load) return;
    UI.modal('Edit Load — ' + loadId, `
        <div class="form-row">
            <div class="form-group"><label class="form-label">Origin</label>
                <select class="form-select" id="editLoadOrigin">${CITIES.map(c => `<option value="${c.name}" ${c.name === load.origin ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Destination</label>
                <select class="form-select" id="editLoadDest">${CITIES.map(c => `<option value="${c.name}" ${c.name === load.destination ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Load Type</label>
                <select class="form-select" id="editLoadType">${LOAD_TYPES.map(t => `<option value="${t}" ${t === load.loadType ? 'selected' : ''}>${t}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Truck Type</label>
                <select class="form-select" id="editTruckType">${TRUCK_TYPES.map(t => `<option value="${t}" ${t === load.truckTypeRequired ? 'selected' : ''}>${t}</option>`).join('')}</select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Weight (T)</label>
                <input type="number" class="form-input" id="editLoadWeight" value="${load.weight}" min="1" max="25">
            </div>
            <div class="form-group"><label class="form-label">Price (₹)</label>
                <input type="number" class="form-input" id="editLoadPrice" value="${load.price}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Status</label>
                <select class="form-select" id="editLoadStatus">${['Pending','Matched','Picked Up','In Transit','Delivered','Completed'].map(s => `<option value="${s}" ${s === load.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Company</label>
                <input type="text" class="form-input" id="editLoadCompany" value="${load.company || load.shipper || ''}">
            </div>
        </div>
        <div class="flex gap-8 mt-16">
            <button class="btn btn-primary btn-lg w-full" onclick="saveLoadEdit('${loadId}')">💾 Save Changes</button>
            <button class="btn btn-secondary btn-lg" onclick="UI.closeModal()">Cancel</button>
        </div>
    `);
}

async function saveLoadEdit(loadId) {
    const originName = document.getElementById('editLoadOrigin').value;
    const destName = document.getElementById('editLoadDest').value;
    const originCity = CITIES.find(c => c.name === originName);
    const destCity = CITIES.find(c => c.name === destName);

    const updates = {
        origin: originName,
        originState: originCity ? originCity.state : '',
        originLat: originCity ? originCity.lat : 0,
        originLng: originCity ? originCity.lng : 0,
        destination: destName,
        destState: destCity ? destCity.state : '',
        destLat: destCity ? destCity.lat : 0,
        destLng: destCity ? destCity.lng : 0,
        loadType: document.getElementById('editLoadType').value,
        truckTypeRequired: document.getElementById('editTruckType').value,
        weight: parseInt(document.getElementById('editLoadWeight').value) || 1,
        price: parseInt(document.getElementById('editLoadPrice').value) || 0,
        status: document.getElementById('editLoadStatus').value,
        company: document.getElementById('editLoadCompany').value,
        distance: originCity && destCity ? calcDistance(originCity, destCity) : 0
    };

    try {
        await DB.updateLoad(loadId, updates);
        UI.closeModal();
        UI.toast('Load updated successfully! ✅', 'success');
        App.navigate('manageloads');
    } catch (e) {
        UI.toast('Error updating load: ' + e.message, 'error');
    }
}

function confirmDeleteLoad(loadId) {
    UI.modal('Confirm Delete', `
        <div style="text-align:center;padding:20px 0">
            <div style="font-size:3rem;margin-bottom:12px">⚠️</div>
            <h3 style="margin-bottom:8px">Delete Load ${loadId}?</h3>
            <p style="color:var(--text-secondary);font-size:0.85rem">This action cannot be undone. The load will be permanently removed from the database.</p>
        </div>
        <div class="flex gap-8 mt-16">
            <button class="btn btn-danger btn-lg w-full" onclick="executeDeleteLoad('${loadId}')">🗑️ Yes, Delete</button>
            <button class="btn btn-secondary btn-lg w-full" onclick="UI.closeModal()">Cancel</button>
        </div>
    `);
}

async function executeDeleteLoad(loadId) {
    try {
        await DB.deleteLoad(loadId);
        UI.closeModal();
        UI.toast('Load deleted successfully! 🗑️', 'success');
        App.navigate('manageloads');
    } catch (e) {
        UI.toast('Error deleting load: ' + e.message, 'error');
    }
}

function editTruckModal(truckId) {
    const truck = DB.getCachedTrucks().find(t => t.id === truckId);
    if (!truck) return;
    UI.modal('Edit Truck — ' + truckId, `
        <div class="form-row">
            <div class="form-group"><label class="form-label">Vehicle Number</label>
                <input type="text" class="form-input" id="editTruckVehicle" value="${truck.vehicleNumber}">
            </div>
            <div class="form-group"><label class="form-label">Owner</label>
                <input type="text" class="form-input" id="editTruckOwner" value="${truck.owner}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Truck Type</label>
                <select class="form-select" id="editTruckTType">${TRUCK_TYPES.map(t => `<option value="${t}" ${t === truck.truckType ? 'selected' : ''}>${t}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Make</label>
                <select class="form-select" id="editTruckMake">${VEHICLE_MAKES.map(m => `<option value="${m}" ${m === truck.make ? 'selected' : ''}>${m}</option>`).join('')}</select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Capacity (T)</label>
                <input type="number" class="form-input" id="editTruckCapacity" value="${truck.capacity}" min="1" max="25">
            </div>
            <div class="form-group"><label class="form-label">Status</label>
                <select class="form-select" id="editTruckStatus">${['Available','In Transit','Delivering','Loading'].map(s => `<option value="${s}" ${s === truck.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Current City</label>
                <select class="form-select" id="editTruckCity">${CITIES.map(c => `<option value="${c.name}" ${c.name === truck.currentCity ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Heading To</label>
                <select class="form-select" id="editTruckHeading">${CITIES.map(c => `<option value="${c.name}" ${c.name === truck.heading ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Driver Name</label>
                <input type="text" class="form-input" id="editTruckDriver" value="${truck.driverName}">
            </div>
            <div class="form-group"><label class="form-label">Rating</label>
                <input type="number" class="form-input" id="editTruckRating" value="${truck.rating}" min="1" max="5" step="0.1">
            </div>
        </div>
        <div class="flex gap-8 mt-16">
            <button class="btn btn-primary btn-lg w-full" onclick="saveTruckEdit('${truckId}')">💾 Save Changes</button>
            <button class="btn btn-secondary btn-lg" onclick="UI.closeModal()">Cancel</button>
        </div>
    `);
}

async function saveTruckEdit(truckId) {
    const cityName = document.getElementById('editTruckCity').value;
    const headingName = document.getElementById('editTruckHeading').value;
    const city = CITIES.find(c => c.name === cityName);
    const heading = CITIES.find(c => c.name === headingName);

    const updates = {
        vehicleNumber: document.getElementById('editTruckVehicle').value,
        owner: document.getElementById('editTruckOwner').value,
        truckType: document.getElementById('editTruckTType').value,
        make: document.getElementById('editTruckMake').value,
        capacity: parseInt(document.getElementById('editTruckCapacity').value) || 1,
        status: document.getElementById('editTruckStatus').value,
        currentCity: cityName,
        currentLat: city ? city.lat : 0,
        currentLng: city ? city.lng : 0,
        heading: headingName,
        headingLat: heading ? heading.lat : 0,
        headingLng: heading ? heading.lng : 0,
        driverName: document.getElementById('editTruckDriver').value,
        rating: document.getElementById('editTruckRating').value,
    };

    try {
        await DB.updateTruck(truckId, updates);
        UI.closeModal();
        UI.toast('Truck updated successfully! ✅', 'success');
        App.navigate('managetrucks');
    } catch (e) {
        UI.toast('Error updating truck: ' + e.message, 'error');
    }
}

function confirmDeleteTruck(truckId) {
    UI.modal('Confirm Delete', `
        <div style="text-align:center;padding:20px 0">
            <div style="font-size:3rem;margin-bottom:12px">⚠️</div>
            <h3 style="margin-bottom:8px">Delete Truck ${truckId}?</h3>
            <p style="color:var(--text-secondary);font-size:0.85rem">This action cannot be undone. The truck will be permanently removed.</p>
        </div>
        <div class="flex gap-8 mt-16">
            <button class="btn btn-danger btn-lg w-full" onclick="executeDeleteTruck('${truckId}')">🗑️ Yes, Delete</button>
            <button class="btn btn-secondary btn-lg w-full" onclick="UI.closeModal()">Cancel</button>
        </div>
    `);
}

async function executeDeleteTruck(truckId) {
    try {
        await DB.deleteTruck(truckId);
        UI.closeModal();
        UI.toast('Truck deleted successfully! 🗑️', 'success');
        App.navigate('managetrucks');
    } catch (e) {
        UI.toast('Error deleting truck: ' + e.message, 'error');
    }
}

function showAddTruckModal() {
    UI.modal('Add New Truck', `
        <div class="form-row">
            <div class="form-group"><label class="form-label">Vehicle Number</label>
                <input type="text" class="form-input" id="addTruckVehicle" placeholder="e.g. MH12 AB 1234">
            </div>
            <div class="form-group"><label class="form-label">Owner</label>
                <input type="text" class="form-input" id="addTruckOwner" placeholder="Company name">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Truck Type</label>
                <select class="form-select" id="addTruckTType">${TRUCK_TYPES.map(t => `<option value="${t}">${t}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label class="form-label">Make</label>
                <select class="form-select" id="addTruckMake">${VEHICLE_MAKES.map(m => `<option value="${m}">${m}</option>`).join('')}</select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Capacity (T)</label>
                <input type="number" class="form-input" id="addTruckCapacity" value="10" min="1" max="25">
            </div>
            <div class="form-group"><label class="form-label">Current City</label>
                <select class="form-select" id="addTruckCity">${CITIES.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select>
            </div>
        </div>
        <div class="form-group"><label class="form-label">Driver Name</label>
            <input type="text" class="form-input" id="addTruckDriver" placeholder="Driver full name">
        </div>
        <button class="btn btn-primary btn-lg w-full mt-16" onclick="executeAddTruck()">🚛 Add Truck</button>
    `);
}

async function executeAddTruck() {
    const cityName = document.getElementById('addTruckCity').value;
    const city = CITIES.find(c => c.name === cityName);
    const headingCity = randItem(CITIES.filter(c => c.name !== cityName));
    
    const truck = {
        owner: document.getElementById('addTruckOwner').value || 'Unknown',
        driverName: document.getElementById('addTruckDriver').value || 'Unknown',
        vehicleNumber: document.getElementById('addTruckVehicle').value || 'XX00 AA 0000',
        truckType: document.getElementById('addTruckTType').value,
        make: document.getElementById('addTruckMake').value,
        capacity: parseInt(document.getElementById('addTruckCapacity').value) || 10,
        currentCity: cityName,
        currentLat: city ? city.lat : 0,
        currentLng: city ? city.lng : 0,
        heading: headingCity.name,
        headingLat: headingCity.lat,
        headingLng: headingCity.lng,
        status: 'Available',
        availableFrom: new Date().toISOString().split('T')[0],
        rating: '4.0',
        totalTrips: 0,
        reliability: 85,
        kycVerified: false,
        gpsEnabled: true,
    };

    try {
        await DB.addTruck(truck);
        UI.closeModal();
        UI.toast('Truck added successfully! 🚛', 'success');
        App.navigate('managetrucks');
    } catch (e) {
        UI.toast('Error adding truck: ' + e.message, 'error');
    }
}

function confirmResetDB() {
    UI.modal('Reset Database', `
        <div style="text-align:center;padding:20px 0">
            <div style="font-size:3rem;margin-bottom:12px">💣</div>
            <h3 style="margin-bottom:8px;color:var(--accent-red)">Reset Entire Database?</h3>
            <p style="color:var(--text-secondary);font-size:0.85rem">This will delete ALL data and re-seed with fresh mock data. This cannot be undone.</p>
        </div>
        <div class="flex gap-8 mt-16">
            <button class="btn btn-danger btn-lg w-full" onclick="executeResetDB()">💣 Yes, Reset Everything</button>
            <button class="btn btn-secondary btn-lg w-full" onclick="UI.closeModal()">Cancel</button>
        </div>
    `);
}

async function executeResetDB() {
    UI.closeModal();
    UI.toast('Resetting database... please wait', 'info');
    try {
        await DB.resetDatabase();
        UI.toast('Database reset complete! 🎉', 'success');
        App.navigate('dashboard');
    } catch (e) {
        UI.toast('Error resetting: ' + e.message, 'error');
    }
}

// ===== Search/Filter helpers =====
function filterAdminLoads() {
    const q = document.getElementById('adminLoadSearch').value.toLowerCase();
    document.querySelectorAll('#adminLoadsTable tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

function filterAdminTrucks() {
    const q = document.getElementById('adminTruckSearch').value.toLowerCase();
    document.querySelectorAll('#adminTrucksTable tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}
