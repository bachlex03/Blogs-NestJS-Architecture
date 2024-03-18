import { PartialType } from '@nestjs/swagger';
import { ResponseSignupDto } from './response-signup.dto';

export class ResponseLoginDto extends PartialType(ResponseSignupDto) {}
