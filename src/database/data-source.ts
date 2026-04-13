import 'dotenv/config';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from './database.config';
import { InitialUsersTable20260414003000 } from './migrations/20260414003000-initial-users-table';
import { User } from '../modules/users/entities/user.entity';

export default new DataSource({
  ...createDataSourceOptions(),
  entities: [User],
  migrations: [InitialUsersTable20260414003000],
});
