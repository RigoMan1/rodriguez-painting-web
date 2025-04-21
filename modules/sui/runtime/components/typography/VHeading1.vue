<script setup lang="ts">
import { makeComponentProps } from '../../composables/component';

defineProps({ ...makeComponentProps({ tag: 'h1' }) });
</script>

<template>
  <component
    :is="tag"
    class="v-heading v-heading-1"
  >
    <slot />
  </component>
</template>
