// Entry animations ("intro" reveals) wait until the preloader has lifted on
// first load, and until the transition panel starts lifting on route changes.
let introDone = false;
let transitioning = false;
const queue = new Set<() => void>();

function flush() {
  if (!introDone || transitioning) return;
  const fns = [...queue];
  queue.clear();
  fns.forEach((fn) => fn());
}

export function markIntroDone() {
  introDone = true;
  flush();
}

export function beginTransition() {
  transitioning = true;
}

export function endTransition() {
  transitioning = false;
  flush();
}

export function onIntro(fn: () => void) {
  queue.add(fn);
  flush();
  return () => {
    queue.delete(fn);
  };
}
