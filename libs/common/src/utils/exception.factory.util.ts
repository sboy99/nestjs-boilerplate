import type { ValidationError } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

type ErrorRecord = {
  [key: string]: string[] | ErrorRecord;
};

const serializeValidationError = (errors?: ValidationError[]): ErrorRecord => {
  let validationError: ErrorRecord = {};

  if (!errors || !errors?.length) return validationError;

  validationError = errors.reduce<ErrorRecord>((acc, val) => {
    // write logic
    const field = val.property;
    const constraints = val?.constraints && Object.values(val?.constraints);

    if (!!constraints && !!constraints.length) acc[field] = constraints;
    else acc[field] = serializeValidationError(val.children);

    return acc;
  }, {});

  return validationError;
};

export const exceptionFactory = (error: ValidationError[]) => {
  const errors = serializeValidationError(error);
  throw new BadRequestException(errors);
};
