//mockData.ts

import {
    Plant,
    PlantCode,
    MachineStatus,
    Machine,
    LVMDP,
    Alarm,
    AlarmSeverity,
    MachineType,
    DowntimeLog,
    WeigherDetails,
    BagmakerDetails,
    PackingLineConfig,
    SeasoningDetails
} from '../types';

// ------------------------------------------------------
// CIKUPA PACKING CONFIGURATION (Mutable for CRUD)
// ------------------------------------------------------
export let CIKUPA_PACKING_LINES: PackingLineConfig[] = [
    { lineName: 'PC39', bagmakers: 22, weighers: 11 },
    { lineName: 'PC14', bagmakers: 10, weighers: 5 },
    { lineName: 'Tortilla', bagmakers: 14, weighers: 7 },
    { lineName: 'TWS 5.6', bagmakers: 10, weighers: 5 },
    { lineName: 'FCP', bagmakers: 12, weighers: 6 },
    { lineName: 'TWS 7.2', bagmakers: 20, weighers: 10 },
    { lineName: 'Cassava Copack', bagmakers: 6, weighers: 3 },
    { lineName: 'Cassava Inhouse', bagmakers: 10, weighers: 5 },
];

// ------------------------------------------------------
// CIKOKOL PACKING CONFIGURATION (Mutable for CRUD)
// ------------------------------------------------------
export let CIKOKOL_PACKING_LINES: PackingLineConfig[] = [
    { lineName: 'Potato Chips PC14', bagmakers: 10, weighers: 5 },
];

// ------------------------------------------------------
// SEMARANG PACKING CONFIGURATION (Mutable for CRUD)
// ------------------------------------------------------
export let SEMARANG_PACKING_LINES: PackingLineConfig[] = [
    { lineName: 'Tempe', bagmakers: 10, weighers: 5 },
];


// ------------------------------------------------------
// MACHINE TYPE DETECTION
// ------------------------------------------------------
const getMachineType = (name: string): MachineType => {
    const n = name.toLowerCase();
    if (n.includes('fryer')) return MachineType.FRYER;
    if (
        n.includes('puff') ||
        n.includes('extrude') ||
        n.includes('pellet') ||
        n.includes('sheeted')
    )
        return MachineType.EXTRUDER;
    if (n.includes('packing') || n.includes('pouch') || CIKUPA_PACKING_LINES.some(l => l.lineName === name) || CIKOKOL_PACKING_LINES.some(l => l.lineName === name) || SEMARANG_PACKING_LINES.some(l => l.lineName === name))
        return MachineType.PACKING;
    return MachineType.GENERIC;
};

// ------------------------------------------------------
// INDIVIDUAL UNIT GENERATORS FOR MULTI-UNIT DASHBOARD
// ------------------------------------------------------
export const generateSingleWeigherDetails = (): WeigherDetails => {
    const statusR = Math.random();
    let status: 'Production' | 'Stop' | 'Offline' | 'Idle';
    if (statusR > 0.95) {
        status = 'Offline'; // 5%
    } else if (statusR > 0.8) {
        status = 'Stop'; // 15%
    } else if (statusR > 0.7) {
        status = 'Idle'; // 10%
    } else {
        status = 'Production'; // 70%
    }

    return {
        averageWeight: parseFloat((25.1 + Math.random() * 0.2).toFixed(2)),
        standardDeviation: parseFloat((0.05 + Math.random() * 0.05).toFixed(3)),
        giveaway: parseFloat((0.8 + Math.random() * 0.4).toFixed(2)),
        averageSpeed: 80 + Math.floor(Math.random() * 5),
        status: status,
        totalWeight1: 1800 + Math.floor(Math.random() * 400),
        totalWeight2: 1850 + Math.floor(Math.random() * 400),
        speed1: 79 + Math.floor(Math.random() * 4),
        speed2: 80 + Math.floor(Math.random() * 4),
    };
};

