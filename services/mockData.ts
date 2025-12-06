
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
    DowntimeLog
} from '../types';

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
    if (n.includes('packing') || n.includes('pouch'))
        return MachineType.PACKING;
    if (n.includes('season') || n.includes('tws'))
        return MachineType.SEASONING;
    return MachineType.GENERIC;
};

// ------------------------------------------------------
// MACHINE GENERATOR (FINAL SAFE VERSION)
// ------------------------------------------------------
const generateMachines = (plantId: PlantCode, names: string[]): Machine[] => {
    return names.map((name, index) => {
        const r = Math.random();
        let status = MachineStatus.RUNNING;
        if (r > 0.88) status = MachineStatus.IDLE;
        if (r > 0.96) status = MachineStatus.BREAKDOWN;

        const type = getMachineType(name);
        const outputBase = type === MachineType.PACKING ? 40 : 800;
        
        // Generate machine-specific process parameters
        let processParams: Record<string, number | string> = {};
        switch(type) {
            case MachineType.EXTRUDER:
                processParams = { 
                    'Screw Speed': 120 + Math.round(Math.random() * 20),
                    'Barrel Temp Zone 1': 145 + Math.round(Math.random() * 5),
                    'Barrel Temp Zone 2': 150 + Math.round(Math.random() * 5),
                    'Feeder Speed': 80 + Math.round(Math.random() * 10),
                    'Die Pressure': 40 + Math.round(Math.random() * 5)
                };
                break;
            case MachineType.FRYER:
                processParams = {
                    'Oil Temp': 180 + Math.round(Math.random() * 5),
                    'Conveyor Speed': 2.5 + Math.random(),
                    'Oil Level': 85 + Math.round(Math.random() * 10)
                };
                break;
            default:
                processParams = { 'Cycle Time': 3.5, 'Vibration': 0.8 };
        }

        return {
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
            
            // Detailed properties
            availability: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
            performance: parseFloat((0.80 + Math.random() * 0.19).toFixed(2)),
            quality: parseFloat((0.95 + Math.random() * 0.04).toFixed(2)),
            processParams: processParams,
            utilityConsumption: {
                electricity: 150 + Math.random() * 50,
                steam: type === MachineType.FRYER ? 400 + Math.random() * 100 : 0,
                water: 0.5 + Math.random() * 0.2,
                air: 200 + Math.random() * 50
            }
        };
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

const cikupaMachines = generateMachines(PlantCode.CIKUPA, [
    'PC14',
    'PC39',
    'Cassava Inhouse',
    'Cassava Copack',
    'Tortilla',
    'FCP',
    'TWS 5.6',
    'TWS 7.2',
    'Packing Pouch',
    'Vacuum Fryer 1'
]);

const agroMachines = generateMachines(PlantCode.AGRO, [
    'Future Line 1',
    'Future Line 2'
]);

// ------------------------------------------------------
// PLANT MASTER DATA (FINAL)
// ------------------------------------------------------
export const PLANTS: Record<PlantCode, Plant> = {
    [PlantCode.CIKOKOL]: {
        id: PlantCode.CIKOKOL,
        name: 'Plant Cikokol',
        location: 'Tangerang',
        outputToday: 12500,
        oeeAvg: 0.82,
        energyTotal: 3200,
        activeAlarms: 3,
        machines: cikokolMachines,
        lvmdps: generateLVMDPs(PlantCode.CIKOKOL)
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
        lvmdps: generateLVMDPs(PlantCode.SEMARANG)
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
        lvmdps: generateLVMDPs(PlantCode.CIKUPA)
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
        lvmdps: generateLVMDPs(PlantCode.AGRO)
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
