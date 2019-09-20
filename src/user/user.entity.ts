/* eslint-disable @typescript-eslint/camelcase */
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { UserRO } from '../auth/auth.dto';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column('text', { nullable: true })
  password: string;

  @Column('simple-json', { nullable: true })
  google: { id: string; email: string };

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  toResponseObject(): UserRO {
    const { id, created_at, email } = this;
    return { id, created_at, email };
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
