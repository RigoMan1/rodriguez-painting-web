<script setup lang="ts">
import { makeComponentProps } from '../../composables/component';

defineProps({ ...makeComponentProps({ tag: 'h6' }) });
</script>

<template>
  <component
    :is="tag"
    class="v-heading v-heading-6"
  >
    <slot />
  </component>
</template>
