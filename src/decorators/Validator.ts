import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { PARAM_VALIDATORS_KEY } from "../core/metadata";
import { ClassOrFactory, ValidatorMetadata } from "../types";

export function Validator<T>(
  validatorClass: ClassOrFactory<T>
): ParameterDecorator {
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

    const validator = (value: any) => {
      const validatorInstance =
        typeof validatorClass === "function" && !validatorClass.prototype
          ? (validatorClass as () => new () => T)()
          : (validatorClass as new () => T);
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

    Reflect.defineMetadata(
      PARAM_VALIDATORS_KEY,
      validators,
      target,
      propertyKey as string
    );
  };
}
