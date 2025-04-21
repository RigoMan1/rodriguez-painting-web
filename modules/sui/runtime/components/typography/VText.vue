<script setup lang="ts">
import { computed } from 'vue';
import { makeComponentProps } from '../../composables/component';

type TextVariants =
  | 'body-1'
  | 'body-2'
  | 'subtitle-1'
  | 'subtitle-2'
  | 'caption'
  | 'overline'
  | 'blockquote';

const props = defineProps({
  ...makeComponentProps({ tag: undefined }),
  variant: {
    type: String as () => TextVariants,
    default: 'body-1',
  },
});

const variantMap = {
  'body-1': {
    class: 'v-body-1',
    tag: 'p',
  },
  'body-2': {
    class: 'v-body-2',
    tag: 'p',
  },
  'subtitle-1': {
    class: 'v-subtitle-1',
    tag: 'h6',
  },
  'subtitle-2': {
    class: 'v-subtitle-2',
    tag: 'h6',
  },
  caption: {
    class: 'v-caption',
    tag: 'span',
  },
  overline: {
    class: 'v-overline',
    tag: 'span',
  },
  blockquote: {
    class: 'v-blockquote',
    tag: 'blockquote',
  },
} as { [key in TextVariants]: { class: string; tag: string } };

const activeVariant = computed(() => variantMap[props.variant]);
</script>

<template>
  <component
    :is="props.tag || activeVariant.tag"
    class="v-text"
    :class="activeVariant.class"
  >
    <slot />
  </component>
</template>
