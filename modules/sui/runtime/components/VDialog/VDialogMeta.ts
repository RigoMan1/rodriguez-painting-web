import { propsFactory } from '../../util';
import { makeVOverlayProps } from '../../components-overlay/VOverlay/VOverlayMeta';
// Components
import type { Component } from 'vue';
import { VDialogTransition } from '../../components-transitions';

/**
 * Creates the props object for the VDialog component.
 *
 * @returns The props object for the VDialog component.
 */
export const makeVDialogProps = propsFactory(
  {
    /**
     * Changes layout for fullscreen display.
     */
    fullscreen: Boolean,
    /**
     * Tab focus will return to the first child of the dialog by default. Disable this when using external tools that require focus such as TinyMCE or vue-clipboard.
     */
    retainFocus: {
      type: Boolean,
      default: true,
    },
    /**
     * When set to true, expects a v-card and a v-card-text component with a designated height. For more information, check out the scrollable example
     */
    scrollable: Boolean,
    ...makeVOverlayProps({
      origin: 'center center' as const,
      scrollStrategy: 'block' as const,
      transition: { component: VDialogTransition as Component },
      zIndex: 2400,
    }),
  },
  'VDialog'
);
