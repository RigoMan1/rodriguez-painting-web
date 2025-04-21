<script setup lang="ts">
// Composables
import { makeVSelectionControlProps } from './VSelectionControlMeta';
import { useSelectionControl } from './composables/useSelectionControl';

// Directives
import { Ripple as vRipple } from '../../directives/ripple';

// Utilities
import { computed, ref, shallowRef, h, useAttrs } from 'vue';
import { filterInputAttrs, getUid, matchesSelector } from '../../util';

defineOptions({ name: 'VSelectionControl', inheritAttrs: false });
defineEmits<{
  'update:modelValue': [boolean];
}>();
const props = defineProps(makeVSelectionControlProps());

const { icon, model, trueValue } = useSelectionControl(props);
const uid = getUid();
const isFocused = shallowRef(false);
const isFocusVisible = shallowRef(false);
const inputEl = ref<HTMLInputElement>();
const id = computed(() => props.id || `input-${uid}`);
const isInteractive = computed(() => !props.disabled && !props.readonly);

function onFocus(e: FocusEvent) {
  if (!isInteractive.value) return;

  isFocused.value = true;
  if (matchesSelector(e.target as HTMLElement, ':focus-visible') !== false) {
    isFocusVisible.value = true;
  }
}

function onBlur() {
  isFocused.value = false;
  isFocusVisible.value = false;
}

// function onClickLabel(e: Event) {
//   e.stopPropagation();
// }

function onInput(e: Event) {
  if (!isInteractive.value) {
    if (inputEl.value) {
      // model value is not updated when inputEl is not interactive
      // but the internal checked state of the inputEl is still updated,
      // so here it's value is restored
      inputEl.value.checked = model.value;
    }

    return;
  }

  model.value = (e.target as HTMLInputElement).checked;
}

// const slots = useSlots();
// const label = slots.label
//   ? slots.label({
//       label: props.label,
//       props: { for: id.value },
//     })
//   : props.label;

const attrs = useAttrs();
const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);

const inputNode = h('input', {
  checked: model.value,
  disabled: !!props.disabled,
  id: id.value,
  onBlur,
  onFocus,
  onInput,
  'aria-disabled': !!props.disabled,
  'aria-label': props.label,
  type: props.type,
  value: trueValue.value,
  name: props.name,
  'aria-checked': props.type === 'checkbox' ? model.value : undefined,
  ...inputAttrs,
});

function toggleInputNode() {
  model.value = !model.value;
}

defineExpose({
  isFocused,
  toggleInputNode,
});
</script>

<template>
  <div
    class="v-selection-control"
    :class="{
      'v-selection-control--dirty': model,
      'v-selection-control--disabled': props.disabled,
      'v-selection-control--error': props.error,
      'v-selection-control--focused': isFocused,
      'v-selection-control--focus-visible': isFocusVisible,
      'v-selection-control--inline': props.inline,
    }"
    v-bind="rootAttrs"
    :data-active="model"
    :data-indeterminate="indeterminate"
  >
    <div class="v-selection-control__wrapper">
      <slot :model="model" />

      <div
        v-ripple="[
          props.ripple && !props.disabled && !props.readonly,
          null,
          ['center', 'circle'],
        ]"
        class="v-selection-control__input"
      >
        <slot
          name="input"
          :model="model"
          :input-node="inputNode"
          :icon="icon"
          :props="{ onFocus, onBlur, id: id }"
        >
          <v-icon
            v-if="icon"
            class="v-selection-control__icon"
            :name="icon"
          />

          <component
            :is="inputNode"
            ref="inputEl"
          />
        </slot>
      </div>
    </div>
  </div>
</template>
