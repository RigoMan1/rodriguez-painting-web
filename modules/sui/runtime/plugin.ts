import { defineNuxtPlugin } from '#app';
import { createSUI } from './framework';

export default defineNuxtPlugin((nuxtApp) => {
  const sui = createSUI({
    ssr: true,
  }) as any;

  nuxtApp.vueApp.use(sui);

  return {
    provide: {
      sui,
    },
  };
});
