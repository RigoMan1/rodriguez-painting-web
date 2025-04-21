// Components
import type VMenu from './VMenu.vue';

import { VDialogTransition } from '../../components-transitions/dialog-transition';

import { makeVOverlayProps } from '../../components-overlay/VOverlay/VOverlayMeta';

import { omit, propsFactory } from '../../util';

// Types
import type { Component } from 'vue';

export const makeVMenuProps = propsFactory(
  {
    // TODO
    // disableKeys: Boolean,
    id: String,
    submenu: Boolean,
    ...omit(
      makeVOverlayProps({
        closeDelay: 250,
        closeOnContentClick: true,
        locationStrategy: 'connected' as const,
        location: undefined,
        openDelay: 300,
        scrim: false,
        scrollStrategy: 'reposition' as const,
        transition: { component: VDialogTransition as Component },
      }),
      ['absolute']
    ),
  },
  'VMenu'
);

export type VMenu = InstanceType<typeof VMenu>;
