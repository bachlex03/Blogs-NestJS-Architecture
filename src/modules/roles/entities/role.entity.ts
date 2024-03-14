import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Permission } from './permission.entity';
import { UserInfo } from 'src/modules/users/entities/user-info.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @ManyToOne(() => UserInfo, (userInfo) => userInfo.role)
  @JoinColumn({ name: 'userInfo_id' })
  userInfo: UserInfo;

  @Column()
  name: string;

  @Column()
  description: string;
}
