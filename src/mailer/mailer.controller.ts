import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailDTo } from 'src/dto/sendEmailDTO';
import { MailerService } from './mailer.service';

@Controller('mail')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('verify-account')
  async verifyAccount(@Body() data: SendEmailDTo) {
    return this.mailerService.sendTemplateMail(
      data.to,
      data.subject,
      data.templateName,
      data.replacements,
    );
  }
}
