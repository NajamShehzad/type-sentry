import {  paramValidatorsMap } from "../core/metadata";
import { ValidatorMetadata } from "../types";

export function Validate(): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {

    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      let methodValidators = paramValidatorsMap.get(target);
      let validators: ValidatorMetadata[] = [];
      if (methodValidators) {
        validators = methodValidators.get(propertyKey) || [];
      }
      validators.forEach(({ index, validator, message }) => {
        if (index < args.length && !validator(args[index])) {
          throw new Error(
            `Validation failed for parameter at index ${index}: ${message}`
          );
        }
      });

      return originalMethod.apply(this, args);
    };
  };
}
