-- ===== CargoLoop Supabase Schema =====
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/dncofxskhacrbupoxumy/sql/new)

-- Loads table
CREATE TABLE IF NOT EXISTS loads (
  id TEXT PRIMARY KEY,
  company TEXT,
  origin TEXT,
  "originState" TEXT,
  "originLat" FLOAT,
  "originLng" FLOAT,
  destination TEXT,
  "destState" TEXT,
  "destLat" FLOAT,
  "destLng" FLOAT,
  weight INTEGER,
  "loadType" TEXT,
  "truckTypeRequired" TEXT,
  distance INTEGER,
  price INTEGER,
  "pricePerKm" INTEGER,
  "pickupDate" TEXT,
  "deliveryDate" TEXT,
  status TEXT DEFAULT 'Pending',
  "isBackhaul" BOOLEAN DEFAULT FALSE,
  poolable BOOLEAN DEFAULT FALSE,
  bids INTEGER DEFAULT 0,
  urgent BOOLEAN DEFAULT FALSE,
  "createdAt" TEXT
);

-- Trucks table
CREATE TABLE IF NOT EXISTS trucks (
  id TEXT PRIMARY KEY,
  owner TEXT,
  "driverName" TEXT,
  "vehicleNumber" TEXT,
  "truckType" TEXT,
  make TEXT,
  capacity INTEGER,
  "currentCity" TEXT,
  "currentLat" FLOAT,
  "currentLng" FLOAT,
  heading TEXT,
  "headingLat" FLOAT,
  "headingLng" FLOAT,
  status TEXT DEFAULT 'Available',
  "availableFrom" TEXT,
  rating TEXT,
  "totalTrips" INTEGER DEFAULT 0,
  reliability INTEGER DEFAULT 85,
  "kycVerified" BOOLEAN DEFAULT FALSE,
  "gpsEnabled" BOOLEAN DEFAULT TRUE
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  "loadId" TEXT,
  "truckId" TEXT,
  origin TEXT,
  destination TEXT,
  "originLat" FLOAT,
  "originLng" FLOAT,
  "destLat" FLOAT,
  "destLng" FLOAT,
  "currentLat" FLOAT,
  "currentLng" FLOAT,
  status TEXT DEFAULT 'Pending',
  progress INTEGER DEFAULT 0,
  distance INTEGER,
  company TEXT,
  transporter TEXT,
  "loadType" TEXT,
  weight INTEGER,
  price INTEGER,
  eta TEXT
);

-- Allow public access (for demo)
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on loads" ON loads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on trucks" ON trucks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on shipments" ON shipments FOR ALL USING (true) WITH CHECK (true);
