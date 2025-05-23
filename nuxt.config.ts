// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
				compatibilityDate: '2024-11-01',
				devtools: { enabled: true },

				modules: [
				 './modules/sui',
				 '@nuxt/eslint',
				 '@nuxt/fonts',
				 '@nuxt/icon',
				 '@nuxtjs/tailwindcss',
				],

				css: ['~/assets/styles/main.css'],

				tailwindcss: {
					exposeConfig: true,
					configPath: './tailwind.config.ts',
					cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'last' }],
				},
});