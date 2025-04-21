import type { PropType } from 'vue';
import { propsFactory } from '../../util';

import { makeLayoutItemProps } from '../composables/layout';
import { makeComponentProps } from '../../composables/component';
import { makeDisplayProps } from '../../composables/display';

const locations = ['start', 'end', 'left', 'right', 'top', 'bottom'] as const;

export const makeVNavigationDrawerProps = propsFactory(
  {
    disableResizeWatcher: Boolean,
    disableRouteWatcher: Boolean,
    expandOnHover: Boolean,
    floating: Boolean,
    modelValue: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    permanent: Boolean,
    rail: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    railWidth: {
      type: [Number, String],
      default: 56,
    },
    scrim: {
      type: [Boolean, String],
      default: true,
    },
    image: String,
    temporary: Boolean,
    touchless: Boolean,
    width: {
      type: [Number, String],
      default: 256,
    },
    location: {
      type: String as PropType<(typeof locations)[number]>,
      default: 'start',
      validator: (value: any) => locations.includes(value),
    },
    sticky: Boolean,

    ...makeComponentProps({ tag: 'nav' }),
    ...makeDisplayProps(),
    ...makeLayoutItemProps(),
  },
  'VNavigationDrawer'
);
