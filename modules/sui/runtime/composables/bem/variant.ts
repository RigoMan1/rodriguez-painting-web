// Utilities
import { computed, unref } from 'vue';
import { getCurrentInstanceName, propsFactory } from '../../util';

// Types
import type { PropType } from 'vue';
import type { MaybeRef } from '../../util';

export const presetVariants = [
  'primary',
  'secondary',
  'outlined',
  'text',
  'link',
  'none',
] as const;

export type Variant = (typeof presetVariants)[number];

export interface VariantProps {
  variant: Variant;
}

export const makeVariantProps = propsFactory(
  {
    variant: {
      type: String as PropType<Variant>,
      default: 'primary',
      validator: (v: any) => presetVariants.includes(v),
    },
  },
  'variant'
);

export function useVariant(
  props: MaybeRef<VariantProps>,
  name = getCurrentInstanceName()
) {
  const variantClasses = computed(() => {
    const { variant } = unref(props);
    if (!variant || variant === 'none') return [];
    return `${name}--variant-${variant}`;
  });

  return { variantClasses };
}
