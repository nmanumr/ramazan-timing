import { JSX as JSXInternal } from "preact"
import svgTags from "./svgTags";

import { mountXOn, mountXShow, parseHtmlAttribute, XAttributes } from "../directives";

type Child =
  | HTMLElement
  | Text
  | string
  | number

type Attributes =
  & JSXInternal.HTMLAttributes
  & JSXInternal.SVGAttributes
  & XAttributes
  & Record<string, any>


/**
 * Append a child node to an element
 *
 * @param el - Element
 * @param child - Child node(s)
 */
export function appendChild(el: HTMLElement | SVGElement, child: Child | Child[]): void {
  /* Handle primitive types (including raw HTML) */
  if (typeof child === "string" || typeof child === "number") {
    el.innerHTML += child.toString()

    /* Handle nodes */
  } else if (child instanceof Node) {
    el.appendChild(child)

    /* Handle nested children */
  } else if (Array.isArray(child)) {
    for (const node of child)
      appendChild(el, node)
  }
}

/**
 * JSX factory
 *
 * @param tag - HTML tag
 * @param attributes - HTML attributes
 * @param children - Child elements
 *
 * @returns Element
 */
export function h(
  tag: string, attributes: Attributes | null, ...children: Child[]
): HTMLElement | SVGElement {
  let el;

  /* Handle svg element */
  if (svgTags.includes(tag)) {
    el = document.createElementNS("http://www.w3.org/2000/svg", tag);

    /* Handle normal html element */
  } else {
    el = document.createElement(tag);
  }

  /* Set attributes, if any */
  if (attributes) {
    for (const attr of Object.keys(attributes)) {
      if (attr.startsWith('x-on') || attr.startsWith('@')) {
        let parsedAttr = parseHtmlAttribute({
          name: attr, value: attributes[attr]
        });
        mountXOn(el as HTMLElement, parsedAttr);
      } else if (attr === 'x-show') {
        mountXShow(el, attributes[attr]);
        continue;
      }

      if (typeof attributes[attr] !== "boolean") {
        el.setAttribute(attr, attributes[attr]);
      } else if (attributes[attr]) {
        el.setAttribute(attr, "");
      }
    }
  }

  /* Append child nodes */
  for (const child of children) {
    appendChild(el, child)
  }

  /* Return element */
  return el
}

/**
 * Remove all the children of given element
 */
export function removeElementChildren(element: HTMLElement): void {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}

export function renderInElement(node: HTMLElement | SVGElement, element: HTMLElement, append: boolean = false) {
  if (!append) removeElementChildren(element);
  element.appendChild(node);
}


/* This override is necessary for types to work */
export declare namespace h {
  namespace JSX {
    type Element = HTMLElement
    type IntrinsicElements = JSXInternal.IntrinsicElements

    interface HTMLAttributes<T extends EventTarget = EventTarget> extends JSXInternal.HTMLAttributes<T> {
      test: boolean;
    }
  }
}
