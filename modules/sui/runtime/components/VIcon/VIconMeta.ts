import { makeSizeProps } from '../../composables/bem/size';
import { makeComponentProps } from '../../composables/component';
import { propsFactory } from '../../util/propsFactory';

export const makeVIconProps = propsFactory(
  {
    name: {
      type: String,
      default: undefined,
    },
    ...makeComponentProps({ tag: 'span' }),
    ...makeSizeProps(),
  },
  'VIcon'
);
