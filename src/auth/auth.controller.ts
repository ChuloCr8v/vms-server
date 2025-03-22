import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { AccountVerificationDTO } from 'src/dto/accountVerificationDTO';
import { OrganizationLoginDTO } from 'src/dto/loginDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() companyDTO: Prisma.OrganizationCreateInput) {
    return this.authService.signup(companyDTO);
  }

  @Post('verify-account')
  verifyAccount(@Body() accountVerificationDTO: AccountVerificationDTO) {
    return this.authService.verifyAccount(accountVerificationDTO);
  }

  @Put('login')
  login(@Body() organizationLoginDTO: OrganizationLoginDTO) {
    return this.authService.login(organizationLoginDTO);
  }

  @Put('forgot-password/:email')
  forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Put('reset-password/:email/:token')
  resetPassword(
    @Param('email') email: string,
    @Param('token') token: string,
    @Body() password: string,
  ) {
    return this.authService.resetPassword(email, token, password);
  }
}
