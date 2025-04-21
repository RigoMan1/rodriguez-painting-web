import { createCssTransition, createJavascriptTransition } from './createTransition';
import ExpandTransitionGenerator from './expand-transition';

export const VSlideYTransition = createCssTransition('slide-y-transition');
export { VDialogTransition } from './dialog-transition';

export const VExpandTransition = createJavascriptTransition(
  'expand-transition',
  ExpandTransitionGenerator()
);
export type VExpandTransition = InstanceType<typeof VExpandTransition>;