export const generateSingleBagmakerDetails = (): BagmakerDetails => {
    const statusR = Math.random();
    let status: 'Production' | 'Stop' | 'Offline' | 'Idle';
    if (statusR > 0.95) {
        status = 'Offline'; // 5%
    } else if (statusR > 0.8) {
        status = 'Stop'; // 15%
    } else if (statusR > 0.7) {
        status = 'Idle'; // 10%
    } else {
        status = 'Production'; // 70%
    }

    const targetSpeed = 80 + Math.floor(Math.random() * 5);
    return {
        targetSpeed: targetSpeed,
        actualSpeed: targetSpeed - Math.floor(Math.random() * 3),
        filmRemaining: parseFloat((65 + Math.random() * 30).toFixed(1)),
        sealTempHorizontal: 150 + Math.floor(Math.random() * 5),
        sealTempVertical: 152 + Math.floor(Math.random() * 5),
        status: status,
        totalEfficiency: parseFloat((0.85 + Math.random() * 0.13).toFixed(2)),
        efficiencyWeigher: parseFloat((0.90 + Math.random() * 0.09).toFixed(2)),
        efficiencyBagmaker: parseFloat((0.90 + Math.random() * 0.08).toFixed(2)),
        bagPercentage: parseFloat((95 + Math.random() * 4.5).toFixed(2)),
        wastedFilmPercentage: parseFloat((1 + Math.random() * 4).toFixed(2)),
        metalDetectCount: Math.floor(Math.random() * 6),
        printerDateErrorCount: Math.floor(Math.random() * 11),
        productInSealCount: 5 + Math.floor(Math.random() * 16),
        spliceDetectCount: 1 + Math.floor(Math.random() * 3),
    };
};

export const generateSeasoningDetails = (): SeasoningDetails => {
    return {
        throughput: 800 + Math.floor(Math.random() * 100),
        seasoningCoverage: parseFloat((98.5 + Math.random() * 1.4).toFixed(2)),
        seasoningGiveaway: parseFloat((0.5 + Math.random() * 0.5).toFixed(2)),
        drumSpeed: 20 + Math.floor(Math.random() * 4),
        feederRate: parseFloat((150.2 + Math.random() * 5).toFixed(1)),
        oilSprayRate: parseFloat((2.5 + Math.random() * 0.3).toFixed(2)),
        inletTemp: 35 + Math.floor(Math.random() * 3),
        outletTemp: 38 + Math.floor(Math.random() * 3),
        seasoningUsed: 450 + Math.floor(Math.random() * 50),
        oilUsed: 80 + Math.floor(Math.random() * 10),
    };
};


