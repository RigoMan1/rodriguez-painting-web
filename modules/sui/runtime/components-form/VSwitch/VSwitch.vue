<script setup lang="ts">
// Composables
import { useFocus } from '../../composables/focus';
import { useProxiedModel } from '../../composables/proxiedModel';
import { makeVSwitchProps } from './VSwitchMeta';
import { extractVSelectionControlProps } from './VSelectionControlMeta';
import type { VSelectionControl } from './VSelectionControlMeta';
import { useColor } from '../../composables/bem/color';
import { useSize } from '../../composables/bem/size';
import { useVariant } from '../../composables/bem/variant';

// Utilities
import { computed, ref, useAttrs } from 'vue';
import { filterInputAttrs, getUid, destructComputed } from '../../util';

defineOptions({ name: 'VSwitch', inheritAttrs: true });

defineEmits<{
  'update:modelValue': [boolean];
  'update:indeterminate': [boolean];
  'update:focused': [boolean];
}>();

const props = defineProps(makeVSwitchProps());
const { colorClasses } = useColor(props);
const { sizeClasses } = useSize(props);
const { variantClasses } = useVariant(props);

const indeterminate = useProxiedModel(props, 'indeterminate');
const model = useProxiedModel(props, 'modelValue');
const { isFocused, focus, blur } = useFocus(props);
const control = ref<VSelectionControl>();

const uid = getUid();
const id = computed(() => props.id || `switch-${uid}`);

function onChange() {
  if (indeterminate.value) {
    indeterminate.value = false;
  }
}
function onTrackClick(e: Event) {
  e.stopPropagation();
  e.preventDefault();
  control.value?.toggleInputNode();
}

const attrs = useAttrs();
const { controlAttrs } = destructComputed(() => {
  const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
  return { rootAttrs, controlAttrs };
});
const controlProps = computed(() => extractVSelectionControlProps(props));
</script>

<template>
  <v-selection-control
    :id="id"
    ref="control"
    v-bind="{
      ...controlAttrs,
      ...controlProps,
    }"
    v-model:model-value="model"
    class="v-switch"
    :class="[colorClasses, sizeClasses, variantClasses]"
    type="checkbox"
    :aria-checked="indeterminate ? 'mixed' : undefined"
    :focused="isFocused"
    @update:model-value="onChange"
    @focus="focus"
    @blur="blur"
  >
    <template #default>
      <div
        class="v-switch__track"
        @click="onTrackClick"
      >
        <div
          v-if="$slots['track-true']"
          key="prepend"
          class="v-switch__track-true"
        >
          <slot
            name="track-true"
            :model="model"
          />
        </div>

        <div
          v-if="$slots['track-false']"
          key="append"
          class="v-switch__track-false"
        >
          <slot
            name="track-false"
            :model="model"
          />
        </div>
      </div>
    </template>

    <template #input="{ icon, inputNode }">
      <component :is="inputNode" />

      <div
        class="v-switch__thumb"
        :class="{ 'v-switch__thumb--filled': icon || props.loading }"
      >
        <slot
          name="thumb"
          :icon="icon"
          :is-active="model"
        />
      </div>
    </template>
  </v-selection-control>
</template>
