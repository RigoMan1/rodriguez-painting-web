// Composables
import { makeGroupItemProps, makeGroupProps } from '../../composables/group';
import { makeLazyProps } from '../../composables/lazy';
import { makeComponentProps } from '../../composables/component';

// Utilities
import { propsFactory } from '../../util';

// Types
import type { PropType, InjectionKey } from 'vue';
import type { RippleDirectiveBinding } from '../../directives/ripple';
import type { GroupItemProvide } from '../../composables/group';

export const VExpansionPanelSymbol: InjectionKey<GroupItemProvide> = Symbol.for(
  'sui:v-expansion-panel'
);

export const makeVExpansionPanelHeaderProps = propsFactory(
  {
    ripple: {
      type: [Boolean, Object] as PropType<RippleDirectiveBinding['value']>,
      default: true,
    },
    readonly: Boolean,
    focusable: Boolean,
  },
  'VExpansionPanelHeader'
);

export const makeVExpansionPanelProps = propsFactory(
  {
    ...makeGroupItemProps(),
    ...makeLazyProps(),
    ...makeComponentProps(),
    ...makeVExpansionPanelHeaderProps(),
  },
  'VExpansionPanel'
);

export const makeVExpansionPanelContentProps = propsFactory(
  {
    ...makeComponentProps(),
    ...makeLazyProps(),
  },
  'VExpansionPanelText'
);

export const makeVExpansionPanelsProps = propsFactory(
  {
    ...makeGroupProps(),
    ...makeVExpansionPanelProps(),
  },
  'VExpansionPanels'
);
