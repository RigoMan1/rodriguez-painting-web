import { makeVSelectionControlProps } from './VSelectionControlMeta';
import { makeColorProps } from '../../composables/bem/color';
import { makeSizeProps } from '../../composables/bem/size';
import { makeVariantProps } from '../../composables/bem/variant';

import { propsFactory } from '../../util';
import { pick } from '../../util/helpers';

export const makeVSwitchProps = propsFactory(
  {
    indeterminate: Boolean,
    inset: Boolean,
    flat: Boolean,
    loading: {
      type: [Boolean, String],
      default: false,
    },

    ...makeColorProps(),
    ...makeSizeProps(),
    ...makeVariantProps(),
    ...makeVSelectionControlProps(),
  },
  'VSwitch'
);

const controlPropsKeys = Object.keys(makeVSelectionControlProps());

export const getControlProps = (props) => pick(props, controlPropsKeys);
