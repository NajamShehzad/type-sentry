import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { paramValidatorsMap } from "../core/metadata";
import { ClassOrFactory, Constructor, ValidatorFunction, ValidatorMetadata } from "../types";

export function Validator<T>(
  validatorClass: ClassOrFactory<T>
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    let methodValidators = paramValidatorsMap.get(target);
    if (!methodValidators) {
      methodValidators = new Map<string | symbol, ValidatorMetadata[]>();
      paramValidatorsMap.set(target, methodValidators);
    }
    let validators = methodValidators.get(propertyKey as string) || [];

    const validator: ValidatorFunction = (value: any) => {
      const validatorInstance =
        typeof validatorClass === "function" && !validatorClass.prototype
          ? (validatorClass as () => Constructor<T>)()
          : (validatorClass as Constructor<T>);
      const classObject = plainToClass(validatorInstance, value) as object;

      const errors = validateSync(classObject);
      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints || {}).join(", "))
          .join("; ");
        throw new Error(
          `Validation failed for ${validatorClass.name}: ${errorMessages}`
        );
      }
      return true;
    };

    validators.push({
      index: parameterIndex,
      validator,
      message: `Validation failed for ${validatorClass.name}`,
    });

    methodValidators.set(propertyKey as string, validators);
  };
}