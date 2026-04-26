// ===== WhatsApp Integration Page =====
function renderWhatsApp() {
    const botMessages = [
        { type: 'bot', text: '🙏 Namaste! Welcome to CargoLoop WhatsApp Booking.\n\nI can help you with:\n1️⃣ Book a shipment\n2️⃣ Track your load\n3️⃣ Find return loads\n4️⃣ Get price estimate\n\nReply with a number to get started!', time: '10:00 AM' },
    ];

    return `
    <div class="animate-fadeIn">
        <div class="page-header">
            <div>
                <h2>💬 WhatsApp Booking</h2>
                <p>Book loads and track shipments via chat — India's most familiar interface</p>
            </div>
        </div>

        <div class="grid-2">
            <div class="chat-container" id="whatsappChat">
                <div class="chat-header">
                    <div class="chat-header-avatar">CL</div>
                    <div>
                        <div style="font-weight:700;font-size:0.9rem">CargoLoop Bot</div>
                        <div style="font-size:0.7rem;opacity:0.8">Online • WhatsApp Business</div>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${botMessages.map(m => `<div class="chat-msg ${m.type}"><div>${m.text.replace(/\n/g, '<br>')}</div><div class="time">${m.time}</div></div>`).join('')}
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chatInput" placeholder="Type a message..." onkeyup="if(event.key==='Enter')sendChat()">
                    <button class="chat-send-btn" onclick="sendChat()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>

            <div>
                <div class="card mb-16">
                    <h3 class="card-title mb-16">📱 Quick Commands</h3>
                    <div style="display:flex;flex-direction:column;gap:8px">
                        ${[
                            { cmd: 'BOOK', desc: 'Start booking a new shipment', emoji: '📦' },
                            { cmd: 'TRACK SH03001', desc: 'Track a specific shipment', emoji: '📍' },
                            { cmd: 'PRICE Mumbai Delhi', desc: 'Get price estimate', emoji: '💰' },
                            { cmd: 'RETURN', desc: 'Find return loads', emoji: '🔄' },
                            { cmd: 'STATUS', desc: 'View all active loads', emoji: '📊' },
                            { cmd: 'HELP', desc: 'Show all commands', emoji: '❓' },
                        ].map(c => `
                            <div class="flex items-center gap-12" style="padding:10px 12px;background:var(--bg-glass);border-radius:var(--radius-sm);cursor:pointer" onclick="document.getElementById('chatInput').value='${c.cmd}';sendChat()">
                                <span style="font-size:1.2rem">${c.emoji}</span>
                                <div class="flex-1">
                                    <div style="font-weight:600;font-size:0.82rem;font-family:monospace;color:var(--accent-green)">${c.cmd}</div>
                                    <div style="font-size:0.72rem;color:var(--text-muted)">${c.desc}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="card">
                    <h3 class="card-title mb-16">🇮🇳 Why WhatsApp?</h3>
                    <div style="display:flex;flex-direction:column;gap:10px;font-size:0.82rem">
                        <div style="padding:10px;background:var(--bg-glass);border-radius:var(--radius-sm)">📱 <strong>500M+ users</strong> in India use WhatsApp daily</div>
                        <div style="padding:10px;background:var(--bg-glass);border-radius:var(--radius-sm)">🚛 <strong>Low-tech friendly</strong> — no app download needed</div>
                        <div style="padding:10px;background:var(--bg-glass);border-radius:var(--radius-sm)">🌐 <strong>Works on 2G</strong> — reliable in remote areas</div>
                        <div style="padding:10px;background:var(--bg-glass);border-radius:var(--radius-sm)">🗣️ <strong>Multilingual</strong> — supports Hindi, regional languages</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

const chatResponses = {
    '1': "Great! Let's book a shipment. 📦\n\nPlease share:\n• Origin city\n• Destination city\n• Weight (in tons)\n• Load type\n\nExample: Mumbai to Delhi, 5 tons, Electronics",
    'book': "Great! Let's book a shipment. 📦\n\nPlease share:\n• Origin city\n• Destination city\n• Weight (in tons)\n• Load type\n\nExample: Mumbai to Delhi, 5 tons, Electronics",
    '2': "Please share your Shipment ID (e.g., SH03001) and I'll get you the latest status.",
    'track': "📍 Shipment SH03001:\n\n• Status: In Transit\n• Route: Mumbai → Delhi\n• Current: Near Indore\n• ETA: 12 hours\n• Driver: Ramesh Kumar\n• 📞 +91 98765 43210\n\nLast updated: 2 mins ago",
    '3': "🔄 Looking for return loads...\n\nI found 4 matches near your delivery location:\n\n1. Delhi→Jaipur (8T, ₹18K) ⭐87\n2. Delhi→Agra (5T, ₹8K) ⭐72\n3. Delhi→Lucknow (12T, ₹28K) ⭐65\n4. Delhi→Chandigarh (6T, ₹15K) ⭐58\n\nReply with the number to accept!",
    'return': "🔄 Looking for return loads...\n\nI found 4 matches near your delivery location:\n\n1. Delhi→Jaipur (8T, ₹18K) ⭐87\n2. Delhi→Agra (5T, ₹8K) ⭐72\n3. Delhi→Lucknow (12T, ₹28K) ⭐65\n4. Delhi→Chandigarh (6T, ₹15K) ⭐58\n\nReply with the number to accept!",
    '4': "💰 What route? Reply as:\nPRICE [Origin] [Destination]\n\nExample: PRICE Mumbai Delhi",
    'status': "📊 Your Active Loads:\n\n1. SH03001 Mumbai→Delhi 🟡 In Transit\n2. SH03004 Bangalore→Chennai ✅ Delivered\n3. SH03007 Pune→Nagpur 🔵 Matched\n\nReply with ID for details!",
    'help': "📋 Available Commands:\n\n1️⃣ or BOOK — New shipment\n2️⃣ or TRACK — Track shipment\n3️⃣ or RETURN — Find return loads\n4️⃣ or PRICE — Price estimate\nSTATUS — View all loads\nHELP — This menu\n\n💡 Tip: You can also type naturally! e.g., 'I need a truck from Mumbai to Delhi'",
};

function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    const container = document.getElementById('chatMessages');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User message
    container.innerHTML += `<div class="chat-msg user"><div>${msg}</div><div class="time">${now}</div></div>`;
    input.value = '';

    // Bot response
    setTimeout(() => {
        const key = msg.toLowerCase().replace(/[^a-z0-9]/g, '');
        let response = chatResponses[key];

        if (!response) {
            if (key.startsWith('price') || msg.toLowerCase().includes('price')) {
                const parts = msg.split(' ');
                const origin = parts[1] || 'Mumbai';
                const dest = parts[2] || 'Delhi';
                const price = MatchingEngine.suggestPrice(origin, dest, 5, 'General');
                response = `💰 Price Estimate:\n\n${origin} → ${dest}\n📏 Distance: ${price.distance} km\n\n💵 Suggested: ₹${price.suggested.toLocaleString()}\n📉 Low: ₹${price.low.toLocaleString()}\n📈 High: ₹${price.high.toLocaleString()}\n\nRate: ₹${price.perKm}/km\n\nWant to book at this price? Reply YES to proceed!`;
            } else if (msg.toLowerCase().includes('yes') || msg.toLowerCase().includes('accept')) {
                response = "✅ Booking confirmed!\n\n📋 Booking ID: LD" + randInt(10000,99999) + "\n🚛 Finding best truck match...\n\nYou'll receive updates on this chat.\nReply TRACK to check status anytime!";
            } else if (msg.toLowerCase().includes('mumbai') || msg.toLowerCase().includes('delhi') || msg.toLowerCase().includes('bangalore')) {
                response = "📦 Got it! I understand you want to ship goods.\n\nLet me confirm:\n• Route: detected from your message\n• Please share weight and load type\n\nOr type BOOK for guided booking!";
            } else {
                response = "I didn't understand that. 🤔\n\nHere are some things I can help with:\n1️⃣ Book a shipment\n2️⃣ Track your load\n3️⃣ Find return loads\n4️⃣ Get price estimate\n\nOr type HELP for all commands!";
            }
        }
        container.innerHTML += `<div class="chat-msg bot"><div>${response.replace(/\n/g, '<br>')}</div><div class="time">${now}</div></div>`;
        container.scrollTop = container.scrollHeight;
    }, 800);

    container.scrollTop = container.scrollHeight;
}
