<script setup lang="ts">
// Types
import { makeVAppProps } from './VAppMeta';

// Composables
import { createLayout } from '../composables/layout';

defineOptions({ name: 'VApp' });

const props = defineProps(makeVAppProps());

const { layoutClasses, layoutRef } = createLayout(props);
</script>

<template>
  <component
    :is="props.tag"
    ref="layoutRef"
    class="v-application"
    :class="layoutClasses"
  >
    <div class="v-application__wrap">
      <slot />
    </div>
  </component>
</template>
