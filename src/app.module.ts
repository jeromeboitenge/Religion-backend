import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChurchesModule } from './modules/churches/churches.module';
import { SermonsModule } from './modules/sermons/sermons.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ChurchesModule, SermonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
