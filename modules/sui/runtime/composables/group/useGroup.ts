// Composables
import { useProxiedModel } from '../proxiedModel';

// Utilities
import { getIds, getItemIndex, getValues } from './utils';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  toRef,
  unref,
  onUpdated,
} from 'vue';
import {
  findChildrenWithProvide,
  getCurrentInstance,
  propsFactory,
  wrapInArray,
} from '../../util';

// Types
import type { ComponentInternalInstance, InjectionKey, PropType, UnwrapRef } from 'vue';
import type { GroupItem, GroupProps, GroupProvide } from './';

export const makeGroupProps = propsFactory(
  {
    modelValue: {
      type: null,
      default: undefined,
    },
    multiple: Boolean,
    mandatory: [Boolean, String] as PropType<boolean | 'force'>,
    max: Number,
    selectedClass: String,
    disabled: Boolean,
  },
  'group'
);

export function useGroup(props: GroupProps, injectKey: InjectionKey<GroupProvide>) {
  let isUnmounted = false;
  const items = reactive<GroupItem[]>([]);
  const selected = useProxiedModel(
    props,
    'modelValue',
    [],
    (v) => {
      if (v == null) return [];

      return getIds(items, wrapInArray(v));
    },
    (v) => {
      const arr = getValues(items, v);

      return props.multiple ? arr : arr[0];
    }
  );

  const groupVm = getCurrentInstance('useGroup');

  function register(item: GroupItem, vm: ComponentInternalInstance) {
    // Is there a better way to fix this typing?
    const unwrapped = item as unknown as UnwrapRef<GroupItem>;

    const key = Symbol.for(`${injectKey.description}:id`);
    const children = findChildrenWithProvide(key, groupVm?.vnode);
    const index = children.indexOf(vm);

    if (unref(unwrapped.value) == null) {
      unwrapped.value = index;
      unwrapped.useIndexAsValue = true;
    }

    if (index > -1) {
      items.splice(index, 0, unwrapped);
    } else {
      items.push(unwrapped);
    }
  }

  function unregister(id: number) {
    if (isUnmounted) return;

    // TODO: re-evaluate this line's importance in the future
    // should we only modify the model if mandatory is set.
    // selected.value = selected.value.filter(v => v !== id)

    forceMandatoryValue();

    const index = items.findIndex((item) => item.id === id);
    items.splice(index, 1);
  }

  // If mandatory and nothing is selected, then select first non-disabled item
  function forceMandatoryValue() {
    const item = items.find((item) => !item.disabled);
    if (item && props.mandatory === 'force' && !selected.value.length) {
      selected.value = [item.id];
    }
  }

  onMounted(() => {
    forceMandatoryValue();
  });

  onBeforeUnmount(() => {
    isUnmounted = true;
  });

  onUpdated(() => {
    // update the items that use the index as the value.
    for (let i = 0; i < items.length; i++) {
      if (items[i].useIndexAsValue) {
        items[i].value = i;
      }
    }
  });

  function select(id: number, value?: boolean) {
    const item = items.find((item) => item.id === id);
    if (value && item?.disabled) return;

    if (props.multiple) {
      const internalValue = selected.value.slice();
      const index = internalValue.findIndex((v) => v === id);
      const isSelected = ~index;
      value = value ?? !isSelected;

      // We can't remove value if group is
      // mandatory, value already exists,
      // and it is the only value
      if (isSelected && props.mandatory && internalValue.length <= 1) return;

      // We can't add value if it would
      // cause max limit to be exceeded
      if (!isSelected && props.max != null && internalValue.length + 1 > props.max)
        return;

      if (index < 0 && value) internalValue.push(id);
      else if (index >= 0 && !value) internalValue.splice(index, 1);

      selected.value = internalValue;
    } else {
      const isSelected = selected.value.includes(id);
      if (props.mandatory && isSelected) return;

      selected.value = (value ?? !isSelected) ? [id] : [];
    }
  }

  function step(offset: number) {
    // getting an offset from selected value obviously won't work with multiple values
    if (props.multiple)
      console.warn('This method is not supported when using "multiple" prop');

    if (!selected.value.length) {
      const item = items.find((item) => !item.disabled);
      item && (selected.value = [item.id]);
    } else {
      const currentId = selected.value[0];
      const currentIndex = items.findIndex((i) => i.id === currentId);

      let newIndex = (currentIndex + offset) % items.length;
      let newItem = items[newIndex];

      while (newItem.disabled && newIndex !== currentIndex) {
        newIndex = (newIndex + offset) % items.length;
        newItem = items[newIndex];
      }

      if (newItem.disabled) return;

      selected.value = [items[newIndex].id];
    }
  }

  const state: GroupProvide = {
    register,
    unregister,
    selected,
    select,
    disabled: toRef(props, 'disabled'),
    prev: () => step(items.length - 1),
    next: () => step(1),
    isSelected: (id: number) => selected.value.includes(id),
    selectedClass: computed(() => props.selectedClass),
    items: computed(() => items),
    getItemIndex: (value: unknown) => getItemIndex(items, value),
  };

  provide(injectKey, state);

  return state;
}
