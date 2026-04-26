// ===== Trust & Verification Page =====
function renderTrust() {
    const verifiedTrucks = MockData.trucks.filter(t => t.kycVerified);
    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>🛡️ Trust & Verification</h2>
                <p>KYC verification, ratings, and delivery reliability scores</p>
            </div>
        </div>

        <div class="stat-grid mb-24">
            ${UI.statCard('✅', verifiedTrucks.length.toString(), 'KYC Verified', `${Math.round(verifiedTrucks.length/MockData.trucks.length*100)}% of fleet`, true, 'rgba(16,185,129,0.15)')}
            ${UI.statCard('⭐', '4.2', 'Avg Rating', 'Platform-wide', true, 'rgba(245,158,11,0.15)')}
            ${UI.statCard('🏆', '89%', 'On-Time Delivery', '+3% this month', true, 'rgba(99,102,241,0.15)')}
            ${UI.statCard('🔒', '0', 'Disputes Open', 'All resolved', true, 'rgba(6,182,212,0.15)')}
        </div>

        <div class="grid-2 mb-24">
            <div class="card">
                <h3 class="card-title mb-16">🪪 KYC Verification Status</h3>
                <div class="kyc-steps">
                    <div class="kyc-step completed">
                        <div class="kyc-step-circle">✓</div>
                        <div style="font-weight:600;font-size:0.82rem">Identity</div>
                        <div style="font-size:0.7rem;color:var(--text-muted)">Aadhaar/PAN</div>
                    </div>
                    <div class="kyc-step completed">
                        <div class="kyc-step-circle">✓</div>
                        <div style="font-weight:600;font-size:0.82rem">Business</div>
                        <div style="font-size:0.7rem;color:var(--text-muted)">GST/Registration</div>
                    </div>
                    <div class="kyc-step completed">
                        <div class="kyc-step-circle">✓</div>
                        <div style="font-weight:600;font-size:0.82rem">Vehicle</div>
                        <div style="font-size:0.7rem;color:var(--text-muted)">RC/Insurance</div>
                    </div>
                    <div class="kyc-step active">
                        <div class="kyc-step-circle">🏦</div>
                        <div style="font-weight:600;font-size:0.82rem">Bank</div>
                        <div style="font-size:0.7rem;color:var(--text-muted)">Account Verify</div>
                    </div>
                </div>
                <div style="padding:12px;background:var(--bg-glass);border-radius:var(--radius-sm);margin-top:16px;border-left:3px solid var(--accent-yellow)">
                    <span style="font-size:0.82rem">⏳ Bank verification pending — estimated 24 hours</span>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title mb-16">📊 Your Reliability Score</h3>
                <div style="text-align:center;padding:20px">
                    <div style="position:relative;width:120px;height:120px;margin:0 auto">
                        ${MatchingEngine.getScoreRingSVG(92, 120)}
                    </div>
                    <div style="font-size:1.1rem;font-weight:700;margin-top:12px">Excellent</div>
                    <div style="font-size:0.78rem;color:var(--text-secondary)">Top 5% of transporters</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
                    ${[
                        { label: 'On-Time Delivery', value: 95 },
                        { label: 'Load Safety', value: 98 },
                        { label: 'Communication', value: 88 },
                        { label: 'Documentation', value: 90 },
                    ].map(s => `
                        <div class="flex items-center justify-between gap-12">
                            <span style="font-size:0.78rem;color:var(--text-secondary);min-width:120px">${s.label}</span>
                            <div class="progress-bar flex-1"><div class="progress-fill" style="width:${s.value}%"></div></div>
                            <span style="font-weight:600;font-size:0.78rem;width:35px;text-align:right">${s.value}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="card mb-24">
            <div class="card-header">
                <h3 class="card-title">⭐ Reviews & Ratings</h3>
                <div class="tabs" style="margin:0">
                    <button class="tab-btn active">Received</button>
                    <button class="tab-btn">Given</button>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px">
                ${[
                    { from: 'Rajesh Textiles', rating: 5, text: 'Excellent service! Goods delivered on time and in perfect condition.', time: '2 days ago' },
                    { from: 'Om Electronics', rating: 4, text: 'Good transporter. Minor delay but communicated well.', time: '5 days ago' },
                    { from: 'Gupta Auto Parts', rating: 5, text: 'Very reliable. Handled fragile items with care. Highly recommended!', time: '1 week ago' },
                    { from: 'Krishna FMCG', rating: 4, text: 'Professional and on time. Will use again.', time: '2 weeks ago' },
                    { from: 'Patel Pharma', rating: 5, text: 'Temperature-controlled shipment handled perfectly. Great driver!', time: '3 weeks ago' },
                ].map(r => `
                    <div style="padding:16px;background:var(--bg-glass);border-radius:var(--radius-md)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-8">
                                <div class="user-avatar" style="width:32px;height:32px;font-size:0.65rem">${r.from[0]}${r.from.split(' ')[1]?.[0] || ''}</div>
                                <div>
                                    <div style="font-weight:600;font-size:0.85rem">${r.from}</div>
                                    <div style="font-size:0.7rem;color:var(--text-muted)">${r.time}</div>
                                </div>
                            </div>
                            ${UI.stars(r.rating)}
                        </div>
                        <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:8px;padding-left:40px">"${r.text}"</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3 class="card-title">🚛 Fleet Verification Status</h3></div>
            <div class="table-container">
                <table class="data-table">
                    <thead><tr><th>Vehicle</th><th>Owner</th><th>KYC</th><th>Rating</th><th>Trips</th><th>Reliability</th><th>Action</th></tr></thead>
                    <tbody>
                        ${MockData.trucks.slice(0, 10).map(t => `
                            <tr>
                                <td style="font-weight:600">${t.vehicleNumber}</td>
                                <td>${t.owner}</td>
                                <td>${t.kycVerified ? '<span class="badge badge-green">✓ Verified</span>' : '<span class="badge badge-yellow">⏳ Pending</span>'}</td>
                                <td>${UI.stars(parseFloat(t.rating))}</td>
                                <td>${t.totalTrips}</td>
                                <td><div class="progress-bar" style="width:60px"><div class="progress-fill" style="width:${t.reliability}%"></div></div></td>
                                <td><button class="btn btn-ghost btn-sm" onclick="UI.toast('Vehicle details opened','info')">View</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}
