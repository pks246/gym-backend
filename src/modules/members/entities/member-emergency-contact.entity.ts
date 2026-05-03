import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity({ name: 'member_emergency_contacts' })
export class MemberEmergencyContact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 60 })
  relationship!: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 30 })
  phoneNumber!: string;

  @ManyToOne(() => Member, (member) => member.emergencyContacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member!: Member;
}
