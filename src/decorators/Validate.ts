import "reflect-metadata";
import { PARAM_VALIDATORS_KEY, VALIDATE_METHOD_KEY } from "../core/metadata";
import { ValidatorMetadata } from "../types";

export function Validate(): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(VALIDATE_METHOD_KEY, true, target, propertyKey);

    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const validators: ValidatorMetadata[] =
        Reflect.getMetadata(PARAM_VALIDATORS_KEY, target, propertyKey) || [];

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
