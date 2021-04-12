import {XShowAttributes} from "./x-show";
import {XTransitionAttributes} from "./x-transition";

export interface Directive {
  type: string;
  value?: string;
  modifiers?: string[];
  expression: any;
}

export type XAttributes = XShowAttributes & XTransitionAttributes;
