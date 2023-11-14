export type TPaginatedResource<T> = {
  page: number;
  size: number;
  count: number;
  lastPage: number;
  results: T[];
};
