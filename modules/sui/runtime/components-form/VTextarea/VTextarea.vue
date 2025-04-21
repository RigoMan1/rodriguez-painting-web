<script setup lang="ts">
import {
  extractVInputFrameProps,
  type VInputFrame,
} from '../VInputFrame/VInputFrameMeta';
import { type VField, extractVFieldProps } from '../VField/VFieldMeta';
import { makeVTextareaProps } from './VTextareaMeta';
import { ForwardSlots } from '../../components/ForwardSlots';

// Composables
import { useFocus } from '../../composables/focus';
import { useProxiedModel } from '../../composables/proxiedModel';

// Utilities
import {
  computed,
  nextTick,
  ref,
  useSlots,
  useAttrs,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue';
import { callEvent, filterInputAttrs, destructComputed } from '../../util';

defineOptions({ name: 'VTextarea', inheritAttrs: false });
const emit = defineEmits<{
  'click:control': [MouseEvent];
  'mousedown:control': [MouseEvent];
  'update:focused': [boolean];
  'update:modelValue': [string];
}>();
const props = defineProps(makeVTextareaProps());

const model = useProxiedModel(props, 'modelValue');
const { isFocused, focus, blur } = useFocus(props);

const VInputFrameRef = ref<VInputFrame>();
const vFieldRef = ref<VField>();
const textareaRef = ref<HTMLInputElement>();
// const isActive = computed(
//   () => activeTypes.includes(props.type) || isFocused.value || props.active
// );

const isActive = computed(
  () => props.persistentPlaceholder || isFocused.value || props.active
);
function onFocus() {
  if (textareaRef.value !== document.activeElement) {
    textareaRef.value?.focus();
  }

  if (!isFocused.value) focus();
}
function onControlMousedown(e: MouseEvent) {
  emit('mousedown:control', e);

  if (e.target === textareaRef.value) return;

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
  const el = e.target as HTMLTextAreaElement;
  model.value = el.value;
  if (props.modelModifiers?.trim) {
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

// #region Textarea auto resize
const textareaScrollHeight = ref(1);
const textareaOldWidth = ref(0);

function triggerResize() {
  if (!props.autoGrow || !textareaRef.value) return; // Check if autoGrow is true

  const computedStyle = window.getComputedStyle(textareaRef.value);
  const lineHeight = parseFloat(computedStyle.lineHeight); // Automatically compute line-height

  // Set the minimum height to match the default rows
  const minHeight = `${parseInt(props.rows) * lineHeight}px`;

  textareaRef.value.style['height'] = '1px'; // Temporarily set height to 1px to calculate the new scroll height
  textareaScrollHeight.value = textareaRef.value.scrollHeight;

  // Set the height to the larger of the scroll height or minimum height
  const height = `${Math.max(textareaScrollHeight.value, parseInt(minHeight))}px`;

  textareaRef.value.style['height'] = height;
}

watch(
  [model, textareaRef],
  () => {
    if (props.autoGrow) nextTick(triggerResize); // Check if autoGrow is true
  },
  {
    immediate: true,
  }
);

function resizeObserverCallback(entries: ResizeObserverEntry[]) {
  if (!props.autoGrow) return; // Check if autoGrow is true

  for (const entry of entries) {
    const { contentRect } = entry;
    if (textareaOldWidth.value === contentRect.width) return;
    textareaOldWidth.value = contentRect.width;
    triggerResize();
  }
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (props.autoGrow) {
    // Check if autoGrow is true
    resizeObserver = new ResizeObserver(resizeObserverCallback);
    if (textareaRef.value) resizeObserver.observe(textareaRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver && textareaRef.value) {
    resizeObserver.unobserve(textareaRef.value);
  }
});
// #endregion
</script>

<template>
  <forward-slots :slots="slots">
    <v-input-frame
      ref="VInputFrameRef"
      v-model="model"
      class="v-textarea v-text-field"
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

            <textarea
              ref="textareaRef"
              :value="model"
              :autofocus="props.autofocus"
              :readonly="isReadonly"
              :disabled="isDisabled"
              :placeholder="props.placeholder"
              :rows="props.rows"
              :name="props.name"
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
