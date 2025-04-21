<script setup lang="ts">
// Composables
import { useGroup } from '../../composables/group';
import { makeVSlidesProps, VSlidesSymbol, VSlidesGroupSymbol } from './VSlidesMeta';

// Directives
import { Touch as vTouch } from '../../directives/touch';

// Utilities
import { computed, provide, ref, shallowRef, watch } from 'vue';

// Types
import type { ComputedRef } from 'vue';
import type { GroupProvide } from '../../composables/group';
import type { TouchHandlers } from '../../directives/touch';

defineOptions({ name: 'VSlides' });
const props = defineProps(makeVSlidesProps());
defineEmits<{ 'update:modelValue': [boolean] }>();
const isRtl = ref(false);

const group = useGroup(props, VSlidesGroupSymbol);

const rootRef = ref();
const isRtlReverse = computed(() => (isRtl.value ? !props.reverse : props.reverse));
const isReversed = shallowRef(false);
const transition = computed(() => {
  const axis = props.direction === 'vertical' ? 'y' : 'x';
  const reverse = isRtlReverse.value ? !isReversed.value : isReversed.value;
  const direction = reverse ? '-reverse' : '';

  return `v-slides-${axis}${direction}-transition`;
});
const transitionCount = shallowRef(0);
const transitionHeight = ref<undefined | string>(undefined);

const activeIndex = computed(() => {
  return group.items.value.findIndex((item) => group.selected.value.includes(item.id));
});

watch(activeIndex, (newVal, oldVal) => {
  const itemsLength = group.items.value.length;
  const lastIndex = itemsLength - 1;

  if (itemsLength <= 2) {
    isReversed.value = newVal < oldVal;
  } else if (newVal === lastIndex && oldVal === 0) {
    isReversed.value = true;
  } else if (newVal === 0 && oldVal === lastIndex) {
    isReversed.value = false;
  } else {
    isReversed.value = newVal < oldVal;
  }
});

provide(VSlidesSymbol, {
  transition,
  isReversed,
  transitionCount,
  transitionHeight,
  rootRef,
});

const canMoveBack = computed(() => props.continuous || activeIndex.value !== 0);
const canMoveForward = computed(
  () => props.continuous || activeIndex.value !== group.items.value.length - 1
);

function prev() {
  if (canMoveBack.value) group.prev();
}

function next() {
  if (canMoveForward.value) group.next();
}

const touchOptions = computed(() => {
  if (props.touch === false) return props.touch;

  const options: TouchHandlers = {
    left: () => {
      return isRtlReverse.value ? prev() : next();
    },
    right: () => {
      return isRtlReverse.value ? next() : prev();
    },
    start: ({ originalEvent }) => {
      originalEvent.stopPropagation();
    },
  };

  return {
    ...options,
    ...(props.touch === true ? {} : props.touch),
  };
});

const prevProps = {
  class: `v-slides__${isRtlReverse.value ? 'right' : 'left'}`,
  onClick: prev,
};

const nextProps = {
  class: `v-slides__${isRtlReverse.value ? 'left' : 'right'}`,
  onClick: next,
};

export interface VSlideControls {
  prev: () => void;
  next: () => void;
  canMoveBack: ComputedRef<boolean>;
  canMoveForward: ComputedRef<boolean>;
  group: GroupProvide;
}

defineExpose({ prev, next, canMoveBack, canMoveForward, group });
</script>

<template>
  <component
    :is="tag"
    v-bind="$attrs"
    ref="rootRef"
    v-touch="touchOptions"
    class="v-slides"
  >
    <div class="v-slides__container">
      <slot
        :group="group"
        :prev="prevProps.onClick"
        :next="nextProps.onClick"
        :can-move-back="canMoveBack"
        :can-move-forward="canMoveForward"
      />
    </div>
  </component>
</template>
