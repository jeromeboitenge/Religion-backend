import { Controller } from '@nestjs/common';
import { ChurchesService } from './churches.service';

@Controller('churches')
export class ChurchesController {
    constructor(private readonly churchesService: ChurchesService) { }
}
