import { Module } from '@nestjs/common';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GymsModule } from './modules/gyms/gyms.module';
import { MembersModule } from './modules/members/members.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    GymsModule,
    MembersModule,
    SubscriptionsModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
