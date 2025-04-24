<template>
  <section
    class="relative -mt-24 bg-cover bg-center"
    style="background-image: url('/images/hero.jpg')"
  >
    <!-- Dark overlay -->
    <!-- bg-primary-900/50 -->
    <div class="absolute inset-0 bg-black/60" />

    <div class="relative mx-auto px-6 py-16 text-center text-white">
      <div class="mx-auto mt-32 max-w-3xl">
        <!-- <v-heading1 class="font-semibold leading-normal">
          Rodriguez
          <span class="rounded bg-primary-500/90 px-2">Painting</span>
          &
          <br />
          <span class="rounded bg-primary-500/90 px-2">Parking Lot Striping</span>
          Services
        </v-heading1> -->

        <v-heading1 class="text-4xl sm:text-6xl">
          <span>Rodriguez</span>
          <br />
          <span class="rounded bg-primary-500/90 px-2">Painting & Striping Services</span>
        </v-heading1>

        <div class="mt-6 flex justify-center gap-1 sm:gap-3">
          <v-button
            variant="outlined"
            label="Explore Our Services"
            size="lg"
            href="#services"
          />

          <v-button
            color="secondary"
            label="Get a Quote"
            size="lg"
          />
        </div>

        <div class="mt-12 flex items-center justify-center space-x-3">
          <nuxt-link
            to="https://www.facebook.com/rodriguezpaintingservices"
            target="_blank"
          >
            <img
              src="/images/facebook-icon.png"
              alt=""
              class="h-12"
            />
          </nuxt-link>

          <nuxt-link
            to="https://www.google.com/maps/place/Rodriguez+Painting+%26+Parking+Lot+Striping+Services/@33.1561817,-96.9004153,17z/data=!3m1!4b1!4m6!3m5!1s0x864c3a1f935aaaab:0xa069278ee7f1f236!8m2!3d33.1561817!4d-96.9004153!16s%2Fg%2F11f63yb0ny?entry=ttu&g_ep=EgoyMDI1MDQyMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
          >
            <img
              src="/images/google-plus-icon.png"
              alt=""
              class="h-12 rounded-lg"
            />
          </nuxt-link>

          <nuxt-link
            to="https://www.bbb.org/us/tx/frisco/profile/commercial-painter/rodriguez-painting-services-0875-90795515"
            target="_blank"
          >
            <img
              src="/images/ab-seal.png"
              alt=""
              class="h-12"
            />
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>
