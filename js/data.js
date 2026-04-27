// ===== CargoLoop Seed Data & Helpers =====
const CITIES = [
    { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, hub: true },
    { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025, hub: true },
    { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, hub: true },
    { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, hub: true },
    { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, hub: true },
    { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, hub: true },
    { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, hub: true },
    { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
    { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
    { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
    { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
    { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
    { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
    { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
    { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
    { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
    { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
    { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
    { name: 'Ludhiana', state: 'Punjab', lat: 30.901, lng: 75.8573 },
    { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
    { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
    { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
    { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
];

const LOAD_TYPES = ['Electronics', 'Textiles', 'Auto Parts', 'FMCG', 'Pharmaceuticals', 'Chemicals', 'Construction', 'Agriculture', 'Furniture', 'Machinery', 'Food & Beverages', 'Raw Materials'];
const TRUCK_TYPES = ['Open Body', 'Closed Container', 'Flatbed', 'Refrigerated', 'Tanker', 'Trailer', 'Mini Truck', 'Tata Ace'];
const VEHICLE_MAKES = ['Tata', 'Ashok Leyland', 'Mahindra', 'Eicher', 'BharatBenz', 'Volvo', 'Isuzu'];

const STATUS_FLOW = ['Pending', 'Matched', 'Picked Up', 'In Transit', 'Delivered', 'Return Assigned', 'Return In Transit', 'Completed'];
const COMPANY_NAMES = ['Rajesh Textiles', 'Om Electronics', 'Gupta Auto Parts', 'Krishna FMCG', 'Patel Pharma', 'Sharma Chemicals', 'Singh Construction', 'Agrawal Foods', 'Mehta Exports', 'Joshi Industries', 'Verma Plastics', 'Nair Spices', 'Reddy Agro', 'Kumar Metals', 'Bansal Traders', 'Sai Transport', 'Om Logistics', 'VRL Logistics', 'Gati Express', 'Delhivery Freight', 'Rivigo Fleet', 'TCI Freight', 'Shree Maruti', 'Navata Road Transport', 'Blue Dart Express', 'SRS Transport', 'Agarwal Packers'];

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randId() { return 'CL' + Date.now().toString(36).toUpperCase() + randInt(100, 999); }

function calcDistance(c1, c2) {
    const R = 6371;
    const dLat = (c2.lat - c1.lat) * Math.PI / 180;
    const dLng = (c2.lng - c1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(c1.lat*Math.PI/180)*Math.cos(c2.lat*Math.PI/180)*Math.sin(dLng/2)**2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function generateLoads(count) {
    const loads = [];
    for (let i = 0; i < count; i++) {
        let origin = randItem(CITIES);
        let dest;
        do { dest = randItem(CITIES); } while (dest.name === origin.name);
        const weight = randInt(1, 25);
        const distance = calcDistance(origin, dest);
        const pricePerKm = randInt(35, 85);
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + randInt(-3, 14));
        loads.push({
            id: 'LD' + String(i + 1001).padStart(5, '0'),
            company: randItem(COMPANY_NAMES),
            origin: origin.name,
            originState: origin.state,
            originLat: origin.lat,
            originLng: origin.lng,
            destination: dest.name,
            destState: dest.state,
            destLat: dest.lat,
            destLng: dest.lng,
            weight: weight,
            loadType: randItem(LOAD_TYPES),
            truckTypeRequired: randItem(TRUCK_TYPES),
            distance: distance,
            price: distance * pricePerKm,
            pricePerKm: pricePerKm,
            pickupDate: baseDate.toISOString().split('T')[0],
            deliveryDate: new Date(baseDate.getTime() + randInt(1, 4) * 86400000).toISOString().split('T')[0],
            status: randItem(['Pending', 'Pending', 'Pending', 'Matched', 'Picked Up', 'In Transit', 'Delivered']),
            isBackhaul: Math.random() > 0.6,
            poolable: weight < 10,
            createdAt: new Date(Date.now() - randInt(0, 7) * 86400000).toISOString(),
            bids: randInt(0, 8),
            urgent: Math.random() > 0.85
        });
    }
    return loads;
}

function generateTrucks(count) {
    const trucks = [];
    for (let i = 0; i < count; i++) {
        let currentCity = randItem(CITIES);
        let route = randItem(CITIES);
        while (route.name === currentCity.name) route = randItem(CITIES);
        const capacity = randItem([1, 2, 3, 5, 7, 9, 14, 16, 20, 25]);
        trucks.push({
            id: 'TK' + String(i + 2001).padStart(5, '0'),
            owner: randItem(COMPANY_NAMES),
            driverName: randItem(['Ramesh', 'Suresh', 'Manoj', 'Vijay', 'Raju', 'Sanjay', 'Deepak', 'Arun', 'Kiran', 'Prakash']) + ' ' + randItem(['Kumar', 'Singh', 'Sharma', 'Verma', 'Yadav', 'Patel']),
            vehicleNumber: randItem(['MH', 'DL', 'KA', 'TN', 'GJ', 'RJ', 'UP', 'WB', 'AP', 'TS']) + randInt(1, 50) + ' ' + String.fromCharCode(65 + randInt(0, 25)) + String.fromCharCode(65 + randInt(0, 25)) + ' ' + randInt(1000, 9999),
            truckType: randItem(TRUCK_TYPES),
            make: randItem(VEHICLE_MAKES),
            capacity: capacity,
            currentCity: currentCity.name,
            currentLat: currentCity.lat + (Math.random() - 0.5) * 0.1,
            currentLng: currentCity.lng + (Math.random() - 0.5) * 0.1,
            heading: route.name,
            headingLat: route.lat,
            headingLng: route.lng,
            status: randItem(['Available', 'Available', 'Available', 'In Transit', 'Delivering', 'Loading']),
            availableFrom: new Date(Date.now() + randInt(0, 5) * 86400000).toISOString().split('T')[0],
            rating: (3.5 + Math.random() * 1.5).toFixed(1),
            totalTrips: randInt(50, 800),
            reliability: randInt(75, 99),
            kycVerified: Math.random() > 0.2,
            gpsEnabled: Math.random() > 0.1,
        });
    }
    return trucks;
}

function generateShipments() {
    const shipments = [];
    for (let i = 0; i < 15; i++) {
        let origin = randItem(CITIES), dest;
        do { dest = randItem(CITIES); } while (dest.name === origin.name);
        const distance = calcDistance(origin, dest);
        const status = STATUS_FLOW[randInt(0, STATUS_FLOW.length - 1)];
        const progressMap = { 'Pending': 0, 'Matched': 15, 'Picked Up': 30, 'In Transit': 55, 'Delivered': 75, 'Return Assigned': 80, 'Return In Transit': 90, 'Completed': 100 };
        shipments.push({
            id: 'SH' + String(i + 3001).padStart(5, '0'),
            loadId: 'LD' + String(i + 1001).padStart(5, '0'),
            truckId: 'TK' + String(randInt(2001, 2040)).padStart(5, '0'),
            origin: origin.name, destination: dest.name,
            originLat: origin.lat, originLng: origin.lng,
            destLat: dest.lat, destLng: dest.lng,
            currentLat: origin.lat + (dest.lat - origin.lat) * (progressMap[status] / 100) + (Math.random() - 0.5) * 0.5,
            currentLng: origin.lng + (dest.lng - origin.lng) * (progressMap[status] / 100) + (Math.random() - 0.5) * 0.5,
            status: status,
            progress: progressMap[status],
            distance: distance,
            company: randItem(COMPANY_NAMES),
            transporter: randItem(COMPANY_NAMES),
            loadType: randItem(LOAD_TYPES),
            weight: randInt(2, 20),
            price: distance * randInt(40, 70),
            eta: randInt(2, 48) + ' hrs',
        });
    }
    return shipments;
}

function generateAnalytics() {
    return {
        totalLoads: 1247,
        totalTrucks: 489,
        emptyKmReduced: 34500,
        costSavings: 2850000,
        truckUtilization: 78,
        backhaulMatches: 312,
        co2Saved: 8625,
        avgBackhaulScore: 72,
        monthlyData: [
            { month: 'Oct', loads: 145, matches: 89, savings: 320000, emptyKm: 4200 },
            { month: 'Nov', loads: 178, matches: 112, savings: 410000, emptyKm: 3800 },
            { month: 'Dec', loads: 156, matches: 98, savings: 380000, emptyKm: 3500 },
            { month: 'Jan', loads: 198, matches: 134, savings: 490000, emptyKm: 3200 },
            { month: 'Feb', loads: 210, matches: 156, savings: 520000, emptyKm: 2900 },
            { month: 'Mar', loads: 234, matches: 178, savings: 560000, emptyKm: 2800 },
            { month: 'Apr', loads: 126, matches: 95, savings: 380000, emptyKm: 2100 },
        ],
        routeHotspots: [
            { route: 'Mumbai → Delhi', demand: 95, avgLoad: 14 },
            { route: 'Delhi → Jaipur', demand: 82, avgLoad: 8 },
            { route: 'Bangalore → Chennai', demand: 78, avgLoad: 11 },
            { route: 'Ahmedabad → Mumbai', demand: 88, avgLoad: 15 },
            { route: 'Hyderabad → Bangalore', demand: 71, avgLoad: 9 },
            { route: 'Pune → Mumbai', demand: 91, avgLoad: 7 },
            { route: 'Kolkata → Guwahati', demand: 65, avgLoad: 12 },
            { route: 'Chennai → Coimbatore', demand: 74, avgLoad: 10 },
        ],
        demandByHour: [
            { hour: '6AM', demand: 30 }, { hour: '8AM', demand: 55 }, { hour: '10AM', demand: 85 },
            { hour: '12PM', demand: 72 }, { hour: '2PM', demand: 68 }, { hour: '4PM', demand: 60 },
            { hour: '6PM', demand: 45 }, { hour: '8PM', demand: 25 }, { hour: '10PM', demand: 15 },
        ],
        pricingHistory: {
            'Mumbai-Delhi': [52, 55, 48, 53, 58, 61, 56, 54, 59, 62, 57, 55],
            'Delhi-Bangalore': [68, 65, 70, 72, 67, 63, 69, 74, 71, 66, 68, 70],
            'Chennai-Hyderabad': [42, 45, 40, 43, 47, 44, 41, 46, 48, 43, 45, 42],
        },
        notifications: [
            { id: 1, type: 'match', msg: 'New backhaul match found: Delhi → Jaipur', time: '2 min ago', read: false },
            { id: 2, type: 'bid', msg: 'New bid received on Load #LD01005 - ₹18,500', time: '15 min ago', read: false },
            { id: 3, type: 'delivery', msg: 'Shipment SH03004 delivered successfully', time: '1 hr ago', read: false },
            { id: 4, type: 'alert', msg: 'Truck TK02012 delayed by 3 hours', time: '2 hrs ago', read: true },
            { id: 5, type: 'system', msg: 'Weekly analytics report ready', time: '5 hrs ago', read: true },
        ]
    };
}

// Helper functions
function formatCurrency(amount) {
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
    if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
    return '₹' + amount.toLocaleString('en-IN');
}

function formatNumber(num) {
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString('en-IN');
}

function getStatusColor(status) {
    const map = {
        'Pending': 'yellow', 'Matched': 'primary', 'Picked Up': 'cyan',
        'In Transit': 'purple', 'Delivered': 'green', 'Return Assigned': 'orange',
        'Return In Transit': 'purple', 'Completed': 'green',
        'Available': 'green', 'Loading': 'yellow', 'Delivering': 'cyan'
    };
    return map[status] || 'primary';
}
