import { propsFactory } from '../../util';

export const makeVDividerProps = propsFactory(
  {
    vertical: Boolean,
    decorative: Boolean,
    text: String,
  },
  'VDivider'
);
