// Types
import type { PropType } from 'vue';
import { propsFactory } from '../util/propsFactory';

export type Tag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | ({} & string); // any other string

export interface ComponentProps {
  tag?: Tag;
}

// Composables
export const makeComponentProps = propsFactory(
  {
    tag: {
      type: String as PropType<Tag>,
      default: 'div',
    },
  },
  'component'
);
