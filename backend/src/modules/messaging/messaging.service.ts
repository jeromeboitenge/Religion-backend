import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadDto, SendMessageDto, SendDirectMessageDto, ReportMessageDto } from './dto';

@Injectable()
export class MessagingService {
  private readonly RATE_LIMIT = 10;
  private readonly RATE_WINDOW = 60000;
  private userMessageCounts = new Map<string, { count: number; resetAt: number }>();

  constructor(private prisma: PrismaService) {}

  async getThreads(groupId: string) {
    return this.prisma.conversationThread.findMany({
      where: { groupId },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { isPinned: 'desc', createdAt: 'desc' },
    });
  }

  async getThread(id: string) {
    const thread = await this.prisma.conversationThread.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!thread) throw new NotFoundException('Thread not found');
    return thread;
  }

  async createThread(dto: CreateThreadDto, userId: string) {
    this.checkRateLimit(userId);

    return this.prisma.conversationThread.create({
      data: {
        ...dto,
        createdBy: userId,
      },
    });
  }

  async sendMessage(threadId: string, userId: string, dto: SendMessageDto) {
    this.checkRateLimit(userId);

    const thread = await this.prisma.conversationThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) throw new NotFoundException('Thread not found');
    if (thread.isLocked) throw new ForbiddenException('Thread is locked');

    const message = await this.prisma.message.create({
      data: {
        threadId,
        senderId: userId,
        content: dto.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        performedById: userId,
        action: 'MESSAGE_SENT',
        targetType: 'Message',
        targetId: message.id,
        details: { threadId },
      },
    });

    return message;
  }

  async getDirectMessages(userId: string) {
    return this.prisma.directMessage.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async sendDirectMessage(senderId: string, dto: SendDirectMessageDto) {
    this.checkRateLimit(senderId);

    if (senderId === dto.receiverId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    const receiver = await this.prisma.user.findUnique({
      where: { id: dto.receiverId },
    });

    if (!receiver) throw new NotFoundException('Receiver not found');

    const message = await this.prisma.directMessage.create({
      data: {
        senderId,
        receiverId: dto.receiverId,
        content: dto.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        performedById: senderId,
        action: 'DIRECT_MESSAGE_SENT',
        targetType: 'DirectMessage',
        targetId: message.id,
        details: { receiverId: dto.receiverId },
      },
    });

    return message;
  }

  async reportMessage(messageId: string, reportedBy: string, dto: ReportMessageDto) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) throw new NotFoundException('Message not found');

    return this.prisma.messageReport.create({
      data: {
        reporterId: reportedBy,
        targetType: 'MESSAGE',
        targetId: messageId,
        reason: dto.reason,
        description: dto.description,
      },
    });
  }

  private checkRateLimit(userId: string) {
    const now = Date.now();
    const userLimit = this.userMessageCounts.get(userId);

    if (!userLimit || now > userLimit.resetAt) {
      this.userMessageCounts.set(userId, {
        count: 1,
        resetAt: now + this.RATE_WINDOW,
      });
      return;
    }

    if (userLimit.count >= this.RATE_LIMIT) {
      throw new BadRequestException('Rate limit exceeded. Please wait before sending more messages.');
    }

    userLimit.count++;
  }
}
