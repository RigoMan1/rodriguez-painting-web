import { propsFactory } from '../../util';
import { makeGroupItemProps } from '../../composables/group';
import { makeLazyProps } from '../../composables/lazy';
import { makeComponentProps } from '../../composables/component';

import type { TouchHandlers } from '../../directives/touch';
import type { ComputedRef, InjectionKey, Ref, PropType } from 'vue';
import type { GroupItemProvide } from '../../composables/group';

export const makeVSlideProps = propsFactory(
  {
    reverseTransition: {
      type: [Boolean, String],
      default: undefined,
    },
    transition: {
      type: [Boolean, String],
      default: undefined,
    },

    ...makeGroupItemProps(),
    ...makeLazyProps(),
  },
  'VSlide'
);

export const makeVSlidesProps = propsFactory(
  {
    continuous: Boolean,
    reverse: Boolean,
    touch: {
      type: [Object, Boolean] as PropType<boolean | TouchHandlers>,
      default: undefined,
    },
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    selectedClass: {
      type: String,
      default: 'v-slides-item--active',
    },
    modelValue: null,
    disabled: Boolean,
    ...makeComponentProps(),
  },
  'VSlides'
);

type SlidesProvide = {
  transition: ComputedRef<undefined | string>;
  transitionCount: Ref<number>;
  transitionHeight: Ref<undefined | string>;
  isReversed: Ref<boolean>;
  rootRef: Ref<HTMLElement | undefined>;
};

export const VSlidesSymbol: InjectionKey<SlidesProvide> = Symbol.for('sui:v-slides');
export const VSlidesGroupSymbol: InjectionKey<GroupItemProvide> =
  Symbol.for('sui:v-slides-group');
