<script setup lang="ts">
// Components
import { VExpandTransition } from '../../components-transitions';

// Composables
import { useLazy } from '../../composables/lazy';
import {
  makeVExpansionPanelContentProps,
  VExpansionPanelSymbol,
} from './VExpansionPanelsMeta';

// Utilities
import { inject } from 'vue';

defineOptions({ name: 'VExpansionPanelContent', inheritAttrs: false });
const props = defineProps(makeVExpansionPanelContentProps());

const expansionPanel = inject(VExpansionPanelSymbol);

if (!expansionPanel)
  throw new Error(
    '[SUI] v-expansion-panel-text needs to be placed inside v-expansion-panel'
  );

const { hasContent, onAfterLeave } = useLazy(props, expansionPanel.isSelected);
</script>

<template>
  <VExpandTransition @after-leave="onAfterLeave">
    <div
      v-show="expansionPanel?.isSelected.value"
      class="v-expansion-panel-content"
    >
      <template v-if="$slots.default && hasContent">
        <div
          v-bind="$attrs"
          class="v-expansion-panel-content__wrapper"
        >
          <slot />
        </div>
      </template>
    </div>
  </VExpandTransition>
</template>
