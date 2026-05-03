import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gym } from './gym.entity';

@Entity({ name: 'gym_operating_hours' })
export class GymOperatingHour {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'day_of_week', type: 'smallint' })
  dayOfWeek!: number;

  @Column({ name: 'open_time', type: 'time', nullable: true })
  openTime?: string | null;

  @Column({ name: 'close_time', type: 'time', nullable: true })
  closeTime?: string | null;

  @Column({ name: 'is_closed', type: 'boolean', default: false })
  isClosed!: boolean;

  @ManyToOne(() => Gym, (gym) => gym.operatingHours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gym_id' })
  gym!: Gym;
}
