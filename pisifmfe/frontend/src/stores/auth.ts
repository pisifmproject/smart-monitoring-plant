// src/stores/auth.ts
import { ref, computed } from "vue";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000/api";

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
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      if (response.data.success && response.data.user && response.data.token) {
        currentUser.value = response.data.user;
        authToken.value = response.data.token;

        // Save to localStorage
        const authState: AuthState = {
          user: response.data.user,
          token: response.data.token,
        };
        localStorage.setItem("auth_state", JSON.stringify(authState));

        // Set axios default header for future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        return {
          success: true,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred during login. Please try again.",
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
