<script setup lang="ts">
defineProps<{
  subHeading: string;
  title: string;
}>();
</script>

<template>
  <div>
    <pre-heading :label="subHeading" />

    <v-heading1 tag="h2">
      {{ title }}
    </v-heading1>
  </div>
</template>
