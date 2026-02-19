import { Module } from '@nestjs/common';
import { SermonsService } from './sermons.service';
import { SermonsController } from './sermons.controller';
import { ChurchesModule } from '../churches/churches.module';

@Module({
    imports: [ChurchesModule],
    controllers: [SermonsController],
    providers: [SermonsService],
    exports: [SermonsService],
})
export class SermonsModule { }
