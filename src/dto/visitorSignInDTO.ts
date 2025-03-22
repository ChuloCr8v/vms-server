import { IsEmail, IsNumber } from 'class-validator';

export class visitorSignInDTO {
  @IsEmail()
  email?: string;

  @IsNumber()
  phoneNumber?: string;

  @IsNumber()
  passCode: number;
}
