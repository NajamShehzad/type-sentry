import { ValidatorMetadata } from "../types";

export const paramValidatorsMap = new WeakMap<
  Object,
  Map<string | symbol, ValidatorMetadata[]>
>();