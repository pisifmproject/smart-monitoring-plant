
import { User, UserRole } from '../types';

interface UserCredentials {
    pass: string;
    role: UserRole;
    name: string;
}

const MOCK_USERS: Record<string, UserCredentials> = {
    'admin1': { pass: 'admifm', role: UserRole.ADMINISTRATOR, name: 'System Administrator' },
    'spv2': { pass: 'spvifm', role: UserRole.SUPERVISOR, name: 'Production Supervisor' },
    'operator3': { pass: 'oprifm', role: UserRole.OPERATOR, name: 'Line Operator' },
    'maintenance4': { pass: 'mtcifm', role: UserRole.MAINTENANCE, name: 'Maintenance Engineer' },
    'qc5': { pass: 'qcifm', role: UserRole.QC, name: 'QC Inspector' },
    'management6': { pass: 'mngifm', role: UserRole.MANAGEMENT, name: 'Plant Manager' },
    'guest': { pass: 'guestifm', role: UserRole.VIEWER, name: 'Guest Viewer' }
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
