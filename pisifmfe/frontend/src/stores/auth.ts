// src/stores/auth.ts - Updated 2025-12-17 16:25
import { ref, computed } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000/api";
console.log("🔧 Auth store loaded - API_URL:", API_URL);

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
    console.log("🟢 LOGIN FUNCTION CALLED!");
    console.log("🟢 Username:", username);
    console.log("🟢 Password length:", password?.length);
    console.log("🟢 API_URL:", API_URL);

    try {
      console.log("🔐 Login attempt:", { username, API_URL });
      console.log("📡 Sending request to:", `${API_URL}/auth/login`);
      console.log("📦 Request body:", { username, password: "***" });

      // Use native fetch instead of axios for better reliability
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("📥 Response received!");
      console.log("📥 Response status:", response.status);

      const data = await response.json();
      console.log("📥 Response data:", data);

      console.log("✅ Response keys:", Object.keys(data));
      console.log("✅ Response success:", data.success);
      console.log("✅ Response user:", data.user);
      console.log(
        "✅ Response token:",
        data.token ? "Token exists" : "No token"
      );

      if (data.success && data.user && data.token) {
        console.log("✅ Setting currentUser:", data.user);
        currentUser.value = data.user;
        authToken.value = data.token;

        // Save to localStorage
        const authState: AuthState = {
          user: data.user,
          token: data.token,
        };
        localStorage.setItem("auth_state", JSON.stringify(authState));
        console.log("💾 Auth state saved to localStorage");

        // Set axios default header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        console.log("🔑 Authorization header set");

        console.log("💾 Auth state saved, user:", currentUser.value?.username);
        console.log("✅ isAuthenticated:", currentUser.value !== null);

        return {
          success: true,
          message: data.message || "Login successful",
        };
      } else {
        console.error("❌ Invalid response structure:", data);
        return {
          success: false,
          message: data.message || "Login failed - Invalid response",
        };
      }
    } catch (error: any) {
      console.error("❌ Login error caught!");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", error?.message);
      console.error("Full error:", error);

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
    delete axios.defaults.headers.common["Authorization"];
  }

  function initAuth() {
    const stored = localStorage.getItem("auth_state");
    if (stored) {
      try {
        const authState: AuthState = JSON.parse(stored);
        currentUser.value = authState.user;
        authToken.value = authState.token;

        // Set axios default header
        if (authState.token) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${authState.token}`;
        }
      } catch (error) {
        console.error("Failed to parse auth state:", error);
        localStorage.removeItem("auth_state");
      }
    }
  }

  // Call initAuth when the module loads
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
