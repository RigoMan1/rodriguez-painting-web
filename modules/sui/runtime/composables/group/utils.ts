import { deepEqual } from '../../util';

// Types
import type { UnwrapRef } from 'vue';
import type { GroupItem } from './';

export function getItemIndex(items: UnwrapRef<GroupItem[]>, value: unknown) {
  const ids = getIds(items, [value]);

  if (!ids.length) return -1;

  return items.findIndex((item) => item.id === ids[0]);
}

export function getIds(items: UnwrapRef<GroupItem[]>, modelValue: any[]) {
  const ids: number[] = [];

  modelValue.forEach((value) => {
    const item = items.find((item) => deepEqual(value, item.value));
    // const itemByIndex = items[value];

    if (item?.value != null) {
      ids.push(item.id);
    }
    // else if (itemByIndex != null) {
    //   // FIXME:
    //   // an issue where typing an index (e.g., "0", "1") in a two-way bound text field
    //   // selects the corresponding group item unintentionally.
    //   ids.push(itemByIndex.id);
    // }
  });

  return ids;
}

export function getValues(items: UnwrapRef<GroupItem[]>, ids: any[]) {
  const values: unknown[] = [];

  ids.forEach((id) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (~itemIndex) {
      const item = items[itemIndex];
      values.push(item.value != null ? item.value : itemIndex);
    }
  });

  return values;
}
