import { IsDefined, IsEmail } from 'class-validator';

export class SendEmailDTo {
  @IsDefined()
  @IsEmail()
  to: string;

  @IsDefined()
  subject: string;

  @IsDefined()
  templateName: string;

  @IsDefined()
  replacements: Record<string, string>;
}
