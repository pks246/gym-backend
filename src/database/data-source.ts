import 'dotenv/config';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from './database.config';
import { InitialUsersTable20260414003000 } from './migrations/20260414003000-initial-users-table';
import { GymDomainFoundation20260424010000 } from './migrations/20260424010000-gym-domain-foundation';
import { Gym } from '../modules/gyms/entities/gym.entity';
import { GymAmenity } from '../modules/gyms/entities/gym-amenity.entity';
import { GymOperatingHour } from '../modules/gyms/entities/gym-operating-hour.entity';
import { User } from '../modules/users/entities/user.entity';

export default new DataSource({
  ...createDataSourceOptions(),
  entities: [User, Gym, GymAmenity, GymOperatingHour],
  migrations: [
    InitialUsersTable20260414003000,
    GymDomainFoundation20260424010000,
  ],
});
