// Components
import { VDialogTransition } from '../../components-transitions';
import { makeVTextFieldProps, type VTextFieldSlots } from '../VTextField/VTextFieldMeta';

import type { VList } from '../../components/VList/VListMeta';
import type { VMenu } from '../../components/VMenu/VMenuMeta';

// Composables
import { makeItemsProps } from '../../components/VList/composables/list-items';

import { makeTransitionProps } from '../../composables/transition';

// Utilities
import { omit, propsFactory } from '../../util';

// Types
import type { Component, PropType } from 'vue';

type Primitive = string | number | boolean | symbol;

type Val<T, ReturnObject extends boolean> = [T] extends [Primitive]
  ? T
  : ReturnObject extends true
    ? T
    : any;

type Value<
  T,
  ReturnObject extends boolean,
  Multiple extends boolean,
> = Multiple extends true ? readonly Val<T, ReturnObject>[] : Val<T, ReturnObject> | null;

export const makeSelectProps = propsFactory(
  {
    chips: Boolean,
    closableChips: Boolean,
    closeText: {
      type: String,
      default: '$sui.close',
    },
    openText: {
      type: String,
      default: '$sui.open',
    },
    eager: Boolean,
    hideNoData: Boolean,
    hideSelected: Boolean,
    listProps: {
      type: Object as PropType<VList['$props']>,
    },
    menu: Boolean,
    menuIcon: {
      type: String,
      default: '$dropdown',
    },
    menuProps: {
      type: Object as PropType<VMenu['$props']>,
    },
    multiple: Boolean,
    noDataText: {
      type: String,
      default: '$sui.noDataText',
    },
    openOnClear: Boolean,
    itemColor: String,

    ...makeItemsProps({ itemChildren: false }),
  },
  'Select'
);

export const makeVSelectProps = propsFactory(
  {
    ...makeSelectProps(),

    ...omit(
      makeVTextFieldProps({
        modelValue: null,
        role: 'combobox',
      }),
      // ['dirty', 'appendInnerIcon']
      ['dirty']
    ),

    ...makeTransitionProps({
      transition: { component: VDialogTransition as Component },
    }),
  },
  'VSelect'
);

type ItemType<T> = T extends readonly (infer U)[] ? U : never;

interface OptionSlotProps {
  item: any;
  index: number;
  isSelected: boolean;
}

// todo: import VTextField Slots and extend

export interface VSelectSlots extends VTextFieldSlots {
  option: (props: OptionSlotProps) => any;
}
