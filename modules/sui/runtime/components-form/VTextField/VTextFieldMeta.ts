// Components
import type VTextField from './VTextField.vue';

// Composables
import { makeVFieldProps, type VFieldSlots } from '../VField/VFieldMeta';
import {
  makeVInputFrameProps,
  type VInputFrameSlots,
} from '../VInputFrame/VInputFrameMeta';

// Utilities
import { propsFactory, createPropsPicker } from '../../util';

// Types
import type { PropType } from 'vue';
// import type { VFieldSlots } from '../VField/VFieldMeta';
// import type { VInputFrameSlots } from '../VInputFrame/VInputFrameMeta';

export const makeVTextFieldProps = propsFactory(
  {
    autofocus: Boolean,
    placeholder: String,
    prefix: String,
    suffix: String,
    role: String,
    type: {
      type: String,
      default: 'text',
    },
    modelModifiers: Object as PropType<Record<string, boolean>>,
    modelValue: [String, Number, Object],

    ...makeVInputFrameProps(),
    ...makeVFieldProps(),
  },
  'VTextField'
);

// export type VTextFieldSlots = Omit<VInputFrameSlots & VFieldSlots, 'default'> & {
//   default: never;
// };

export const extractVTextFieldProps = createPropsPicker(makeVTextFieldProps);

export type VTextField = InstanceType<typeof VTextField>;

export interface VTextFieldSlots extends VInputFrameSlots, VFieldSlots {
  default: never;
}
