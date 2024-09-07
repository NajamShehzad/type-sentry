import "reflect-metadata";
import { PARAM_VALIDATORS_KEY } from "../core/metadata";
import { ValidatorFunction, ValidatorMetadata } from "../types";

export function createParamValidator(
  validator: ValidatorFunction,
  defaultMessage: string
) {
  return (message: string = defaultMessage): ParameterDecorator => {
    return (
      target: Object,
      propertyKey: string | symbol | undefined,
      parameterIndex: number
    ) => {
      const validators: ValidatorMetadata[] =
        Reflect.getMetadata(
          PARAM_VALIDATORS_KEY,
          target,
          propertyKey as string
        ) || [];
      validators.push({ index: parameterIndex, validator, message });
      Reflect.defineMetadata(
        PARAM_VALIDATORS_KEY,
        validators,
        target,
        propertyKey as string
      );
    };
  };
}

export const IsNumber = createParamValidator(
  (value) => typeof value === "number",
  "Must be a number"
);

export const IsString = createParamValidator(
  (value) => typeof value === "string",
  "Must be a string"
);
