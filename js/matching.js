// ===== CargoLoop Matching Engine =====
const MatchingEngine = {
    // Forward matching: find trucks for a load
    findTrucksForLoad(load, trucks) {
        return trucks
            .filter(t => t.status === 'Available')
            .map(t => {
                const distToOrigin = calcDistance(
                    { lat: t.currentLat, lng: t.currentLng },
                    { lat: load.originLat, lng: load.originLng }
                );
                const capacityMatch = t.capacity >= load.weight ? 1 : 0;
                const typeMatch = t.truckType === load.truckTypeRequired ? 1 : 0.5;
                const proximityScore = Math.max(0, 100 - (distToOrigin / 10));
                const reliabilityScore = t.reliability;
                const score = Math.round(
                    (proximityScore * 0.3 + capacityMatch * 25 + typeMatch * 20 + reliabilityScore * 0.25)
                );
                return { ...t, matchScore: Math.min(99, score), distToOrigin, capacityMatch, typeMatch };
            })
            .filter(t => t.capacityMatch > 0)
            .sort((a, b) => b.matchScore - a.matchScore);
    },

    // Backhaul matching: find return loads for trucks completing delivery
    findBackhaulLoads(truck, loads) {
        return loads
            .filter(l => l.status === 'Pending')
            .map(l => {
                const distFromTruck = calcDistance(
                    { lat: truck.headingLat || truck.currentLat, lng: truck.headingLng || truck.currentLng },
                    { lat: l.originLat, lng: l.originLng }
                );
                const distFromOrigTruckOrigin = calcDistance(
                    { lat: l.destLat, lng: l.destLng },
                    { lat: truck.currentLat, lng: truck.currentLng }
                );
                const routeDeviationKm = distFromTruck;
                const routeDeviationScore = Math.max(0, 100 - (routeDeviationKm / 5));
                const capacityMatch = truck.capacity >= l.weight ? 1 : 0;
                const typeMatch = truck.truckType === l.truckTypeRequired ? 1 : 0.7;
                const returnCloseness = Math.max(0, 100 - (Math.abs(distFromOrigTruckOrigin - l.distance) / 10));
                const backhaulScore = Math.round(
                    (routeDeviationScore * 0.35 + returnCloseness * 0.25 + capacityMatch * 20 + typeMatch * 15 + 5)
                );
                return {
                    ...l,
                    backhaulScore: Math.min(98, Math.max(10, backhaulScore)),
                    routeDeviationKm,
                    isReturnMatch: distFromOrigTruckOrigin < l.distance * 0.3
                };
            })
            .filter(l => l.routeDeviationKm < 300 && truck.capacity >= l.weight)
            .sort((a, b) => b.backhaulScore - a.backhaulScore);
    },

    // Load pooling: find loads that can share a truck
    findPoolableLoads(loads) {
        const poolable = loads.filter(l => l.poolable && l.status === 'Pending');
        const pools = [];
        const used = new Set();

        for (let i = 0; i < poolable.length; i++) {
            if (used.has(i)) continue;
            const pool = [poolable[i]];
            let totalWeight = poolable[i].weight;

            for (let j = i + 1; j < poolable.length; j++) {
                if (used.has(j)) continue;
                const dist = calcDistance(
                    { lat: poolable[i].originLat, lng: poolable[i].originLng },
                    { lat: poolable[j].originLat, lng: poolable[j].originLng }
                );
                const destDist = calcDistance(
                    { lat: poolable[i].destLat, lng: poolable[i].destLng },
                    { lat: poolable[j].destLat, lng: poolable[j].destLng }
                );
                if (dist < 150 && destDist < 200 && totalWeight + poolable[j].weight <= 20) {
                    pool.push(poolable[j]);
                    totalWeight += poolable[j].weight;
                    used.add(j);
                }
            }
            if (pool.length >= 2) {
                const totalPrice = pool.reduce((s, l) => s + l.price, 0);
                pools.push({
                    id: 'PL' + String(pools.length + 4001).padStart(5, '0'),
                    loads: pool,
                    totalWeight,
                    loadCount: pool.length,
                    route: pool[0].origin + ' → ' + pool[0].destination + ' area',
                    totalPrice,
                    savingsPercent: randInt(15, 35),
                    utilization: Math.round((totalWeight / 20) * 100),
                });
                used.add(i);
            }
        }
        return pools;
    },

    // Route optimization: suggest multi-stop routes
    suggestMultiStopRoute(origin, loads) {
        const nearby = loads
            .filter(l => l.status === 'Pending')
            .map(l => ({
                ...l,
                distFromOrigin: calcDistance(origin, { lat: l.originLat, lng: l.originLng })
            }))
            .filter(l => l.distFromOrigin < 500)
            .sort((a, b) => a.distFromOrigin - b.distFromOrigin)
            .slice(0, 5);
        return nearby;
    },

    // AI price suggestion
    suggestPrice(origin, destination, weight, loadType) {
        const o = CITIES.find(c => c.name === origin) || CITIES[0];
        const d = CITIES.find(c => c.name === destination) || CITIES[1];
        const dist = calcDistance(o, d);
        const baseRate = 45;
        const demandMultiplier = 0.8 + Math.random() * 0.6;
        const weightFactor = 1 + (weight / 50);
        const typeMultiplier = loadType === 'Refrigerated' || loadType === 'Chemicals' ? 1.3 : 1;
        const price = Math.round(dist * baseRate * demandMultiplier * weightFactor * typeMultiplier);
        return {
            suggested: price,
            low: Math.round(price * 0.8),
            high: Math.round(price * 1.25),
            perKm: Math.round(price / dist),
            distance: dist
        };
    },

    // Carbon savings calculation
    calcCarbonSaved(emptyKmReduced) {
        const avgEmissionPerKm = 0.25; // kg CO2 per km for heavy truck
        return Math.round(emptyKmReduced * avgEmissionPerKm);
    },

    // Backhaul score ring SVG
    getScoreRingSVG(score, size = 48) {
        const r = (size / 2) - 4;
        const circumference = 2 * Math.PI * r;
        const offset = circumference - (score / 100) * circumference;
        let color = '#ef4444';
        if (score >= 70) color = '#10b981';
        else if (score >= 40) color = '#f59e0b';
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
            <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="4"
                stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round"
                style="transform: rotate(-90deg); transform-origin: center; transition: stroke-dashoffset 1s ease;"/>
            <text x="${size/2}" y="${size/2}" text-anchor="middle" dy="0.35em" fill="${color}" font-size="11" font-weight="800">${score}</text>
        </svg>`;
    }
};
