<template>
  <div
    class="flex h-screen w-full bg-slate-950 overflow-hidden font-sans selection:bg-blue-500/30"
  >
    <!-- Left Side - Visual / Branding (Visible on Large Screens) -->
    <div
      class="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-slate-900 border-r border-slate-800 overflow-hidden"
    >
      <!-- Background Effects -->
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"
      ></div>
      <div
        class="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"
      ></div>

      <div
        class="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700"
      >
        <div class="flex items-center gap-3 mb-8">
          <span class="text-xl font-bold text-white tracking-tight"
            >PT Indofood Fortuna Makmur</span
          >
        </div>

        <h1
          class="text-5xl font-extrabold text-white leading-tight tracking-tight mb-6"
        >
          Operational<br />Excellence
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"
          >
            Through Real-time Data.
          </span>
        </h1>
        <p
          class="text-slate-300 text-lg max-w-lg leading-relaxed border-l-2 border-blue-500/50 pl-6"
        >
          Enterprise-grade monitoring solution for multi-plant industrial
          operations. Track performance, utilities, and machine health in one
          unified platform.
        </p>
      </div>

      <div
        class="relative z-10 flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider animate-in fade-in duration-1000 delay-300"
      >
        <ShieldCheck :size="14" class="text-emerald-500" />
        <span>Secure Enterprise Environment</span>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div
      class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative"
    >
      <!-- Mobile Header (Visible on Small Screens) -->
      <div class="absolute top-8 left-8 lg:hidden flex items-center gap-3">
        <span class="text-sm font-bold text-white tracking-tight">PT IFM</span>
      </div>

      <div
        class="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-500"
      >
        <div class="text-center lg:text-left">
          <h2 class="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h2>
          <p class="text-slate-300 mt-2 text-sm">
            Sign in to access the Smart Monitoring System.
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in zoom-in-95"
        >
          <AlertTriangle :size="18" class="shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-4">
            <!-- Username -->
            <div>
              <label
                class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2"
                >Corporate ID / Username</label
              >
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <User
                    class="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
                <input
                  v-model="username"
                  type="text"
                  class="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-lg leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-900 transition-all shadow-sm text-sm font-medium"
                  placeholder="Enter your username"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label
                class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2"
                >Password</label
              >
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Lock
                    class="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
                <input
                  v-model="password"
                  type="password"
                  class="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-lg leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-900 transition-all shadow-sm text-sm font-medium"
                  placeholder="Enter your password"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-800 rounded cursor-pointer"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-slate-300 cursor-pointer hover:text-slate-200"
            >
              Remember me
            </label>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </span>
              <span v-else>
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRight
                    class="h-5 w-5 text-blue-400 group-hover:text-blue-200 transition-colors"
                  />
                </span>
                Sign In to Dashboard
              </span>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="pt-8 mt-8 border-t border-slate-900 text-center">
          <button
            @click="navigateLanding"
            type="button"
            class="bg-transparent border-none p-0 text-xs font-medium uppercase tracking-widest
                  text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-0
                  active:bg-transparent"
          >
            ← Return to Landing Page
          </button>

          <p
            class="text-[10px] text-slate-300 mt-4 leading-relaxed max-w-xs mx-auto"
          >
            By signing in, you agree to comply with the company's IT security
            policies and procedures.
          </p>
        </div>
      </div>

      <div class="absolute bottom-6 text-[10px] text-slate-300 font-medium">
        © 2025 PT Indofood Fortuna Makmur. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import {
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-vue-next";

const router = useRouter();
const { login } = useAuth();

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const rememberMe = ref(false);

async function handleLogin() {
  error.value = "";
  isLoading.value = true;

  if (!username.value || !password.value) {
    error.value = "Username and password are required.";
    isLoading.value = false;
    return;
  }

  try {
    const result = await login(username.value, password.value);

    if (result.success) {
      // Save credentials if remember me is checked
      if (rememberMe.value) {
        localStorage.setItem("remembered_username", username.value);
      } else {
        localStorage.removeItem("remembered_username");
      }

      // Wait for auth state to be fully updated
      await nextTick();
      await router.isReady();
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("🔄 Navigating to global dashboard");
      await router.push({ name: "global" });
    } else {
      error.value = result.message || "Login failed. Please try again.";
      password.value = "";
      isLoading.value = false;
    }
  } catch (err) {
    console.error("Login error:", err);
    error.value = "An error occurred. Please try again.";
    isLoading.value = false;
  }
}

function navigateLanding() {
  router.push("/");
}

// Load remembered username on mount
if (localStorage.getItem("remembered_username")) {
  username.value = localStorage.getItem("remembered_username") || "";
  rememberMe.value = true;
}
</script>
