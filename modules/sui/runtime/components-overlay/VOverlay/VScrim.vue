<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  [key: string]: unknown;
}>();

const { modelValue, ...rest } = props;
</script>

<template>
  <Transition
    name="fade-transition"
    appear
  >
    <div
      v-if="props.modelValue"
      class="v-overlay__scrim"
      v-bind="rest"
    />
  </Transition>
</template>
