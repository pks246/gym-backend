import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gym } from './gym.entity';

@Entity({ name: 'gym_amenities' })
export class GymAmenity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @ManyToOne(() => Gym, (gym) => gym.amenities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gym_id' })
  gym!: Gym;
}