// ------------------------------------------------------
// MACHINE GENERATOR (REFACTORED FOR DYNAMIC PACKING CONFIG)
// ------------------------------------------------------
const generateMachines = (plantId: PlantCode, names: string[]): Machine[] => {
    return names.map((name, index) => {
        const r = Math.random();
        let status = MachineStatus.RUNNING;
        if (r > 0.88) status = MachineStatus.IDLE;
        if (r > 0.96) status = MachineStatus.BREAKDOWN;

        const type = getMachineType(name);
        const outputBase = type === MachineType.PACKING ? 40 : 800;
        
        const machineBase: Omit<Machine, 'weigher' | 'bagmaker' | 'bagmakerUnits' | 'weigherUnits' | 'seasoning'> = {
            id: `${plantId}-M-${index}`,
            code: name.replace(/\s+/g, '_').toUpperCase(),
            name: name,
            plantId,
            status,
            type,
            outputPerHour: Math.floor(Math.random() * 500) + outputBase,
            oee: parseFloat((0.6 + Math.random() * 0.35).toFixed(2)),
            temperature: Math.floor(Math.random() * 40) + 60,
            totalOutputShift: Math.floor(Math.random() * 5000) + 1000,
            targetShift: 8000,
            lineSpeed: type === MachineType.PACKING ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 200) + 100,
            rejectRate: parseFloat((Math.random() * 5).toFixed(2)),
            availability: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
            performance: parseFloat((0.80 + Math.random() * 0.19).toFixed(2)),
            quality: parseFloat((0.95 + Math.random() * 0.04).toFixed(2)),
            processParams: {},
            utilityConsumption: {
                electricity: 150 + Math.random() * 50,
                steam: type === MachineType.FRYER ? 400 + Math.random() * 100 : 0,
                water: 0.5 + Math.random() * 0.2,
                air: 200 + Math.random() * 50
            },
        };

        // DYNAMICALLY GENERATE MULTI-UNIT DATA FOR CIKUPA
        if (plantId === PlantCode.CIKUPA) {
            const packingLineConfig = CIKUPA_PACKING_LINES.find(line => line.lineName === name);
            if (packingLineConfig) {
                return {
                    ...machineBase,
                    bagmakerUnits: Array.from({ length: packingLineConfig.bagmakers }, () => generateSingleBagmakerDetails()),
                    weigherUnits: Array.from({ length: packingLineConfig.weighers }, () => generateSingleWeigherDetails()),
                    seasoning: generateSeasoningDetails(),
                };
            }
        }

        // DYNAMICALLY GENERATE MULTI-UNIT DATA FOR CIKOKOL
        if (plantId === PlantCode.CIKOKOL) {
            const packingLineConfig = CIKOKOL_PACKING_LINES.find(line => line.lineName === name);
            if (packingLineConfig) {
                return {
                    ...machineBase,
                    bagmakerUnits: Array.from({ length: packingLineConfig.bagmakers }, () => generateSingleBagmakerDetails()),
                    weigherUnits: Array.from({ length: packingLineConfig.weighers }, () => generateSingleWeigherDetails()),
                    seasoning: generateSeasoningDetails(),
                };
            }
        }

        // DYNAMICALLY GENERATE MULTI-UNIT DATA FOR SEMARANG
        if (plantId === PlantCode.SEMARANG) {
            const packingLineConfig = SEMARANG_PACKING_LINES.find(line => line.lineName === name);
            if (packingLineConfig) {
                return {
                    ...machineBase,
                    bagmakerUnits: Array.from({ length: packingLineConfig.bagmakers }, () => generateSingleBagmakerDetails()),
                    weigherUnits: Array.from({ length: packingLineConfig.weighers }, () => generateSingleWeigherDetails()),
                    seasoning: generateSeasoningDetails(),
                };
            }
        }

        // DEFAULT CASE: Single unit packing data for all other machines of type PACKING
        if (type === MachineType.PACKING) {
            return {
                ...machineBase,
                weigher: generateSingleWeigherDetails(),
                bagmaker: generateSingleBagmakerDetails(),
                seasoning: generateSeasoningDetails(),
            };
        }
        
        // Return base machine for all other types
        return {
            ...machineBase,
            seasoning: generateSeasoningDetails(),
        } as Machine;
    });
};


// ------------------------------------------------------
// LVMDP GENERATOR (FINAL SAFE VERSION)
// ------------------------------------------------------
const generateLVMDPs = (plantId: PlantCode): LVMDP[] => {
    return [1, 2, 3, 4].map(i => {
        const kw = Math.floor(Math.random() * 400) + 200;
        const pf = parseFloat((0.85 + Math.random() * 0.14).toFixed(2));
        const kva = kw / pf;
        const kvar = Math.sqrt(kva * kva - kw * kw);

        const avgCurrent = (kva * 1000) / (400 * Math.sqrt(3));
        const phaseCurrent = () =>
            parseFloat(
                (avgCurrent * (1 + (Math.random() * 0.02 - 0.01))).toFixed(1)
            );

        return {
            id: `${plantId}-LVMDP-${i}`,
            code: `LVMDP-${i}`,
            name: `Main Panel ${i}`,
            plantId,

            status: Math.random() > 0.9 ? 'WARNING' : 'NORMAL',

            totalPowerKW: kw,
            totalPowerKVA: parseFloat(kva.toFixed(1)),
            totalPowerKVAR: parseFloat(kvar.toFixed(1)),
            powerFactor: pf,

            frequency: parseFloat(
                (49.9 + Math.random() * 0.2).toFixed(2)
            ),

            currentLoadPercent: Math.floor(Math.random() * 40) + 40,

            voltageRS: 395 + Math.floor(Math.random() * 10),
            voltageST: 395 + Math.floor(Math.random() * 10),
            voltageTR: 395 + Math.floor(Math.random() * 10),

            currentR: phaseCurrent(),
            currentS: phaseCurrent(),
            currentT: phaseCurrent(),

            unbalanceVoltage: parseFloat((Math.random()).toFixed(2)),
            unbalanceCurrent: parseFloat((Math.random() * 2).toFixed(2)),

            energyToday: Math.floor(Math.random() * 5000),
            energyMTD: Math.floor(Math.random() * 150000),
            energyTotal: Math.floor(Math.random() * 5000000),

            thdV: parseFloat((1 + Math.random() * 4).toFixed(1)),
            thdI: parseFloat((3 + Math.random() * 8).toFixed(1)),

            panelTemp: 35 + Math.floor(Math.random() * 10),

            breakerStatus: 'CLOSED',
            doorOpen: Math.random() > 0.95
        };
    });
};

