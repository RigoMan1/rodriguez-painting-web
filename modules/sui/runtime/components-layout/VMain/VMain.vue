<script setup lang="ts">
// Composables
import { makeVMainProps } from './VMainMeta';
import { useLayout } from '../composables/layout';

import { useSsrBoot } from '../../composables/ssrBoot';

defineOptions({ name: 'VMain' });

const props = defineProps(makeVMainProps());

const { mainStyles } = useLayout();
const { ssrBootStyles } = useSsrBoot();
</script>

<template>
  <component
    :is="props.tag"
    class="v-main"
    :class="{ 'v-main--scrollable': props.scrollable }"
    :style="[mainStyles, ssrBootStyles]"
  >
    <div
      v-if="props.scrollable"
      class="v-main__scroller"
    >
      <slot />
    </div>
    <slot v-else />
  </component>
</template>
