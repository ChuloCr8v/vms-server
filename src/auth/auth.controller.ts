import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { AccountVerificationDTO } from 'src/dto/accountVerificationDTO';
import { OrganizationLoginDTO } from 'src/dto/loginDTO';
import { Errors } from 'src/common/errors';
import { RolesGuard } from 'src/guards/roles.guard';

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

  @Put('reset-password/:token/:email')
  resetPassword(
    @Param('email') email: string,
    @Param('token') token: string,
    @Body() data: { password: string },
  ) {
    return this.authService.resetPassword(email, token, data.password);
  }

  @Put('request-otp')
  requestOTP(@Body() data: { email: string }) {
    return this.authService.requestOTP(data.email);
  }

  @Put('verify-otp')
  veritfyOTP(@Body() data: { email: string; otp: string }) {
    const { email, otp } = data;
    return this.authService.verifyOTP(email, otp);
  }

  @Post('/employee/:orgId')
  createEmployee(
    @Body() createEmployeeDTO: Prisma.EmployeeCreateInput,
    @Param('orgId') orgId: string,
  ) {
    return this.authService.createEmployee(createEmployeeDTO, orgId);
  }

  @Put('/employee/admin-role/:id')
  updateAdminRole(@Param('id') id: string) {
    // console.log(id);
    return this.authService.updateAdminRole(id);
  }

  @UseGuards(RolesGuard)
  @Put('/update-status/:id')
  updateUserStatus(@Param('id') id: string) {
    // console.log(id);

    if (!id) return Errors.ID_IS_REQUIRED;
    return this.authService.updateUserStatus(id);
  }
}
