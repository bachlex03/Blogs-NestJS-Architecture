import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';

export class ResponseSignupDto {
  /**
   * A JWT token include email, userId and user'roles | expired in 1d
   */
  accessToken: string;

  /**
   * A JWT token include email, userId and user'roles | expired in 3d
   */
  refreshToken: string;

  /**
   * Time expire of access token
   * @example 1731283192
   */
  expiresInAccessToken: number;

  /**
   * A list of user's roles
   * @example ['USER']
   */
  roles: Role[];
}
