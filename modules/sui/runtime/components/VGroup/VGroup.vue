<script setup lang="ts">
import { useGroup } from '../../composables/group';
import { makeVGroupProps, VGroupSymbol } from './VGroupMeta';

defineOptions({ name: 'VGroup' });
defineEmits<{ 'update:modelValue': any }>();
const props = defineProps(makeVGroupProps());

const { isSelected, select, next, prev, selected } = useGroup(props, VGroupSymbol);
</script>

<template>
  <component :is="props.tag">
    <slot
      :is-selected="isSelected"
      :select="select"
      :next="next"
      :prev="prev"
      :selected="selected"
    />
  </component>
</template>
