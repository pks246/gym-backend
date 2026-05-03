import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GymAmenity } from './gym-amenity.entity';
import { GymOperatingHour } from './gym-operating-hour.entity';

@Entity({ name: 'gyms' })
export class Gym {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({
    name: 'contact_email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contactEmail?: string | null;

  @Column({ name: 'phone_number', type: 'varchar', length: 30, nullable: true })
  phoneNumber?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => GymAmenity, (amenity) => amenity.gym, {
    cascade: true,
    eager: true,
  })
  amenities!: GymAmenity[];

  @OneToMany(() => GymOperatingHour, (operatingHour) => operatingHour.gym, {
    cascade: true,
    eager: true,
  })
  operatingHours!: GymOperatingHour[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
