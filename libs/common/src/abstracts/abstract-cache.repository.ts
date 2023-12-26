import { TTL } from '@app/infra/cache';
import type { Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import type { Model } from 'mongoose';

import type { AbstractDocument } from './abstract.document';
import { AbstractRepository } from './abstract.repository';

type TTTL = keyof typeof TTL | number;

type TCacheOptions = {
  key: string | object;
  ttl: TTTL;
  scope?: ('read' | 'list') | string;
};

type TCacheData<T> = {
  data: T;
  cachedAt: number;
  expireAt: number;
};
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

  //   todo: implement CRUD methods

  protected prepareKey({ key, scope }: Omit<TCacheOptions, 'ttl'>) {
    const cacheKey = JSON.stringify(key);
    return `${this.docName}[${cacheKey}]${!!scope ? `:${scope}` : ''}${
      !!scope ? `:${scope}` : ''
    }`;
  }

  protected prepareTTL(ttl: TTTL) {
    return typeof ttl === 'number' ? ttl : TTL[ttl];
  }

  protected async get<T = TDoc>(key: string): Promise<T | null> {
    const cache = await this.cacheManager.get<TCacheData<T>>(key);
    if (!cache) {
      this.logger.log(`🕵️ Cache miss : ${key}`);
      return null;
    }
    this.logger.log(
      `🚀 Cache hit : ${key} | Expires in ${Math.round(
        (cache.expireAt - Date.now()) / 1000
      )} seconds`
    );
    return cache?.data;
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
    return new Promise<T>(async (resolve, reject) => {
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
          value = await fetcher();
          // cache data with given ttl
          if (!!value) await this.set(key, value, ttl);
        }
        // resolve data
        resolve(value);
      } catch (error) {
        reject(error);
      }
    });
  }
}
