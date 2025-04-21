// Utilities
import { computed, inject, onBeforeUnmount, provide, toRef, watch } from 'vue';
import { getCurrentInstance, getUid, propsFactory } from '../../util';

// Types
import type { InjectionKey } from 'vue';
import type { GroupItemProps, GroupItemProvide, GroupProvide } from './';

export const makeGroupItemProps = propsFactory(
  {
    value: null,
    disabled: Boolean,
    selectedClass: String,
  },
  'group-item'
);

export function useGroupItem<T extends boolean = true>(
  props: GroupItemProps,
  injectKey: InjectionKey<GroupProvide>,
  required?: T
): T extends true ? GroupItemProvide : GroupItemProvide | null {
  const vm = getCurrentInstance('useGroupItem');

  if (!vm) {
    throw new Error(
      '[SUI] useGroupItem composable must be used inside a component setup function'
    );
  }

  const id = getUid();

  provide(Symbol.for(`${injectKey.description}:id`), id);

  const group = inject(injectKey, null);

  if (!group) {
    if (!required) return group;

    throw new Error(
      `[SUI] Could not find useGroup injection with symbol ${injectKey.description}`
    );
  }

  const value = toRef(props, 'value');
  const disabled = computed(() => !!(group.disabled.value || props.disabled));

  group.register(
    {
      id,
      value,
      disabled,
    },
    vm
  );

  onBeforeUnmount(() => {
    group.unregister(id);
  });

  const isSelected = computed(() => group.isSelected(id));
  const isFirst = computed(() => group.items.value[0].id === id);
  const isLast = computed(
    () => group.items.value[group.items.value.length - 1].id === id
  );

  const selectedClass = computed(
    () => isSelected.value && [group.selectedClass.value, props.selectedClass]
  );

  watch(
    isSelected,
    (value) => {
      vm.emit('group:selected', { value });
    },
    { flush: 'sync' }
  );

  return {
    id,
    isSelected,
    isFirst,
    isLast,
    toggle: () => group.select(id, !isSelected.value),
    select: (value: boolean) => group.select(id, value),
    selectedClass,
    value,
    disabled,
    group,
  };
}
