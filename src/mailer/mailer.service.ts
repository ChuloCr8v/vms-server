import { Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Errors } from 'src/common/errors';
import { SendEmailDTo } from 'src/dto/sendEmailDTO';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private async loadTemplate(
    templateName: string,
    replacements: Record<string, string>,
  ) {
    const filePath = path.join(
      __dirname,
      '../../src/templates/emails',
      `${templateName}.hbs`,
    );
    const html = await fs.readFile(filePath, 'utf-8');
    const template = handlebars.compile(html);
    return template(replacements);
  }

  async sendTemplateMail(
    to: string,
    subject: string,
    templateName: string,
    replacements: Record<string, string>,
  ) {
    try {
      const htmlContent = await this.loadTemplate(templateName, replacements);

      const mailOptions = {
        from: process.env.MAIL_USER,
        to,
        subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email sent', info };
    } catch (error) {
      console.error('Email sending error:', error);
      Errors.SEND_EMAIL_FAILED;
    }
  }
}
