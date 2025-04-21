<script setup lang="ts">
import { makeVListChildrenProps, extractVListGroupProps } from './VListMeta';
// Utilities
import { createList } from './list';
// Types
import type { InternalListItem, VListItemSlots } from './VListMeta';

export type VListChildrenSlots<T> = {
  [K in keyof Omit<VListItemSlots, 'default'>]: VListItemSlots[K] & { item: T };
} & {
  default: never;
  item: { props: InternalListItem['props'] };
};

defineOptions({ name: 'VListChildren' });
const props = defineProps(makeVListChildrenProps());

createList();

const VListGroupProps = extractVListGroupProps(props);

const combinedProps = (itemProps: any, activatorProps: any, item: any) => ({
  ...itemProps,
  ...activatorProps,
  value: props.returnObject ? item.raw : itemProps.value,
});
</script>

<template>
  <template
    v-for="(item, index) in props.items"
    :key="index"
  >
    <template v-if="item.children">
      <VListGroup
        :value="item.props?.value"
        v-bind="VListGroupProps"
      >
        <template #activator="{ props: activatorProps, isOpen }">
          <slot
            name="group-root"
            :props="combinedProps(item.props, activatorProps, item)"
            :is-open="isOpen"
          >
            <VListItem v-bind="combinedProps(item.props, activatorProps, item)" />
          </slot>
        </template>

        <template #default>
          <VListChildren
            :items="item.children"
            :return-object="props.returnObject"
          >
            <template
              v-if="$slots.item"
              #item="{ props: itemProps }"
            >
              <slot
                name="item"
                :props="itemProps"
              />
            </template>

            <template
              v-if="$slots.item"
              #group-root="{ props: itemProps, isOpen }"
            >
              <slot
                name="group-root"
                :props="itemProps"
                :is-open="isOpen"
              />
            </template>
          </VListChildren>
        </template>
      </VListGroup>
    </template>

    <template v-else>
      <slot
        name="item"
        :props="item.props"
      >
        <VListItem
          v-bind="item.props"
          :value="props.returnObject ? item : item.props.value"
        />
      </slot>
    </template>
  </template>
</template>
