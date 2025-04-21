import { makeLayoutItemProps } from '../composables/layout';
import { makeScrollProps } from '../composables/scroll';
import { makeComponentProps } from '../../composables/component';
import { propsFactory } from '../../util/propsFactory';
import type { PropType } from 'vue';

export const makeVAppBarProps = propsFactory(
  {
    modelValue: {
      type: Boolean,
      default: true,
    },
    scrollBehavior: {
      type: String as PropType<'hide' | 'fade' | 'inverted' | 'custom'>,
      required: false,
    },
    location: {
      type: String as PropType<'top' | 'bottom'>,
      default: 'top',
    },
    height: {
      type: [Number, String],
      default: 64,
    },
    ...makeComponentProps({ tag: 'header' }),
    ...makeScrollProps(),
    ...makeLayoutItemProps(),
  },
  'VAppBar'
);
