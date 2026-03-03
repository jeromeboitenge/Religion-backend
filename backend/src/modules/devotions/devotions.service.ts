import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DevotionsService {
  constructor(private prisma: PrismaService) {}

  async getToday() {
    const today = new Date().toISOString().split('T')[0];
    const devotion = await this.prisma.devotion.findFirst({
      where: { date: new Date(today) },
    });

    if (!devotion) throw new NotFoundException('No devotion for today');
    return devotion;
  }

  async getByDate(dateStr: string) {
    const devotion = await this.prisma.devotion.findFirst({
      where: { date: new Date(dateStr) },
    });

    if (!devotion) throw new NotFoundException('No devotion for this date');
    return devotion;
  }

  async getRecent() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.devotion.findMany({
      where: {
        date: { gte: sevenDaysAgo },
      },
      orderBy: { date: 'desc' },
    });
  }

  @Cron('0 5 * * *', {
    timeZone: 'Africa/Kigali',
  })
  async generateDailyDevotion() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.devotion.findFirst({
      where: { date: today },
    });

    if (existing) {
      console.log('Devotion already exists for today');
      return;
    }

    const devotionData = await this.generateDevotionContent(today);

    await this.prisma.devotion.create({
      data: devotionData,
    });

    console.log(`Generated devotion for ${today.toISOString()}`);
  }

  private async generateDevotionContent(date: Date) {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const themes = [
      { en: 'Faith', rw: 'Kwizera', fr: 'Foi' },
      { en: 'Hope', rw: 'Ibyiringiro', fr: 'Espérance' },
      { en: 'Love', rw: 'Urukundo', fr: 'Amour' },
      { en: 'Service', rw: 'Gukorera', fr: 'Service' },
      { en: 'Prayer', rw: 'Gusenga', fr: 'Prière' },
      { en: 'Unity', rw: 'Ubumwe', fr: 'Unité' },
      { en: 'Mercy', rw: 'Imbabazi', fr: 'Miséricorde' },
    ];

    const theme = themes[dayOfYear % themes.length];

    return {
      date,
      theme_en: theme.en,
      theme_rw: theme.rw,
      theme_fr: theme.fr,
      message_en: `Today, let us reflect on ${theme.en}. In our Catholic faith, ${theme.en.toLowerCase()} is a cornerstone of our relationship with God and each other. As young Catholics, we are called to embody this virtue in our daily lives.`,
      message_rw: `Uyu munsi, reka tutekereze ku ${theme.rw}. Mu kwizera kwacu gatolika, ${theme.rw} ni urufatiro rw'umubano wacu n'Imana n'abandi. Nk'urubyiruko rwa gatolika, twahamagariwe kwerekana ubu buryo mu buzima bwacu bwa buri munsi.`,
      message_fr: `Aujourd'hui, réfléchissons sur ${theme.fr}. Dans notre foi catholique, ${theme.fr.toLowerCase()} est une pierre angulaire de notre relation avec Dieu et les autres. En tant que jeunes catholiques, nous sommes appelés à incarner cette vertu dans notre vie quotidienne.`,
      prayer_en: `Lord, grant us the grace to grow in ${theme.en.toLowerCase()}. Help us to be witnesses of Your love in our communities. Amen.`,
      prayer_rw: `Mwami, duhe ubuntu bwo gukura mu ${theme.rw}. Udufashe kuba abagabo b'urukundo rwawe mu miryango yacu. Amen.`,
      prayer_fr: `Seigneur, accorde-nous la grâce de grandir en ${theme.fr.toLowerCase()}. Aide-nous à être des témoins de Ton amour dans nos communautés. Amen.`,
      reflection_en: `How can I practice ${theme.en.toLowerCase()} in my daily interactions today?`,
      reflection_rw: `Nshobora gute gukora ${theme.rw} mu mibanire yanjye ya buri munsi uyu munsi?`,
      reflection_fr: `Comment puis-je pratiquer ${theme.fr.toLowerCase()} dans mes interactions quotidiennes aujourd'hui?`,
      action_en: `Perform one act of ${theme.en.toLowerCase()} for someone in need today.`,
      action_rw: `Kora igikorwa kimwe cya ${theme.rw} ku muntu ukeneye uyu munsi.`,
      action_fr: `Accomplissez un acte de ${theme.fr.toLowerCase()} pour quelqu'un dans le besoin aujourd'hui.`,
      bibleReferences: JSON.stringify([
        { book: 'John', chapter: 13, verse: 34, text: 'Love one another' },
        { book: '1 Corinthians', chapter: 13, verse: 13, text: 'Faith, hope, love' },
      ]),
    };
  }
}
