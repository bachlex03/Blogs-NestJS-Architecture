import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Blog } from 'src/modules/blogs/entities/blog.entity';

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER',
}

export enum Permissions {
  POST = 'POST',
  VIEW = 'VIEW',
  COMMENT = 'COMMENT',
  ACCEPT_POST = 'ACCEPT_POST',
  DELETE_POST = 'ACCEPT_DELETE',
}

export const RolePermissions = {
  [Roles.ADMIN]: [Permissions.POST, Permissions.VIEW],
  [Roles.USER]: [Permissions.POST, Permissions.VIEW],
};

@Entity({ name: 'userInfo' })
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Blog, (blog) => blog.userInfo)
  blogs: Blog[];

  @Column({ default: '' })
  fistName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ default: '' })
  phoneNumber: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
