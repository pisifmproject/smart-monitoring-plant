<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{
  src?: string | null;            // contoh: "/Logo.jpg"
  size?: number | string;         // dipakai untuk mode "box"
  max?: number | string;          // dipakai untuk mode "intrinsic" (opsional)
  mode?: "box" | "intrinsic";     // NEW
  rounded?: boolean;
  glow?: boolean;
  alt?: string;
  fit?: "cover" | "contain";
}>(), {
  src: "/Logo.jpg",
  size: 44,
  max: 96,
  mode: "box",                    // default masih kotak
  rounded: true,
  glow: true,
  alt: "Brand logo",
  fit: "cover",
});

const toCssSize = (v: number | string) =>
  typeof v === "number" ? `${v}px` : v;

const boxSize = computed(() => toCssSize(props.size));
const maxSize = computed(() => toCssSize(props.max));

// base path aman
const base = (import.meta.env.BASE_URL ?? "/") as string;
const joinPath = (b: string, p: string) => {
  const bb = b.endsWith("/") ? b.slice(0, -1) : b;
  const pp = p.startsWith("/") ? p : `/${p}`;
  return `${bb}${pp}`;
};

const hasError = ref(false);
const resolvedSrc = computed(() => {
  if (hasError.value || !props.src) return "";
  if (/^https?:\/\//i.test(props.src)) return props.src;
  if (props.src.startsWith("/")) return joinPath(base, props.src);
  return props.src;
});
const onErr = () => { hasError.value = true; };
</script>

<template>
  <!-- MODE: BOX (persegi pakai size x size) -->
  <div v-if="mode === 'box'"
       class="inline-flex items-center justify-center"
       :style="{ width: boxSize, height: boxSize }">
    <img v-if="resolvedSrc"
         :src="resolvedSrc" :alt="alt"
         :class="[
           fit === 'contain' ? 'object-contain' : 'object-cover',
           rounded ? 'rounded-xl' : '',
           glow ? 'shadow-lg shadow-cyan-500/20' : ''
         ]"
         :style="{ width: '100%', height: '100%' }"
         draggable="false" @error="onErr" />
    <div v-else
         :class="[
           'bg-gradient-to-br from-cyan-400 to-blue-600',
           rounded ? 'rounded-xl' : '',
           glow ? 'shadow-lg shadow-cyan-500/20' : ''
         ]"
         :style="{ width: '100%', height: '100%' }" />
  </div>

  <!-- MODE: INTRINSIC (ikut ukuran asli gambar, dibatasi max) -->
  <div v-else
       class="inline-flex items-center justify-center">
    <img v-if="resolvedSrc"
         :src="resolvedSrc" :alt="alt"
         :class="[
           rounded ? 'rounded-xl' : '',
           glow ? 'shadow-lg shadow-cyan-500/20' : ''
         ]"
         :style="{
           maxWidth: maxSize,
           maxHeight: maxSize,
           height: 'auto',
           width: 'auto'
         }"
         draggable="false" @error="onErr" />
    <div v-else
         :class="[
           'bg-gradient-to-br from-cyan-400 to-blue-600',
           rounded ? 'rounded-xl' : '',
           glow ? 'shadow-lg shadow-cyan-500/20' : ''
         ]"
         :style="{ width: maxSize, height: maxSize }" />
  </div>
</template>
