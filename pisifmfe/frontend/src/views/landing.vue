<script setup lang="ts">
import { RouterLink } from "vue-router";
import brandLogo from "../components/brandLogo.vue";
</script>

<template>
  <div
    class="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white"
  >
    <!-- Animated background gradients -->
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-cyan-500/40 to-sky-400/40 blur-3xl animate-float-slow"
      />
      <div
        class="absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-indigo-500/30 to-fuchsia-400/30 blur-3xl animate-float-rev"
      />
      <div
        class="absolute top-1/2 left-1/2 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-cyan-400/20 to-transparent blur-3xl animate-pulse"
      />
    </div>

    <!-- Grid overlay -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:24px_24px]"
    />

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Hero Section -->
      <div class="flex-1 flex items-center justify-center px-4 py-20 md:py-0">
        <div class="max-w-4xl w-full text-center">
          <!-- Logo with glow -->
          <div class="mb-8 flex justify-center animate-fade-in">
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-20"
              />
              <!-- <brandLogo
                src="/Logo.jpg"
                mode="intrinsic"
                :max="160"
                :rounded="true"
                :glow="true"
                class="relative"
              /> -->
            </div>
          </div>

          <!-- Main Title with gradient -->
          <h1
            class="text-5xl md:text-7xl font-bold leading-tight mb-4 animate-fade-in-delayed-1"
          >
            <span class="block mb-2">Project</span>
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500"
            >
              Information System </span
            ><br />
            <span class="text-lg md:text-2xl font-medium text-slate-300 mt-4"
              >for Indofood Fortuna Makmur</span
            >
          </h1>

          <!-- Subtitle -->
          <p
            class="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-delayed-2"
          >
            <!-- Monitor dan kontrol semua lini produksi dengan dashboard real-time
            yang powerful dan intuitif -->
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-delayed-3"
          >
            <RouterLink
              to="/app/lvmdp1"
              class="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/60 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
            >
              <span>🚀 MASUK</span>
              <svg
                class="size-5 transition group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="relative z-10 border-t border-slate-700/50 py-12 text-center">
        <p class="text-sm text-slate-400 mb-2">
          © 2025 • Indofood Fortuna Makmur - Cikupa
        </p>
        <p class="text-xs text-slate-500">
          Built with ♥ by <strong class="text-slate-300">@sptianbgus</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float-slow {
  0% {
    transform: translateY(0px) translateX(0);
  }
  50% {
    transform: translateY(12px) translateX(6px);
  }
  100% {
    transform: translateY(0px) translateX(0);
  }
}

@keyframes float-rev {
  0% {
    transform: translateY(0px) translateX(0);
  }
  50% {
    transform: translateY(-10px) translateX(-6px);
  }
  100% {
    transform: translateY(0px) translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}

.animate-float-rev {
  animation: float-rev 12s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delayed-1 {
  animation: fade-in 0.8s ease-out 0.2s backwards;
}

.animate-fade-in-delayed-2 {
  animation: fade-in 0.8s ease-out 0.4s backwards;
}

.animate-fade-in-delayed-3 {
  animation: fade-in 0.8s ease-out 0.6s backwards;
}
</style>
