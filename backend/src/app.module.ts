import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { DevotionsModule } from './modules/devotions/devotions.module';
import { FormationModule } from './modules/formation/formation.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { EventsModule } from './modules/events/events.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    GroupsModule,
    MeetingsModule,
    DevotionsModule,
    FormationModule,
    MessagingModule,
    EventsModule,
    AnnouncementsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
