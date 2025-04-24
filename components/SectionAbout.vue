<script setup lang="ts">
const highlights = [
  '15+ years of professional painting experience',
  'Fully insured for residential and commercial projects',
  'Interior & exterior painting services',
  'Parking lot striping expertise',
  'Focused on detail and customer satisfaction',
  'Skilled, reliable, and courteous team',
];
</script>

<template>
  <div class="flex flex-col gap-8 md:flex-row">
    <!-- blurb -->
    <div class="flex w-full flex-col justify-center md:w-1/2">
      <content-heading
        title="Why Choose Rodriguez Painting?"
        sub-heading="Our Vision"
      />

      <div class="mt-4 md:max-w-lg">
        <v-text variant="body-2" class="mt-2 text-gray-600">
          Rodriguez Painting offers a full service of interior and exterior painting and
          parking lot striping. We focus on individual service and attention to detail
          resulting in professional finishes. We are consistently working to better our
          company and our employees to make sure we provide our clients the best products
          and services available.
        </v-text>

        <ul class="mt-6 space-y-2">
          <li
            v-for="(feature, i) in highlights"
            :key="i"
            class="flex items-center space-x-2"
          >
            <v-icon
              name="i-mdi-check-circle"
              class="flex-shrink-0 text-lg text-primary-500 "
            />
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- image grid -->
    <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:w-1/2 md:grid-cols-12">
      <!-- first two images half-width at sm/md, full-width on xs -->
      <div
        class="col-span-1 h-48 overflow-hidden rounded-lg shadow-md sm:col-span-1 sm:h-56 md:col-span-6
          md:h-80"
      >
        <img
          src="/images/about-3.jpg"
          alt=""
          class="h-full w-full object-cover object-center"
        />
      </div>

      <div
        class="col-span-1 h-48 overflow-hidden rounded-lg shadow-md sm:col-span-1 sm:h-56 md:col-span-6
          md:h-80"
      >
        <img
          src="/images/about-2.jpg"
          alt=""
          class="h-full w-full object-cover object-center"
        />
      </div>

      <!-- full-width third image -->
      <div
        class="col-span-1 h-48 overflow-hidden rounded-lg shadow-md sm:col-span-2 sm:h-56 md:col-span-12
          md:h-80"
      >
        <img
          src="/images/about-1.jpg"
          alt=""
          class="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  </div>
</template>
