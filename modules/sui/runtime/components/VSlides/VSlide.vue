<script setup lang="ts">
// Composables
import { useGroupItem } from '../../composables/group';
import { useLazy } from '../../composables/lazy';
import { useSsrBoot } from '../../composables/ssrBoot';
import { MaybeTransition } from '../../composables/transition';
import { makeVSlideProps, VSlidesGroupSymbol, VSlidesSymbol } from './VSlidesMeta';

// Utilities
import { computed, inject, nextTick, shallowRef } from 'vue';
import { convertToUnit } from '../../util';

defineOptions({ name: 'VSlide' });
const props = defineProps(makeVSlideProps());
defineEmits<{
  'group:selected': [boolean];
}>();

const slide = inject(VSlidesSymbol);
const groupItem = useGroupItem(props, VSlidesGroupSymbol);
const { isBooted } = useSsrBoot();

if (!slide || !groupItem) throw new Error('[SUI] VSlide must be used inside VSlides');

const isTransitioning = shallowRef(false);
const hasTransition = computed(
  () =>
    isBooted.value &&
    (slide.isReversed.value
      ? props.reverseTransition !== false
      : props.transition !== false)
);

function onAfterTransition() {
  if (!isTransitioning.value || !slide) {
    return;
  }

  // Finalize transition state.
  isTransitioning.value = false;
  if (slide.transitionCount.value > 0) {
    slide.transitionCount.value -= 1;

    // Remove container height if we are out of transition.
    if (slide.transitionCount.value === 0) {
      slide.transitionHeight.value = undefined;
    }
  }
}

function onBeforeTransition() {
  if (isTransitioning.value || !slide) {
    return;
  }

  // Initialize transition state here.
  isTransitioning.value = true;

  if (slide.transitionCount.value === 0) {
    // Set initial height for height transition.
    slide.transitionHeight.value = convertToUnit(slide.rootRef.value?.clientHeight);
  }

  slide.transitionCount.value += 1;
}

function onTransitionCancelled() {
  onAfterTransition(); // This should have the same path as normal transition end.
}

function onEnterTransition(el: Element) {
  if (!isTransitioning.value) {
    return;
  }

  nextTick(() => {
    // Do not set height if no transition or cancelled.
    if (!hasTransition.value || !isTransitioning.value || !slide) {
      return;
    }

    // Set transition target height.
    slide.transitionHeight.value = convertToUnit(el.clientHeight);
  });
}

const transition = computed(() => {
  const name = slide.isReversed.value ? props.reverseTransition : props.transition;

  return !hasTransition.value
    ? false
    : {
        name: typeof name !== 'string' ? slide.transition.value : name,
        onBeforeEnter: onBeforeTransition,
        onAfterEnter: onAfterTransition,
        onEnterCancelled: onTransitionCancelled,
        onBeforeLeave: onBeforeTransition,
        onAfterLeave: onAfterTransition,
        onLeaveCancelled: onTransitionCancelled,
        onEnter: onEnterTransition,
      };
});

const { hasContent } = useLazy(props, groupItem.isSelected);
</script>

<template>
  <MaybeTransition
    :transition="transition"
    :disabled="!isBooted"
  >
    <div
      v-show="groupItem.isSelected.value"
      class="v-slide"
      :class="[groupItem.selectedClass.value]"
    >
      <slot v-if="hasContent" />
    </div>
  </MaybeTransition>
</template>
