<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
  >
    <div
      class="bg-slate-900 border border-slate-700 p-8 rounded-lg shadow-2xl w-96"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-100 mb-2">PISIFM</h1>
        <p class="text-slate-400">Monitoring System</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 bg-slate-800 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
            placeholder="Masukkan password"
          />
        </div>

        <div
          v-if="error"
          class="text-red-400 text-sm text-center bg-red-950/50 border border-red-800 rounded-lg py-2"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all font-medium shadow-lg shadow-blue-900/50"
        >
          Login
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-slate-700">
        <p class="text-xs text-slate-500 text-center">
          Gunakan akun Tamu untuk akses terbatas atau User untuk akses penuh
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../stores/auth";

const router = useRouter();
const { login } = useAuth();

const username = ref("");
const password = ref("");
const error = ref("");

function handleLogin() {
  error.value = "";

  if (login(username.value, password.value)) {
    router.push("/app/summary");
  } else {
    error.value = "Username atau password salah";
    password.value = "";
  }
}
</script>
