
import { Plant, PlantCode, MachineStatus, Machine, LVMDP, Alarm, AlarmSeverity, MachineType } from '../types';

const getMachineType = (name: string): MachineType => {
    const n = name.toLowerCase();
    if (n.includes('fryer')) return MachineType.FRYER;
    if (n.includes('puff') || n.includes('extrude') || n.includes('pellet') || n.includes('sheeted')) return MachineType.EXTRUDER;
    if (n.includes('packing') || n.includes('pouch')) return MachineType.PACKING;
    if (n.includes('seasoning') || n.includes('tws')) return MachineType.SEASONING; // TWS often weighing/seasoning
    return MachineType.GENERIC;
};

const generateMachines = (plantId: PlantCode, names: string[]): Machine[] => {
    return names.map((name, index) => {
        // Randomize status for demo purposes
        const r = Math.random();
        let status = MachineStatus.RUNNING;
        if (r > 0.85) status = MachineStatus.IDLE;
        if (r > 0.95) status = MachineStatus.BREAKDOWN;

        const type = getMachineType(name);
        
        // Output/Speed scaling
        const outputBase = type === MachineType.PACKING ? 40 : 800;
        
        return {
            id: `${plantId}-M-${index}`,
            code: `${name.replace(/\s+/g, '_').toUpperCase()}`,
            name: name,
            plantId: plantId,
            status: status,
            type: type,
            outputPerHour: Math.floor(Math.random() * 500) + outputBase,
            oee: parseFloat((0.6 + Math.random() * 0.35).toFixed(2)),
            temperature: Math.floor(Math.random() * 40) + 60, // 60-100 deg C
            totalOutputShift: Math.floor(Math.random() * 5000) + 1000,
            targetShift: 8000,
            lineSpeed: type === MachineType.PACKING ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 200) + 100,
            rejectRate: parseFloat((Math.random() * 5).toFixed(2))
        };
    });
};

const generateLVMDPs = (plantId: PlantCode): LVMDP[] => {
    return [1, 2, 3, 4].map(i => {
        const kw = Math.floor(Math.random() * 400) + 200;
        const pf = parseFloat((0.85 + Math.random() * 0.14).toFixed(2));
        const kva = kw / pf;
        const kvar = Math.sqrt(kva*kva - kw*kw);
        
        // Phase currents
        const avgCurrent = (kva * 1000) / (400 * Math.sqrt(3));
        const unbalI = Math.random() * 2;
        
        return {
            id: `${plantId}-LVMDP-${i}`,
            code: `LVMDP-${i}`,
            name: `Main Panel ${i}`,
            plantId: plantId,
            status: Math.random() > 0.9 ? 'WARNING' : 'NORMAL',
            
            // Power
            totalPowerKW: kw,
            totalPowerKVAR: parseFloat(kvar.toFixed(1)),
            totalPowerKVA: parseFloat(kva.toFixed(1)),
            powerFactor: pf,
            frequency: parseFloat((49.9 + Math.random() * 0.2).toFixed(2)),
            currentLoadPercent: Math.floor(Math.random() * 30) + 50,

            // Phase
            voltageRS: 395 + Math.floor(Math.random() * 10),
            voltageST: 395 + Math.floor(Math.random() * 10),
            voltageTR: 395 + Math.floor(Math.random() * 10),
            currentR: parseFloat((avgCurrent * (1 + (Math.random()*0.02 - 0.01))).toFixed(1)),
            currentS: parseFloat((avgCurrent * (1 + (Math.random()*0.02 - 0.01))).toFixed(1)),
            currentT: parseFloat((avgCurrent * (1 + (Math.random()*0.02 - 0.01))).toFixed(1)),
            unbalanceVoltage: parseFloat((Math.random()).toFixed(2)),
            unbalanceCurrent: parseFloat(unbalI.toFixed(2)),

            // Energy
            energyToday: Math.floor(Math.random() * 5000),
            energyMTD: Math.floor(Math.random() * 150000),
            energyTotal: Math.floor(Math.random() * 5000000),

            // Quality
            thdV: parseFloat((1 + Math.random() * 4).toFixed(1)),
            thdI: parseFloat((3 + Math.random() * 8).toFixed(1)),

            // Env
            panelTemp: 35 + Math.floor(Math.random() * 10),
            breakerStatus: 'CLOSED',
            doorOpen: Math.random() > 0.95
        };
    });
};

const cikokolMachines = generateMachines(PlantCode.CIKOKOL, [
    'Baked Corn Puff', 'Potato Chips PC14', 'Cassava Inhouse', 'Cassava Copack', 'Tempe Line', 'Batch Fryer', 'Continuous Fryer'
]);

const semarangMachines = generateMachines(PlantCode.SEMARANG, [
    'PC14', 'PC32', 'Cassava Inhouse', 'Cassava Copack', 'Tempe', 'Tortilla', 'FCP', 'Extrude Pellet', 'Sheeted Pellet E250', 'Sheeted Pellet E500-1', 'Sheeted Pellet E500-2', 'Batch Fryer', 'Continuous Fryer'
]);

const cikupaMachines = generateMachines(PlantCode.CIKUPA, [
    'PC14', 'PC39', 'Cassava Inhouse', 'Cassava Copack', 'Tortilla', 'FCP', 'TWS 5.6', 'TWS 7.2', 'Packing Pouch', 'Vacuum Fryer 1'
]);

const agroMachines = generateMachines(PlantCode.AGRO, [
    'Future Line 1', 'Future Line 2'
]);

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
        oeeAvg: 0,
        energyTotal: 500,
        activeAlarms: 0,
        machines: agroMachines,
        lvmdps: generateLVMDPs(PlantCode.AGRO)
    }
};

export const MOCK_ALARMS: Alarm[] = [
    { id: '1', timestamp: '10:15:00', source: 'PC14_SM', message: 'Oil Temp High', severity: AlarmSeverity.WARNING },
    { id: '2', timestamp: '10:10:00', source: 'LVMDP-2 Cikokol', message: 'THD-V Warning', severity: AlarmSeverity.WARNING },
    { id: '3', timestamp: '09:45:00', source: 'Extruder Semarang', message: 'Motor Trip', severity: AlarmSeverity.CRITICAL },
    { id: '4', timestamp: '08:30:00', source: 'Boiler 1 Cikokol', message: 'Low Pressure', severity: AlarmSeverity.INFO },
    { id: '5', timestamp: '11:20:00', source: 'PC32_SEMARANG', message: 'Conveyor Jam', severity: AlarmSeverity.CRITICAL },
    { id: '6', timestamp: '11:15:00', source: 'LVMDP-1 Cikupa', message: 'Overcurrent Phase R', severity: AlarmSeverity.WARNING },
    { id: '7', timestamp: '11:00:00', source: 'Packing Pouch Cikupa', message: 'Sealer Temp Low', severity: AlarmSeverity.WARNING },
    { id: '8', timestamp: '10:55:00', source: 'Batch Fryer Cikokol', message: 'Oil Level Low', severity: AlarmSeverity.WARNING },
];

// Helper functions for Routing
export const getMachineById = (id: string): Machine | undefined => {
    for (const plant of Object.values(PLANTS)) {
        const machine = plant.machines.find(m => m.id === id);
        if (machine) return machine;
    }
    return undefined;
};

export const getLVMDPById = (id: string): LVMDP | undefined => {
    for (const plant of Object.values(PLANTS)) {
        const panel = plant.lvmdps.find(l => l.id === id);
        if (panel) return panel;
    }
    return undefined;
};
