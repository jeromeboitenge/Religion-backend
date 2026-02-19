import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChurchesModule } from './churches/churches.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ChurchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
