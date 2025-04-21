// Types
import type { Ref, ComputedRef, ComponentInternalInstance } from 'vue';
import type { EventProp } from '../../util';

// Composables
export { useGroup, makeGroupProps } from './useGroup';
export { useGroupItem, makeGroupItemProps } from './useGroupItem';

// Group
export interface GroupProvide {
  register: (item: GroupItem, cmp: ComponentInternalInstance) => void;
  unregister: (id: number) => void;
  select: (id: number, value: boolean) => void;
  selected: Ref<Readonly<number[]>>;
  isSelected: (id: number) => boolean;
  prev: () => void;
  next: () => void;
  selectedClass: Ref<string | undefined>;
  items: ComputedRef<
    {
      id: number;
      value: unknown;
      disabled: boolean | undefined;
    }[]
  >;
  disabled: Ref<boolean | undefined>;
  getItemIndex: (value: unknown) => number;
}

export interface GroupProps {
  disabled: boolean;
  modelValue: unknown;
  multiple?: boolean;
  mandatory?: boolean | 'force' | undefined;
  max?: number | undefined;
  selectedClass: string | undefined;
  'onUpdate:modelValue': EventProp<[unknown]> | undefined;
}

// GroupItem
export interface GroupItemProvide {
  id: number;
  isSelected: Ref<boolean>;
  isFirst: Ref<boolean>;
  isLast: Ref<boolean>;
  toggle: () => void;
  select: (value: boolean) => void;
  selectedClass: Ref<(string | undefined)[] | false>;
  value: Ref<unknown>;
  disabled: Ref<boolean | undefined>;
  group: GroupProvide;
}

export interface GroupItem {
  id: number;
  value: Ref<unknown>;
  disabled: Ref<boolean | undefined>;
  useIndexAsValue?: boolean;
}

export interface GroupItemProps {
  value?: unknown;
  disabled?: boolean;
  selectedClass?: string | undefined;
  'onGroup:selected'?: EventProp<[{ value: boolean }]> | undefined;
}
