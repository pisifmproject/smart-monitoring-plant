// src/stores/auth.ts
import { ref, computed } from "vue";
import axios from "axios";

// Hard-lock API URL: no silent localhost fallback.
// If you want dev proxy, set VITE_API_URL=/api in .env.local
const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined. Please set it in your .env file.");
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  plantAccess: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const currentUser = ref<User | null>(null);
const authToken = ref<string | null>(null);

function applyAxiosToken(token: string | null) {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
}

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null);
  const userRole = computed(() => currentUser.value?.role || null);
  const username = computed(() => currentUser.value?.username || "");
  const name = computed(() => currentUser.value?.name || "");
  const plantAccess = computed(() => currentUser.value?.plantAccess || []);

  async function login(
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    username = String(username ?? "").trim();
    password = String(password ?? "").trim();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Always parse body (even 401)
      const data = await response.json().catch(() => ({}));

      // Strictly trust backend success flag only
      if (data?.success === true && data?.user && data?.token) {
        currentUser.value = data.user;
        authToken.value = data.token;

        const authState: AuthState = { user: data.user, token: data.token };
        localStorage.setItem("auth_state", JSON.stringify(authState));

        applyAxiosToken(data.token);

        return { success: true, message: data.message || "Login successful" };
      }

      return {
        success: false,
        message: data?.message || "Login failed. Invalid credentials.",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Network error. Cannot connect to server.",
      };
    }
  }

  function logout() {
    currentUser.value = null;
    authToken.value = null;
    localStorage.removeItem("auth_state");
    applyAxiosToken(null);
  }

  function initAuth() {
    const stored = localStorage.getItem("auth_state");
    if (!stored) return;

    try {
      const authState: AuthState = JSON.parse(stored);
      currentUser.value = authState.user;
      authToken.value = authState.token;
      applyAxiosToken(authState.token);
    } catch {
      localStorage.removeItem("auth_state");
      currentUser.value = null;
      authToken.value = null;
      applyAxiosToken(null);
    }
  }

  // init once at module load
  initAuth();

  return {
    currentUser: computed(() => currentUser.value),
    authToken: computed(() => authToken.value),
    isAuthenticated,
    userRole,
    username,
    name,
    plantAccess,
    login,
    logout,
    initAuth,
  };
}
