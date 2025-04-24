<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <span class="mb-2 block text-sm font-semibold uppercase tracking-widest text-primary-700">
    {{ label }}
  </span>
</template>

<!-- <script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="mb-2 flex items-center space-x-2">
    <span class="text-base  text-green-700  uppercase">
      {{ label }}
    </span>
    <span class="h-px max-w-16 flex-grow bg-green-700"></span>
  </div>
</template> -->
