// ===== Payments Page =====
function renderPayments() {
    const transactions = [
        { id: 'PAY7001', load: 'LD01005', route: 'Mumbai → Delhi', amount: 45000, status: 'Completed', method: 'Bank Transfer', date: '2026-04-24', type: 'credit' },
        { id: 'PAY7002', load: 'LD01012', route: 'Bangalore → Chennai', amount: 18000, status: 'In Escrow', method: 'UPI', date: '2026-04-25', type: 'pending' },
        { id: 'PAY7003', load: 'LD01018', route: 'Delhi → Jaipur', amount: 12500, status: 'Processing', method: 'Bank Transfer', date: '2026-04-25', type: 'pending' },
        { id: 'PAY7004', load: 'LD01022', route: 'Pune → Mumbai', amount: 8000, status: 'Completed', method: 'UPI', date: '2026-04-23', type: 'credit' },
        { id: 'PAY7005', load: 'LD01030', route: 'Ahmedabad → Surat', amount: 15000, status: 'Delayed', method: 'Bank Transfer', date: '2026-04-21', type: 'delay' },
        { id: 'PAY7006', load: 'LD01035', route: 'Hyderabad → Bangalore', amount: 32000, status: 'In Escrow', method: 'Net Banking', date: '2026-04-25', type: 'pending' },
        { id: 'PAY7007', load: 'LD01041', route: 'Chennai → Coimbatore', amount: 11000, status: 'Completed', method: 'UPI', date: '2026-04-22', type: 'credit' },
    ];

    const totalReceived = transactions.filter(t => t.status === 'Completed').reduce((s, t) => s + t.amount, 0);
    const inEscrow = transactions.filter(t => t.status === 'In Escrow').reduce((s, t) => s + t.amount, 0);
    const pending = transactions.filter(t => t.status === 'Processing').reduce((s, t) => s + t.amount, 0);

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>💳 Payments & Credit</h2>
                <p>Escrow payments, delayed payment options, and transaction history</p>
            </div>
            <button class="btn btn-primary" onclick="UI.toast('Withdrawal initiated!','success')">💸 Withdraw Funds</button>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('💰', formatCurrency(totalReceived), 'Total Received', 'This month', true, 'rgba(16,185,129,0.15)')}
            ${UI.statCard('🔒', formatCurrency(inEscrow), 'In Escrow', 'Awaiting delivery', false, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('⏳', formatCurrency(pending), 'Processing', 'In transit', false, 'rgba(245,158,11,0.15)')}
            ${UI.statCard('📊', '2.1 days', 'Avg Payment Time', '-0.5 days', true, 'rgba(6,182,212,0.15)')}
        </div>

        <div class="grid-2 mb-24">
            <div class="card" style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(6,182,212,0.05));border-color:rgba(99,102,241,0.2)">
                <h3 class="card-title mb-16">🔒 How Escrow Works</h3>
                <div style="display:flex;flex-direction:column;gap:16px">
                    <div class="flex items-center gap-12">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(99,102,241,0.2);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent-primary)">1</div>
                        <div><div style="font-weight:600;font-size:0.85rem">Shipper Pays</div><div style="font-size:0.72rem;color:var(--text-secondary)">Amount locked in escrow when load is booked</div></div>
                    </div>
                    <div class="flex items-center gap-12">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent-yellow)">2</div>
                        <div><div style="font-weight:600;font-size:0.85rem">In Transit</div><div style="font-size:0.72rem;color:var(--text-secondary)">Funds held safely until delivery confirmed</div></div>
                    </div>
                    <div class="flex items-center gap-12">
                        <div style="width:36px;height:36px;border-radius:50%;background:rgba(16,185,129,0.2);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent-green)">3</div>
                        <div><div style="font-weight:600;font-size:0.85rem">Released</div><div style="font-size:0.72rem;color:var(--text-secondary)">Payment released to transporter after delivery + 24hrs</div></div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title mb-16">💳 Payment Methods</h3>
                <div style="display:flex;flex-direction:column;gap:10px">
                    ${[
                        { name: 'UPI (GPay/PhonePe)', icon: '📱', status: 'Primary', active: true },
                        { name: 'Bank Transfer (NEFT/RTGS)', icon: '🏦', status: 'Active', active: true },
                        { name: 'Net Banking', icon: '🌐', status: 'Active', active: true },
                        { name: 'Credit Line (30-day)', icon: '💳', status: 'Apply →', active: false },
                    ].map(m => `
                        <div class="flex items-center justify-between" style="padding:12px;background:var(--bg-glass);border-radius:var(--radius-sm)">
                            <div class="flex items-center gap-12">
                                <span style="font-size:1.3rem">${m.icon}</span>
                                <span style="font-weight:600;font-size:0.85rem">${m.name}</span>
                            </div>
                            <span class="badge ${m.active ? 'badge-green' : 'badge-primary'}">${m.status}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:16px;padding:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-sm)">
                    <div style="font-weight:600;font-size:0.82rem;color:var(--accent-yellow)">💡 SME Credit Option</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px">Eligible for 30-day delayed payment. Ship now, pay later. <a href="#" style="color:var(--accent-primary)" onclick="UI.toast('Credit application submitted!','success');return false">Apply Now</a></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Transaction History</h3>
                <button class="btn btn-secondary btn-sm">📥 Download CSV</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>ID</th><th>Load</th><th>Route</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                        ${transactions.map(t => `
                            <tr>
                                <td style="font-weight:600">${t.id}</td>
                                <td>${t.load}</td>
                                <td>${t.route}</td>
                                <td style="font-weight:700;color:${t.type === 'credit' ? 'var(--accent-green)' : t.type === 'delay' ? 'var(--accent-red)' : 'var(--text-primary)'}">${t.type === 'credit' ? '+' : ''}${formatCurrency(t.amount)}</td>
                                <td>${t.method}</td>
                                <td>${t.date}</td>
                                <td><span class="badge ${{
                                    'Completed': 'badge-green',
                                    'In Escrow': 'badge-primary',
                                    'Processing': 'badge-yellow',
                                    'Delayed': 'badge-red'
                                }[t.status]}">${t.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}
