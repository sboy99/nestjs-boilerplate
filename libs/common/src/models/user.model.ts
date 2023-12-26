import { AbstractDocument } from '@app/common/abstracts';
import type { ModelDefinition } from '@nestjs/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { MAX_INPUT_SIZE, MIN_INPUT_SIZE } from '../constants';
import { getDefaultSchemaOptions } from '../utils';

@Schema(getDefaultSchemaOptions())
export class User extends AbstractDocument<User> {
  @Prop({
    type: SchemaTypes.String,
    required: true,
    maxlength: MAX_INPUT_SIZE,
  })
  fullName: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    minlength: MIN_INPUT_SIZE,
  })
  username: string;

  @Prop({
    type: SchemaTypes.String,
    default: null,
  })
  avatar?: string;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
  })
  isBlocked?: boolean;
}

export const UserModel: ModelDefinition = {
  name: User.name,
  schema: SchemaFactory.createForClass(User),
};
