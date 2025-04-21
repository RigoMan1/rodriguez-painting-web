<script lang="ts">
// Components
import { VExpandTransition } from '../../components-transitions';

// Composables
import { useList } from './list';
import { useNestedGroupActivator, useNestedItem } from './composables/nested';
import { useSsrBoot } from '../../composables/ssrBoot';
import { MaybeTransition } from '../../composables/transition';
import { makeVListGroupProps } from './VListMeta';

// Utilities
import { computed, toRef, defineComponent } from 'vue';

const VListGroupActivator = defineComponent({
  name: 'VListGroupActivator',

  setup(_, { slots }) {
    useNestedGroupActivator();

    return () => slots.default?.();
  },
});
</script>

<script setup lang="ts">
defineOptions({ name: 'VListGroup' });
const props = defineProps(makeVListGroupProps());

const { isOpen, open, id: _id } = useNestedItem(toRef(props, 'value'), true);
const id = computed(() => `v-list-group--id-${String(_id.value)}`);
const list = useList();
const { isBooted } = useSsrBoot();

function onClick(e: Event) {
  // ! 🐛 event value is not being passed
  // e.stopPropagation();
  open(!isOpen.value, e);
}

const activatorProps = computed(() => ({
  onClick,
  class: 'v-list-group__header',
  id: id.value,
}));

// const toggleIcon = computed(() => (isOpen.value ? props.collapseIcon : props.expandIcon));
</script>

<template>
  <component
    :is="props.tag"
    class="v-list-group"
    :class="{
      'v-list-group--prepend': list?.hasPrepend.value,
      'v-list-group--fluid': props.fluid,
      'v-list-group--subgroup': props.subgroup,
      'v-list-group--open': isOpen,
    }"
  >
    <template v-if="$slots.activator">
      <VListGroupActivator>
        <slot
          name="activator"
          :props="activatorProps"
          :is-open="isOpen"
        />
      </VListGroupActivator>
    </template>

    <MaybeTransition
      :transition="{ component: VExpandTransition }"
      :disabled="!isBooted"
    >
      <div
        v-show="isOpen"
        class="v-list-group__items"
        role="group"
        :aria-labelledby="id"
      >
        <slot />
      </div>
    </MaybeTransition>
  </component>
</template>
