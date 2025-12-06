
import { User, UserRole } from '../types';

interface UserCredentials {
    pass: string;
    role: UserRole;
    name: string;
}

const MOCK_USERS: Record<string, UserCredentials> = {
    'admin': { pass: 'admifm', role: UserRole.ADMINISTRATOR, name: 'System Administrator' },
    'supervisor': { pass: 'spvifm', role: UserRole.SUPERVISOR, name: 'Supervisor' },
    'operator': { pass: 'oprifm', role: UserRole.OPERATOR, name: 'Operator' },
    'maintenance': { pass: 'mtcifm', role: UserRole.MAINTENANCE, name: 'Maintenance' },
    'qc': { pass: 'qcifm', role: UserRole.QC, name: 'QC' },
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
