import { ctx } from './constants';

export type BindingParams = {
  callback: () => void;
  throttleDelay: number;
  disabled: boolean;
  distance: number;
  immediateCheck: boolean;
};

export type CtxElement = HTMLElement & {
  [key in typeof ctx]: any;
};
