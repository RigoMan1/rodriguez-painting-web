<script setup lang="ts">
import { VGroupSymbol } from './VGroupMeta';
import { makeGroupItemProps, useGroupItem } from '../../composables/group';

defineOptions({ name: 'VItem' });
const props = defineProps(makeGroupItemProps());
defineEmits<{ 'group:selected': [boolean] }>();

const { isSelected, select, toggle, selectedClass, value, disabled, isFirst, isLast } =
  useGroupItem(props, VGroupSymbol);
</script>

<template>
  <slot
    :is-selected="isSelected"
    :selected-class="selectedClass"
    :select="select"
    :toggle="toggle"
    :value="value"
    :disabled="disabled"
    :is-first="isFirst"
    :is-last="isLast"
  />
</template>
