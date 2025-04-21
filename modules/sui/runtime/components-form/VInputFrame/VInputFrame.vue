<script setup lang="ts">
// Composables
import { makeVInputFrameProps } from './VInputFrameMeta';

// Utilities
import { computed, useSlots } from 'vue';
import { getUid, wrapInArray } from '../../util';

// Types
import type { ComputedRef } from 'vue';

export interface VInputFrameSlot {
  id: ComputedRef<string>;
  messagesId: ComputedRef<string>;
  isDisabled: boolean | null;
  isReadonly: boolean | null;
  isValid: boolean | null;
}

defineOptions({ name: 'VInputFrame' });

const props = defineProps(makeVInputFrameProps());

defineEmits<{
  'update:modelValue': [boolean];
}>();

const uid = getUid();
const id = computed(() => props.id || `input-${uid}`);
const messagesId = computed(() => `${id.value}-messages`);

const slotProps = computed<VInputFrameSlot>(() => ({
  id,
  messagesId,
  isDisabled: props.disabled,
  isReadonly: props.readonly,
  isValid: !props.error,
}));

const hasErrors = computed(() => props.errorMessages?.length);

const errorMessages = computed(() => {
  return props.errorMessages?.length
    ? wrapInArray(props.errorMessages).slice(0, Math.max(0, +props.maxErrors))
    : [];
});

const messages = computed(() => {
  if (hasErrors.value) {
    return errorMessages.value;
  } else if (props.hint && (props.persistentHint || props.focused)) {
    return wrapInArray(props.hint);
  } else {
    return props.messages;
  }
});

const slots = useSlots();
const hasLabel = computed(() => !!slots.label || props.label);
const hasPrepend = computed(() => !!slots.prepend || props.prependIcon);
const hasAppend = computed(() => !!slots.append || props.appendIcon);
const hasMessages = computed(() => messages.value.length > 0);
const hasDetails = computed(
  () =>
    !props.hideDetails ||
    (props.hideDetails === 'auto' && (hasMessages.value || !!slots.details))
);
</script>

<template>
  <div
    class="v-input-frame"
    :class="[
      `v-input-frame--${props.direction}`,
      {
        'v-input-frame--error': hasErrors || props.error,
        'v-input-frame--dirty': props.dirty,
        'v-input-frame--disabled': props.disabled,
        'v-input-frame--readonly': props.readonly,
      },
    ]"
    :style="`--v-message-count: ${messages.length}`"
  >
    <!-- label -->
    <template v-if="hasLabel">
      <div class="v-input-frame__label">
        <label class="v-label">
          <slot
            name="label"
            v-bind="slotProps"
          >
            {{ props.label }}
          </slot>
        </label>
      </div>
    </template>

    <!-- prepend -->
    <template v-if="hasPrepend">
      <div class="v-input-frame__prepend">
        <slot
          name="prepend"
          v-bind="slotProps"
        >
          <v-icon
            v-if="props.prependIcon"
            :name="props.prependIcon"
            size="none"
          />
        </slot>
      </div>
    </template>

    <!-- default -->
    <template v-if="$slots.default">
      <div class="v-input-frame__control">
        <slot v-bind="slotProps" />
      </div>
    </template>

    <!-- append -->
    <template v-if="hasAppend">
      <div class="v-input-frame__append">
        <slot
          name="append"
          v-bind="slotProps"
        >
          <v-icon
            v-if="props.appendIcon"
            :name="props.appendIcon"
            size="none"
          />
        </slot>
      </div>
    </template>

    <!-- details -->

    <template v-if="hasDetails">
      <VMessages
        :id="messagesId"
        :active="hasMessages"
        :messages="messages"
        class="v-input-frame__messages"
      >
        <template #message>
          <slot name="message" />
        </template>
      </VMessages>

      <slot
        name="details"
        v-bind="slotProps"
      />
    </template>
  </div>
</template>
