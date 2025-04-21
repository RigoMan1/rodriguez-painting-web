// Utilities
import { inject, reactive, shallowRef, toRefs, watchEffect, computed } from 'vue';

import { mergeDeep, debounce, IN_BROWSER, propsFactory } from '../util';

// Types
import type { PropType, InjectionKey, Ref } from 'vue';

export interface DisplayProps {
  mobileBreakpoint?: number | DisplayBreakpoint;
}

export const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'] as const; // no isDefault

export type Breakpoint = (typeof breakpoints)[number];

export type DisplayBreakpoint = 'isDefault' | Breakpoint;

export type DisplayThresholds = {
  [key in DisplayBreakpoint]: number;
};

export interface DisplayOptions {
  mobileBreakpoint?: number | DisplayBreakpoint;
  thresholds?: Partial<DisplayThresholds>;
}

export interface InternalDisplayOptions {
  mobileBreakpoint: number | DisplayBreakpoint;
  thresholds: DisplayThresholds;
}

export type SSROptions =
  | boolean
  | {
      clientWidth: number;
      clientHeight?: number;
    };

export interface DisplayInstance {
  isDefault: Ref<boolean>;
  sm: Ref<boolean>;
  md: Ref<boolean>;
  lg: Ref<boolean>;
  xl: Ref<boolean>;
  xxl: Ref<boolean>;
  smAndUp: Ref<boolean>;
  mdAndUp: Ref<boolean>;
  lgAndUp: Ref<boolean>;
  xlAndUp: Ref<boolean>;
  smAndDown: Ref<boolean>;
  mdAndDown: Ref<boolean>;
  lgAndDown: Ref<boolean>;
  xlAndDown: Ref<boolean>;
  name: Ref<DisplayBreakpoint>;
  height: Ref<number>;
  width: Ref<number>;
  mobile: Ref<boolean>;
  mobileBreakpoint: Ref<number | DisplayBreakpoint>;
  thresholds: Ref<DisplayThresholds>;

  /** @internal */
  ssr: boolean;

  update(): void;
}

export const DisplaySymbol: InjectionKey<DisplayInstance> = Symbol.for('sui:display');

const defaultDisplayOptions: DisplayOptions = {
  mobileBreakpoint: 'lg',
  thresholds: {
    isDefault: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },
};

const parseDisplayOptions = (options: DisplayOptions = defaultDisplayOptions) => {
  return mergeDeep(defaultDisplayOptions, options) as InternalDisplayOptions;
};

function getClientWidth(ssr?: SSROptions) {
  return IN_BROWSER && !ssr
    ? window.innerWidth
    : (typeof ssr === 'object' && ssr.clientWidth) || 0;
}

function getClientHeight(ssr?: SSROptions) {
  return IN_BROWSER && !ssr
    ? window.innerHeight
    : (typeof ssr === 'object' && ssr.clientHeight) || 0;
}

export function createDisplay(
  options?: DisplayOptions,
  ssr?: SSROptions
): DisplayInstance {
  const { thresholds, mobileBreakpoint } = parseDisplayOptions(options);

  const height = shallowRef(getClientHeight(ssr));
  const state = reactive({} as DisplayInstance);
  const width = shallowRef(getClientWidth(ssr));

  function updateSize() {
    height.value = getClientHeight();
    width.value = getClientWidth();
  }
  function update() {
    updateSize();
  }

  // eslint-disable-next-line max-statements
  watchEffect(() => {
    const isDefault = width.value < thresholds.sm;
    const sm = width.value < thresholds.md && !isDefault;
    const md = width.value < thresholds.lg && !(sm || isDefault);
    const lg = width.value < thresholds.xl && !(md || sm || isDefault);
    const xl = width.value < thresholds.xxl && !(lg || md || sm || isDefault);
    const xxl = width.value >= thresholds.xxl;
    const name = isDefault
      ? 'isDefault'
      : sm
      ? 'sm'
      : md
      ? 'md'
      : lg
      ? 'lg'
      : xl
      ? 'xl'
      : 'xxl';
    const breakpointValue =
      typeof mobileBreakpoint === 'number'
        ? mobileBreakpoint
        : thresholds[mobileBreakpoint];
    const mobile = width.value < breakpointValue;

    state.isDefault = isDefault;
    state.sm = sm;
    state.md = md;
    state.lg = lg;
    state.xl = xl;
    state.xxl = xxl;
    state.smAndUp = !isDefault;
    state.mdAndUp = !(isDefault || sm);
    state.lgAndUp = !(isDefault || sm || md);
    state.xlAndUp = !(isDefault || sm || md || lg);
    state.smAndDown = !(md || lg || xl || xxl);
    state.mdAndDown = !(lg || xl || xxl);
    state.lgAndDown = !(xl || xxl);
    state.xlAndDown = !xxl;
    state.name = name;
    state.height = height.value;
    state.width = width.value;
    state.mobile = mobile;
    state.mobileBreakpoint = mobileBreakpoint;
    state.thresholds = thresholds;
  });

  if (IN_BROWSER) {
    window.addEventListener('resize', debounce(updateSize, 50), {
      passive: true,
    });
  }

  return { ...toRefs(state), update, ssr: !!ssr };
}

export const makeDisplayProps = propsFactory(
  {
    mobileBreakpoint: [Number, String] as PropType<number | DisplayBreakpoint>,
  },
  'display'
);

export function useDisplay(props: DisplayProps = {}) {
  const display = inject(DisplaySymbol);

  if (!display) throw new Error('Could not find SUI display injection');

  const mobile = computed(() => {
    if (!props.mobileBreakpoint) return display.mobile.value;

    const breakpointValue =
      typeof props.mobileBreakpoint === 'number'
        ? props.mobileBreakpoint
        : display.thresholds.value[props.mobileBreakpoint];

    return display.width.value < breakpointValue;
  });

  return { ...display, mobile };
}
