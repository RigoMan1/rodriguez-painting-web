<script setup lang="ts">
// Components
import VOverlay from '../../components-overlay/VOverlay/VOverlay.vue';

// Composables
import { forwardRefs } from '../../composables/forwardRefs';
import { useProxiedModel } from '../../composables/proxiedModel';
import { useScopeId } from '../../composables/scopeId';
import { makeVDialogProps } from './VDialogMeta';

// Utilities
import { computed, mergeProps, nextTick, ref, watch } from 'vue';
import { focusableChildren, IN_BROWSER } from '../../util';

defineOptions({ name: 'VDialog' });
defineEmits<{ 'update:modelValue': [boolean] }>();
const props = defineProps(makeVDialogProps());

const isActive = useProxiedModel(props, 'modelValue');
const { scopeId } = useScopeId();

const overlay = ref<InstanceType<typeof VOverlay>>();
function onFocusin(e: FocusEvent) {
  const before = e.relatedTarget as HTMLElement | null;
  const after = e.target as HTMLElement | null;

  if (
    before !== after &&
    overlay.value?.contentEl &&
    // We're the topmost dialog
    overlay.value?.globalTop &&
    // It isn't the document or the dialog body
    ![document, overlay.value.contentEl].includes(after!) &&
    // It isn't inside the dialog body
    !overlay.value.contentEl.contains(after)
  ) {
    const focusable = focusableChildren(overlay.value.contentEl);

    if (!focusable.length) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (before === firstElement) {
      lastElement.focus();
    } else {
      firstElement.focus();
    }
  }
}

if (IN_BROWSER) {
  watch(
    () => isActive.value && props.retainFocus,
    (val) => {
      val
        ? document.addEventListener('focusin', onFocusin)
        : document.removeEventListener('focusin', onFocusin);
    },
    { immediate: true }
  );
}

watch(isActive, async (val) => {
  await nextTick();
  if (val) {
    overlay.value!.contentEl?.focus({ preventScroll: true });
  } else {
    overlay.value!.activatorEl?.focus({ preventScroll: true });
  }
});

const activatorPropsExtended = computed(() =>
  mergeProps(
    {
      'aria-haspopup': 'dialog',
      'aria-expanded': String(isActive.value),
    },
    props.activatorProps
  )
);

const {
  fullscreen,
  retainFocus,
  scrollable,
  modelValue,
  activatorProps,
  ...overlayProps
} = props;

const overlayRefs = forwardRefs({}, overlay);
</script>

<template>
  <v-overlay
    ref="overlay"
    v-model="isActive"
    role="dialog"
    aria-modal="true"
    class="v-dialog"
    :class="{
      'v-dialog--fullscreen': props.fullscreen,
      'v-dialog--scrollable': props.scrollable,
    }"
    :activator-props="activatorPropsExtended"
    v-bind="{
      ...overlayProps,
      ...scopeId,
    }"
  >
    <template #activator="slotProps">
      <slot
        name="activator"
        v-bind="slotProps"
      />
    </template>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </v-overlay>
</template>
