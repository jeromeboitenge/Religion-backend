import { Module } from '@nestjs/common';
import { DevotionsService } from './devotions.service';
import { DevotionsController } from './devotions.controller';

@Module({
    controllers: [DevotionsController],
    providers: [DevotionsService],
    exports: [DevotionsService],
})
export class DevotionsModule { }
