// Composables
import { makeComponentProps } from '../../composables/component';

import { makeSizeProps } from '../../composables/bem/size';
import { makeVariantProps } from '../../composables/bem/variant';
import { makeColorProps } from '../../composables/bem/color';

import { propsFactory } from '../../util';

// Types
import type { PropType } from 'vue';
import type { RippleDirectiveBinding } from '../../directives/ripple';
import type { RouteLocationRaw } from 'vue-router';
import type { NuxtLinkProps } from '#app';

const nuxtLinkProps = {
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined,
    required: false,
  },
  href: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined,
    required: false,
  },

  // Attributes
  target: {
    type: String as PropType<NuxtLinkProps['target']>,
    default: undefined,
    required: false,
  },
  rel: {
    type: String as PropType<NuxtLinkProps['rel']>,
    default: undefined,
    required: false,
  },
  noRel: {
    type: Boolean as PropType<NuxtLinkProps['noRel']>,
    default: undefined,
    required: false,
  },

  // Prefetching
  prefetch: {
    type: Boolean as PropType<NuxtLinkProps['prefetch']>,
    default: undefined,
    required: false,
  },
  noPrefetch: {
    type: Boolean as PropType<NuxtLinkProps['noPrefetch']>,
    default: undefined,
    required: false,
  },

  // Styling
  activeClass: {
    type: String as PropType<NuxtLinkProps['activeClass']>,
    default: undefined,
    required: false,
  },
  exactActiveClass: {
    type: String as PropType<NuxtLinkProps['exactActiveClass']>,
    default: undefined,
    required: false,
  },
  prefetchedClass: {
    type: String as PropType<NuxtLinkProps['prefetchedClass']>,
    default: undefined,
    required: false,
  },

  // Vue Router's `<RouterLink>` additional props
  replace: {
    type: Boolean as PropType<NuxtLinkProps['replace']>,
    default: undefined,
    required: false,
  },
  ariaCurrentValue: {
    type: String as PropType<NuxtLinkProps['ariaCurrentValue']>,
    default: undefined,
    required: false,
  },

  // Edge cases handling
  external: {
    type: Boolean as PropType<NuxtLinkProps['external']>,
    default: undefined,
    required: false,
  },
};

export const makeVButtonProps = propsFactory(
  {
    active: {
      type: Boolean,
      default: undefined,
    },
    disabled: Boolean,
    loading: Boolean,

    icon: [Boolean, String],
    prependIcon: String,
    appendIcon: String,

    block: Boolean,
    readonly: Boolean,
    stacked: Boolean,

    ripple: {
      type: [Boolean, Object] as PropType<RippleDirectiveBinding['value']>,
      default: true,
    },

    label: String,

    ...makeComponentProps({ tag: 'button' }),
    ...makeVariantProps(),
    ...makeSizeProps(),
    ...makeColorProps(),
    ...nuxtLinkProps,
  },
  'VButton'
);
