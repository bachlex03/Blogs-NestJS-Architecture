import { UUID } from 'crypto';
import { Blog } from 'src/modules/blogs/entities/blog.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entity } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
