import { UUID } from 'crypto';

export class SaveKeyTokenDto {
  user_id: any;

  refreshTokenUsed: string[];

  refreshTokenUsing: string;
}
