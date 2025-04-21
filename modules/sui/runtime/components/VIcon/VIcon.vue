<script setup lang="ts">
import { computed, Text, useSlots } from 'vue';
import { useSize } from '../../composables/bem/size';
import { flattenFragments } from '../../util';
import { makeVIconProps } from './VIconMeta';

defineOptions({ name: 'VIcon' });

const props = defineProps(makeVIconProps());

const { sizeClasses, sizeStyles } = useSize(props);

const slots = useSlots();

const icon = computed(() => {
  const slot = slots.default?.();
  if (!slot) return props.name;

  const textNode = flattenFragments(slot).filter(
    (node) => node.type === Text && node.children && typeof node.children === 'string'
  )[0]?.children as string;

  return textNode || props.name;
});
</script>

<template>
  <component
    :is="props.tag"
    class="v-icon"
    :class="[icon, sizeClasses]"
    :style="sizeStyles"
  />
</template>
