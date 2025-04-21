// Components
import type VTextarea from './VTextarea.vue';

// Composables
import { makeVFieldProps } from '../VField/VFieldMeta';
import { makeVInputFrameProps } from '../VInputFrame/VInputFrameMeta';

// Utilities
import { propsFactory, createPropsPicker } from '../../util';

// Types
import type { PropType } from 'vue';
// import type { VFieldSlots } from '../VField/VFieldMeta';
// import type { VInputFrameSlots } from '../VInputFrame/VInputFrameMeta';

export const makeVTextareaProps = propsFactory(
  {
    modelValue: {
      type: String,
      default: '',
    },
    autoGrow: Boolean,
    autofocus: Boolean,
    placeholder: String,
    prefix: String,
    persistentPlaceholder: Boolean,
    noResize: Boolean,
    rows: {
      type: [Number, String],
      default: 5,
      validator: (v: any) => !isNaN(parseFloat(v)),
    },
    maxRows: {
      type: [Number, String],
      validator: (v: any) => !isNaN(parseFloat(v)),
    },
    suffix: String,
    modelModifiers: Object as PropType<Record<string, boolean>>,

    ...makeVInputFrameProps(),
    ...makeVFieldProps(),
  },
  'VTextarea'
);

// export type VTextareaSlots = Omit<VInputFrameSlots & VFieldSlots, 'default'> & {
//   default: never;
// };

export const extractVTextareaProps = createPropsPicker(makeVTextareaProps);

export type VTextarea = InstanceType<typeof VTextarea>;
