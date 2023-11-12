declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production';
    POSTGRES_HOST?: string;
    POSTGRES_PORT?: number;
    POSTGRES_DB?: string;
    POSTGRES_USER?: string;
    POSTGRES_PASSWORD?: string;
  }
}
