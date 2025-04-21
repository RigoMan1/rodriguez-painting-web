import { propsFactory } from '../../util/propsFactory';
import { makeComponentProps } from '../../composables/component';

export const makeVMainProps = propsFactory(
  {
    scrollable: Boolean,
    ...makeComponentProps({
      tag: 'main',
    }),
  },
  'VMain'
);
