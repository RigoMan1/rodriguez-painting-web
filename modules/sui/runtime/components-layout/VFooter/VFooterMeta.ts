import { makeComponentProps } from '../../composables/component';
import { propsFactory } from '../../util/propsFactory';
import { makeLayoutItemProps } from '../composables/layout';

export const makeVFooterProps = propsFactory(
  {
    app: Boolean,
    height: {
      type: [Number, String],
      default: 'auto',
    },
    ...makeComponentProps({ tag: 'footer' }),
    ...makeLayoutItemProps(),
  },
  'VFooter'
);
