<script setup lang="ts">
// Types
import { makeVNavigationDrawerProps } from './VNavigationDrawerMeta';

// Utilities
import { computed, nextTick, onBeforeMount, ref, shallowRef, toRef, watch } from 'vue' // prettier-ignore
import { toPhysical } from '../../util';
import { useRouter } from 'vue-router';

// Composables
import { useLayoutItem } from '../composables/layout';
import { useSticky } from './sticky';
import { useTouch } from './touch';

import { useHydration } from '../../composables/hydration';
import { useDisplay } from '../../composables/display';
import { useProxiedModel } from '../../composables/proxiedModel';
import { useScopeId } from '../../composables/scopeId';
import { useSsrBoot } from '../../composables/ssrBoot';
import { useToggleScope } from '../../composables/toggleScope';

defineOptions({ name: 'VNavigationDrawer', inheritAttrs: false });

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:rail': [value: boolean];
}>();

const props = defineProps(makeVNavigationDrawerProps());

const isRtl = ref(false);
const { mobile } = useDisplay(props);
const router = useRouter();
const isActive = useProxiedModel(props, 'modelValue', null, (v) => !!v);
const { ssrBootStyles } = useSsrBoot();
const isMounted = useHydration();
const { scopeId } = useScopeId();

const rootEl = ref<HTMLElement>();
const isHovering = shallowRef(false);

const width = computed(() => {
  return props.rail && props.expandOnHover && isHovering.value
    ? Number(props.width)
    : Number(props.rail ? props.railWidth : props.width);
});
const location = computed(() => {
  return toPhysical(props.location, isRtl.value) as 'left' | 'right' | 'bottom';
});
const isTemporary = computed(() => !props.permanent && (mobile.value || props.temporary));
const isSticky = computed(
  () => props.sticky && !isTemporary.value && location.value !== 'bottom'
);

useToggleScope(
  () => props.expandOnHover && props.rail != null,
  () => {
    watch(isHovering, (val) => emit('update:rail', !val));
  }
);

useToggleScope(
  () => !props.disableResizeWatcher,
  () => {
    watch(
      isTemporary,
      (val) => !props.permanent && nextTick(() => (isActive.value = !val))
    );
  }
);

useToggleScope(
  () => !props.disableRouteWatcher && !!router,
  () => {
    watch(router!.currentRoute, () => isTemporary.value && (isActive.value = false));
  }
);

watch(
  () => props.permanent,
  (val) => {
    if (val) isActive.value = true;
  }
);

onBeforeMount(() => {
  if (props.modelValue != null || isTemporary.value) return;

  isActive.value = props.permanent || !mobile.value;
});

const { isDragging, dragProgress, dragStyles } = useTouch({
  isActive,
  isTemporary,
  width,
  touchless: toRef(props, 'touchless'),
  position: location,
});

const layoutSize = computed(() => {
  const size = isTemporary.value
    ? 0
    : props.rail && props.expandOnHover
    ? Number(props.railWidth)
    : width.value;

  return isDragging.value ? size * dragProgress.value : size;
});

const { layoutItemStyles, layoutItemScrimStyles } = useLayoutItem({
  id: props.name,
  order: computed(() => parseInt(props.order, 10)),
  position: location,
  layoutSize,
  elementSize: width,
  active: computed(() => isActive.value || isDragging.value),
  disableTransitions: computed(() => isDragging.value),
  absolute: computed(
    () => props.absolute || (isSticky.value && typeof isStuck.value !== 'string')
  ),
});

const { isStuck, stickyStyles } = useSticky({
  rootEl,
  isSticky,
  layoutItemStyles,
});

const scrimStyles = computed(() => ({
  ...(isDragging.value
    ? {
        opacity: dragProgress.value * 0.2,
        transition: 'none',
      }
    : undefined),
  ...layoutItemScrimStyles.value,
}));

function onMouseenter() {
  isHovering.value = true;
}
function onMouseleave() {
  isHovering.value = false;
}
</script>

<template>
  <component
    :is="tag"
    v-if="isMounted"
    ref="rootEl"
    :class="[
      $attrs.class,
      'v-navigation-drawer',
      `v-navigation-drawer--${location}`,
      {
        'v-navigation-drawer--expand-on-hover': expandOnHover,
        'v-navigation-drawer--is-hovering': isHovering,
        'v-navigation-drawer--rail': rail,
        'v-navigation-drawer--temporary': isTemporary,
        'v-navigation-drawer--active': isActive,
        'v-navigation-drawer--sticky': isSticky,
      },
    ]"
    :style="[$attrs.style, layoutItemStyles, dragStyles, ssrBootStyles, stickyStyles]"
    v-bind="scopeId"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <div class="v-navigation-drawer__content">
      <slot />
    </div>
  </component>

  <Transition name="fade-transition">
    <div
      v-if="isTemporary && (isDragging || isActive) && !!scrim"
      class="v-navigation-drawer__scrim"
      :style="scrimStyles"
      :scopeId="scopeId"
      @click="isActive = false"
    />
  </Transition>
</template>
../composables/layout
