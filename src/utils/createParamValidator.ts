import { paramValidatorsMap } from "../core/metadata";
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
      console.log(
        `Applying param validator to ${String(
          propertyKey
        )} at index ${parameterIndex}`
      );

      let methodValidators = paramValidatorsMap.get(target);
      if (!methodValidators) {
        methodValidators = new Map<string | symbol, ValidatorMetadata[]>();
        paramValidatorsMap.set(target, methodValidators);
      }

      let validators = methodValidators.get(propertyKey as string) || [];
      validators.push({ index: parameterIndex, validator, message });
      methodValidators.set(propertyKey as string, validators);
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
