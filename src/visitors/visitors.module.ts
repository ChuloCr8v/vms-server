import { Module } from '@nestjs/common';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VisitorsController],
  providers: [VisitorsService, PrismaService],
})
export class VisitorsModule {}
