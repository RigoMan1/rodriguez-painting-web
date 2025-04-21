<script setup lang="ts">
import { inject } from 'vue';

// Composables
import {
  VExpansionPanelSymbol,
  makeVExpansionPanelHeaderProps,
} from './VExpansionPanelsMeta';

// Directives
import { Ripple as vRipple } from '../../directives/ripple';

defineOptions({ name: 'VExpansionPanelHeader' });

const props = defineProps(makeVExpansionPanelHeaderProps());

const expansionPanel = inject(VExpansionPanelSymbol);

if (!expansionPanel)
  throw new Error(
    '[SUI] v-expansion-panel-header needs to be placed inside v-expansion-panel'
  );
</script>

<template>
  <button
    v-ripple="props.ripple"
    type="button"
    :data-state="expansionPanel?.isSelected.value ? 'active' : undefined"
    class="v-expansion-panel-header"
    :class="{
      'v-expansion-panel-header--active': expansionPanel?.isSelected.value,
      'v-expansion-panel-header--focusable': props.focusable,
    }"
    :tabindex="expansionPanel?.disabled.value ? -1 : undefined"
    :aria-expanded="expansionPanel?.isSelected.value"
    :disabled="expansionPanel?.disabled.value"
    @click="!props.readonly ? expansionPanel?.toggle() : undefined"
  >
    <slot />
  </button>
</template>
