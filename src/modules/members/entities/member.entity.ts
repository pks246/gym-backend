import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gym } from '../../gyms/entities/gym.entity';
import { MemberEmergencyContact } from './member-emergency-contact.entity';

@Entity({ name: 'members' })
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Gym, (gym) => gym.members, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gym_id' })
  gym!: Gym;

  @Column({ name: 'member_code', type: 'varchar', length: 50, unique: true })
  memberCode!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ name: 'phone_number', type: 'varchar', length: 30, nullable: true })
  phoneNumber?: string | null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: string | null;

  @Column({ name: 'joined_on', type: 'date' })
  joinedOn!: string;

  @Column({ type: 'varchar', length: 30, default: 'active' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @OneToMany(() => MemberEmergencyContact, (contact) => contact.member, {
    cascade: true,
    eager: true,
  })
  emergencyContacts!: MemberEmergencyContact[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
