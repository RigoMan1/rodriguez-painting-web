<script setup lang="ts">
// Composables
import { useDimension } from '../../composables/dimensions';
import { useToggleScope } from '../../composables/toggleScope';
import { useVirtual } from './virtual';
import { makeVVirtualScrollProps } from './VVirtualScrollMeta';

// Utilities
import { onMounted, onScopeDispose, toRef, computed } from 'vue';
import { convertToUnit, getCurrentInstance, getScrollParent } from '../../util';

defineOptions({ name: 'VVirtualScroll' });
const props = defineProps(makeVVirtualScrollProps());

const vm = getCurrentInstance('VVirtualScroll');
const { dimensionStyles } = useDimension(props);
const {
  containerRef,
  markerRef,
  handleScroll,
  handleScrollend,
  handleItemResize,
  scrollToIndex,
  paddingTop,
  paddingBottom,
  computedItems,
} = useVirtual(props, toRef(props, 'items'));

const isRenderless = computed(() => !props.tag);
useToggleScope(
  () => isRenderless.value,
  () => {
    function handleListeners(add = false) {
      const method = add ? 'addEventListener' : 'removeEventListener';

      if (containerRef.value === document.documentElement) {
        document[method]('scroll', handleScroll, { passive: true });
        document[method]('scrollend', handleScrollend);
      } else {
        containerRef.value?.[method]('scroll', handleScroll, { passive: true });
        containerRef.value?.[method]('scrollend', handleScrollend);
      }
    }

    onMounted(() => {
      containerRef.value = getScrollParent(vm.vnode.el as HTMLElement, true);
      handleListeners(true);
    });
    onScopeDispose(handleListeners);
  }
);

defineExpose({ scrollToIndex });
</script>

<template>
  <template v-if="isRenderless">
    <div
      ref="markerRef"
      class="v-virtual-scroll__spacer"
      :style="{ paddingTop: convertToUnit(paddingTop) }"
    />
    <VVirtualScrollItem
      v-for="item in computedItems"
      :key="item.index"
      @update:height="(height) => handleItemResize(item.index, height)"
    >
      <slot
        :item="item.raw"
        :index="item.index"
      />
    </VVirtualScrollItem>
    <div
      class="v-virtual-scroll__spacer"
      :style="{ paddingBottom: convertToUnit(paddingBottom) }"
    />
  </template>

  <template v-else>
    <component
      :is="props.tag"
      ref="containerRef"
      class="v-virtual-scroll"
      :style="dimensionStyles"
      @scroll.passive="handleScroll"
      @scrollend="handleScrollend"
    >
      <div
        ref="markerRef"
        class="v-virtual-scroll__container"
        :style="{
          paddingTop: convertToUnit(paddingTop),
          paddingBottom: convertToUnit(paddingBottom),
        }"
      >
        <VVirtualScrollItem
          v-for="item in computedItems"
          :key="item.index"
          @update:height="(height) => handleItemResize(item.index, height)"
        >
          <slot
            :item="item.raw"
            :index="item.index"
          />
        </VVirtualScrollItem>
      </div>
    </component>
  </template>
</template>
