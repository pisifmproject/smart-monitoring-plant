import { User, UserRole, PlantCode } from '../types';

interface UserCredentials {
    pass: string;
    role: UserRole;
    name: string;
    plantAccess?: PlantCode[];
}

// NOTE: Exported to allow modification from the settings panel
export let MOCK_USERS: Record<string, UserCredentials> = {
    'admin': { pass: 'admifm', role: UserRole.ADMINISTRATOR, name: 'System Administrator' }, // No plantAccess -> global
    'supervisor': { pass: 'spvifm', role: UserRole.SUPERVISOR, name: 'Supervisor Cikokol', plantAccess: [PlantCode.CIKOKOL] },
    'operator': { pass: 'oprifm', role: UserRole.OPERATOR, name: 'Operator Semarang', plantAccess: [PlantCode.SEMARANG] },
    'maintenance': { pass: 'mtcifm', role: UserRole.MAINTENANCE, name: 'Maintenance Multi', plantAccess: [PlantCode.CIKUPA, PlantCode.SEMARANG] },
    'qc': { pass: 'qcifm', role: UserRole.QC, name: 'QC Cikokol & Cikupa', plantAccess: [PlantCode.CIKOKOL, PlantCode.CIKUPA] },
    'management': { pass: 'mngifm', role: UserRole.MANAGEMENT, name: 'Management Agro', plantAccess: [PlantCode.AGRO] },
    'guest': { pass: 'gsifm', role: UserRole.VIEWER, name: 'Guest Viewer', plantAccess: [PlantCode.CIKOKOL, PlantCode.SEMARANG] }
};

export const login = (username: string, pass: string): User | null => {
    const userCreds = MOCK_USERS[username];
    if (userCreds && userCreds.pass === pass) {
        return {
            username,
            name: userCreds.name,
            role: userCreds.role,
            plantAccess: userCreds.plantAccess
        };
    }
    return null;
};

// --- CRUD Operations for User Management ---

export const getUsers = (): User[] => {
    return Object.entries(MOCK_USERS).map(([username, credentials]) => ({
        username,
        name: credentials.name,
        role: credentials.role,
        plantAccess: credentials.plantAccess
    }));
};

export const addUser = (user: User, pass: string): { success: boolean, message?: string } => {
    if (MOCK_USERS[user.username]) {
        return { success: false, message: 'Username already exists.' };
    }
    MOCK_USERS[user.username] = {
        name: user.name,
        role: user.role,
        pass,
        plantAccess: user.plantAccess
    };
    return { success: true };
};

export const updateUser = (username: string, data: { name: string, role: UserRole, pass?: string, plantAccess?: PlantCode[] }): { success: boolean, message?: string } => {
    if (!MOCK_USERS[username]) {
        return { success: false, message: 'User not found.' };
    }
    MOCK_USERS[username].name = data.name;
    MOCK_USERS[username].role = data.role;
    MOCK_USERS[username].plantAccess = data.plantAccess;
    if (data.pass) {
        MOCK_USERS[username].pass = data.pass;
    }
    return { success: true };
};

export const deleteUser = (username: string): { success: boolean, message?: string } => {
    if (!MOCK_USERS[username]) {
        return { success: false, message: 'User not found.' };
    }
    if (username === 'admin') {
         return { success: false, message: 'Cannot delete the primary administrator account.' };
    }
    delete MOCK_USERS[username];
    return { success: true };
};