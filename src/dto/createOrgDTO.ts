import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDTO {
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  organization: string;

  @IsNotEmpty()
  @IsDefined()
  password: string;
}
