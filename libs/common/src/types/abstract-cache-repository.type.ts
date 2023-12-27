import type { TTL } from '@app/infra/cache';

import type { AbstractDocument } from '../abstracts';
import type {
  TFindOneAndDeleteDocumentParams,
  TFindOneAndSoftDeleteDocumentParams,
  TFindOneAndUpdateDocumentParams,
  TFindOneDocumentParams,
  TListDocumentsParams,
} from './abstract-repository.type';

export type TTTL = keyof typeof TTL | number;

export type TCacheOptions = {
  key: string | object;
  ttl: TTTL;
  scope?: 'read' | 'list';
};

export type TCacheData<T> = {
  data: T;
  cachedAt: number;
  expireAt: number;
};

export type TCachedResult<T> = T & {
  cached: boolean;
  cacheExipresIn: number | null;
};

export type TFindOneDocumentWithCacheParams<
  TDoc extends AbstractDocument<TDoc>,
> = TFindOneDocumentParams<TDoc> & {
  cacheOptions: TCacheOptions;
};

export type TListDocumentsWithCacheParams<TDoc extends AbstractDocument<TDoc>> =
  TListDocumentsParams<TDoc> & {
    cacheOptions: TCacheOptions;
  };

export type TFindOneAndUpdateDocumentAndInvalidateCacheParams<
  TDoc extends AbstractDocument<TDoc>,
> = TFindOneAndUpdateDocumentParams<TDoc> & {
  cacheOptions: Omit<TCacheOptions, 'ttl'>;
};

export type TFindOneAndSoftDeleteDocumentAndInvalidateCacheParams<
  TDoc extends AbstractDocument<TDoc>,
> = TFindOneAndSoftDeleteDocumentParams<TDoc> & {
  cacheOptions: Omit<TCacheOptions, 'ttl'>;
};

export type TFindOneAndDeleteDocumentAndInvalidateCacheParams<
  TDoc extends AbstractDocument<TDoc>,
> = TFindOneAndDeleteDocumentParams<TDoc> & {
  cacheOptions: Omit<TCacheOptions, 'ttl'>;
};
