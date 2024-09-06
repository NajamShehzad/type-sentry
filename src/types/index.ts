export type ValidatorFunction = (value: any) => boolean;

export interface ValidatorMetadata {
  index: number;
  validator: ValidatorFunction;
  message: string;
}

export type Constructor<T = any> = new (...args: any[]) => T;
export type ClassOrFactory<T = any> = Constructor<T> | (() => Constructor<T>);
