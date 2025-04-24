<script setup lang="ts"></script>

<template>
  <div>
    <section-hero />

    <section-about
      id="about"
      class="container mt-12 sm:mt-24"
    />

    <div
      id="services"
      class="mt-24 bg-zinc-100 py-20"
    >
      <section-services class="container" />
    </div>

    <section-testimonial class="container mt-24" />

    <rp-cta class="mt-24 bg-gray-100" />
  </div>
</template>
