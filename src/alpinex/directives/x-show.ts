import { Subscribable } from "rxjs";
import { transitionIn, transitionOut } from "./x-transition";

export interface XShowAttributes {
  'x-show'?: Subscribable<boolean>;
}

/**
 * Removes display none of given element
 */
export function showElement(el: HTMLElement | SVGElement) {
  if (el.style.length === 1 && el.style.display === 'none') {
    el.removeAttribute('style')
  } else {
    el.style.removeProperty('display')
  }
}

export function mountXShow(el: HTMLElement | SVGElement, value: Subscribable<boolean>) {
  // TODO: unsubscribe on element destroyed
  value.subscribe(async (val) => {
    if (val && (el.style.display === 'none' || (el as any).__x_transition)) {
      try {
        await transitionIn(el);
      } catch (e) {
      } finally {
        showElement(el);
      }
    } else if (el.style.display !== 'none') {
      try {
        await transitionOut(el);
      } catch (e) {
      } finally {
        el.style.display = 'none';
      }
    }
  })
}