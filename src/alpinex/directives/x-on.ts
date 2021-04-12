import { Directive } from "./types";
import { camelCase, isNumeric, kebabCase } from "../utils";
import { debounce } from "./_";

/**
 * adds an event listener to an element
 */
export function mountXOn(el: HTMLElement, { modifiers, value: event, expression }: Directive) {
  const options = {
    passive: modifiers.includes('passive'),
  };

  if (modifiers.includes('camel')) {
    event = camelCase(event);
  }

  let handler: (e: Event) => void, listenerTarget: HTMLElement | Document | Window;
  if (modifiers.includes('away')) {
    listenerTarget = document;

    handler = (e) => {
      // Don't do anything if the click came from the element or within it.
      if (el.contains(e.target as Node)) return

      // Don't do anything if this element isn't currently visible.
      if (el.offsetWidth < 1 && el.offsetHeight < 1) return

      // Now that we are sure the element is visible, AND the click
      // is from outside it, let's run the expression.
      (expression as CallableFunction)(e);

      if (modifiers.includes('once')) {
        document.removeEventListener(event, handler);
      }
    }
  } else {
    listenerTarget = modifiers.includes('window')
      ? window : (modifiers.includes('document') ? document : el)

    handler = (e) => {
      // Remove this global event handler if the element that declared it
      // has been removed. It's now stale.
      if (listenerTarget === window || listenerTarget === document) {
        if (!document.body.contains(el)) {
          listenerTarget.removeEventListener(event, handler)
          return
        }
      }

      if (['keydown', 'keyup'].includes(event)) {
        if (isListeningForASpecificKeyThatHasntBeenPressed(e as KeyboardEvent, modifiers)) {
          return
        }
      }

      if (modifiers.includes('prevent')) e.preventDefault()
      if (modifiers.includes('stop')) e.stopPropagation()

      // If the .self modifier isn't present, or if it is present and
      // the target element matches the element we are registering the
      // event on, run the handler
      if (!modifiers.includes('self') || e.target === el) {
        const returnValue = Promise.resolve((expression as CallableFunction)(e));

        returnValue.then((value) => {
          if (value === false) {
            e.preventDefault()
          } else {
            if (modifiers.includes('once')) {
              listenerTarget.removeEventListener(event, handler)
            }
          }
        })
      }
    }
  }

  if (modifiers.includes('debounce')) {
    let nextModifier = modifiers[modifiers.indexOf('debounce') + 1] || 'invalid-wait'
    let wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250
    handler = debounce(handler, wait, this)
  }

  listenerTarget.addEventListener(event, handler, options);
}

function isListeningForASpecificKeyThatHasntBeenPressed(e: KeyboardEvent, modifiers: string[]) {
  let keyModifiers = modifiers.filter(i => {
    return !['window', 'document', 'prevent', 'stop'].includes(i)
  })

  if (keyModifiers.includes('debounce')) {
    let debounceIndex = keyModifiers.indexOf('debounce')
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1)
  }

  // If no modifier is specified, we'll call it a press.
  if (keyModifiers.length === 0) return false

  // If one is passed, AND it matches the key pressed, we'll call it a press.
  if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false

  // The user is listening for key combinations.
  const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super']
  const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier))

  keyModifiers = keyModifiers.filter(i => !selectedSystemKeyModifiers.includes(i))

  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
      // Alias "cmd" and "super" to "meta"
      if (modifier === 'cmd' || modifier === 'super') modifier = 'meta'

      return (e as any)[`${modifier}Key`]
    })

    // If all the modifiers selected are pressed, ...
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      // AND the remaining key is pressed as well. It's a press.
      if (keyModifiers[0] === keyToModifier(e.key)) return false
    }
  }

  // We'll call it NOT a valid keypress.
  return true
}

function keyToModifier(key: string) {
  switch (key) {
    case '/':
      return 'slash'
    case ' ':
    case 'Spacebar':
      return 'space'
    default:
      return key && kebabCase(key)
  }
}
