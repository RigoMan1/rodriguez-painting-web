<script setup lang="ts"></script>
<template>
  <div
    class="grid max-w-7xl grid-cols-1 overflow-hidden rounded-none bg-gradient-to-r from-primary-500 to-primary-500/85 px-4 py-12 shadow-lg sm:mx-auto xl:rounded-xl md:grid-cols-12 md:px-8"
  >
    <!-- Text block -->
    <div
      class="col-span-1 flex flex-col justify-center space-y-6 text-center md:col-span-6 md:text-left"
    >
      <v-heading3 class="text-white">Ready to Transform Your Property?</v-heading3>
      <v-text
        variant="body-2"
        class="text-white/80"
      >
        Whether it's painting your home, refreshing your business, or striping your
        parking lot—Rodriguez Painting delivers professional, detail-focused results you
        can count on.
      </v-text>
    </div>

    <!-- Buttons -->
    <div
      class="col-span-1 mt-6 flex flex-wrap items-center justify-center space-x-3 pr-0 md:col-span-6
        md:mt-0 md:justify-end md:space-x-3 md:pr-8"
    >
      <v-button
        size="lg"
        color="secondary"
      >
        Get a Quote
      </v-button>
      <v-button
        size="lg"
        variant="outlined"
      >
        Call Us
      </v-button>
    </div>
  </div>
</template>
