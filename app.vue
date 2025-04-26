<script setup lang="ts">
const domain = 'rodriguez-painting-web.vercel.app';
const title = 'Rodriguez - Painting & Striping Services';
const description =
  'Rodriguez Painting & Striping Services - Your trusted partner for all your painting and striping needs. Contact us today for a free estimate!';
const image = `https://${domain}/images/og-image-main.jpg`;

useSeoMeta({
  ogTitle: title,
  ogDescription: description,
  ogImage: image,
  // ogUrl: `https://${domain}`,
  ogType: 'website',
});
</script>

<template>
  <v-app class="bg-gray-50">
    <rp-header />

    <v-main>
      <nuxt-page />
    </v-main>

    <rp-footer class="mt-20" />
  </v-app>
</template>
