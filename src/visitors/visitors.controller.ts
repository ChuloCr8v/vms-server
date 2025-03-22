import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { updateVisitorDTO } from 'src/dto/updateVisitorDTO';
import { VisitorsService } from './visitors.service';

@Controller('')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}
  @Get('/visitors')
  listVisitors() {
    return this.visitorsService.listVisitors();
  }

  @Get('/visits')
  listVisits() {
    return this.visitorsService.listVisits();
  }

  @Get('/visitors/:id')
  getVisitor(@Param('id') id: string) {
    return this.visitorsService.getVisitor(id);
  }

  @Post('/visits')
  createVisit(@Body() createVisitDTO: Prisma.VisitCreateInput) {
    return this.visitorsService.createVisit(createVisitDTO);
  }

  @Patch('/:id')
  updateVisitor(
    @Param('id') id: string,
    @Body() updateVisitorDTO: updateVisitorDTO,
  ) {
    return this.visitorsService.updateVisitor(id, updateVisitorDTO);
  }
}
