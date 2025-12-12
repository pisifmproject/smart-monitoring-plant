import { db } from '../config/database';
import { users, plants, machines, lvmdpPanels, packingConfigs, visibilityDataItems } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  try {
    // 1. Users
    console.log('Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin', salt);

    // Check if admin exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
    if (existingAdmin.length === 0) {
        await db.insert(users).values([
          { username: 'admin', passwordHash: hash, fullName: 'Administrator', email: 'admin@example.com', role: 'ADMIN' },
          { username: 'operator', passwordHash: hash, fullName: 'Operator 1', email: 'op1@example.com', role: 'OPERATOR' },
        ]);
    }

    // 2. Plants
    console.log('Seeding plants...');
    const existingPlants = await db.select().from(plants);
    if (existingPlants.length === 0) {
        await db.insert(plants).values([
          { code: 'P01', name: 'Plant Jakarta', location: 'Jakarta' },
          { code: 'P02', name: 'Plant Surabaya', location: 'Surabaya' },
        ]);
    }

    // Fetch plants to get IDs
    const allPlants = await db.select().from(plants);
    const p1 = allPlants.find(p => p.code === 'P01');
    const p2 = allPlants.find(p => p.code === 'P02');

    if (p1 && p2) {
        // 3. Machines
        console.log('Seeding machines...');
        const existingMachines = await db.select().from(machines);
        if (existingMachines.length === 0) {
            await db.insert(machines).values([
                { plantId: p1.id, code: 'M01', name: 'Filling Machine 1', type: 'FILLER', status: 'RUNNING', lineGroup: 'Line 1' },
                { plantId: p1.id, code: 'M02', name: 'Packing Machine 1', type: 'PACKER', status: 'STOPPED', lineGroup: 'Line 1' },
                { plantId: p1.id, code: 'M03', name: 'Palletizer 1', type: 'PALLETIZER', status: 'RUNNING', lineGroup: 'Line 1' },
                { plantId: p2.id, code: 'M04', name: 'Filling Machine 2', type: 'FILLER', status: 'RUNNING', lineGroup: 'Line 2' },
            ]);
        }

        // 4. LVMDP Panels
        console.log('Seeding LVMDP panels...');
        const existingPanels = await db.select().from(lvmdpPanels);
        if (existingPanels.length === 0) {
            await db.insert(lvmdpPanels).values([
                { plantId: p1.id, code: 'LVMDP-01', name: 'Main Panel P1', status: 'ACTIVE' },
                { plantId: p2.id, code: 'LVMDP-02', name: 'Main Panel P2', status: 'ACTIVE' },
            ]);
        }

        // 5. Packing Configs
        console.log('Seeding packing configs...');
        // Need machine IDs
        const allMachines = await db.select().from(machines);
        const m1 = allMachines.find(m => m.code === 'M01');
        const m4 = allMachines.find(m => m.code === 'M04');

        const existingConfigs = await db.select().from(packingConfigs);
        if (existingConfigs.length === 0 && m1 && m4) {
             await db.insert(packingConfigs).values([
                { plantId: p1.id, machineId: m1.id, code: 'PC01', name: 'Bottle 600ml', unit: 'bottles', targetPerHour: '5000' },
                { plantId: p2.id, machineId: m4.id, code: 'PC02', name: 'Bottle 1500ml', unit: 'bottles', targetPerHour: '2000' },
             ]);
        }
    }

    // 6. Visibility Items
    console.log('Seeding visibility items...');
    const existingVis = await db.select().from(visibilityDataItems);
    if (existingVis.length === 0) {
        await db.insert(visibilityDataItems).values([
            { key: 'GLOBAL_OUTPUT_TODAY', label: 'Total Output', category: 'GLOBAL_DASHBOARD', groupName: 'KPI' },
            { key: 'GLOBAL_OEE', label: 'Global Avg OEE', category: 'GLOBAL_DASHBOARD', groupName: 'KPI' },
        ]);
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
