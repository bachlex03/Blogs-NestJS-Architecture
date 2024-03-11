import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { UUID } from 'crypto';

@Entity()
export class KeyToken {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User)
  @JoinColumn()
  user: User;

  @Column({
    type: 'simple-array',
    default: '',
  })
  refreshTokenUsed: string[];

  @Column()
  refreshTokenUsing: string;
}
