<script setup lang="ts">
import { makeComponentProps } from '../../composables/component';

defineProps({ ...makeComponentProps({ tag: 'h4' }) });
</script>

<template>
  <component
    :is="tag"
    class="v-heading v-heading-4"
  >
    <slot />
  </component>
</template>
