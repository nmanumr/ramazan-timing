import {getXAttrs} from "./_";
import {Directive} from "./types";

/* ----------------------------
 *  Types
 * ---------------------------- */

export interface XTransitionAttributes {
  'x-transition:enter'?: string;
  'x-transition:enter-start'?: string;
  'x-transition:enter-end'?: string;
  'x-transition:leave'?: string;
  'x-transition:leave-start'?: string;
  'x-transition:leave-end'?: string;
}

interface Stage {
  start: () => void;
  during: () => void;
  show: () => void;
  end: () => void;
  hide: () => void;
  cleanup: () => void;
}

export const enum TransitionType {IN, OUT}

interface XTransition {
  type: TransitionType;
  cancel: () => void;
  finish: () => void;
  nextFrame: number;
}

declare global {
  interface Element {
    __x_transition?: XTransition;
    __x_original_classes?: string[];
  }
}

/* ----------------------------
 *  Helper functions
 * ---------------------------- */

export function once(callback: () => any): () => void {
  let called = false

  return function () {
    if (!called) {
      called = true
      callback.apply(this, arguments)
    }
  }
}

/**
 * Apply in transition with classes
 *
 * Thanks @alpinejs
 * https://github.com/alpinejs/alpine/blob/master/src/utils.js#L416
 */
function transitionClassesIn(
  el: HTMLElement | SVGElement,
  directives: Directive[],
): Promise<void> {
  const enter = (directives.find(i => i.value === 'enter') || {expression: ''}).expression.split(' ');
  const enterStart = (directives.find(i => i.value === 'enter-start') || {expression: ''}).expression.split(' ');
  const enterEnd = (directives.find(i => i.value === 'enter-end') || {expression: ''}).expression.split(' ');

  return transitionClasses(el, enter, enterStart, enterEnd, TransitionType.IN);
}

/**
 * Apply out transition with classes
 *
 * Thanks @alpinejs
 * https://github.com/alpinejs/alpine/blob/master/src/utils.js#L424
 */
function transitionClassesOut(
  el: HTMLElement | SVGElement,
  directives: Directive[],
): Promise<void> {
  const leave = (directives.find(i => i.value === 'leave') || {expression: ''}).expression.split(' ');
  const leaveStart = (directives.find(i => i.value === 'leave-start') || {expression: ''}).expression.split(' ');
  const leaveEnd = (directives.find(i => i.value === 'leave-end') || {expression: ''}).expression.split(' ');

  return transitionClasses(el, leave, leaveStart, leaveEnd, TransitionType.OUT);
}

/**
 * Apply a classes transition
 *
 * Thanks @alpinejs
 * https://github.com/alpinejs/alpine/blob/master/src/utils.js#L432
 */
function transitionClasses(
  el: HTMLElement | SVGElement,
  classesDuring: Array<string>,
  classesStart: Array<string>,
  classesEnd: Array<string>,
  type: TransitionType,
): Promise<void> {
  // clear the previous transition if exists to avoid caching the wrong classes
  if (el.__x_transition) {
    el.__x_transition.cancel && el.__x_transition.cancel();
  }

  const originalClasses = el.__x_original_classes || [];

  const stages = {
    start() {
      el.classList.add(...classesStart);
    },
    during() {
      el.classList.add(...classesDuring);
    },
    show() {
    },
    end() {
      // Don't remove classes that were in the original class attribute.
      el.classList.remove(...classesStart.filter((i: string) => !originalClasses.includes(i)));
      el.classList.add(...classesEnd);
    },
    hide() {
    },
    cleanup() {
      el.classList.remove(...classesDuring.filter((i: string) => !originalClasses.includes(i)));
      el.classList.remove(...classesEnd.filter((i: string) => !originalClasses.includes(i)));
    },
  }

  return transition(el, stages, type);
}

/**
 * Apply a transition based on the given stage
 *
 * Thanks @alpinejs
 * https://github.com/alpinejs/alpine/blob/master/src/utils.js#L467
 */
function transition(
  el: HTMLElement | SVGElement,
  stages: Stage,
  type: TransitionType
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const finish = once(() => {
      stages.hide();

      // Adding an "isConnected" check, in case the callback
      // removed the element from the DOM.
      if (el.isConnected) {
        stages.cleanup()
      }

      delete el.__x_transition;
    });

    el.__x_transition = {
      // Set transition type so we can avoid clearing transition if the direction is the same
      type: type,
      // create a callback for the last stages of the transition so we can call it
      // from different point and early terminate it. Once will ensure that function
      // is only called one time.
      cancel: once(() => {
        finish();
        reject();
      }),
      finish,
      // This store the next animation frame so we can cancel it
      nextFrame: null
    }

    stages.start();
    stages.during();

    el.__x_transition.nextFrame = requestAnimationFrame(() => {
      // Note: Safari's transitionDuration property will list out comma separated transition durations
      // for every single transition property. Let's grab the first one and call it a day.
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000;

      if (duration === 0) {
        duration = Number(getComputedStyle(el).animationDuration.replace('s', '')) * 1000;
      }

      stages.show();

      el.__x_transition.nextFrame = requestAnimationFrame(() => {
        stages.end();

        setTimeout(() => {
          el.__x_transition.finish();
          resolve();
        }, duration);
      });
    });
  });
}


/* ----------------------------
 *  Exported functions
 * ---------------------------- */

/**
 * Apply transition In to element
 * @param el
 * @param forceSkip
 */
export function transitionIn(
  el: HTMLElement | SVGElement,
  forceSkip = false
): Promise<void> {
  // We don't want to transition on the initial page load.
  if (forceSkip) return Promise.resolve();

  if ((el as any).__x_transition && (el as any).__x_transition.type === TransitionType.IN) {
    // there is already a similar transition going on, this was probably triggered by
    // a change in a different property, let's just leave the previous one doing its job
    return Promise.resolve();
  }

  const attrs = getXAttrs(el, 'transition');

  if (attrs.some(attr => ['enter', 'enter-start', 'enter-end'].includes(attr.value))) {
    return transitionClassesIn(el, attrs);
  }
  return Promise.resolve();
}

/**
 * Apply transition out to element
 * @param el
 * @param forceSkip
 */
export function transitionOut(
  el: HTMLElement | SVGElement,
  forceSkip = false
): Promise<void> {
  // We don't want to transition on the initial page load.
  if (forceSkip) return Promise.resolve();

  if ((el as any).__x_transition && (el as any).__x_transition.type === TransitionType.OUT) {
    // there is already a similar transition going on, this was probably triggered by
    // a change in a different property, let's just leave the previous one doing its job
    return Promise.resolve();
  }

  const attrs = getXAttrs(el, 'transition');

  if (attrs.some(attr => ['leave', 'leave-start', 'leave-end'].includes(attr.value))) {
    return transitionClassesOut(el, attrs)
  }
  return Promise.resolve();
}
