<script setup lang="ts">
// Utilities
import { computed, shallowRef, toRef } from 'vue';
import { convertToUnit } from '../../util';

// Composables
import { useLayoutItem } from '../composables/layout';
import { makeVFooterProps } from './VFooterMeta';

import { useResizeObserver } from '../../composables/resizeObserver';

defineOptions({ name: 'VFooter' });

const props = defineProps(makeVFooterProps());

const autoHeight = shallowRef(32);
const { resizeRef } = useResizeObserver((entries) => {
  if (!entries.length) return;
  autoHeight.value = entries[0].target.clientHeight;
});

const height = computed(() =>
  props.height === 'auto' ? autoHeight.value : parseInt(props.height, 10)
);

const { layoutItemStyles } = useLayoutItem({
  id: props.name,
  order: computed(() => parseInt(props.order, 10)),
  position: computed(() => 'bottom'),
  layoutSize: height,
  elementSize: computed(() => (props.height === 'auto' ? undefined : height.value)),
  active: computed(() => props.app),
  absolute: toRef(props, 'absolute'),
});
</script>

<template>
  <component
    :is="props.tag"
    ref="resizeRef"
    class="v-footer"
    :style="[props.app ? layoutItemStyles : { height: convertToUnit(props.height) }]"
  >
    <slot />
  </component>
</template>
