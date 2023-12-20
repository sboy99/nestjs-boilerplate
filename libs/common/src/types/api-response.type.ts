import type { HttpStatus } from '@nestjs/common';

export type TApiBaseReponse = {
  statusCode: HttpStatus;
  message?: string;
};

export type TApiDataResponse<T = unknown> = {
  data?: T;
};

export type TApiTokenResponse<T = unknown> = {
  tokens?: T;
};

export type TApiErrorResponse<T = unknown> = {
  error?: T;
};

export type TApiResponse<TData = unknown, TTokens = unknown, TError = unknown> = TApiBaseReponse &
  TApiDataResponse<TData> &
  TApiTokenResponse<TTokens> &
  TApiErrorResponse<TError>;

export type TApiResponseAsync<TData = unknown, TTokens = unknown, TError = unknown> = Promise<
  TApiResponse<TData, TTokens, TError>
>;
