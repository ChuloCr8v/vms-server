import { IsDefined, IsEmail } from 'class-validator';

export class AccountVerificationDTO {
  @IsDefined()
  token: string;

  @IsDefined()
  @IsEmail()
  email: string;
}
