<script setup lang="ts" generic="T">
import type { VMenu } from '../../components/VMenu/VMenuMeta';
import type { VList } from '../../components/VList/VListMeta';
import { ForwardSlots } from '../../components/ForwardSlots';
import type { VVirtualScroll } from '../../components/VVirtualScroll/VVirtualScrollMeta';
// Composables
import { useScrolling } from './useScrolling';
import { useItems } from '../../components/VList/composables/list-items';
// import { useLocale } from '../../composables/locale';
import { useProxiedModel } from '../../composables/proxiedModel';

// Utilities
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { IN_BROWSER, matchesSelector, wrapInArray } from '../../util';

// Types
import type { ListItem } from '../../components/VList/composables/list-items';
import { extractVTextFieldProps } from '../VTextField/VTextFieldMeta';

import { makeVSelectProps } from './VSelectMeta';
import type { VSelectSlots } from './VSelectMeta';
defineOptions({ name: 'VSelect', inheritAttrs: false });

defineSlots<VSelectSlots>();

defineEmits<{
  'update:focused': [boolean];
  'update:modelValue': [any];
  'update:menu': [boolean];
}>();

const props = defineProps(makeVSelectProps());

// const { t } = useLocale();
const vTextFieldRef = ref();
const vMenuRef = ref<VMenu>();
const vVirtualScrollRef = ref<VVirtualScroll>();
const _menu = useProxiedModel(props, 'menu');
const menu = computed({
  get: () => _menu.value,
  set: (v) => {
    if (_menu.value && !v && vMenuRef.value?.ΨopenChildren) return;
    _menu.value = v;
  },
});
const { items, transformIn, transformOut } = useItems(props);
const model: any = useProxiedModel(
  props,
  'modelValue',
  [],
  (v) => transformIn(v === null ? [null] : wrapInArray(v)),
  (v) => {
    const transformed = transformOut(v);
    return props.multiple ? transformed : (transformed[0] ?? null);
  }
);

const selectedValues = computed(() =>
  model.value.map((selection: any) => selection.value)
);
const isFocused = shallowRef(false);
const label = computed(() => (menu.value ? props.closeText : props.openText));

let keyboardLookupPrefix = '';
let keyboardLookupLastTime: number;

const displayItems = computed(() => {
  if (props.hideSelected) {
    return items.value.filter(
      (item) => !model.value.some((s: ListItem<any>) => props.valueComparator(s, item))
    );
  }
  return items.value;
});

const menuDisabled = computed(
  () => (props.hideNoData && !displayItems.value.length) || props.readonly
  // || form?.isReadonly.value
);

const computedMenuProps = computed(() => {
  return {
    ...props.menuProps,
    activatorProps: {
      ...(props.menuProps?.activatorProps || {}),
      'aria-haspopup': 'listbox', // Set aria-haspopup to 'listbox'
    },
  };
});

const listRef = ref<VList>();

const { onListScroll, onListKeydown } = useScrolling(listRef, vTextFieldRef);
function onClear() {
  if (props.openOnClear) {
    menu.value = true;
  }
}
function onMousedownControl() {
  if (menuDisabled.value) return;

  menu.value = !menu.value;
}
function onKeydown(e: KeyboardEvent) {
  if (!e.key || props.readonly) return;

  if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
    e.preventDefault();
  }

  if (['Enter', 'ArrowDown', ' '].includes(e.key)) {
    menu.value = true;
  }

  if (['Escape', 'Tab'].includes(e.key)) {
    menu.value = false;
  }

  if (e.key === 'Home') {
    listRef.value?.focus('first');
  } else if (e.key === 'End') {
    listRef.value?.focus('last');
  }

  // html select hotkeys
  const KEYBOARD_LOOKUP_THRESHOLD = 1000; // milliseconds

  function checkPrintable(e: KeyboardEvent) {
    const isPrintableChar = e.key.length === 1;
    const noModifier = !e.ctrlKey && !e.metaKey && !e.altKey;
    return isPrintableChar && noModifier;
  }

  if (props.multiple || !checkPrintable(e)) return;

  const now = performance.now();
  if (now - keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
    keyboardLookupPrefix = '';
  }
  keyboardLookupPrefix += e.key.toLowerCase();
  keyboardLookupLastTime = now;

  const item = items.value.find((item) =>
    item.label.toLowerCase().startsWith(keyboardLookupPrefix)
  );
  if (item !== undefined) {
    model.value = [item];
    const index = displayItems.value.indexOf(item);

    if (IN_BROWSER) {
      window.requestAnimationFrame(() => {
        if (index >= 0) vVirtualScrollRef.value?.scrollToIndex(index);
      });
    }
  }
}

