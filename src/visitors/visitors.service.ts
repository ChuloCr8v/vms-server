import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createVisitorDTO } from 'src/dto/createVisitorDTO';
import { updateVisitorDTO } from 'src/dto/updateVisitorDTO';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VisitorsService {
  constructor(private prisma: PrismaService) {}

  async listVisits() {
    try {
      const res = await this.prisma.visit.findMany();
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createVisit(createVisitDTO: Prisma.VisitCreateInput) {
    try {
      // Extract visitor ID or create new visitor data
      const visitorId = createVisitDTO.visitor.connect?.id;
      const visitorCreateData = createVisitDTO.visitor.create;

      // Validate visitor creation data if needed
      if (!visitorId && !visitorCreateData) {
        throw new Error(
          'Either visitor ID or visitor creation data must be provided.',
        );
      }

      // Use a transaction to ensure atomicity
      return await this.prisma.$transaction(async (prisma) => {
        let visitor: Prisma.VisitorCreateInput;

        if (visitorId) {
          // Find the existing visitor
          visitor = await prisma.visitor.findUnique({
            where: { id: visitorId },
          });

          if (!visitor) {
            throw new Error(`Visitor with ID ${visitorId} not found.`);
          }
        } else {
          // Create a new visitor
          if (
            !visitorCreateData?.name ||
            !visitorCreateData?.email ||
            !visitorCreateData?.phone
          ) {
            throw new Error('Missing required fields for visitor creation.');
          }

          visitor = await prisma.visitor.create({
            data: {
              name: visitorCreateData.name,
              email: visitorCreateData.email,
              phone: visitorCreateData.phone,
              isActive: visitorCreateData.isActive,
              company: visitorCreateData.company,
            },
          });
        }

        // Create the visit
        return await prisma.visit.create({
          data: {
            ...createVisitDTO,
            visitor: {
              connect: { id: visitor.id }, // Connect the visit to the visitor
            },
          },
        });
      });
    } catch (error) {
      console.error('Error in createVisit:', error);
      throw error;
    }
  }

  async createVisitor(createVisitorDTO: createVisitorDTO) {
    const { name, email, phone, company, isActive } = createVisitorDTO;
    const visitorData = {
      name,
      email,
      phone,
      company,
      isActive,
    };

    try {
      await this.prisma.visitor.create({ data: visitorData });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating visitor');
    }
  }

  async listVisitors() {
    try {
      const res = await this.prisma.visitor.findMany();
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getVisitor(id: string) {
    try {
      const visitor = await this.prisma.visitor.findUnique({
        where: { id },
      });

      if (!visitor) throw new NotFoundException();

      return visitor;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  updateVisitor(id: string, updateVisitorDTO: updateVisitorDTO) {}
}
