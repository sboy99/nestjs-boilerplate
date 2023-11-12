import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
  entities: ['libs/common/src/entities/**/*.ts'],
  migrations: ['migrations/**/*'],
});
