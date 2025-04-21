<script lang="ts">
// Composables
import { createList } from './list';
import { makeVListProps, type InternalListItem } from './VListMeta';
import { useNested } from './composables/nested';

// Utilities
import { computed, ref, shallowRef, provide } from 'vue';
import { focusChild, getPropertyFromItem, omit } from '../../util';

// Types
import type { ItemProps } from './composables/list-items';

function isPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
  );
}

function transformItem(
  props: ItemProps & { itemType: string },
  item: any
): InternalListItem {
  const type = getPropertyFromItem(item, props.itemType, 'item');
  const title = isPrimitive(item) ? item : getPropertyFromItem(item, props.itemTitle);
  const value = getPropertyFromItem(item, props.itemValue, undefined);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps =
    props.itemProps === true
      ? omit(item, ['children'])
      : getPropertyFromItem(item, props.itemProps);

  const _props = {
    title,
    value,
    ...itemProps,
  };

  return {
    type,
    title: _props.title,
    value: _props.value,
    props: _props,
    children: type === 'item' && children ? transformItems(props, children) : undefined,
    raw: item,
  };
}

function transformItems(
  props: ItemProps & { itemType: string },
  items: (string | object)[]
) {
  const array: InternalListItem[] = [];

  for (const item of items) {
    array.push(transformItem(props, item));
  }

  return array;
}

export function useListItems(props: ItemProps & { itemType: string }) {
  const items = computed(() => transformItems(props, props.items));

  return { items };
}
</script>

<script setup lang="ts">
defineOptions({ name: 'VList' });

defineEmits<{
  'update:selected': [boolean];
  'update:activated': [boolean];
  'update:opened': [boolean];
  'click:open': [{ id: unknown; value: boolean; path: unknown[] }];
  'click:activate': [{ id: unknown; value: boolean; path: unknown[] }];
  'click:select': [{ id: unknown; value: boolean; path: unknown[] }];
}>();

const props = defineProps(makeVListProps());

const { items } = useListItems(props);
const { children, open, parents, select } = useNested(props);

createList();

const isFocused = shallowRef(false);
const contentRef = ref<HTMLElement>();
function onFocusin(e: FocusEvent) {
  isFocused.value = true;
}

function onFocusout(e: FocusEvent) {
  isFocused.value = false;
}

function onFocus(e: FocusEvent) {
  if (
    !isFocused.value &&
    !(e.relatedTarget && contentRef.value?.contains(e.relatedTarget as Node))
  )
    focus();
}

function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement;

  if (!contentRef.value || ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

  if (e.key === 'ArrowDown') {
    focus('next');
  } else if (e.key === 'ArrowUp') {
    focus('prev');
  } else if (e.key === 'Home') {
    focus('first');
  } else if (e.key === 'End') {
    focus('last');
  } else {
    return;
  }

  e.preventDefault();
}

function onMousedown(e: MouseEvent) {
  isFocused.value = true;
}

function focus(location?: 'next' | 'prev' | 'first' | 'last') {
  if (contentRef.value) {
    return focusChild(contentRef.value, location);
  }
}

// provide active class
provide('activeClass', props.activeClass);

defineExpose({ open, select, focus, children, parents });
</script>

<template>
  <component
    :is="props.tag"
    ref="contentRef"
    class="v-list"
    :class="{
      'v-list--disabled': props.disabled,
    }"
    :tabindex="props.disabled || isFocused ? -1 : 0"
    role="listbox"
    :aria-activedescendant="undefined"
    @focusin="onFocusin"
    @focusout="onFocusout"
    @focus="onFocus"
    @keydown="onKeydown"
    @mousedown="onMousedown"
  >
    <slot />

    <VListChildren
      :items="items"
      :return-object="props.returnObject"
    >
      <template
        v-if="$slots.item"
        #item="{ props: itemProps }"
      >
        <slot
          name="item"
          :props="itemProps"
        />
      </template>

      <template
        v-if="$slots.item"
        #group-root="{ props: itemProps, isOpen }"
      >
        <slot
          name="group-root"
          :props="itemProps"
          :is-open="isOpen"
        />
      </template>
    </VListChildren>
  </component>
</template>
