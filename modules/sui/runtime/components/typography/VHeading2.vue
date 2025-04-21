<script setup lang="ts">
import { makeComponentProps } from '../../composables/component';

defineProps({ ...makeComponentProps({ tag: 'h2' }) });
</script>

<template>
  <component
    :is="tag"
    class="v-heading v-heading-2"
  >
    <slot />
  </component>
</template>
