import { Prop, Schema } from '@nestjs/mongoose';
import type { Types } from 'mongoose';
import { SchemaTypes } from 'mongoose';

@Schema()
export abstract class AbstractDocument<TDoc> {
  @Prop({ type: SchemaTypes.ObjectId })
  _id?: Types.ObjectId | string;

  @Prop({
    type: SchemaTypes.String,
  })
  uuid?: string;

  @Prop({
    type: SchemaTypes.Boolean,
    default: false,
  })
  isDeleted?: boolean;

  @Prop({
    type: SchemaTypes.Date,
    default: null,
  })
  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(entity: Partial<TDoc>) {
    Object.assign(this, entity);
  }
}
