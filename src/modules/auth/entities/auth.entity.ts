import { isEmail } from 'class-validator';
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @OneToOne((type) => User, (user) => user.id)
  user_id: User;
}