// ------------------------------------------------------
// MACHINE LIST PER PLANT
// ------------------------------------------------------
const cikokolMachines = generateMachines(PlantCode.CIKOKOL, [
    'Baked Corn Puff',
    'Potato Chips PC14',
    'Cassava Inhouse',
    'Cassava Copack',
    'Tempe Line',
    'Batch Fryer',
    'Continuous Fryer'
]);

const semarangMachines = generateMachines(PlantCode.SEMARANG, [
    'PC14',
    'PC32',
    'Cassava Inhouse',
    'Cassava Copack',
    'Tempe',
    'Tortilla',
    'FCP',
    'Extrude Pellet',
    'Sheeted Pellet E250',
    'Sheeted Pellet E500-1',
    'Sheeted Pellet E500-2',
    'Batch Fryer',
    'Continuous Fryer'
]);

// Cikupa machine names now dynamically match the packing line config
const cikupaMachineNames = [
    ...CIKUPA_PACKING_LINES.map(l => l.lineName),
    'Packing Pouch',
    'Vacuum Fryer 1'
];
const cikupaMachines = generateMachines(PlantCode.CIKUPA, cikupaMachineNames);


const agroMachines = generateMachines(PlantCode.AGRO, [
    'Future Line 1',
    'Future Line 2'
]);

