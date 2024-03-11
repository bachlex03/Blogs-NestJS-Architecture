import { UUID } from 'crypto';

export class SaveKeyTokenDto {
  refreshTokenUsed?: string[];

  refreshTokenUsing: string;
}
