// Composables
import { makeComponentProps } from '../../composables/component';
import { makeGroupProps } from '../../composables/group';

import { propsFactory } from '../../util';

export const VGroupSymbol = Symbol.for('sui:v-group');

export const makeVGroupProps = propsFactory(
  {
    ...makeComponentProps(),
    ...makeGroupProps({
      selectedClass: 'v-item--selected',
    }),
  },
  'VGroup'
);