// ------------------------------------------------------
// PLANT MASTER DATA (FINAL)
// NOTE: Exporting `let` to make it mutable for CRUD operations
// ------------------------------------------------------
export let PLANTS: Record<PlantCode, Plant> = {
    [PlantCode.CIKOKOL]: {
        id: PlantCode.CIKOKOL,
        name: 'Plant Cikokol',
        location: 'Tangerang',
        outputToday: 12500,
        oeeAvg: 0.82,
        energyTotal: 3200,
        activeAlarms: 3,
        machines: cikokolMachines,
        lvmdps: generateLVMDPs(PlantCode.CIKOKOL),
        utilityBaseValues: {
            water: { baseConsumption: 450, costPerUnit: 12000 },
            gas: { baseConsumption: 1200, costPerUnit: 4500 },
            steam: { baseConsumption: 15, costPerUnit: 250000 },
            air: { baseConsumption: 18000, costPerUnit: 150 },
            nitrogen: { baseConsumption: 450, costPerUnit: 2000 }
        }
    },
    [PlantCode.SEMARANG]: {
        id: PlantCode.SEMARANG,
        name: 'Plant Semarang',
        location: 'Central Java',
        outputToday: 18200,
        oeeAvg: 0.78,
        energyTotal: 4100,
        activeAlarms: 7,
        machines: semarangMachines,
        lvmdps: generateLVMDPs(PlantCode.SEMARANG),
        utilityBaseValues: {
            water: { baseConsumption: 650, costPerUnit: 11500 },
            gas: { baseConsumption: 1800, costPerUnit: 4400 },
            steam: { baseConsumption: 25, costPerUnit: 240000 },
            air: { baseConsumption: 25000, costPerUnit: 150 },
            nitrogen: { baseConsumption: 600, costPerUnit: 2000 }
        }
    },
    [PlantCode.CIKUPA]: {
        id: PlantCode.CIKUPA,
        name: 'Plant Cikupa',
        location: 'Tangerang',
        outputToday: 15600,
        oeeAvg: 0.85,
        energyTotal: 3800,
        activeAlarms: 2,
        machines: cikupaMachines,
        lvmdps: generateLVMDPs(PlantCode.CIKUPA),
        utilityBaseValues: {
            water: { baseConsumption: 500, costPerUnit: 12000 },
            gas: { baseConsumption: 1400, costPerUnit: 4500 },
            steam: { baseConsumption: 20, costPerUnit: 250000 },
            air: { baseConsumption: 22000, costPerUnit: 150 },
            nitrogen: { baseConsumption: 550, costPerUnit: 2000 }
        }
    },
    [PlantCode.AGRO]: {
        id: PlantCode.AGRO,
        name: 'Plant Agro',
        location: 'Development',
        outputToday: 0,
        oeeAvg: 0.7,
        energyTotal: 500,
        activeAlarms: 0,
        machines: agroMachines,
        lvmdps: generateLVMDPs(PlantCode.AGRO),
        utilityBaseValues: {
            water: { baseConsumption: 100, costPerUnit: 12000 },
            gas: { baseConsumption: 200, costPerUnit: 4500 },
            steam: { baseConsumption: 5, costPerUnit: 250000 },
            air: { baseConsumption: 3000, costPerUnit: 150 },
            nitrogen: { baseConsumption: 100, costPerUnit: 2000 }
        }
    }
};

// ------------------------------------------------------
// ACCESS HELPERS (SAFE)
// ------------------------------------------------------
export const getMachineById = (id: string): Machine | undefined => {
    for (const plant of Object.values(PLANTS)) {
        const m = plant.machines.find(x => x.id === id);
        if (m) return m;
    }
    return undefined;
};

export const getLVMDPById = (id: string): LVMDP | undefined => {
    for (const plant of Object.values(PLANTS)) {
        const p = plant.lvmdps.find(x => x.id === id);
        if (p) return p;
    }
    return undefined;
};

// ------------------------------------------------------
// EXTRA MOCK ALARMS
// ------------------------------------------------------
export const MOCK_ALARMS: Alarm[] = [
    {
        id: '1',
        timestamp: '10:15:00',
        source: 'PC14_SM',
        message: 'Oil Temp High',
        severity: AlarmSeverity.WARNING,
        code: 'W-001',
        isActive: true,
        handledByMaintenance: false
    },
    {
        id: '2',
        timestamp: '10:10:00',
        source: 'LVMDP-2 Cikokol',
        message: 'THD-V Warning',
        severity: AlarmSeverity.WARNING,
        code: 'W-002',
        isActive: true,
        handledByMaintenance: false
    },
    {
        id: '3',
        timestamp: '09:45:00',
        source: 'Extruder Semarang',
        message: 'Motor Trip',
        severity: AlarmSeverity.CRITICAL,
        code: 'C-001',
        isActive: true,
        handledByMaintenance: false
    }
];

export const MOCK_DOWNTIME_LOGS: DowntimeLog[] = [
    { id: 'dt-1', machineId: 'CIKOKOL-M-1', start: '10:15:00', end: '10:30:00', duration: '15m 0s', reason: 'Jam', description: 'Infeed blockage at conveyor belt.', source: 'AUTO' },
    { id: 'dt-2', machineId: 'CIKOKOL-M-1', start: '08:00:00', end: '08:45:00', duration: '45m 0s', reason: 'Changeover', description: 'Product change from Chitato to Qtela.', source: 'MANUAL' },
    { id: 'dt-3', machineId: 'SEMARANG-M-0', start: '11:20:00', end: '11:55:00', duration: '35m 0s', reason: 'Jam', description: 'Product jam at seasoning drum exit.', source: 'AUTO' },
];