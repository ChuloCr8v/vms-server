import { createVisitorDTO } from './createVisitorDTO';
import { PartialType } from '@nestjs/mapped-types';

export class updateVisitorDTO extends PartialType(createVisitorDTO) {}
