import type { SchemaOptions } from '@nestjs/mongoose';

export const getDefaultSchemaOptions = (): SchemaOptions => {
  return {
    versionKey: false,
    timestamps: true,
    validateBeforeSave: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  };
};
