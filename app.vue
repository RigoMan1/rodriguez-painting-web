<script setup lang="ts"></script>

<template>
  <v-app>
    <v-app-bar class="flex items-center border-b border-zinc-800 bg-zinc-900 px-4">
      <nuxt-link
        class="ml-3 text-lg font-medium"
        to="/"
      >
        AI Flashcards
      </nuxt-link>
    </v-app-bar>

    <v-main>
      <div class="container p-4">
        <nuxt-page />
      </div>
    </v-main>

    <v-footer height="auto">
      <div class="flex h-12 items-center justify-center text-sm text-zinc-500">
        <span>
          &copy;
          {{ new Date().getFullYear() }}
          All Rights Reserved
        </span>
      </div>
    </v-footer>
  </v-app>
</template>
