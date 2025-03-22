import { IsDate, IsDefined, IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class createVisitorDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  phone: string;

  @IsDefined()
  @IsNotEmpty()
  name: string;

  isActive: boolean;

  company?: string;
}
