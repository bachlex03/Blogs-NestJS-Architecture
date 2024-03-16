import { UUID } from 'crypto';

export class SaveTokenDto {
  refreshTokenUsed?: string[];

  refreshTokenUsing: string;
}
