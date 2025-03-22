import { IsDefined, IsEmail } from 'class-validator';

export class OrganizationLoginDTO {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  password: string;
}
