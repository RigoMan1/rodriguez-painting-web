<script setup lang="ts">
import { Ripple as vRipple } from '~/modules/sui/runtime/directives/ripple';

interface Service {
  name: string;
  subheading: string;
  path: string;
  icon: string;
  description: string;
  images: string[];
  services: string[];
}

interface ServicesData {
  title: string;
  description: string;
  services: Service[];
}

const sectionContent: ServicesData = {
  title: 'Our Services',
  description:
    'Rodriguez Painting Services proudly serves residential and commercial clients across North Texas and the DFW area. With over 15 years of experience, we deliver high-quality painting, surface, and maintenance services using premium materials for lasting results.',
  services: [
    {
      name: 'Residential Interior Painting',
      subheading: `Enhance your home's comfort, style, and value.`,
      path: '/services/residential-interior',
      icon: 'i-mdi-format-paint',
      description:
        "Transform your home's interior with detailed painting, texture work, cabinet refinishing, wallpaper removal, and drywall repair.",
      images: ['/images/service-interior.jpg'],
      services: [
        'Interior Painting',
        'Texture Work',
        'Kitchen Cabinet Painting',
        'Wallpaper Removal',
        'Surface Preparation & Primer',
        'Caulking & Finishing',
      ],
    },
    {
      name: 'Residential Exterior Painting',
      subheading: 'Protect and beautify your home’s exterior.',
      path: '/services/residential-exterior',
      icon: 'i-mdi-home',
      description:
        "Protect and enhance your home's exterior with professional painting, power washing, waterproofing, and wood staining.",
      images: ['/images/service-exterior.jpg'],
      services: [
        'Exterior Painting',
        'Power Washing',
        'Waterproofing & Sealants',
        'Gutter Cleaning & Installation',
        'Drywall & Stucco Repairs',
        'Fence & Deck Staining',
        'Door Refinishing',
      ],
    },
    {
      name: 'Commercial Painting & Maintenance',
      subheading: 'Professional-grade results for every business environment.',
      path: '/services/commercial',
      icon: 'i-mdi-office-building',
      description:
        'Comprehensive interior and exterior painting, drywall work, joint caulking, waterproofing, and warehouse coatings tailored for businesses.',
      images: ['/images/service-commercial.jpg'],
      services: [
        'Parking & Fire Lane Striping',
        'Expansion Joint Repair',
        'Waterproofing & Sealants',
        'Drywall Installation & Repair',
        'Maintenance Painting',
        'Joint Caulking',
        'Power Washing',
        'Warehouse Ceiling Painting',
      ],
    },
    {
      name: 'Parking Lot Striping',
      subheading: 'Functional, compliant, and built to last.',
      path: '/services/striping',
      icon: 'i-mdi-parking',
      description:
        'Precision parking lot striping, fire lane markings, custom layouts, and maintenance using high-durability paint for long-lasting visibility.',
      images: ['/images/service-commercial.jpg'],
      services: [],
    },
  ],
};

// const { data: sectionContent } = await useAsyncData('section-services', () =>
//   queryCollection<ServicesData>('content').path('/sections/2-services').first()
// );

const activeService = ref<Service | null>(null);

onMounted(() => {
  activeService.value = sectionContent.services[0];
});
</script>

<template>
  <section
    class="flex h-auto flex-col gap-8 rounded-lg md:h-[46rem] md:flex-row md:gap-20"
  >
    <!-- Left side (heading + grid) -->
    <div class="w-full md:w-1/2">
      <content-heading
        class="text-center lg:text-left"
        :title="sectionContent.title"
        sub-heading="Our Services"
      />

      <v-group
        v-model="activeService"
        mandatory
        class="mt-10 grid h-auto grid-cols-2 gap-4 md:mt-20 md:h-[30rem] md:gap-6"
      >
        <v-group-item
          v-for="(service, i) in sectionContent.services"
          :key="i"
          v-slot="{ toggle, isSelected }"
          :value="service"
        >
          <div
            v-ripple
            class="relative flex h-full w-full cursor-pointer flex-col items-center justify-center
              overflow-hidden rounded-xl border border-gray-300 px-4 py-4 text-center transition-all
              duration-300 ease-in-out hover:shadow-lg"
            :class="{
              'bg-primary-500 text-white shadow-lg': isSelected,
              '!opacity-60 hover:!opacity-100': !isSelected,
            }"
            @click="toggle"
          >
            <icon
              :name="service.icon"
              class="size-8"
            />

            <h3 class="mt-4 font-medium leading-6 md:text-xl">
              {{ service.name }}
            </h3>

            <!-- hide on mobile, show md+ -->
            <v-text
              variant="body-2"
              :class="[
                'hidden md:block', // <-- hide on <md
                { 'text-white/80': isSelected }, // <-- keep color rule
              ]"
            >
              {{ service.subheading }}
            </v-text>
          </div>
        </v-group-item>
      </v-group>
    </div>

    <!-- Right side (details + image + list) -->
    <div class="h-auto w-full space-y-4 md:h-full md:w-1/2 md:space-y-6">
      <v-text>
        {{ activeService?.description }}
      </v-text>

      <div class="h-60 overflow-hidden rounded-xl bg-zinc-500 md:h-80">
        <img
          :src="activeService?.images[0]"
          :alt="activeService?.name"
          loading="lazy"
          class="h-full w-full object-cover"
        />
      </div>

      <ul class="mt-4 space-y-2 md:mt-8">
        <li
          v-for="(item, i) in activeService?.services"
          :key="i"
          class="flex items-center space-x-2"
        >
          <v-icon
            name="i-mdi-check-circle"
            class="text-lg text-primary-500"
          />
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
