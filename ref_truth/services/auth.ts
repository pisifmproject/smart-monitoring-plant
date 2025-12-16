
import { User, UserRole, PlantCode } from '../types';

interface UserCredentials {
    pass: string;
    role: UserRole;
    name: string;
    plantAccess: PlantCode[];
}

// NOTE: Exported to allow modification from the settings panel
export const MOCK_USERS: Record<string, UserCredentials> = {
    'admin': { 
        pass: 'admifm', 
        role: UserRole.ADMINISTRATOR, 
        name: 'System Administrator',
        plantAccess: [PlantCode.CIKOKOL, PlantCode.SEMARANG, PlantCode.CIKUPA, PlantCode.AGRO]
    },
    'supervisor': { 
        pass: 'spvifm', 
        role: UserRole.SUPERVISOR, 
        name: 'Supervisor Cikupa',
        plantAccess: [PlantCode.CIKUPA] // Example: Supervisor only sees Cikupa
    },
    'operator': { 
        pass: 'oprifm', 
        role: UserRole.OPERATOR, 
        name: 'Operator Cikokol',
        plantAccess: [PlantCode.CIKOKOL] // Example: Operator only sees Cikokol
    },
    'maintenance': { 
        pass: 'mtcifm', 
        role: UserRole.MAINTENANCE, 
        name: 'Maintenance Team',
        plantAccess: [PlantCode.CIKOKOL, PlantCode.SEMARANG, PlantCode.CIKUPA, PlantCode.AGRO]
    },
    'qc': { 
        pass: 'qcifm', 
        role: UserRole.QC, 
        name: 'Quality Control',
        plantAccess: [PlantCode.CIKOKOL, PlantCode.SEMARANG, PlantCode.CIKUPA, PlantCode.AGRO]
    },
    'management': { 
        pass: 'mngifm', 
        role: UserRole.MANAGEMENT, 
        name: 'Pak Bos',
        plantAccess: [PlantCode.CIKOKOL, PlantCode.SEMARANG, PlantCode.CIKUPA, PlantCode.AGRO]
    },
    'guest': { 
        pass: 'gsifm', 
        role: UserRole.VIEWER, 
        name: 'Guest',
        plantAccess: [PlantCode.CIKOKOL, PlantCode.SEMARANG, PlantCode.CIKUPA, PlantCode.AGRO]
    }
};

export const login = (username: string, pass: string): User | null => {
    const user = MOCK_USERS[username];
    if (user && user.pass === pass) {
        return {
            username,
            name: user.name,
            role: user.role,
            plantAccess: user.plantAccess
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
        plantAccess: user.plantAccess || []
    };
    return { success: true };
};

export const updateUser = (username: string, data: { name: string, role: UserRole, pass?: string, plantAccess?: PlantCode[] }): { success: boolean, message?: string } => {
    if (!MOCK_USERS[username]) {
        return { success: false, message: 'User not found.' };
    }
    MOCK_USERS[username].name = data.name;
    MOCK_USERS[username].role = data.role;
    if (data.pass) {
        MOCK_USERS[username].pass = data.pass;
    }
    if (data.plantAccess) {
        MOCK_USERS[username].plantAccess = data.plantAccess;
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
