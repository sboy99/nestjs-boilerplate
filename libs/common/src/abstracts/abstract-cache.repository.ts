import { TTL } from '@app/infra/cache';
import type { Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { Model } from 'mongoose';

import type {
  TCacheData,
  TCachedResult,
  TCacheOptions,
  TFindOneAndDeleteDocumentAndInvalidateCacheParams,
  TFindOneAndSoftDeleteDocumentAndInvalidateCacheParams,
  TFindOneAndUpdateDocumentAndInvalidateCacheParams,
  TFindOneDocumentWithCacheParams,
  TListDocumentsWithCacheParams,
  TPaginatedResource,
  TTTL,
} from '../types';
import type { AbstractDocument } from './abstract.document';
import { AbstractRepository } from './abstract.repository';

export abstract class AbstractCacheRepository<
  TDoc extends AbstractDocument<TDoc>,
> extends AbstractRepository<TDoc> {
  protected readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDoc>,
    protected readonly cacheManager: Cache,
    protected readonly docName: string
  ) {
    super(model, docName);
  }

  // -------------------------------PUBLIC------------------------------- //

  public findOneWithCache({
    cacheOptions,
    ...findOneOptions
  }: TFindOneDocumentWithCacheParams<TDoc>): Promise<TCachedResult<TDoc>> {
    return this.withCache(
      async () => this.findOne(findOneOptions),
      cacheOptions
    );
  }

  public listWithCache({
    cacheOptions,
    ...listOptions
  }: TListDocumentsWithCacheParams<TDoc>): Promise<
    TCachedResult<TPaginatedResource<TDoc>>
  > {
    return this.withCache(async () => this.list(listOptions), cacheOptions);
  }

  public async findOneAndUpdateAndInvalidateCache({
    cacheOptions,
    ...findOneAndUpdateOptions
  }: TFindOneAndUpdateDocumentAndInvalidateCacheParams<TDoc>): Promise<TDoc> {
    await this.invalidateCache(cacheOptions);
    return this.findOneAndUpdate(findOneAndUpdateOptions);
  }

  public async findOneAndSoftDeleteAndInvalidateCache({
    cacheOptions,
    ...findOneAndSoftDeleteOptions
  }: TFindOneAndSoftDeleteDocumentAndInvalidateCacheParams<TDoc>): Promise<TDoc> {
    await this.invalidateCache(cacheOptions);
    return this.findOneAndSoftDelete(findOneAndSoftDeleteOptions);
  }

  public async findOneAndDeleteAndInvalidateCache({
    cacheOptions,
    ...findOneAndDeleteOptions
  }: TFindOneAndDeleteDocumentAndInvalidateCacheParams<TDoc>): Promise<TDoc> {
    await this.invalidateCache(cacheOptions);
    return this.findOneAndDelete(findOneAndDeleteOptions);
  }

  public invalidateCache(
    cacheOptions: Omit<TCacheOptions, 'ttl'>
  ): Promise<void> {
    const key = this.prepareKey(cacheOptions);
    return this.del(key);
  }

  // ----------------------------PROTECTED------------------------------ //

  protected prepareKey({ key, scope }: Omit<TCacheOptions, 'ttl'>) {
    const cacheKey = JSON.stringify(key);
    return `${this.docName}[${cacheKey}]${!!scope ? `:${scope}` : ``}`;
  }

  protected prepareTTL(ttl: TTTL) {
    return typeof ttl === 'number' ? ttl : TTL[ttl];
  }

  protected async get<T = TDoc>(key: string): Promise<TCachedResult<T> | null> {
    const cache = await this.cacheManager.get<TCacheData<T>>(key);
    if (!cache) {
      this.logger.log(`🕵️ Cache miss : ${key}`);
      return null;
    }
    const cacheExipresIn = Math.round((cache.expireAt - Date.now()) / 1000);

    this.logger.log(
      `🚀 Cache hit : ${key} | Expires in ${cacheExipresIn} seconds`
    );

    return {
      cached: true,
      cacheExipresIn,
      ...cache?.data,
    };
  }

  protected async set<T = TDoc>(key: string, value: T, ttl = 5) {
    const now = Date.now();
    const cacheData: TCacheData<T> = {
      data: value,
      cachedAt: now,
      expireAt: now + ttl * 1000,
    };
    await this.cacheManager.set(key, cacheData, ttl * 1000);
    this.logger.log(`📚 Cached: ${key} for ${ttl} seconds`);
  }

  protected async del(key: string) {
    await this.cacheManager.del(key);
    this.logger.log(`🧹 Cleared: ${key} cache was deleted`);
  }

  protected withCache<T>(
    fetcher: () => Promise<T>,
    cacheOptions: TCacheOptions
  ) {
    return new Promise<TCachedResult<T>>(async (resolve, reject) => {
      try {
        const key = this.prepareKey({
          key: cacheOptions?.key,
          scope: cacheOptions?.scope,
        });
        const ttl = this.prepareTTL(cacheOptions.ttl);

        // check for existing cache
        let value = await this.get<T>(key);
        if (!value) {
          // fetch data from database
          const data = await fetcher();
          // cache data with given ttl
          if (!!data) {
            await this.set(key, data, ttl);
            value = { cached: false, cacheExipresIn: null, ...data };
          }
        }
        // resolve data
        resolve(value);
      } catch (error) {
        reject(error);
      }
    });
  }
}
