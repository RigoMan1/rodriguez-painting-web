<script setup lang="ts">
// Composables
import { useResizeObserver } from '../../composables/resizeObserver';
import { VSlotMerge } from '../MergeSlot';

// Utilities
import { watch } from 'vue';

defineOptions({ name: 'VVirtualScrollItem', inheritAttrs: false });

const emit = defineEmits<{
  'update:height': [number];
}>();

const { resizeRef, contentRect } = useResizeObserver(undefined, 'border');

watch(
  () => contentRect.value?.height,
  (height) => {
    if (height != null) emit('update:height', height);
  }
);
</script>

<template>
  <VSlotMerge
    ref="resizeRef"
    v-bind="$attrs"
  >
    <slot />
  </VSlotMerge>
</template>
