// Utilities
import { computed, unref } from 'vue';
import { getCurrentInstanceName, propsFactory } from '../../util';

// Types
import type { PropType } from 'vue';
import type { MaybeRef } from '../../util';

export const presetColors = [
  'primary',
  'secondary',

  'danger',
  'warn',
  'success',
  'info',
  'help',

  'light',
  'dark',

  'none',
] as const;

export type Color = (typeof presetColors)[number];

export interface ColorProps {
  color: Color;
}

export const makeColorProps = propsFactory(
  {
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (v: any) => presetColors.includes(v),
    },
  },
  'color'
);

export function useColor(props: MaybeRef<ColorProps>, name = getCurrentInstanceName()) {
  const colorClasses = computed(() => {
    const { color } = unref(props);
    if (!color || color === 'none') return [];
    return `${name}--color-${color}`;
  });

  return { colorClasses };
}
