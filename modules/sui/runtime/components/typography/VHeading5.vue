<script setup lang="ts">
import { makeComponentProps } from '../../composables/component';

defineProps({ ...makeComponentProps({ tag: 'h5' }) });
</script>

<template>
  <component
    :is="tag"
    class="v-heading v-heading-5"
  >
    <slot />
  </component>
</template>
