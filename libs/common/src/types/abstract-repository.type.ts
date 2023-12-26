import type {
  CreateOptions,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import type { AbstractDocument } from '../abstracts';
import type { TQuery } from './query.type';

export type TCreateDocumentParams<TDoc extends AbstractDocument<TDoc>> = {
  document: Partial<TDoc>;
  options?: CreateOptions;
};

export type TCreateManyDocumentParams<TDoc extends AbstractDocument<TDoc>> = {
  documents: Partial<TDoc>[];
  options?: CreateOptions;
};

export type TCreateUniqueDocumentParams<TDoc extends AbstractDocument<TDoc>> = {
  constraints: FilterQuery<TDoc>;
  document: Partial<TDoc>;
  queryOptions?: QueryOptions<TDoc>;
};

export type TListDocumentsParams<TDoc extends AbstractDocument<TDoc>> = {
  apiQuery: TQuery<TDoc>;
  filterQuery?: FilterQuery<TDoc>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'skip' | 'limit' | 'sort'>;
};

export type TOptions = Partial<{
  isNotToThrow: boolean;
}>;

export type TFindOneDocumentParams<TDoc extends AbstractDocument<TDoc>> = {
  filterQuery?: FilterQuery<TDoc>;
  queryOptions?: QueryOptions<TDoc>;
  projection?: ProjectionType<TDoc>;
  options?: TOptions;
};

export type TLookupDocumentParams<TDoc extends AbstractDocument<TDoc>> = Pick<
  TFindOneDocumentParams<TDoc>,
  'filterQuery' | 'queryOptions'
>;

export type TUpsertDocumentsParams<TDoc extends AbstractDocument<TDoc>> = {
  filterQuery: FilterQuery<TDoc>;
  document: Omit<TDoc, '_id' | 'uuid'>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'new'>;
};

export type TFindOneAndUpdateDocumentParams<
  TDoc extends AbstractDocument<TDoc>,
> = {
  filterQuery: FilterQuery<TDoc>;
  updatedDocument: UpdateQuery<TDoc>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'new'>;
  options?: TOptions;
};

export type TFindOneAndSoftDeleteDocumentParams<
  TDoc extends AbstractDocument<TDoc>,
> = {
  filterQuery: FilterQuery<TDoc>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'new'>;
  options?: TOptions;
};

export type TFindOneAndDeleteDocumentParams<
  TDoc extends AbstractDocument<TDoc>,
> = {
  filterQuery: FilterQuery<TDoc>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'new'>;
  options?: TOptions;
};
