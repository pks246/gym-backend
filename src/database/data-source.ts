import 'dotenv/config';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from './database.config';
import { AttendanceDomainFoundation20260503020000 } from './migrations/20260503020000-attendance-domain-foundation';
import { InitialUsersTable20260414003000 } from './migrations/20260414003000-initial-users-table';
import { GymDomainFoundation20260424010000 } from './migrations/20260424010000-gym-domain-foundation';
import { MemberDomainFoundation20260503010000 } from './migrations/20260503010000-member-domain-foundation';
import { SubscriptionDomainFoundation20260503015000 } from './migrations/20260503015000-subscription-domain-foundation';
import { Attendance } from '../modules/attendance/entities/attendance.entity';
import { Gym } from '../modules/gyms/entities/gym.entity';
import { GymAmenity } from '../modules/gyms/entities/gym-amenity.entity';
import { GymOperatingHour } from '../modules/gyms/entities/gym-operating-hour.entity';
import { MemberEmergencyContact } from '../modules/members/entities/member-emergency-contact.entity';
import { Member } from '../modules/members/entities/member.entity';
import { SubscriptionPlan } from '../modules/subscriptions/entities/subscription-plan.entity';
import { Subscription } from '../modules/subscriptions/entities/subscription.entity';
import { User } from '../modules/users/entities/user.entity';

export default new DataSource({
  ...createDataSourceOptions(),
  entities: [
    User,
    Gym,
    GymAmenity,
    GymOperatingHour,
    Member,
    MemberEmergencyContact,
    SubscriptionPlan,
    Subscription,
    Attendance,
  ],
  migrations: [
    InitialUsersTable20260414003000,
    GymDomainFoundation20260424010000,
    MemberDomainFoundation20260503010000,
    SubscriptionDomainFoundation20260503015000,
    AttendanceDomainFoundation20260503020000,
  ],
});
