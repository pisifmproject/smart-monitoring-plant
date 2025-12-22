<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-vue-next";
import { useAuth } from "@/stores/auth";

// Force reload check - v2
const AUTH_VERSION = "v2.1";
console.log("🔄 Login component version:", AUTH_VERSION);

const router = useRouter();
const { login } = useAuth();

const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

onMounted(() => {
  const apiUrl = import.meta.env.VITE_API_URL || "/api";
  console.log("🌐 Login page loaded");
  console.log("🔗 API URL:", apiUrl);
  console.log("📍 Current URL:", window.location.href);

  // Force check - show alert if localhost still detected
  if (apiUrl.includes("localhost")) {
    console.error("⚠️ WARNING: Still using localhost! Browser cache issue!");
  }
});

const handleSubmit = async () => {
  console.log("🚀 Form submitted");
  console.log("Username:", username.value);
  console.log("Password length:", password.value.length);
  error.value = "";
  isLoading.value = true;

  if (!username.value || !password.value) {
    console.warn("⚠️ Empty credentials");
    error.value = "Please enter your credentials.";
    isLoading.value = false;
    return;
  }

  try {
    console.log("📝 Calling login with:", username.value);
    console.log("   login function type:", typeof login);
    console.log("   login function:", login);

    // Call the database authentication
    const result = await login(username.value, password.value);
    console.log("📊 Login result:", result);
    console.log("   - result type:", typeof result);
    console.log("   - success:", result.success);
    console.log("   - message:", result.message);
    console.log("   - message type:", typeof result.message);
    console.log("   - message length:", result.message?.length);

    if (result.success) {
      console.log("✅ Login successful, processing navigation");
      try {
        // Wait for next tick to ensure router is fully ready
        await nextTick();

        // Ensure router is fully initialized
        await router.isReady();
        console.log("🔄 Router is ready, waiting 100ms before navigation");

        // Add small delay to ensure all transitions complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("📍 Navigating to global dashboard");
        console.log(
          "   Available routes:",
          router
            .getRoutes()
            .map((r) => r.path)
            .join(", ")
        );

        await router.push({ name: "global" });
        console.log("✅ Navigation complete");
      } catch (navErr) {
        console.error("❌ Navigation error:", navErr);
        console.error("   Error details:", (navErr as any).message);
        // Log all available routes for debugging
        console.log(
          "   Available routes:",
          router.getRoutes().map((r) => ({ path: r.path, name: r.name }))
        );
        // Fallback to direct navigation
        console.log("   Falling back to direct href");
        window.location.href = "/app/global";
      }
    } else {
      const errorMsg = result.message || "Login failed. Please try again.";
      console.error("❌ Login failed:", errorMsg);
      error.value = errorMsg;
      isLoading.value = false;
    }
  } catch (err) {
    console.error("❌ Unexpected error in handleSubmit:", err);
    error.value = "An unexpected error occurred. Please try again.";
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="flex h-screen w-full bg-slate-950 overflow-hidden font-sans selection:bg-blue-500/30"
  >
    <!-- Left Side - Visual / Branding -->
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
          <span class="text-xl font-bold text-white tracking-tight">
            PT Indofood Fortuna Makmur
          </span>
        </div>

        <h1
          class="text-5xl font-extrabold text-white leading-tight tracking-tight mb-6"
        >
          Operational Excellence <br />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"
          >
            Through Real-time Data.
          </span>
        </h1>
        <p
          class="text-slate-300 text-lg max-w-lg leading-relaxed border-l-2 border-blue-500/50 pl-6"
        >
          Enterprise-grade monitoring solution for industrial operations. Track
          performance, utilities, and machine health in one unified platform.
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
      class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-950 relative"
    >
      <!-- Mobile Header -->
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

        <div
          v-if="error"
          class="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in zoom-in-95"
        >
          <AlertTriangle :size="18" class="shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label
                class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2"
              >
                Corporate ID / Username
              </label>
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <UserIcon
                    class="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
                <input
                  type="text"
                  class="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-lg leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-900 transition-all shadow-sm text-sm font-medium"
                  placeholder="Enter your username"
                  v-model="username"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2"
              >
                Password
              </label>
              <div class="relative group">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Lock
                    class="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors"
                  />
                </div>
                <input
                  type="password"
                  class="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-lg leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-900 transition-all shadow-sm text-sm font-medium"
                  placeholder="Enter your password"
                  v-model="password"
                  :disabled="isLoading"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
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
              <span v-else class="flex items-center gap-2">
                <ArrowRight
                  class="h-5 w-5 text-blue-400 group-hover:text-blue-200 transition-colors"
                />
                Sign In to Dashboard
              </span>
            </button>
          </div>
        </form>

        <div class="pt-8 mt-8 text-center">
          <button
            @click="router.push('/')"
            class="!bg-transparent !border-0 !shadow-none !text-cyan-400 text-xs uppercase tracking-[0.25em] hover:!text-cyan-300 focus:!outline-none focus:!ring-0 px-0 py-0"
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
