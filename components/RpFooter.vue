<script setup lang="ts"></script>

<template>
  <v-footer height="auto">
    <v-divider />

    <div
      class="container mx-auto flex flex-col items-center justify-between space-y-4 p-6 sm:flex-row
        sm:space-y-0"
    >
      <nuxt-link to="#">
        <img
          class="h-12 rounded-full"
          src="/images/rp-logo-dark.png"
          alt="Logo"
        />
      </nuxt-link>

      <div class="flex flex-1 justify-center">
        <div
          class="mt-6 flex flex-wrap items-center justify-center gap-4 lg:mt-0 lg:gap-6"
        >
          <nuxt-link
            v-for="link in [
              { name: 'Services', path: '#services' },
              { name: 'About Us', path: '#about' },
              { name: 'Contact', path: '#' },
            ]"
            :key="link.name"
            :to="link.path"
            class="text-sm"
          >
            {{ link.name }}
          </nuxt-link>
        </div>
      </div>

      <v-text variant="caption">© Copyright 2025. All Rights Reserved.</v-text>
    </div>
  </v-footer>
</template>
