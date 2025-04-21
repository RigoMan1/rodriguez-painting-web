import type VSelectionControl from './VSelectionControl.vue';
// Composables
import { makeComponentProps } from '../../composables/component';

// Utilities
import { propsFactory, deepEqual, createPropsPicker } from '../../util';

// Types
import type { PropType } from 'vue';
import type { RippleDirectiveBinding } from '../../directives/ripple';

export const makeVSelectionControlProps = propsFactory(
  {
    label: String,
    baseColor: String,
    trueValue: null,
    falseValue: null,
    value: null,

    ...makeComponentProps(),

    // originally in VSelectionControlGroup
    valueComparator: {
      type: Function as PropType<typeof deepEqual>,
      default: deepEqual,
    },
    disabled: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    readonly: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    indeterminate: Boolean,
    falseIcon: String,
    trueIcon: String,
    modelValue: null,
    id: String,
    error: Boolean,
    inline: Boolean,
    ripple: {
      type: [Boolean, Object] as PropType<RippleDirectiveBinding['value']>,
      default: true,
    },
    type: String,
    name: String,
  },
  'VSelectionControl'
);

export type VSelectionControl = InstanceType<typeof VSelectionControl>;

export const extractVSelectionControlProps = createPropsPicker(
  makeVSelectionControlProps
);
