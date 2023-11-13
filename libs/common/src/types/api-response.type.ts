import type { HttpStatus } from '@nestjs/common';

export type TApiBaseReponse = {
  statusCode: HttpStatus;
  message: string;
};

type RecordOrRecordArray = Record<string, unknown> | Array<Record<string, unknown>>;

export type TApiDataResponse<T = unknown> = {
  data?: T;
};

export type TApiTokenResponse<T = unknown> = {
  tokens?: T;
};

export type TApiErrorResponse<T = unknown> = {
  error?: T;
};

export type TApiResponse<
  TData = RecordOrRecordArray,
  TTokens = RecordOrRecordArray,
  TError = RecordOrRecordArray,
> = TApiBaseReponse & TApiDataResponse<TData> & TApiTokenResponse<TTokens> & TApiErrorResponse<TError>;

export type TApiResponseAsync<
  TData = RecordOrRecordArray,
  TTokens = RecordOrRecordArray,
  TError = RecordOrRecordArray,
> = Promise<TApiResponse<TData, TTokens, TError>>;
