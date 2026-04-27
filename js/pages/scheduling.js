// ===== Scheduling Page =====
function renderScheduling() {
    const loads = DB.getCachedLoads();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    const events = loads.slice(0, 20).map(l => ({
        date: parseInt(l.pickupDate.split('-')[2]),
        label: `${l.origin.substring(0,3)}→${l.destination.substring(0,3)}`,
        type: l.isBackhaul ? 'return' : 'outbound'
    }));

    let calendarHTML = '';
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    dayNames.forEach(d => { calendarHTML += `<div class="calendar-day-header">${d}</div>`; });
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div class="calendar-day other-month"><span class="day-num">${new Date(year, month, -firstDay + i + 1).getDate()}</span></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate();
        const dayEvents = events.filter(e => e.date === day);
        calendarHTML += `<div class="calendar-day ${isToday ? 'today' : ''}" onclick="showDayDetail(${day})">
            <span class="day-num">${day}</span>
            ${dayEvents.slice(0, 2).map(e => `<div class="calendar-event ${e.type}">${e.label}</div>`).join('')}
            ${dayEvents.length > 2 ? `<div style="font-size:0.6rem;color:var(--text-muted)">+${dayEvents.length - 2} more</div>` : ''}
        </div>`;
    }

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div><h2>📅 Scheduling</h2><p>Manage outbound and return trips</p></div>
            <div class="flex gap-8">
                <button class="btn btn-secondary btn-sm">← Prev</button>
                <span style="font-weight:700;font-size:1.1rem;padding:0 12px">${monthNames[month]} ${year}</span>
                <button class="btn btn-secondary btn-sm">Next →</button>
            </div>
        </div>
        <div class="stat-grid mb-24">
            ${UI.statCard('📦', '12', 'Scheduled Pickups', 'This week', true, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('🚛', '8', 'In Transit', null, false, 'rgba(6,182,212,0.15)')}
            ${UI.statCard('🔄', '5', 'Return Trips', 'Assigned', true, 'rgba(16,185,129,0.15)')}
            ${UI.statCard('✅', '23', 'Completed', 'This month', true, 'rgba(245,158,11,0.15)')}
        </div>
        <div class="card mb-24">
            <div class="card-header">
                <h3 class="card-title">Trip Calendar</h3>
                <div class="flex gap-12">
                    <span class="flex items-center gap-4"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(99,102,241,0.4)"></span> <span style="font-size:0.72rem;color:var(--text-muted)">Outbound</span></span>
                    <span class="flex items-center gap-4"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:rgba(16,185,129,0.4)"></span> <span style="font-size:0.72rem;color:var(--text-muted)">Return</span></span>
                </div>
            </div>
            <div class="calendar-grid">${calendarHTML}</div>
        </div>
        <div class="card">
            <div class="card-header"><h3 class="card-title">Upcoming Trips</h3></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>Date</th><th>Route</th><th>Type</th><th>Truck</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        ${loads.slice(0, 8).map(l => `
                            <tr>
                                <td>${l.pickupDate}</td>
                                <td style="font-weight:600">${l.origin} → ${l.destination}</td>
                                <td><span class="badge ${l.isBackhaul ? 'badge-green' : 'badge-primary'}">${l.isBackhaul ? 'Return' : 'Outbound'}</span></td>
                                <td>${l.truckTypeRequired}</td>
                                <td><span class="badge badge-${getStatusColor(l.status)}">${l.status}</span></td>
                                <td><button class="btn btn-ghost btn-sm" onclick="UI.toast('Trip details opened','info')">View</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function showDayDetail(day) {
    const loads = DB.getCachedLoads();
    const events = loads.slice(0, 20).filter(l => parseInt(l.pickupDate.split('-')[2]) === day);
    if (events.length === 0) { UI.toast('No shipments on this day', 'info'); return; }
    UI.modal(`Shipments on Day ${day}`, events.map(l => `
        <div style="padding:12px;background:var(--bg-glass);border-radius:var(--radius-sm);margin-bottom:8px">
            <div class="flex items-center justify-between">
                <span style="font-weight:600">${l.origin} → ${l.destination}</span>
                <span class="badge badge-${getStatusColor(l.status)}">${l.status}</span>
            </div>
            <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px">${l.loadType} • ${l.weight}T • ${formatCurrency(l.price)}</div>
        </div>
    `).join(''));
}
