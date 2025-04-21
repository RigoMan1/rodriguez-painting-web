<script setup lang="ts">
// Utilities
import { computed, toRef, ref, shallowRef, watchEffect } from 'vue';
import { convertToUnit } from '../../util';

// Composables
import { useLayoutItem } from '../composables/layout';
import { useScroll } from '../composables/scroll';
import { makeVAppBarProps } from './VAppBarMeta';

import { useProxiedModel } from '../../composables/proxiedModel';
import { useSsrBoot } from '../../composables/ssrBoot';
import { useToggleScope } from '../../composables/toggleScope';

const props = defineProps(makeVAppBarProps());

defineEmits<{ 'update:modelValue': [value: boolean] }>();

defineOptions({
  name: 'VAppBar',
});

const vToolbarRef = ref<any>();
const isActive = useProxiedModel(props, 'modelValue');
const scrollBehavior = computed(() => {
  const behavior = new Set(props.scrollBehavior?.split(' ') ?? []);
  return {
    hide: behavior.has('hide'),
    fade: behavior.has('fade'),
    inverted: behavior.has('inverted'),
    custom: behavior.has('custom'),
  };
});

const canScroll = computed(() => {
  const behavior = scrollBehavior.value;
  return (
    behavior.hide ||
    behavior.inverted ||
    behavior.fade ||
    behavior.custom ||
    !isActive.value
  );
});

const { currentScroll, scrollThreshold, isScrollingUp, scrollRatio } = useScroll(props, {
  canScroll,
});

const opacity = computed(() =>
  scrollBehavior.value.fade
    ? scrollBehavior.value.inverted
      ? 1 - scrollRatio.value
      : scrollRatio.value
    : undefined
);

const heightCalculated = computed(() => {
  if (scrollBehavior.value.hide && scrollBehavior.value.inverted) return 0;

  return convertToUnit(props.height) || '64px';
});

const thresholdExceeded = ref(false);
useToggleScope(
  computed(() => !!props.scrollBehavior),
  () => {
    watchEffect(() => {
      if (scrollBehavior.value) {
        thresholdExceeded.value = currentScroll.value > scrollThreshold.value;
      }

      if (scrollBehavior.value.hide) {
        if (scrollBehavior.value.inverted) {
          isActive.value = currentScroll.value > scrollThreshold.value;
        } else {
          isActive.value =
            isScrollingUp.value || currentScroll.value < scrollThreshold.value;
        }
      } else {
        isActive.value = true;
      }
    });
  }
);

const { ssrBootStyles } = useSsrBoot();
const { layoutItemStyles } = useLayoutItem({
  id: props.name,
  order: computed(() =>
    typeof props.order === 'string' ? parseInt(props.order) : props.order
  ),
  position: toRef(props, 'location'),
  layoutSize: heightCalculated,
  elementSize: shallowRef(undefined),
  active: isActive,
  absolute: toRef(props, 'absolute'),
});
</script>

<template>
  <component
    :is="props.tag"
    ref="vToolbarRef"
    class="v-app-bar"
    :style="[
      {
        ...layoutItemStyles,
        '--v-app-bar-opacity': opacity,
        height: heightCalculated,
        ...ssrBootStyles,
      },
    ]"
    :scroll-behavior="scrollBehavior"
    :model-value="isActive"
  >
    <slot
      :scroll-data="{
        currentScroll,
        scrollThreshold,
        isScrollingUp,
        scrollRatio,
        opacity,
        thresholdExceeded,
      }"
    />
  </component>
</template>
../composables/layout../composables/scroll
