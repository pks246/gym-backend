import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Member, (member) => member.attendances, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member!: Member;

  @Column({ name: 'attended_on', type: 'date' })
  attendedOn!: string;

  @Column({ name: 'check_in_at', type: 'timestamp' })
  checkInAt!: string;

  @Column({ name: 'check_out_at', type: 'timestamp', nullable: true })
  checkOutAt?: string | null;

  @Column({ type: 'varchar', length: 30, default: 'front-desk' })
  source!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
