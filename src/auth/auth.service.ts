import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Errors } from 'src/common/errors';
import { AccountVerificationDTO } from 'src/dto/accountVerificationDTO';
import { OrganizationLoginDTO } from 'src/dto/loginDTO';
import { SendEmailDTo } from 'src/dto/sendEmailDTO';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptCompare } from 'src/utils/bcryptCompare';
import { generatePassword } from 'src/utils/generatePassword';
import { hashData } from 'src/utils/hash';
import { OTPService } from 'src/utils/otp';
import { TokenService } from 'src/utils/tokens';
import { verificationLink } from 'src/utils/verificationLink';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: MailerService,
    private tokenService: TokenService,
  ) {}

  // Verify Account Email Method
  async verifyAccountEmail(data: SendEmailDTo) {
    const { to, subject, templateName, replacements } = data;

    try {
      await this.emailService
        .sendTemplateMail(to, subject, templateName, replacements)
        .then((res) => {
          return res;
        })
        .catch((error) => {
          Errors.SEND_EMAIL_FAILED;
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      Errors.SEND_EMAIL_FAILED;
    }
  }

  // Signup
  async signup(signupDTO: Prisma.OrganizationCreateInput) {
    const { organization, email, password } = signupDTO;

    if (!organization) return Errors.ORGANISATION_IS_REQUIRED;
    if (!email) return Errors.EMAIL_IS_REQUIRED;
    if (!password) return Errors.PASSWORD_IS_REQUIRED;

    try {
      const existingOrg = await this.prisma.organization.findUnique({
        where: { email },
      });

      if (existingOrg) return Errors.EMAIL_ALREADY_EXISTS;

      // Generate Token
      const { token, hashedToken, verificationTokenExpiresAt } =
        await this.tokenService.generateVerificationToken();

      // Hash Password
      const hashedPassword = await hashData.hashString(password);

      // Save to DB
      const res = await this.prisma.organization.create({
        data: {
          organization,
          email,
          password: hashedPassword,
          verificationToken: hashedToken,
          verificationTokenExpiresAt,
          isVerified: false,
        },
      });

      // Send Email
      const verification = verificationLink.link(email, token);

      await this.verifyAccountEmail({
        to: email,
        subject: 'Verify Your Organization Account',
        templateName: 'verifyAccount',
        replacements: {
          name: organization,
          year: new Date().getFullYear().toString(),
          companyName: 'VMS',
          verificationLink: verification,
        },
      });

      return res;
    } catch (error) {
      return error;
    }
  }

  // Verify account

  async verifyAccount(accountVerificationDTO: AccountVerificationDTO) {
    const { email, token } = accountVerificationDTO;

    try {
      const organization = await this.prisma.organization.findUnique({
        where: { email },
      });

      if (!organization) return Errors.EMAIL_DOES_NOT_EXIST;

      // Check if token is expired
      if (
        organization.verificationTokenExpiresAt &&
        new Date() > organization.verificationTokenExpiresAt
      ) {
        return Errors.TOKEN_EXPIRED;
      }

      if (
        !organization.verificationToken ||
        organization.verificationToken === null
      ) {
        return Errors.INVALID_TOKEN;
      }

      // Verify Token
      const isValid = await bcrypt.compare(
        token,
        organization.verificationToken,
      );
      if (!isValid) return Errors.INVALID_TOKEN;

      // Update to Verified
      const updatedOrg = await this.prisma.organization.update({
        where: { email },
        data: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpiresAt: null,
        },
      });

      const replacements = {
        name: organization.organization,
        companyName: organization.organization,
        loginLink: 'www.vms.com',
        year: new Date().getFullYear().toString(),
      };

      await this.emailService.sendTemplateMail(
        email,
        'Email Verified Successfully',
        'accountVerified',
        replacements,
      );

      return updatedOrg;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // login

  async login(organizationLoginDTo: OrganizationLoginDTO) {
    const { email, password } = organizationLoginDTo;
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { email },
      });

      if (!organization) return Errors.EMAIL_DOES_NOT_EXIST;
      const isValid = await BcryptCompare.compare(
        password,
        organization.password,
      );

      if (!isValid) return Errors.INVALID_PASSWORD;

      const token = this.tokenService.generateToken(organization.id, email);

      return token;
    } catch (error) {
      return error;
    }
  }

  // forgot password
  async forgotPassword(email: string) {
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { email },
      });
      if (!organization) return Errors.EMAIL_DOES_NOT_EXIST;

      const { token, verificationTokenExpiresAt, hashedToken } =
        await this.tokenService.generateVerificationToken();
      const link = `${process.env.BASE_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

      await this.prisma.organization.update({
        where: { id: organization.id },
        data: {
          verificationTokenExpiresAt,
          verificationToken: hashedToken,
        },
      });

      await this.verifyAccountEmail({
        to: email,
        subject: 'Reset Password',
        templateName: 'forgotPassword',
        replacements: {
          name: organization.organization,
          year: new Date().getFullYear().toString(),
          companyName: 'VMS',
          verificationLink: link,
        },
      });

      return { message: 'Verification link sent' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // reset password
  async resetPassword(
    email: string,
    token: string,
    password: string,
    verificationType?: string,
  ) {
    if (!password) return Errors.PASSWORD_IS_REQUIRED;
    const otpVerification = verificationType === 'otp';

    try {
      const organization = await this.prisma.organization.findUnique({
        where: { email },
      });
      if (!organization) return Errors.EMAIL_DOES_NOT_EXIST;

      const currentToken = otpVerification
        ? organization.verificationOTP
        : organization.verificationToken;

      if (!currentToken) return Errors.INVALID_TOKEN;

      const isValid = await bcrypt.compare(token, currentToken);

      if (!isValid) return Errors.INVALID_TOKEN;

      if (
        this.tokenService.tokenExpired(
          otpVerification
            ? new Date(organization.verificationOTPExpiresAt)
            : new Date(organization.verificationTokenExpiresAt),
        )
      )
        return Errors.TOKEN_EXPIRED;

      await this.prisma.organization.update({
        where: { id: organization.id },
        data: {
          password: await hashData.hashString(password),
          verificationOTP: null,
          verificationOTPExpiresAt: null,
          verificationToken: null,
          verificationTokenExpiresAt: null,
        },
      });

      const replacements = {
        name: organization.organization,
        companyName: organization.organization,
        loginLink: 'www.vms.com',
        year: new Date().getFullYear().toString(),
      };

      await this.emailService.sendTemplateMail(
        email,
        'Password Reset Successful',
        'passwordResetSuccessful',
        replacements,
      );

      return 'Password reset successful';
    } catch (error) {
      throw new Error(error);
    }
  }

  // request OTP
  async requestOTP(email: string) {
    if (!email) return Errors.EMAIL_IS_REQUIRED;

    try {
      const user = await this.prisma.organization.findUnique({
        where: { email },
      });

      if (!user) return Errors.EMAIL_DOES_NOT_EXIST;

      const OTP = OTPService.generateOTP();
      await this.prisma.organization.update({
        where: { id: user.id },
        data: {
          verificationOTP: await OTP.hashedOTP,
          verificationOTPExpiresAt: (
            await this.tokenService.generateVerificationToken()
          ).verificationTokenExpiresAt.toString(),
        },
      });

      const replacements = {
        otp: OTP.otp,
        year: new Date().getFullYear().toString(),
        name: user.organization,
        companyName: 'VMS',
      };

      await this.emailService.sendTemplateMail(
        email,
        'Reset Password OTP',
        'otp',
        replacements,
      );

      return { message: 'OTP Sent successfully', user };
    } catch (error) {
      throw new Error(error);
    }
  }

  // Verify OTP
  async verifyOTP(email: string, otp: string) {
    if (!email) return Errors.EMAIL_IS_REQUIRED;
    if (!otp) return Errors.TOKEN_IS_REQUIRED;

    try {
      const user = await this.prisma.organization.findUnique({
        where: { email },
      });

      if (!user) return Errors.EMAIL_DOES_NOT_EXIST;

      if (new Date(user.verificationOTPExpiresAt) < new Date())
        return Errors.TOKEN_EXPIRED;

      const verify = await bcrypt.compare(otp, user.verificationOTP);

      if (!verify) return Errors.INVALID_TOKEN;

      await this.prisma.organization.update({
        where: { id: user.id },
        data: {
          verificationOTP: null,
          verificationOTPExpiresAt: null,
        },
      });

      return 'OTP verification successful';
    } catch (error) {
      throw new Error(error);
    }
  }

  // create employee

  async createEmployee(data: Prisma.EmployeeCreateInput, orgId: string) {
    try {
      const findEmployee = await this.prisma.employee.findUnique({
        where: { email: data.email },
      });

      if (findEmployee) return Errors.EMAIL_ALREADY_EXISTS;

      const organization = await this.prisma.organization.findUnique({
        where: { id: orgId },
      });

      if (!organization) return Errors.EMAIL_DOES_NOT_EXIST;

      const password = generatePassword.password();
      const hashedPassword = await hashData.hashString(password);

      const employeeData = {
        ...data,
        password: hashedPassword,
        Organization: {
          connect: { id: orgId },
        },
      };

      const res = await this.prisma.employee.create({
        data: employeeData,
        // include: { Organization: true },
      });

      const replacements = {
        name: data.name,
        organization: organization.organization,
        loginUrl: process.env.BASE_URL,
        year: new Date().getFullYear().toString(),
        companyName: 'DMS',
      };

      await this.emailService.sendTemplateMail(
        data.email,
        'Welcome to VMS',
        'employeeDetails',
        replacements,
      );

      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  // update admin role

  async updateAdminRole(id: string) {
    if (!id) return new Error('Employee Id is required');

    try {
      const employee = await this.prisma.employee.findUnique({ where: { id } });
      if (!employee) return Errors.ACCOUNT_DOES_NOT_EXIST;

      const organization = await this.prisma.organization.findUnique({
        where: { id: employee.OrganizationId },
      });

      const update = await this.prisma.employee.update({
        where: { id },
        data: { isAdmin: !employee.isAdmin },
      });

      const replacements = {
        name: employee.name,
        organization: organization.organization,
        url: process.env.FRONTEND_URL,
        year: new Date().getFullYear().toString(),
      };

      !employee.isAdmin &&
        (await this.emailService.sendTemplateMail(
          employee.email,
          'Admin Role Updated',
          'adminRole',
          replacements,
        ));

      return update;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserStatus(id: string) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
      });

      if (!employee) return Errors.ACCOUNT_DOES_NOT_EXIST;

      const updateEmployeeStatus = await this.prisma.employee.update({
        where: { id },
        data: {
          isActive: !employee.isActive,
        },
      });

      return updateEmployeeStatus;
    } catch (error) {
      throw new Error(error);
    }
  }
}
