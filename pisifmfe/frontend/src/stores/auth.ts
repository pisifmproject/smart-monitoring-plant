// src/stores/auth.ts - Backend Authentication
import { ref, computed } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined in .env");
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

    console.log("[AUTH] ===== LOGIN FUNCTION CALLED =====");
    console.log(`[AUTH] Username: ${username}`);
    console.log(`[AUTH] Password length: ${password.length}`);
    console.log(`[AUTH] API_URL: ${API_URL}`);

    try {
      console.log(`[AUTH] Attempting login for user: ${username}`);
      console.log(`[AUTH] Making fetch to: ${API_URL}/auth/login`);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log(`[AUTH] Response received!`);
      console.log(`[AUTH] Response status: ${response.status}`);
      console.log(`[AUTH] Response statusText: ${response.statusText}`);
      console.log(`[AUTH] Response.ok: ${response.ok}`);

      // Always parse body (even 401)
      let data;
      try {
        data = await response.json();
        console.log(`[AUTH] JSON parsed successfully`);
      } catch (parseErr) {
        console.error(`[AUTH] Failed to parse JSON response:`, parseErr);
        data = {};
      }

      console.log(`[AUTH] Response data:`, JSON.stringify(data));
      console.log(`[AUTH] Data type:`, typeof data);
      console.log(`[AUTH] Data.success:`, data?.success);
      console.log(`[AUTH] Data.message:`, data?.message);
      console.log(`[AUTH] Data.user:`, data?.user ? "present" : "missing");
      console.log(
        `[AUTH] Data.token:`,
        data?.token ? "present (first 20 chars)" : "missing"
      );

      // Strictly trust backend success flag only
      if (data?.success === true && data?.user && data?.token) {
        console.log(`[AUTH] ✅ LOGIN SUCCESS! User: ${data.user.username}`);
        currentUser.value = data.user;
        authToken.value = data.token;

        const authState: AuthState = { user: data.user, token: data.token };
        localStorage.setItem("auth_state", JSON.stringify(authState));

        applyAxiosToken(data.token);

        return { success: true, message: data.message || "Login successful" };
      }

      const message = data?.message || "Login failed. Invalid credentials.";
      console.error(`[AUTH] ❌ Login FAILED: ${message}`);
      return {
        success: false,
        message: message,
      };
    } catch (error: any) {
      console.error(`[AUTH] 💥 LOGIN ERROR:`, error);
      console.error(`[AUTH] Error message:`, error?.message);
      console.error(`[AUTH] Error stack:`, error?.stack);
      return {
        success: false,
        message: error?.message || "Network error. Cannot connect to server.",
      };
    }

    // Explicit fallback return (should never reach here)
    console.error("[AUTH] UNEXPECTED: No return statement reached!");
    return {
      success: false,
      message: "Unexpected error occurred",
    };
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
