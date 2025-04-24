<script setup lang="ts">
// todo: hide logo in mobile and show it above hero text
</script>

<template>
  <v-app-bar
    v-slot="{ scrollData }"
    class="h-full border-b border-white/10 text-white"
    height="80"
    scroll-behavior="custom"
    scroll-threshold="75"
  >
    <div
      class="flex h-full items-center transition-all duration-300"
      :class="{
        'bg-zinc-900 shadow-lg': scrollData.thresholdExceeded,
      }"
    >
      <div class="flex w-full items-center justify-between sm:container">
        <nuxt-link
          class="text-lg font-medium"
          to="/"
        >
          <img
            class="h-10 sm:h-14"
            src="/images/rp-logo-light.png"
            alt="Logo"
          />
        </nuxt-link>

        <div class="flex items-center space-x-4 sm:space-x-12">
          <nuxt-link to="/#services">Services</nuxt-link>
          <nuxt-link to="/#about">About</nuxt-link>
          <nuxt-link to="/#contact">Contact</nuxt-link>

          <v-button
            class="hidden sm:inline-flex"
            href="tel:2142416937"
            prepend-icon="i-mdi-phone"
          >
            (214) 241-6937
          </v-button>
        </div>

        <v-button
          class="mr-2 sm:hidden"
          href="tel:2142416937"
          icon="i-mdi-phone"
        />
      </div>
    </div>
  </v-app-bar>
</template>
