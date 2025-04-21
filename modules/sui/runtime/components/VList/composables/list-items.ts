// Utilities
import { computed } from 'vue';
import { deepEqual, getPropertyFromItem, omit, propsFactory } from '../../../util';

// Types
import type { PropType } from 'vue';
// import type { InternalItem } from '../../../composables/filter';
import type { SelectItemKey } from '../../../util';

export interface InternalItem<T = any> {
  value: any;
  raw: T;
}

export interface ListItem<T = any> extends InternalItem<T> {
  label: string;
  props: {
    [key: string]: any;
    label: string;
    value: any;
  };
  children?: ListItem<T>[];
}

export interface ItemProps {
  items: any[];
  labelKey: SelectItemKey;
  valueKey: SelectItemKey;
  itemChildren: SelectItemKey;
  itemProps: SelectItemKey;
  returnObject: boolean;
  valueComparator: typeof deepEqual;
}

// Composables
export const makeItemsProps = propsFactory(
  {
    items: {
      type: Array as PropType<ItemProps['items']>,
      default: () => [],
    },
    labelKey: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: 'label',
    },
    valueKey: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: 'value',
    },
    itemChildren: {
      type: [Boolean, String, Array, Function] as PropType<SelectItemKey>,
      default: 'children',
    },
    itemProps: {
      type: [Boolean, String, Array, Function] as PropType<SelectItemKey>,
      default: 'props',
    },
    returnObject: Boolean,
    valueComparator: {
      type: Function as PropType<typeof deepEqual>,
      default: deepEqual,
    },
  },
  'list-items'
);

export function transformItem(props: Omit<ItemProps, 'items'>, item: any): ListItem {
  const label = getPropertyFromItem(item, props.labelKey, item);
  const value = getPropertyFromItem(item, props.valueKey, label);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps =
    props.itemProps === true
      ? typeof item === 'object' && item != null && !Array.isArray(item)
        ? 'children' in item
          ? omit(item, ['children'])
          : item
        : undefined
      : getPropertyFromItem(item, props.itemProps);

  const _props = {
    label,
    value,
    ...itemProps,
  };

  return {
    label: String(_props.label ?? ''),
    value: _props.value,
    props: _props,
    children: Array.isArray(children) ? transformItems(props, children) : undefined,
    raw: item,
  };
}

export function transformItems(
  props: Omit<ItemProps, 'items'>,
  items: ItemProps['items']
) {
  const array: ListItem[] = [];

  for (const item of items) {
    array.push(transformItem(props, item));
  }

  return array;
}

export function useItems(props: ItemProps) {
  const items = computed(() => transformItems(props, props.items));
  const hasNullItem = computed(() => items.value.some((item) => item.value === null));

  function transformIn(value: any[]): ListItem[] {
    if (!hasNullItem.value) {
      // When the model value is null, return an InternalItem
      // based on null only if null is one of the items
      value = value.filter((v) => v !== null);
    }

    return value.map((v) => {
      if (props.returnObject && typeof v === 'string') {
        // String model value means value is a custom input value from combobox
        // Don't look up existing items if the model value is a string
        return transformItem(props, v);
      }
      return (
        items.value.find((item) => props.valueComparator(v, item.value)) ||
        transformItem(props, v)
      );
    });
  }

  function transformOut(value: ListItem[]): any[] {
    return props.returnObject
      ? value.map(({ raw }) => raw)
      : value.map(({ value }) => value);
  }

  return { items, transformIn, transformOut };
}
