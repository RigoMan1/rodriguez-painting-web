<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <div>
    <div
      class="w-full h-full relative overflow-hidden rounded border border-dashed border-gray-400 dark:border-gray-500 opacity-75"
    >
      <svg
        class="absolute inset-0 h-full w-full stroke-gray-900/10 dark:stroke-white/10"
        fill="none"
      >
        <defs>
          <pattern
            id="pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
          </pattern>
        </defs>
        <rect
          stroke="none"
          fill="url(#pattern-5c1e4f0e-62d5-498b-8ff0-cf77bb448c8e)"
          width="100%"
          height="100%"
        />
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-size="12"
          fill="currentColor"
        >
          {{ label }}
        </text>
      </svg>
    </div>
  </div>
</template>
