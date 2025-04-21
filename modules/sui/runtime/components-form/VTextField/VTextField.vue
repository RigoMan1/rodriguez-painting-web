<script setup lang="ts">
import {
  extractVInputFrameProps,
  type VInputFrame,
} from '../VInputFrame/VInputFrameMeta';
import { type VField, extractVFieldProps } from '../VField/VFieldMeta';
import { makeVTextFieldProps, type VTextFieldSlots } from './VTextFieldMeta';
import { ForwardSlots } from '../../components/ForwardSlots';

// Composables
import { useFocus } from '../../composables/focus';
import { useProxiedModel } from '../../composables/proxiedModel';

// Utilities
import { computed, nextTick, ref, useSlots, useAttrs } from 'vue';
import { callEvent, filterInputAttrs, destructComputed } from '../../util';

const activeTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];

defineSlots<VTextFieldSlots>();

defineOptions({ name: 'VTextField', inheritAttrs: false });
const emit = defineEmits<{
  'click:control': [MouseEvent];
  'mousedown:control': [MouseEvent];
  'update:focused': [boolean];
  'update:modelValue': [string];
}>();
const props = defineProps(makeVTextFieldProps());

const model = useProxiedModel(props, 'modelValue');
const { isFocused, focus, blur } = useFocus(props);

const VInputFrameRef = ref<VInputFrame>();
const vFieldRef = ref<VField>();
const inputRef = ref<HTMLInputElement>();
const isActive = computed(
  () => activeTypes.includes(props.type) || isFocused.value || props.active
);
function onFocus() {
  if (inputRef.value !== document.activeElement) {
    inputRef.value?.focus();
  }

  if (!isFocused.value) focus();
}
function onControlMousedown(e: MouseEvent) {
  emit('mousedown:control', e);

  if (e.target === inputRef.value) return;

  onFocus();
  e.preventDefault();
}
function onControlClick(e: MouseEvent) {
  onFocus();

  emit('click:control', e);
}
function onClear(e: MouseEvent) {
  e.stopPropagation();

  onFocus();

  nextTick(() => {
    model.value = null;

    callEvent(props['onClick:clear'], e);
  });
}
function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  model.value = el.value;
  if (
    props.modelModifiers?.trim &&
    ['text', 'search', 'password', 'tel', 'url'].includes(props.type)
  ) {
    const caretPosition = [el.selectionStart, el.selectionEnd];
    nextTick(() => {
      el.selectionStart = caretPosition[0];
      el.selectionEnd = caretPosition[1];
    });
  }
}

const slots = useSlots();
const attrs = useAttrs();
const { rootAttrs, inputAttrs } = destructComputed(() => {
  const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
  return { rootAttrs, inputAttrs };
});
const inputProps = computed(() => extractVInputFrameProps(props));
const fieldProps = computed(() => extractVFieldProps(props));

defineExpose({
  focus,
});
</script>

<template>
  <forward-slots :slots="slots">
    <v-input-frame
      ref="VInputFrameRef"
      v-model="model"
      class="v-text-field"
      v-bind="{
        ...rootAttrs,
        ...inputProps,
        ...$attrs,
      }"
      :focused="isFocused"
    >
      <template #default="{ isDisabled, isReadonly, isValid, isDirty }">
        <forward-slots
          :slots="slots"
          :only="['prepend-inner', 'append-inner']"
        >
          <v-field
            :id="id"
            ref="vFieldRef"
            :role="props.role"
            v-bind="{ ...fieldProps }"
            :active="isActive || isDirty"
            :dirty="isDirty || props.dirty"
            :disabled="isDisabled"
            :readonly="isReadonly"
            :focused="isFocused"
            :error="isValid === false"
            @mousedown="onControlMousedown"
            @click="onControlClick"
            @click:clear="onClear"
            @click:prepend-inner="props['onClick:prependInner']"
            @click:append-inner="props['onClick:appendInner']"
          >
            <slot />

            <input
              ref="inputRef"
              :value="model"
              :readonly="isReadonly"
              :disabled="isDisabled"
              :placeholder="props.placeholder"
              size="1"
              :type="props.type"
              v-bind="inputAttrs"
              @input="onInput"
              @focus="onFocus"
              @blur="blur"
            />
          </v-field>
        </forward-slots>
      </template>
    </v-input-frame>
  </forward-slots>
</template>
