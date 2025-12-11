<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
  >
    <div class="bg-white p-8 rounded-lg shadow-xl w-96">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">PISIFM</h1>
        <p class="text-gray-600">Monitoring System</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan password"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Login
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">
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
