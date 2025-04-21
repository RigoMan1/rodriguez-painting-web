// Composables
import { createDisplay, DisplaySymbol } from './composables/display';

// Utilities
import { nextTick } from 'vue';
import { getUid, IN_BROWSER } from './util';

// Types
import './types/index.d.ts';
import type { App } from 'vue';
import type { DisplayOptions, SSROptions } from './composables/display';

export * from './composables';
export interface SUIOptions {
  components?: Record<string, any>;
  directives?: Record<string, any>;
  display?: DisplayOptions;
  ssr?: SSROptions;
}

export function createSUI(options: SUIOptions = {}) {
  const { components = {}, directives = {} } = options;

  const display = createDisplay(options.display, options.ssr);

  const install = (app: App) => {
    for (const key in directives) {
      app.directive(key, directives[key]);
    }

    for (const key in components) {
      app.component(key, components[key]);
    }

    app.provide(DisplaySymbol, display);

    if (IN_BROWSER && options.ssr) {
      if (app.$nuxt) {
        app.$nuxt.hook('app:suspense:resolve', () => {
          display.update();
        });
      } else {
        const { mount } = app;
        app.mount = (...args) => {
          const vm = mount(...args);
          nextTick(() => display.update());
          app.mount = mount;
          return vm;
        };
      }
    }

    getUid.reset();
  };

  return {
    install,
    breakpoints: display,
  };
}

const __SUI_VERSION__ = '0.0.0';
export const version = __SUI_VERSION__;
createSUI.version = version;
