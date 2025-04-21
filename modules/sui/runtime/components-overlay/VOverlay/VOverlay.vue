<script setup lang="ts">
// Composables
import { useLocationStrategies } from '../composables/locationStrategies';
import { useScrollStrategies } from '../composables/scrollStrategies';
import { useActivator } from '../composables/useActivator';
import { useBackButton } from '../composables/useBackButton';

import { useDimension } from '../../composables/dimensions';
import { useHydration } from '../../composables/hydration';
import { useLazy } from '../../composables/lazy';
import { useProxiedModel } from '../../composables/proxiedModel';
import { useScopeId } from '../../composables/scopeId';
import { useStack } from '../../composables/stack';
import { useTeleport } from '../../composables/teleport';
import { useToggleScope } from '../../composables/toggleScope';
import { MaybeTransition } from '../../composables/transition';
// import { useRtl } from '../composables/locale'

// Directives
import { ClickOutside as vClickOutside } from '../../directives/click-outside';

// Utilities
import { computed, mergeProps, onBeforeUnmount, ref, toRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  animate,
  convertToUnit,
  getScrollParent,
  IN_BROWSER,
  standardEasing,
} from '../../util';

import { makeVOverlayProps } from './VOverlayMeta';

defineOptions({ name: 'VOverlay', inheritAttrs: false });

const emit = defineEmits<{
  'click:outside': [MouseEvent];
  'update:modelValue': [boolean];
  afterLeave: [];
}>();

const props = defineProps(makeVOverlayProps());

// * --- SETUP ---

const model = useProxiedModel(props, 'modelValue');
const isActive = computed({
  get: () => model.value,
  set: (v) => {
    if (!(v && props.disabled)) model.value = v;
  },
});
const { teleportTarget } = useTeleport(computed(() => props.attach || props.contained));

const isRtl = ref(false);
const { hasContent, onAfterLeave: _onAfterLeave } = useLazy(props, isActive);

const { globalTop, localTop, stackStyles } = useStack(
  isActive,
  toRef(props, 'zIndex'),
  props._disableGlobalStack
);
const {
  activatorEl,
  activatorRef,
  target,
  targetEl,
  targetRef,
  activatorEvents,
  contentEvents,
  scrimEvents,
} = useActivator(props, { isActive, isTop: localTop });
const { dimensionStyles } = useDimension(props);
const isMounted = useHydration();
const { scopeId } = useScopeId();

watch(
  () => props.disabled,
  (v) => {
    if (v) isActive.value = false;
  }
);

const root = ref<HTMLElement>();
const contentEl = ref<HTMLElement>();
const { contentStyles, updateLocation } = useLocationStrategies(props, {
  isRtl,
  contentEl,
  target,
  isActive,
});
useScrollStrategies(props, {
  root,
  contentEl,
  targetEl,
  isActive,
  updateLocation,
});

function onClickOutside(e: MouseEvent) {
  emit('click:outside', e);

  if (!props.persistent) isActive.value = false;
  else animateClick();
}

function closeConditional() {
  return isActive.value && globalTop.value;
}

if (IN_BROWSER) {
  watch(
    isActive,
    (val) => {
      if (val) {
        window.addEventListener('keydown', onKeydown);
      } else {
        window.removeEventListener('keydown', onKeydown);
      }
    },
    { immediate: true }
  );
}

onBeforeUnmount(() => {
  if (!IN_BROWSER) return;

  window.removeEventListener('keydown', onKeydown);
});

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && globalTop.value) {
    if (!props.persistent) {
      isActive.value = false;
      if (contentEl.value?.contains(document.activeElement)) {
        activatorEl.value?.focus();
      }
    } else animateClick();
  }
}

const router = useRouter();
useToggleScope(
  () => props.closeOnBack,
  () => {
    useBackButton(router, (next) => {
      if (globalTop.value && isActive.value) {
        next(false);
        if (!props.persistent) isActive.value = false;
        else animateClick();
      } else {
        next();
      }
    });
  }
);

const top = ref<number>();
watch(
  () =>
    isActive.value && (props.absolute || props.contained) && teleportTarget.value == null,
  (val) => {
    if (val) {
      const scrollParent = getScrollParent(root.value);
      if (scrollParent && scrollParent !== document.scrollingElement) {
        top.value = scrollParent.scrollTop;
      }
    }
  }
);

// Add a quick "bounce" animation to the content
function animateClick() {
  if (props.noClickAnimation) return;

  if (contentEl.value) {
    animate(
      contentEl.value,
      [
        { transformOrigin: 'center' },
        { transform: 'scale(1.03)' },
        { transformOrigin: 'center' },
      ],
      {
        duration: 150,
        easing: standardEasing,
      }
    );
  }
}

function onAfterLeave() {
  _onAfterLeave();
  emit('afterLeave');
}

defineExpose({
  isActive,
  contentEl,
  globalTop,
  activatorEl,
});
</script>

<template>
  <slot
    name="activator"
    :is-active="isActive"
    :props="
      mergeProps(
        {
          ref: activatorRef,
          targetRef,
        },
        activatorEvents,
        props.activatorProps
      )
    "
  />

  <Teleport
    v-if="isMounted && hasContent"
    :disabled="!teleportTarget"
    :to="teleportTarget"
  >
    <div
      ref="root"
      class="v-overlay"
      :class="[
        {
          'v-overlay--absolute': props.absolute || props.contained,
          'v-overlay--active': isActive,
          'v-overlay--contained': props.contained,
        },
        props.bem.root,
      ]"
      :style="[stackStyles, { top: convertToUnit(top) }]"
      v-bind="{ ...scopeId, ...$attrs }"
    >
      <v-scrim
        :class="props.bem.scrim"
        :model-value="isActive && !!props.scrim"
        v-bind="scrimEvents"
      />
      <maybe-transition
        appear
        persisted
        :transition="props.transition"
        :target="activatorEl"
        :on-after-leave="
          () => {
            onAfterLeave();
            emit('afterLeave');
          }
        "
      >
        <div
          v-show="isActive"
          ref="contentEl"
          v-click-outside="{
            handler: onClickOutside,
            closeConditional,
            include: () => [activatorEl],
          }"
          class="v-overlay__content"
          :class="props.bem.content"
          :style="[dimensionStyles, contentStyles]"
          v-bind="{
            ...contentEvents,
          }"
        >
          <slot
            :is-active="isActive"
            :close="() => (isActive = false)"
          />
        </div>
      </maybe-transition>
    </div>
  </Teleport>
</template>
