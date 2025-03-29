import { Module } from '@nestjs/common';
import { VisitorsModule } from './visitors/visitors.module';
import { VisitorsService } from './visitors/visitors.service';
import { VisitorsController } from './visitors/visitors.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { MailerService } from './mailer/mailer.service';
import { MailerController } from './mailer/mailer.controller';
import { JwtModule } from '@nestjs/jwt';
import { ExtractToken } from './utils/extractToken';

@Module({
  imports: [VisitorsModule, AuthModule, JwtModule.register({})],
  controllers: [VisitorsController, MailerController],
  providers: [VisitorsService, PrismaService, MailerService, ExtractToken],
})
export class AppModule {}
