import type VList from './VList.vue';

// import { makeRouterProps } from '../../composables/router';
import { makeComponentProps } from '../../composables/component';
import { makeItemsProps } from './composables/list-items';
import { makeNestedProps } from './composables/nested';

// Utilities
import { EventProp, propsFactory, createPropsPicker } from '../../util';

// Types
import type { PropType } from 'vue';
import type { RippleDirectiveBinding } from '../../directives/ripple';
import type { ListItem } from './composables/list-items';

// #region VList

export interface InternalListItem<T = any> extends ListItem<T> {
  type?: 'item' | 'subheader' | 'divider';
}

export const makeVListProps = propsFactory(
  {
    baseColor: String,
    /* @deprecated */
    activeColor: String,
    activeClass: String,
    bgColor: String,
    disabled: Boolean,
    expandIcon: String,
    collapseIcon: String,
    lines: {
      type: [Boolean, String] as PropType<'one' | 'two' | 'three' | false>,
      default: 'one',
    },

    'onClick:open': EventProp<[{ id: unknown; value: boolean; path: unknown[] }]>(),
    'onClick:select': EventProp<[{ id: unknown; value: boolean; path: unknown[] }]>(),
    'onUpdate:opened': EventProp<[]>(),
    ...makeNestedProps({
      selectStrategy: 'single-leaf' as const,
      openStrategy: 'list' as const,
    }),

    itemType: {
      type: String,
      default: 'type',
    },
    ...makeItemsProps(),
    ...makeComponentProps(),
  },
  'VList'
);

// #endregion

// #region VListChildren
export const makeVListChildrenProps = propsFactory(
  {
    items: Array as PropType<readonly InternalListItem[]>,
    returnObject: Boolean,
  },
  'VListChildren'
);

export type VListChildrenSlots<T> = {
  [K in keyof Omit<VListItemSlots, 'default'>]: VListItemSlots[K] & { item: T };
} & {
  default(): void;
  item(props: InternalListItem<T>): void;
  'group-root'(props: InternalListItem<T>, isOpen: boolean): void;
};

//#endregion

// #region VListItem
export type ListItemSlot = {
  isActive: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
  select: (value: boolean) => void;
};

export type ListItemTitleSlot = {
  title?: string | number;
};

export type VListItemSlots = {
  prepend: ListItemSlot;
  append: ListItemSlot;
  default: ListItemSlot;
  title: ListItemTitleSlot;
};

export const makeVListItemProps = propsFactory(
  {
    // prependAvatar: String,
    // appendAvatar: String,

    prependIcon: String,
    appendIcon: String,

    active: {
      type: Boolean,
      default: undefined,
    },
    activeClass: String,
    disabled: Boolean,
    link: {
      type: Boolean,
      default: undefined,
    },

    ripple: {
      type: [Boolean, Object] as PropType<RippleDirectiveBinding['value']>,
      default: true,
    },
    title: [String, Number],
    value: null,

    onClick: EventProp<[MouseEvent]>(),
    onClickOnce: EventProp<[MouseEvent]>(),

    ...makeComponentProps(),
    // ...makeRouterProps(),
  },
  'VListItem'
);
// #endregion

// #region VListGroup
export const makeVListGroupProps = propsFactory(
  {
    /* @deprecated */
    activeColor: String,
    baseColor: String,
    color: String,
    collapseIcon: {
      type: String,
      default: '$collapse',
    },
    expandIcon: {
      type: String,
      default: '$expand',
    },
    prependIcon: String,
    appendIcon: String,
    fluid: Boolean,
    subgroup: Boolean,
    value: null,

    ...makeComponentProps(),
  },
  'VListGroup'
);
// #endregion

export const extractVListGroupProps = createPropsPicker(makeVListGroupProps);

export type VList = InstanceType<typeof VList>;
