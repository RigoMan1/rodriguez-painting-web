<script setup lang="ts">
// Composables
import { useGroupItem } from '../../composables/group';
import { makeVExpansionPanelProps, VExpansionPanelSymbol } from './VExpansionPanelsMeta';

// Utilities
import { provide } from 'vue';

defineOptions({ name: 'VExpansionPanel' });

const props = defineProps(makeVExpansionPanelProps());

defineEmits<{
  'group:selected': [boolean];
}>();

const groupItem = useGroupItem(props, VExpansionPanelSymbol);

provide(VExpansionPanelSymbol, groupItem);
</script>

<template>
  <component
    :is="tag"
    class="v-expansion-panel"
  >
    <slot
      :disabled="groupItem.disabled.value"
      :expanded="groupItem.isSelected.value"
      :readonly="readonly"
    />
  </component>
</template>
