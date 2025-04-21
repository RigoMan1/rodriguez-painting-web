// Utilities
import type { PropType } from 'vue';
import {
  convertToUnit,
  destructComputed,
  getCurrentInstanceName,
  propsFactory,
} from '../../util';

// Types
const _presetSizes = ['xs', 'sm', 'base', 'lg', 'xl', 'none'] as const;

type PresetSizes = (typeof _presetSizes)[number];
export interface SizeProps {
  size?: PresetSizes;
  scale?: string | number;
}

export const makeSizeProps = propsFactory(
  {
    /** Represents one of the predefined size options ('xs', 'sm', 'base', 'lg', 'xl'). */
    size: {
      type: String as PropType<PresetSizes>,
      default: 'base',
    },
    /** A custom scale value that can be a string or number, which directly sets the width and height of the component. */
    scale: {
      type: [String, Number],
      default: undefined,
    },
  },
  'size'
);

export function useSize(props: SizeProps, name = getCurrentInstanceName()) {
  return destructComputed(() => {
    let sizeClasses;
    let sizeStyles;
    if (props.scale) {
      sizeStyles = {
        width: convertToUnit(props.scale),
        height: convertToUnit(props.scale),
      };
    } else if (props.size && props.size !== 'none') {
      sizeClasses = `${name}--size-${props.size}`;
    }
    return { sizeClasses, sizeStyles };
  });
}
