<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowRight } from "lucide-vue-next";

const router = useRouter();
</script>

<template>
  <div
    class="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden selection:bg-blue-500/30"
  >
    <!-- Background Effects -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"
    ></div>

    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none opacity-40"
    ></div>

    <div
      class="absolute bottom-0 right-0 w-[800px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none opacity-30"
    ></div>

    <!-- Header -->
    <header
      class="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20"
    >
      <h1 class="text-lg font-bold tracking-tight text-white">
        PT Indofood Fortuna Makmur
      </h1>
    </header>

    <!-- Hero -->
    <main
      class="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-20 pb-20"
    >
      <div
        class="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10 max-w-5xl mx-auto"
      >
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm shadow-sm mb-4"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
            ></span>
          </span>
          <span
            class="text-xs font-semibold text-slate-300 tracking-wide uppercase"
          >
            System Operational
          </span>
        </div>

        <!-- Headline -->
        <h2
          class="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight"
        >
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 pb-2"
          >
            Smart Monitoring Plant
          </span>
        </h2>

        <!-- Subheadline -->
        <p
          class="text-blue-100 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
        >
          Real-time plant performance & energy monitoring in a unified
          platform.
        </p>

        <!-- CTA -->
        <div class="pt-8">
          <button
            @click="router.push('/login')"
            class="group relative px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] border border-blue-500/50 flex items-center gap-3 mx-auto overflow-hidden"
          >
            <span class="relative z-10">Access Dashboard</span>
            <ArrowRight
              class="relative z-10 group-hover:translate-x-1 transition-transform"
              :size="20"
            />
            <div
              class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"
            ></div>
          </button>

          <p
            class="mt-6 text-xs text-blue-300 font-semibold tracking-wide uppercase"
          >
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="w-full py-8 mb-24 flex justify-center items-center text-xs text-slate-400 font-medium relative z-20"
    >
      © 2025 PT Indofood Fortuna Makmur. All rights reserved.
    </footer>
  </div>
</template>
