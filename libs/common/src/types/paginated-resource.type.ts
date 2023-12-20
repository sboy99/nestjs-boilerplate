export type TPaginatedResource<T = unknown> = {
  page: number;
  size: number;
  count: number;
  lastPage: number;
  results: T[];
};
