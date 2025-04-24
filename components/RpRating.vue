<script setup>
const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },
});

const getStarType = (index) => {
  if (index <= Math.floor(props.rating)) {
    return 'i-mdi-star';
  } else if (index === Math.ceil(props.rating) && props.rating % 1 !== 0) {
    return 'i-mdi-star-half-full';
  } else {
    return 'i-mdi-star-outline';
  }
};
</script>

<template>
  <div class="inline-flex">
    <v-icon
      v-for="index in 5"
      :key="index"
      class="text-yellow-500"
      :name="getStarType(index)"
    />
  </div>
</template>
