// Composables
import { useProxiedModel } from '../../../composables/proxiedModel';
import type { makeVSelectionControlProps } from '../VSelectionControlMeta';

// Utilities
import { computed } from 'vue';

// Types
import type { ExtractPropTypes } from 'vue';

import type { EventProp } from '../../../util';

export function useSelectionControl(
  props: ExtractPropTypes<ReturnType<typeof makeVSelectionControlProps>> & {
    'onUpdate:modelValue': EventProp | undefined;
  }
) {
  const modelValue = useProxiedModel(props, 'modelValue');
  const trueValue = computed(() =>
    props.trueValue !== undefined
      ? props.trueValue
      : props.value !== undefined
        ? props.value
        : true
  );

  const falseValue = computed(() => {
    return props.falseValue !== undefined ? props.falseValue : false;
  });

  const model = computed({
    get() {
      const val = modelValue.value;

      return props.valueComparator(val, trueValue.value);
    },
    set(val: boolean) {
      if (props.readonly) return;

      const currentValue = val ? trueValue.value : falseValue.value;

      const newVal = currentValue;

      modelValue.value = newVal;
    },
  });

  const icon = computed(() => (model.value ? props.trueIcon : props.falseIcon));

  return {
    trueValue,
    falseValue,
    model,
    icon,
  };
}
