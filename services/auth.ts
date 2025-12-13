
import { User, UserRole } from '../types';

interface UserCredentials {
    pass: string;
    role: UserRole;
    name: string;
}

// NOTE: Exported to allow modification from the settings panel
export const MOCK_USERS: Record<string, UserCredentials> = {
    'admin': { pass: 'admifm', role: UserRole.ADMINISTRATOR, name: 'System Administrator' },
    'supervisor': { pass: 'spvifm', role: UserRole.SUPERVISOR, name: 'Supervisor' },
    'operator': { pass: 'oprifm', role: UserRole.OPERATOR, name: 'Operator' },
    'maintenance': { pass: 'mtcifm', role: UserRole.MAINTENANCE, name: 'Maintenance' },
    'qc': { pass: 'qcifm', role: UserRole.QC, name: 'Quality Control' },
    'management': { pass: 'mngifm', role: UserRole.MANAGEMENT, name: 'Pak Bos' },
    'guest': { pass: 'gsifm', role: UserRole.VIEWER, name: 'Guest' }
};

export const login = (username: string, pass: string): User | null => {
    const user = MOCK_USERS[username];
    if (user && user.pass === pass) {
        return {
            username,
            name: user.name,
            role: user.role
        };
    }
    return null;
};

// --- CRUD Operations for User Management ---

export const getUsers = (): User[] => {
    return Object.entries(MOCK_USERS).map(([username, credentials]) => ({
        username,
        name: credentials.name,
        role: credentials.role
    }));
};

export const addUser = (user: User, pass: string): { success: boolean, message?: string } => {
    if (MOCK_USERS[user.username]) {
        return { success: false, message: 'Username already exists.' };
    }
    MOCK_USERS[user.username] = {
        name: user.name,
        role: user.role,
        pass
    };
    return { success: true };
};

export const updateUser = (username: string, data: { name: string, role: UserRole, pass?: string }): { success: boolean, message?: string } => {
    if (!MOCK_USERS[username]) {
        return { success: false, message: 'User not found.' };
    }
    MOCK_USERS[username].name = data.name;
    MOCK_USERS[username].role = data.role;
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
