<script setup lang="ts">
interface Testimonial {
  quote: string;
  author: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Mr. Rodriguez and his team did a fantastic job staining my fence.They worked very diligently, clean and organized.I will highly recommend their businesses.',
    author: 'Rossura Gallo',
    rating: 5,
    avatar: '',
  },
  {
    quote:
      'Moises and his crew not only gave us the best estimate but delivered top quality work. He assisted us with paint color options and executed on his promise. I especially like how he and his crew cleaned up and left the rooms clean from any mess.',
    author: 'Steve Soe',
    rating: 5,
    avatar: '',
  },
  {
    quote:
      'We hired Moises and his team to do our flooring change, renovate our kitchen and paint the exterior of our home. Great service and very trustworthy, but most importantly their work is excellent. Would highly recommend these guys.',
    author: 'Ubong Ekpo',
    rating: 5,
    avatar: '',
  },
  {
    quote:
      'Moses and his team did a wonderful job painting the exterior and interior of our home. They were very professional and on time. They cleaned up at the end of each day. I would highly recommend Rodriquez painting services.',
    author: 'Robert Ciminelli',
    rating: 5,
    avatar: '',
  },
  {
    quote:
      'Got a very reasonable quote same day. Completed services a few days after booking. Had my parking lot striped and fire lanes painted. Excellent work, ease of scheduling, and attention to detail. Would definitely hire them again.',
    author: 'D. Dental',
    rating: 5,
    avatar: '',
  },
];

const activeSlide = ref(0);
const slidesRef = ref<any>(null);

// Function to go to the next slide
const nextSlide = () => {
  if (slidesRef.value?.canMoveForward) {
    slidesRef.value.next();
  } else {
    activeSlide.value = 0; // Reset to first slide if it's the last one
  }
};

// Auto-cycling logic
let slideInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000); // Change slide every 2 seconds
});

onBeforeUnmount(() => {
  clearInterval(slideInterval); // Clear interval when component is destroyed
});
</script>

<template>
  <section class="rounded-lg">
    <div class="mx-auto max-w-xl text-center">
      <content-heading
        class="mt-4"
        title="What Our Clients Say"
        sub-heading="Testimonials"
      />
      <p class="mt-2 text-gray-600">
        We are proud to have received numerous positive reviews from our clients. Here are
        just a few of the many testimonials we have received.
      </p>
    </div>

    <div class="mt-20 flex flex-wrap justify-center gap-4">
      <div
        v-for="(t, i) in testimonials"
        :key="i"
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
      >
        <rp-rating
          :rating="5"
          class="mb-4"
        />
        <p class="mb-4 text-gray-700">“{{ t.quote }}”</p>
        <p class="font-semibold text-gray-900">{{ t.author }}</p>
      </div>
    </div>
  </section>
</template>
