<script setup lang="ts">
// Components
import { useList } from './list';
import { useNestedItem } from './composables/nested';
import { makeVListItemProps } from './VListMeta';
import { useLink } from './composables/router';
import type { ListItemSlot /*ListItemTitleSlot, VListItemSlots*/ } from './VListMeta';

// Directives
import { Ripple as vRipple } from '../../directives/ripple';

// Utilities
import { computed, watch, useAttrs, inject, useSlots } from 'vue';

const attrs = useAttrs();
defineOptions({ name: 'VListItem', inheritAttrs: false });
const emit = defineEmits<{
  click: [boolean];
}>();

const props = defineProps(makeVListItemProps());

const link = useLink(props, attrs);
const id = computed(() => (props.value === undefined ? link.href.value : props.value));
const {
  activate,
  isActivated,
  select,
  isSelected,
  isIndeterminate,
  isGroupActivator,
  root,
  parent,
  openOnSelect,
  isLeaf,
  isOpen,
  open,
} = useNestedItem(id, false);
const list = useList();
const isActive = computed(
  () =>
    props.active !== false &&
    (props.active ||
      link.isActive?.value ||
      (root.activatable.value ? isActivated.value : isSelected.value))
);
const isLink = computed(() => props.link !== false && link.isLink.value);
const isClickable = computed(
  () =>
    !props.disabled &&
    props.link !== false &&
    (props.link ||
      link.isClickable.value ||
      (!!list &&
        (root.selectable.value || root.activatable.value || props.value != null)))
);

watch(
  () => link.isActive?.value,
  (val) => {
    if (val && parent.value != null) {
      root.open(parent.value, true);
    }

    if (val) {
      openOnSelect(val);
    }
  },
  { immediate: true }
);

// TODO: assign the slotProps
const slotProps = computed(
  () =>
    ({
      isActive: isActive.value,
      select,
      isSelected: isSelected.value,
      isIndeterminate: isIndeterminate.value,
    } satisfies ListItemSlot)
);

function onClick(e: MouseEvent) {
  emit('click', e instanceof MouseEvent);

  if (!isClickable.value) return;

  link.navigate?.(e);

  if (isGroupActivator) return;

  if (root.activatable.value) {
    activate(!isActivated.value, e);
  } else if (root.selectable.value) {
    select(!isSelected.value, e);
  } else if (props.value != null) {
    select(!isSelected.value, e);
  }
}

// TODO: it seems this was a wip, we need to revisit this
function getItems() {
  return Array.from(document.querySelectorAll('.v-list-item'));
}

// Use this utility to get all the items
function useNestedElements() {
  // const nested = inject(VNestedSymbol, emptyNested);

  function getItems() {
    // return [root.children.value.keys()];
    return Array.from(document.querySelectorAll('.v-list-item'));
  }

  function getItemElement(id) {
    return document.querySelector(`[data-id="${id}"]`);
  }

  return { getItems, getItemElement };
}

function handleKeydownRight(ev: KeyboardEvent) {
  const { getItems, getItemElement } = useNestedElements();

  if (!isLeaf.value) {
    if (isOpen.value) {
      // Go to the first child
      const items = getItems();
      const index = items.findIndex((el) => el === getItemElement(id.value));
      const next = items[index + 1];
      if (next) {
        next.focus();
      }
    } else {
      // Open expanded
      open(true, ev);
    }
  }
}

function handleKeydownLeft(ev: KeyboardEvent) {
  const { getItems, getItemElement } = useNestedElements();

  if (isOpen.value) {
    // Close expanded
    open(false, ev);
  } else {
    // Go back to parent
    const items = getItems();

    const parentElement = items.find((el) => el === getItemElement(parent.value));

    if (parentElement) {
      parentElement.focus();
    }
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick(e as any as MouseEvent);
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (isClickable.value && !isLink.value) {
    if (e.key === 'ArrowRight') {
      handleKeydownRight(e);
    } else if (e.key === 'ArrowLeft') {
      handleKeydownLeft(e);
    } else {
      onKeyDown(e);
    }
  }
};

const slots = useSlots();
const Tag = computed(() => (isLink.value ? 'a' : props.tag));
const hasAppendMedia = computed(() => !!props.appendIcon);
const hasAppend = computed(() => !!(hasAppendMedia.value || slots.append));
const hasPrependMedia = computed(() => !!props.prependIcon);
const hasPrepend = computed(() => !!(hasPrependMedia.value || slots.prepend));

list?.updateHasPrepend(hasPrepend.value);

const activeClass = inject('activeClass', 'v-list-item--active');
</script>

<template>
  <component
    :is="Tag"
    v-ripple="isClickable && props.ripple"
    class="v-list-item"
    :class="[
      {
        'v-list-item--active': isActive,
        'v-list-item--disabled': props.disabled,
        'v-list-item--link': isClickable,
        'v-list-item--prepend': !hasPrepend && list?.hasPrepend,
        [`${activeClass}`]: isActive,
      },
      $attrs.class,
    ]"
    :tabindex="isClickable ? (list ? -2 : 0) : undefined"
    :data-id="id"
    :data-parent-id="parent"
    @click="onClick"
    @keydown="handleKeyDown"
  >
    <slot>
      <!-- prepend -->
      <template v-if="hasPrepend">
        <div
          key="prepend"
          class="v-list-item__prepend"
        >
          <slot name="prepend">
            <v-icon
              v-if="props.prependIcon"
              key="prepend-icon"
              :name="props.prependIcon"
            />
          </slot>
        </div>
      </template>

      <!-- default -->
      <div
        class="v-list-item__content"
        data-no-activator=""
      >
        <slot name="content">
          {{ props.title }}
        </slot>
      </div>

      <!-- append -->
      <template v-if="hasAppend">
        <div
          key="append"
          class="v-list-item__append"
        >
          <slot name="append">
            <v-icon
              v-if="props.appendIcon"
              key="append-icon"
              :name="props.appendIcon"
            />
          </slot>
        </div>
      </template>
    </slot>
  </component>
</template>
