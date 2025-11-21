<!-- frontend/src/views/landing.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Modal states
const showPasswordModal = ref(false);
const password = ref("");
const errorMsg = ref("");

// buka modal ketika tombol MASUK diklik
function openPasswordModal() {
  showPasswordModal.value = true;
  password.value = "";
  errorMsg.value = "";
}

// tutup modal
function closePasswordModal() {
  showPasswordModal.value = false;
}

// cek password
function submitPassword() {
  if (password.value === "pisifm00") {
    showPasswordModal.value = false;
    router.push("/app/lvmdp1"); // arahkan seperti sebelumnya
  } else {
    errorMsg.value = "Eitsss...Password salah!!!";
  }
}
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
          <div class="mb-8 flex justify-center animate-fade-in">
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-20"
              />
            </div>
          </div>

          <h1
            class="text-5xl md:text-7xl font-bold leading-tight mb-4 animate-fade-in-delayed-1"
          >
            <span class="block mb-2">Project</span>
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500"
              >Information System</span
            ><br />
            <span class="text-lg md:text-2xl font-medium text-slate-300 mt-4">
              for Indofood Fortuna Makmur
            </span>
          </h1>

          <p
            class="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-delayed-2"
          ></p>

          <!-- CTA Button -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-delayed-3"
          >
            <button
              @click="openPasswordModal"
              class="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/60 hover:scale-105"
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
            </button>
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

    <!-- Password Modal -->
    <div
      v-if="showPasswordModal"
      class="pw-backdrop"
      @click="closePasswordModal"
    >
      <div class="pw-modal" @click.stop>
        <h3 class="pw-title">Masukkan Password</h3>

        <input
          v-model="password"
          type="password"
          class="pw-input"
          placeholder="Password"
          @keyup.enter="submitPassword"
        />

        <p v-if="errorMsg" class="pw-error">
          {{ errorMsg }}
        </p>

        <div class="pw-actions">
          <button class="pw-btn pw-btn-secondary" @click="closePasswordModal">
            Batal
          </button>
          <button class="pw-btn pw-btn-primary" @click="submitPassword">
            Masuk
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === Animations === */
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

/* === Password Modal === */
.pw-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.pw-modal {
  background: #0f172a;
  color: #e5e7eb;
  padding: 24px 20px;
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.pw-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.pw-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #475569;
  background: #020617;
  color: #e5e7eb;
  font-size: 0.95rem;
  outline: none;
}

.pw-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 1px rgba(14, 165, 233, 0.5);
}

.pw-error {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #fecaca;
}

.pw-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.pw-btn {
  padding: 8px 14px;
  font-size: 0.9rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s ease;
}

.pw-btn-primary {
  background: #0ea5e9;
  color: white;
}

.pw-btn-primary:hover {
  background: #0284c7;
}

.pw-btn-secondary {
  background: transparent;
  color: #e5e7eb;
  border: 1px solid #64748b;
}

.pw-btn-secondary:hover {
  background: rgba(148, 163, 184, 0.12);
}
</style>
