import type VVirtualScroll from './VVirtualScroll.vue';
// Composables
import { makeComponentProps } from '../../composables/component';

// Utilities
import { propsFactory } from '../../util';

// Composables

import { makeDimensionProps } from '../../composables/dimensions';
import { makeVirtualProps } from './virtual';

// Types
import type { PropType } from 'vue';

export interface VVirtualScrollSlot<T> {
  item: T;
  index: number;
}

export const makeVVirtualScrollProps = propsFactory(
  {
    items: {
      type: Array as PropType<readonly unknown[]>,
      default: () => [],
    },

    ...makeVirtualProps(),
    ...makeComponentProps({
      tag: undefined,
    }),
    ...makeDimensionProps(),
  },
  'VVirtualScroll'
);

export type VVirtualScroll = InstanceType<typeof VVirtualScroll>;
