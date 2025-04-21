import { defineNuxtModule, addPlugin, createResolver, addComponentsDir } from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@rigo/sui',
    configKey: 'sui',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    const componentPaths = [
      './runtime/components',
      './runtime/components-overlay',
      './runtime/components-layout',
      './runtime/components-form',
    ];

    nuxt.options.css.push(resolver.resolve('./runtime/styles/main.css'));

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));

    // Auto import components
    componentPaths.forEach((componentPath) => {
      addComponentsDir({
        path: resolver.resolve(`${componentPath}`),
        global: true,
        extensions: ['.vue'],
        pathPrefix: false,
      });
    });
  },
});
