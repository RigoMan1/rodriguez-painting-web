import { propsFactory } from '../../util';
import { makeLayoutProps } from '../composables/layout';
import { makeComponentProps } from '../../composables/component';

export const makeVAppProps = propsFactory(
  {
    ...makeLayoutProps({ fullHeight: true }),
    ...makeComponentProps(),
  },
  'VApp'
);
