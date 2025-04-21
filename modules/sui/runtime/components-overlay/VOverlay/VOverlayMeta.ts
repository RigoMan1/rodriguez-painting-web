import type VOverlay from '../VOverlay/VOverlay.vue';
import { propsFactory, createPropsPicker } from '../../util';

import { makeLocationStrategyProps } from '../composables/locationStrategies';
import { makeScrollStrategyProps } from '../composables/scrollStrategies';
import { makeTransitionProps } from '../../composables/transition';
import { makeLazyProps } from '../../composables/lazy';
import { makeActivatorProps } from '../composables/useActivator';
import { makeComponentProps } from '../../composables/component';
import { makeDimensionProps } from '../../composables/dimensions';

import type { PropType } from 'vue';

type VOverlayBEM = {
  root?: string;
  content?: string;
  scrim?: string;
};

export const makeVOverlayProps = propsFactory(
  {
    _disableGlobalStack: Boolean,
    arrow: Boolean,
    absolute: Boolean,
    attach: [Boolean, String, Object] as PropType<boolean | string | Element>,
    closeOnBack: {
      type: Boolean,
      default: true,
    },
    contained: Boolean,
    disabled: Boolean,
    opacity: [Number, String],
    noClickAnimation: Boolean,
    modelValue: Boolean,
    persistent: Boolean,
    scrim: {
      type: [Boolean, String],
      default: true,
    },
    zIndex: {
      type: [Number, String],
      default: 2000,
    },
    bem: {
      type: Object as PropType<VOverlayBEM>,
      default: () => ({
        root: '',
        content: '',
        scrim: '',
      }),
    },

    ...makeActivatorProps(),
    ...makeComponentProps(),
    ...makeDimensionProps(),
    ...makeLazyProps(),
    ...makeLocationStrategyProps(),
    ...makeScrollStrategyProps(),
    ...makeTransitionProps(),
  },
  'VOverlay'
);

export const extractVOverlayProps = createPropsPicker(makeVOverlayProps);
export type VOverlay = InstanceType<typeof VOverlay>;
