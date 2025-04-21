<script setup lang="ts">
import { makeComponentProps } from '../../composables/component';

defineProps({ ...makeComponentProps({ tag: 'h3' }) });
</script>

<template>
  <component
    :is="tag"
    class="v-heading v-heading-3"
  >
    <slot />
  </component>
</template>
