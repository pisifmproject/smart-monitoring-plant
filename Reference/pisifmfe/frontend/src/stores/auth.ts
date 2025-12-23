// src/stores/auth.ts
import { ref, computed } from "vue";

export type UserRole = "tamu" | "user" | null;

interface User {
  username: string;
  role: UserRole;
}

const currentUser = ref<User | null>(null);

// Hardcoded users
const users = [
  { username: "tamuifm", password: "hello01", role: "tamu" as UserRole },
  { username: "userifm", password: "pisifm00", role: "user" as UserRole },
];

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null);
  const userRole = computed(() => currentUser.value?.role || null);
  const username = computed(() => currentUser.value?.username || "");

  function login(username: string, password: string): boolean {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      currentUser.value = {
        username: user.username,
        role: user.role,
      };
      // Save to localStorage
      localStorage.setItem("auth_user", JSON.stringify(currentUser.value));
      return true;
    }
    return false;
  }

  function logout() {
    currentUser.value = null;
    localStorage.removeItem("auth_user");
  }

  function initAuth() {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        currentUser.value = JSON.parse(stored);
      } catch (e) {
        localStorage.removeItem("auth_user");
      }
    }
  }

  function canAccessDailyReport(): boolean {
    return userRole.value === "user";
  }

  return {
    isAuthenticated,
    userRole,
    username,
    login,
    logout,
    initAuth,
    canAccessDailyReport,
  };
}
