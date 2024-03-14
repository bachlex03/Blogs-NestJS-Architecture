import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Blog } from 'src/modules/blogs/entities/blog.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity({ name: 'userInfo' })
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Blog, (blog) => blog.userInfo)
  blogs: Blog[];

  @OneToMany(() => Role, (role) => role.id)
  role: Role[];

  @Column({ default: '' })
  fistName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  phoneNumber: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