/** @param set - null means toggle */
function select(item: ListItem, set: boolean | null = true) {
  if (item.props.disabled) return;

  if (props.multiple) {
    const index = model.value.findIndex((selection: any) =>
      props.valueComparator(selection.value, item.value)
    );
    const add = set == null ? !~index : set;

    if (~index) {
      const value = add ? [...model.value, item] : [...model.value];
      value.splice(index, 1);
      model.value = value;
    } else if (add) {
      model.value = [...model.value, item];
    }
  } else {
    const add = set !== false;
    model.value = add ? [item] : [];

    nextTick(() => {
      menu.value = false;
    });
  }
}
function onBlur(e: FocusEvent) {
  if (!listRef.value?.$el.contains(e.relatedTarget as HTMLElement)) {
    menu.value = false;
  }
}
function onAfterLeave() {
  if (isFocused.value) {
    vTextFieldRef.value?.focus();
  }
}
function onFocusin() {
  isFocused.value = true;
}
function onModelUpdate(v: any) {
  if (v == null) model.value = [];
  else if (
    matchesSelector(vTextFieldRef.value, ':autofill') ||
    matchesSelector(vTextFieldRef.value, ':-webkit-autofill')
  ) {
    const item = items.value.find((item) => item.label === v);
    if (item) {
      select(item);
    }
  } else if (vTextFieldRef.value) {
    vTextFieldRef.value.value = '';
  }
}

watch(menu, () => {
  if (!props.hideSelected && menu.value && model.value.length) {
    const index = displayItems.value.findIndex((item) =>
      model.value.some((s: any) => props.valueComparator(s.value, item.value))
    );

    if (IN_BROWSER) {
      window.requestAnimationFrame(() => {
        if (index >= 0) vVirtualScrollRef.value?.scrollToIndex(index);
      });
    }
  }
});

watch(
  () => props.items,
  (newVal, oldVal) => {
    if (menu.value) return;

    if (isFocused.value && !oldVal.length && newVal.length) {
      menu.value = true;
    }
  }
);

const slots = useSlots();
const hasList = computed(() => {
  return !!(
    !props.hideNoData ||
    displayItems.value.length ||
    slots['list-header'] ||
    slots['list-footer'] ||
    slots['no-data']
  );
});
const isDirty = computed(() => model.value.length > 0);
const textFieldProps = computed(() => extractVTextFieldProps(props));
const placeholder = computed(() => {
  return isDirty.value || !isFocused.value ? undefined : props.placeholder;
});

const VTextFieldModel = computed({
  get: () => model.value.map((v: any) => v.props.label).join(', '),
  set: (v) => {
    const item = items.value.find((item) => item.label === v);
    if (item) {
      select(item);
    }
  },
});
</script>

<template>
  <forward-slots :slots="slots">
    <v-text-field
      ref="vTextFieldRef"
      v-bind="{
        ...textFieldProps,
        ...$attrs,
      }"
      v-model="VTextFieldModel"
      v-model:focused="isFocused"
      :validation-value="model.externalValue"
      :dirty="isDirty"
      class="v-select"
      :class="{
        'v-select--active-menu': menu,
        'v-select--multiple': props.multiple,
        'v-select--single': !props.multiple,
        'v-select--selected': model,
        'v-select--selection-slot': !!slots.selection,
      }"
      :aria-label="label"
      :title="label"
      inputmode="none"
      :placeholder="placeholder"
      @click:clear="onClear"
      @mousedown:control="onMousedownControl"
      @blur="onBlur"
      @keydown="onKeydown"
      @update:model-value="onModelUpdate"
    >
      <v-menu
        ref="vMenuRef"
        v-model="menu"
        activator="parent"
        :bem="{
          content: 'v-select__content',
        }"
        :disabled="menuDisabled"
        :eager="props.eager"
        :max-height="310"
        :open-on-click="false"
        :close-on-content-click="false"
        :transition="props.transition"
        v-bind="computedMenuProps"
        @after-leave="onAfterLeave"
      >
        <slot name="header" />

        <template v-if="hasList">
          <v-list
            ref="listRef"
            class="v-select__list"
            :selected="selectedValues"
            :select-strategy="props.multiple ? 'independent' : 'single-independent'"
            tabindex="-1"
            aria-live="polite"
            v-bind="props.listProps"
            @mousedown="($event: MouseEvent) => $event.preventDefault()"
            @keydown="onListKeydown"
            @focusin="onFocusin"
            @scroll.passive="onListScroll"
          >
            <slot name="list-header" />

            <slot
              v-if="!displayItems.length && !props.hideNoData"
              name="no-data"
            >
              <v-list-item :title="props.noDataText" />
            </slot>

            <v-virtual-scroll
              ref="vVirtualScrollRef"
              v-slot="{ item, index }"
              :items="displayItems"
              :height="310"
            >
              <v-list-item
                :key="index"
                role="option"
                v-bind="item.props"
                class="v-select__option"
                @click="() => select(item, null)"
              >
                <slot
                  name="option"
                  :item="item"
                  :index="index"
                  :is-selected="selectedValues.includes(item.value)"
                >
                  {{ item.label }}
                </slot>
              </v-list-item>
            </v-virtual-scroll>

            <slot name="list-footer" />
          </v-list>
        </template>

        <slot name="footer" />
      </v-menu>
    </v-text-field>
  </forward-slots>
</template>
