// ===== Reverse Logistics Page =====
function renderReverseLogistics() {
    const reverseOrders = [
        { id: 'RV5001', type: 'Product Return', origin: 'Delhi', destination: 'Mumbai', weight: 2, status: 'Pending', reason: 'Customer return — defective product', shipper: 'Om Electronics', date: '2026-04-25' },
        { id: 'RV5002', type: 'Unsold Goods', origin: 'Chennai', destination: 'Bangalore', weight: 8, status: 'In Transit', reason: 'End-of-season unsold inventory', shipper: 'Rajesh Textiles', date: '2026-04-24' },
        { id: 'RV5003', type: 'Recycling', origin: 'Pune', destination: 'Mumbai', weight: 5, status: 'Matched', reason: 'E-waste recycling pickup', shipper: 'Gupta Auto Parts', date: '2026-04-23' },
        { id: 'RV5004', type: 'Repair/RMA', origin: 'Hyderabad', destination: 'Bangalore', weight: 1, status: 'Delivered', reason: 'Warranty repair return', shipper: 'Patel Pharma', date: '2026-04-22' },
        { id: 'RV5005', type: 'Product Return', origin: 'Jaipur', destination: 'Delhi', weight: 3, status: 'Pending', reason: 'Wrong item shipped', shipper: 'Krishna FMCG', date: '2026-04-25' },
        { id: 'RV5006', type: 'Recycling', origin: 'Ahmedabad', destination: 'Surat', weight: 12, status: 'In Transit', reason: 'Packaging material recycling', shipper: 'Sharma Chemicals', date: '2026-04-24' },
    ];

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🔙 Reverse Logistics</h2>
                <p>Handle returns, unsold goods, and recycling logistics</p>
            </div>
            <button class="btn btn-primary" onclick="UI.modal('New Reverse Order','<div style=\\'text-align:center;padding:20px\\'>Coming soon! Use the form below to initiate a return.</div>')">+ New Return</button>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('🔙', reverseOrders.length.toString(), 'Active Returns', null, false, 'rgba(239,68,68,0.15)')}
            ${UI.statCard('📦', '3', 'Product Returns', 'Customer initiated', false, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('♻️', '2', 'Recycling Pickups', 'Eco-friendly', true, 'rgba(16,185,129,0.15)')}
            ${UI.statCard('🔧', '1', 'Repair/RMA', 'Under warranty', false, 'rgba(245,158,11,0.15)')}
        </div>

        <div class="grid-3 mb-24">
            <div class="card" style="text-align:center;border-top:3px solid var(--accent-red)">
                <div style="font-size:2rem;margin-bottom:8px">📦</div>
                <div style="font-weight:700">Product Returns</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px">Customer returns, wrong items, defective goods</div>
            </div>
            <div class="card" style="text-align:center;border-top:3px solid var(--accent-green)">
                <div style="font-size:2rem;margin-bottom:8px">♻️</div>
                <div style="font-weight:700">Recycling</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px">E-waste, packaging, materials recycling</div>
            </div>
            <div class="card" style="text-align:center;border-top:3px solid var(--accent-yellow)">
                <div style="font-size:2rem;margin-bottom:8px">🏪</div>
                <div style="font-weight:700">Unsold Goods</div>
                <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px">Season-end, overstock return to warehouse</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3 class="card-title">Active Reverse Orders</h3></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>ID</th><th>Type</th><th>Route</th><th>Weight</th><th>Reason</th><th>Shipper</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        ${reverseOrders.map(r => `
                            <tr>
                                <td style="font-weight:600">${r.id}</td>
                                <td><span class="badge ${r.type === 'Recycling' ? 'badge-green' : r.type === 'Product Return' ? 'badge-red' : 'badge-yellow'}">${r.type}</span></td>
                                <td>${r.origin} → ${r.destination}</td>
                                <td>${r.weight}T</td>
                                <td style="max-width:200px;font-size:0.78rem;color:var(--text-secondary)">${r.reason}</td>
                                <td>${r.shipper}</td>
                                <td><span class="badge badge-${getStatusColor(r.status)}">${r.status}</span></td>
                                <td><button class="btn btn-secondary btn-sm" onclick="UI.toast('Return ${r.id} details','info')">Manage</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}
