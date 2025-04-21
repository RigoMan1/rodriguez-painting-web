<script setup lang="ts">
// Composables
// import { useRtl } from '../../composables/locale';
import { useFocus } from '../../composables/focus';
import { makeVFieldProps } from './VFieldMeta';
import type { DefaultInputSlot } from './VFieldMeta';

// Utilities
import { computed, ref, useSlots } from 'vue';
import { getUid } from '../../util';

defineOptions({ name: 'VField', inheritAttrs: true });
defineEmits<{
  'update:focused': [boolean];
  'update:modelValue': [any];
}>();
const props = defineProps(makeVFieldProps());

const { focusClasses, isFocused, focus, blur } = useFocus(props);
// const { rtlClasses } = useRtl();

const isActive = computed(() => props.dirty || props.active);

const uid = getUid();
const id = computed(() => props.id || `input-${uid}`);
const messagesId = computed(() => `${id.value}-messages`);

const controlRef = ref<HTMLElement>();

const slotProps = computed<DefaultInputSlot>(() => ({
  isActive,
  isFocused,
  controlRef,
  blur,
  focus,
}));

function onClick(e: MouseEvent) {
  if (e.target !== document.activeElement) {
    e.preventDefault();
  }
}

const slots = useSlots();
const hasPrepend = computed(() => !!(slots['prepend-inner'] || props.prependInnerIcon));
const hasAppend = computed(() => !!(slots['append-inner'] || props.appendInnerIcon));
</script>

<template>
  <div
    class="v-field"
    :class="[
      {
        'v-field--active': isActive,
        'v-field--disabled': props.disabled,
        'v-field--dirty': props.dirty,
        'v-field--error': props.error,
        'v-field--reverse': props.reverse,
      },
      focusClasses.value,
      // rtlClasses.value,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <!-- prepend -->
    <template v-if="hasPrepend">
      <div
        key="prepend"
        class="v-field__prepend-inner"
      >
        <v-icon
          v-if="props.prependInnerIcon"
          key="prepend-icon"
          :name="prependInnerIcon"
          size="none"
        />

        <slot
          name="prepend-inner"
          :slot-props="slotProps"
        />
      </div>
    </template>

    <!-- default -->

    <slot
      v-bind="{
        ...slotProps,
        props: {
          id,
          class: 'v-field__input',
          'aria-describedby': messagesId,
        },
        focus,
        blur,
      }"
    />

    <!-- append -->
    <template v-if="hasAppend">
      <div
        key="append"
        class="v-field__append-inner"
      >
        <v-icon
          v-if="props.appendInnerIcon"
          key="append-icon"
          :name="appendInnerIcon"
          size="none"
        />

        <slot
          name="append-inner"
          :slot-props="slotProps"
        />
      </div>
    </template>
  </div>
</template>
