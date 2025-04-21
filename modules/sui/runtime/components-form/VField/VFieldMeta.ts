import type VField from './VField.vue';
// Composables
import { makeComponentProps } from '../../composables/component';
import { makeFocusProps } from '../../composables/focus';

// Types
import type { Ref } from 'vue';

import { EventProp, propsFactory, createPropsPicker } from '../../util';

export interface DefaultInputSlot {
  isActive: Ref<boolean>;
  isFocused: Ref<boolean>;
  controlRef: Ref<HTMLElement | undefined>;
  focus: () => void;
  blur: () => void;
}

export const makeVFieldProps = propsFactory(
  {
    prependInnerIcon: String,
    appendInnerIcon: String,
    active: Boolean,
    dirty: Boolean,
    disabled: {
      type: Boolean,
      default: null,
    },
    error: Boolean,
    label: String,
    reverse: Boolean,

    'onClick:appendInner': EventProp<[MouseEvent]>(),
    'onClick:prependInner': EventProp<[MouseEvent]>(),

    ...makeComponentProps(),
    ...makeFocusProps(),
  },
  'VField'
);

export const extractVFieldProps = createPropsPicker(makeVFieldProps);

export type VField = InstanceType<typeof VField>;

export interface VFieldSlots {
  'prepend-inner': any;
  'append-inner': any;
}
