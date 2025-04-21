<script setup lang="ts">
import { useSize } from '../../composables/bem/size';
import { useVariant } from '../../composables/bem/variant';
import { useColor } from '../../composables/bem/color';
import { makeVButtonProps } from './VButtonMeta';

import { computed } from 'vue';
import { Ripple as vRipple } from '../../directives/ripple';

defineOptions({ name: 'VButton' });

const props = defineProps(makeVButtonProps());

const { sizeClasses } = useSize(props);
const { variantClasses } = useVariant(props);
const { colorClasses } = useColor(props);

const isLink = computed(() => !!(props.href || props.to));

const VNuxtLink = resolveComponent('NuxtLink');
const component = computed(() => (isLink.value ? VNuxtLink : props.tag));

const slots = useSlots();
const hasPrepend = computed(() => !!(props.prependIcon || slots.prepend));
const hasAppend = computed(() => !!(props.appendIcon || slots.append));
const hasIcon = computed(() => !!(props.icon && props.icon !== true));
const isActive = computed(() => {
  if (props.active !== undefined) {
    return props.active;
  }

  if (isLink.value) {
    const route = useRoute();
    return route.path === props.to;
  }

  return false;
});

const dataState = computed(() => {
  if (props.loading) return 'loading';
  if (props.disabled) return 'disabled';
  if (props.readonly) return 'readonly';
  if (isActive.value) return 'active';
  return 'idle';
});

const routerProps = {
  to: props.to,
  href: props.href,
  target: props.target,
  rel: props.rel,
  noRel: props.noRel,
  prefetch: props.prefetch,
  noPrefetch: props.noPrefetch,
  activeClass: props.activeClass,
  exactActiveClass: props.exactActiveClass,
  prefetchedClass: props.prefetchedClass,
  replace: props.replace,
  ariaCurrentValue: props.ariaCurrentValue,
  external: props.external,
};
</script>

<template>
  <component
    :is="component"
    v-ripple="props.ripple"
    class="v-button"
    :class="[
      colorClasses,
      sizeClasses,
      variantClasses,
      {
        'v-button--icon-only': !!props.icon,
        'v-button--readonly': props.readonly,
        'v-button--stacked': props.stacked,
      },
    ]"
    :disabled="props.disabled"
    :aria-busy="props.loading ? true : undefined"
    :tabindex="props.loading || props.readonly ? -1 : undefined"
    :data-state="dataState"
    v-bind="routerProps"
  >
    <span
      v-if="hasPrepend"
      key="prepend"
      class="v-button__prepend"
    >
      <v-icon
        v-if="props.prependIcon"
        :name="props.prependIcon"
        class="v-button__prepend-icon"
        size="none"
      />

      <slot name="prepend" />
    </span>

    <span class="v-button__content">
      <v-icon
        v-if="!$slots.default && hasIcon"
        :name="(props.icon as string)"
        class="v-button__icon"
        size="none"
      />

      <slot v-else>
        {{ props.label }}
      </slot>
    </span>

    <span
      v-if="hasAppend"
      key="append"
      class="v-button__append"
    >
      <v-icon
        v-if="props.appendIcon"
        :name="props.appendIcon"
        class="v-button__append-icon"
        size="none"
      />

      <slot name="append" />
    </span>
  </component>
</template>
