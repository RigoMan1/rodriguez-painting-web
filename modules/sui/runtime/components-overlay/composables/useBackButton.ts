// Utilities
import { nextTick, onScopeDispose } from 'vue';
import { IN_BROWSER } from '../../util';

// Types
import type { NavigationGuardNext, Router } from 'vue-router';

let inTransition = false;
export function useBackButton(
  router: Router | undefined,
  cb: (next: NavigationGuardNext) => void
) {
  let popped = false;
  let removeBefore: (() => void) | undefined;
  let removeAfter: (() => void) | undefined;

  if (IN_BROWSER) {
    nextTick(() => {
      window.addEventListener('popstate', onPopstate);
      removeBefore = router?.beforeEach((to, from, next) => {
        if (!inTransition) {
          setTimeout(() => (popped ? cb(next) : next()));
        } else {
          popped ? cb(next) : next();
        }
        inTransition = true;
      });
      removeAfter = router?.afterEach(() => {
        inTransition = false;
      });
    });
    onScopeDispose(() => {
      window.removeEventListener('popstate', onPopstate);
      removeBefore?.();
      removeAfter?.();
    });
  }

  function onPopstate(e: PopStateEvent) {
    if (e.state?.replaced) return;

    popped = true;
    setTimeout(() => (popped = false));
  }
}
