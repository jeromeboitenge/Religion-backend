import { Module } from '@nestjs/common';
import { DevotionsController } from './devotions.controller';
import { DevotionsService } from './devotions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DevotionsController],
  providers: [DevotionsService],
  exports: [DevotionsService],
})
export class DevotionsModule {}
