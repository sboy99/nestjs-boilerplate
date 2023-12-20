import type { TPaginatedResource, TQuery } from '@app/common/types';
import type { Logger } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import type { WithTransactionCallback } from 'mongodb';
import type {
  ClientSession,
  ClientSessionOptions,
  CreateOptions,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { isValidObjectId as isMongoId, Types } from 'mongoose';

import type { AbstractDocument } from './abstract.document';

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

export type TFindOneAndUpdateDocumentParams<TDoc extends AbstractDocument<TDoc>> = {
  filterQuery: FilterQuery<TDoc>;
  updatedDocument: UpdateQuery<TDoc>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'new'>;
  options?: TOptions;
};

export type TFindOneAndSoftDeleteDocumentParams<TDoc extends AbstractDocument<TDoc>> = {
  filterQuery: FilterQuery<TDoc>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'new'>;
  options?: TOptions;
};

export type TFindOneAndDeleteDocumentParams<TDoc extends AbstractDocument<TDoc>> = {
  filterQuery: FilterQuery<TDoc>;
  queryOptions?: Omit<QueryOptions<TDoc>, 'new'>;
  options?: TOptions;
};

export abstract class AbstractRepository<TDocument extends AbstractDocument<TDocument>> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly docName: string
  ) {}

  // CRUD operations
  public async create<TDoc extends TDocument>({ document, options }: TCreateDocumentParams<TDoc>): Promise<TDoc> {
    // create the document object to mongodb
    const createdDocument = await this.model.create(
      [
        {
          ...document,
          _id: this.generateMongoId(document),
          uuid: this.generateUUID(document),
        },
      ],
      options
    );
    // throw error if document was not created
    if (!createdDocument?.[0]) throw new BadRequestException(`Unable to create document ${this.docName} `);
    // log the response
    this.logger.log(`Created new ${this.docName} document ${JSON.stringify(createdDocument?.[0]?.toObject())}`);
    // return the document
    return createdDocument?.[0]?.toObject();
  }

  private generateMongoId(document: Partial<TDocument>) {
    return isMongoId(document?._id) ? document._id : new Types.ObjectId();
  }

  private generateUUID(document: Partial<TDocument>) {
    return isUUID(document?.uuid) ? document.uuid : randomUUID();
  }

  public async createMany<TDoc extends TDocument>({
    documents,
    options,
  }: TCreateManyDocumentParams<TDoc>): Promise<TDoc[]> {
    // create bulk documents
    const _createdDocuments = await this.model.create(
      documents.map((doc) => ({
        ...doc,
        _id: this.generateMongoId(doc),
        uuid: this.generateUUID(doc),
      })),
      options
    );
    const createdDocuments = _createdDocuments.map((createdDocument) => createdDocument.toObject());
    // log the response
    this.logger.log(`Created bulk ${this.docName} documents ${JSON.stringify(createdDocuments)}`);

    // return created documents
    return createdDocuments as TDoc[];
  }

  public async createUnique<TDoc extends TDocument>({
    constraints,
    document,
    queryOptions,
  }: TCreateUniqueDocumentParams<TDoc>): Promise<TDoc> {
    const isDoc = await this.lookUp({ filterQuery: constraints, queryOptions });
    if (!!isDoc) throw new BadRequestException(`${this.docName} document already exists`);
    return this.create({
      document,
      options: queryOptions,
    });
  }

  public async list<TDoc extends TDocument>({
    apiQuery,
    filterQuery,
    queryOptions,
  }: TListDocumentsParams<TDoc>): Promise<TPaginatedResource<TDoc>> {
    // objectify sort order
    const sortOrder = (apiQuery?.sort || []).reduce<Record<string, string>>((acc, curr) => {
      acc[curr.property as string] = curr.direction;
      return acc;
    }, {});

    // calculate document count
    const documentsCount = await this.model.countDocuments({
      ...filterQuery,
      isDeleted: false,
    });

    // list documents
    const documentsList = await this.model
      .find({ ...filterQuery, isDeleted: false }, apiQuery?.select, {
        ...queryOptions,
        sort: sortOrder,
        skip: apiQuery.pagination.offset,
        limit: apiQuery.pagination.limit,
      })
      .lean<TDoc[]>(true);

    return {
      count: documentsCount,
      page: apiQuery.pagination.page,
      size: apiQuery.pagination.size,
      lastPage: Math.ceil(documentsCount / apiQuery.pagination.size),
      results: documentsList,
    };
  }

  public async lookUp<TDoc extends TDocument>({
    filterQuery,
    queryOptions,
  }: TLookupDocumentParams<TDoc>): Promise<TDoc> {
    return this.findOne({
      filterQuery,
      queryOptions,
      options: {
        isNotToThrow: true,
      },
    });
  }

  public async findOne<TDoc extends TDocument>({
    filterQuery,
    options,
    projection,
    queryOptions,
  }: TFindOneDocumentParams<TDoc>): Promise<TDoc> {
    const document = await this.model
      .findOne({ ...filterQuery, isDeleted: false }, projection, queryOptions)
      .lean<TDocument>(true);

    if (!options?.isNotToThrow && !document) {
      this.logger.warn(
        `${this.docName} document was not found with filterQuery ${JSON.stringify(filterQuery)}`,
        filterQuery
      );
      throw new BadRequestException(`${this.docName} document was not found`);
    }

    return document as TDoc;
  }

  public async upsert<TDoc extends TDocument>({ filterQuery, document, queryOptions }: TUpsertDocumentsParams<TDoc>) {
    const isDoc = await this.lookUp({ filterQuery, queryOptions });
    if (!!isDoc) return this.findOneAndUpdate({ filterQuery, updatedDocument: document as any, queryOptions });

    return this.create({
      document: document as any,
      options: queryOptions,
    });
  }

  public async findOneAndUpdate<TDoc extends TDocument>({
    filterQuery,
    updatedDocument,
    queryOptions,
    options,
  }: TFindOneAndUpdateDocumentParams<TDoc>): Promise<TDoc> {
    const document = await this.model
      .findOneAndUpdate({ ...filterQuery, isDeleted: false }, updatedDocument, {
        ...queryOptions,
        new: true,
      })
      .lean<TDocument>(true);

    if (!options?.isNotToThrow && !document) {
      this.logger.warn(`${this.docName} Document was not found with filterQuery`, filterQuery);
      throw new NotFoundException(`${this.docName} Document was not found`);
    }

    return document as TDoc;
  }

  public async findOneAndSoftDelete<TDoc extends TDocument>({
    filterQuery,
    queryOptions,
    options,
  }: TFindOneAndSoftDeleteDocumentParams<TDoc>): Promise<TDoc> {
    const document = await this.model
      .findOneAndUpdate(
        { ...filterQuery, isDeleted: false },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
          },
        },
        {
          ...queryOptions,
          new: true,
        }
      )
      .lean<TDocument>(true);

    if (!options?.isNotToThrow && !document) {
      this.logger.warn(`${this.docName} document was not found with filterQuery`, filterQuery);
      throw new NotFoundException(`${this.docName} document was not found`);
    }

    return document as TDoc;
  }

  public async findOneAndDelete<TDoc extends TDocument>({
    filterQuery,
    queryOptions,
  }: TFindOneAndDeleteDocumentParams<TDoc>) {
    return this.model.findOneAndDelete({ ...filterQuery, isDeleted: false }, queryOptions).lean<TDoc>(true);
  }

  // transactions
  public async startSession(options?: ClientSessionOptions): Promise<ClientSession> {
    return this.model.startSession(options);
  }

  public async withTransaction<TDoc>(session: ClientSession, fn: WithTransactionCallback<TDoc>) {
    try {
      const res = await session.withTransaction<TDoc>(fn as any);
      this.logger.log(`transaction ${session.id?.id.toString('hex')} committed successfully`);
      // return the result of the transaction
      return res;
    } catch (error) {
      // rollback the transaction
      this.logger.warn(`transaction ${session.id?.id.toString('hex')} rollbacked unfortunately`);

      throw error;
    } finally {
      // close the session
      await session.endSession();
    }
  }
}
