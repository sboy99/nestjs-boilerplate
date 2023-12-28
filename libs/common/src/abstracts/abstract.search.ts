import type { estypes as ES } from '@elastic/elasticsearch';
import type { Logger, OnModuleInit } from '@nestjs/common';
import type { ElasticsearchService } from '@nestjs/elasticsearch';

import type { AbstractDocument } from './abstract.document';

export type TSearchEntity<T extends AbstractDocument<T>> = Omit<T, '_id'> & {
  '@timestamp': Date;
};

export type TCreateSearchEntryParams<T extends AbstractDocument<T>> = {
  doc: T;
};

export type TUpdateSearchEntryParams<T extends AbstractDocument<T>> = {
  id: string;
  updatedDoc: Partial<T>;
};

export abstract class AbstractSearch<T extends AbstractDocument<T>>
  implements OnModuleInit
{
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly esService: ElasticsearchService,
    private readonly searchIndex: string
  ) {}

  async onModuleInit() {
    await this.initIndex();
  }

  private async initIndex() {
    try {
      const isIndexExists = await this.esService.indices.exists({
        index: this.searchIndex,
      });

      if (!isIndexExists) {
        // create the index
        await this.createSearchIndex();
      }

      this.logger.log(`Search index ${this.searchIndex} has been created`);
    } catch (error) {
      this.logger.error('Error while creating index ', error);
    }
  }

  protected async createSearchIndex(): Promise<ES.IndicesCreateResponse> {
    return this.esService.indices.create({
      index: this.searchIndex,
      mappings: {
        properties: {
          id: {
            type: 'text',
          },
        },
      },
    });
  }

  protected async removeSearchIndex(): Promise<ES.IndicesDeleteResponse> {
    return this.esService.indices.delete({
      index: this.searchIndex,
    });
  }

  public async create({ doc }: TCreateSearchEntryParams<T>) {
    const { _id: id, ...restDoc } = doc;
    const document: TSearchEntity<T> = {
      ...restDoc,
      '@timestamp': doc?.createdAt ?? new Date(),
    };

    const _doc = await this.esService.create<TSearchEntity<T>>({
      index: this.searchIndex,
      id: id.toString('hex'),
      document,
    });

    this.logger.log('Created search index');

    return _doc;
  }

  public async read({ id }: { id: string }) {
    return this.esService.get<TSearchEntity<T>>({
      index: this.searchIndex,
      id: String(id),
    });
  }

  public async update({ id, updatedDoc }: TUpdateSearchEntryParams<T>) {
    const _updatedDoc = await this.esService.update<TSearchEntity<T>>({
      index: this.searchIndex,
      id: String(id),
      doc: updatedDoc,
    });

    this.logger.log('Updated search index', _updatedDoc);

    return _updatedDoc;
  }

  public async delete({ id }: { id: string }) {
    const _deletedDoc = await this.esService.delete({
      index: this.searchIndex,
      id: String(id),
    });

    this.logger.log('Deleted search index', _deletedDoc);

    return _deletedDoc;
  }

  public async search({
    search,
    fields,
    limit = 10,
  }: {
    search: string;
    fields: Array<keyof Omit<TSearchEntity<T>, '@timestamp'>>;
    limit?: number;
  }) {
    return this.esService.search<T>({
      index: this.searchIndex,
      size: limit,
      query: {
        bool: {
          should: fields.map<ES.QueryDslQueryContainer>((f) => ({
            wildcard: {
              [f]: {
                value: this.prepareSearchWildcard(search),
              },
            },
          })),
        },
      },
    });
  }

  private prepareSearchWildcard(str: string) {
    let s = '*';
    for (const char of str) {
      s = `${s}${char}*`;
    }
    return s;
  }
}
