import { User, UserRole, PlantCode } from '../types';

const API_BASE = '/api/stable/auth';

// Helper to handle API response
async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const login = async (username: string, pass: string): Promise<User | null> => {
    try {
        const res = await handleResponse(await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: pass })
        }));

        // Return mapped user
        // Backend returns: { token, user: { id, username, role, full_name } }
        const backendUser = res.user;

        // Store token
        if (res.token) {
            localStorage.setItem('smmp_token', res.token);
        }

        return {
            username: backendUser.username,
            name: backendUser.full_name,
            role: backendUser.role as UserRole,
            plantAccess: undefined
        };
    } catch (e) {
        console.error("Login failed", e);
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('smmp_token');
    // Optional: Call backend logout
    fetch(`${API_BASE}/logout`, { method: 'POST' }).catch(() => {});
};

export const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('smmp_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// --- CRUD Operations for User Management ---
export const getUsers = (): User[] => {
    return [];
};

export const addUser = async (user: User, pass: string) => {
    return { success: true };
};

export const updateUser = async (username: string, data: any) => {
    return { success: true };
};

export const deleteUser = async (username: string) => {
    return { success: true };
};
