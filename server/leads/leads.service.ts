import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { ScraperService } from '../scraper/scraper.service';
import { RedisService } from '../redis/redis.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private prisma: PrismaService,
    private ai: AIService,
    private scraper: ScraperService,
    private redis: RedisService,
    @InjectQueue('lead-finder') private leadFinderQueue: Queue,
  ) {}

  async searchLeads(query: string) {
    const isMockMode = process.env.MOCK_MODE === 'true' || !process.env.GEMINI_API_KEY;

    const searchQuery = await this.prisma.searchQuery.create({
      data: { query, status: 'processing' },
    });

    if (isMockMode) {
      this.logger.warn('MOCK_MODE active: Generating sample leads instead of triggering agents.');
      setTimeout(async () => {
        const mockLeads = [
          { name: 'Nepal Trade Hub', location: 'Kathmandu', industry: 'Textiles', description: 'Major exporter of pashmina.', website: 'https://nepaltradehub.com', leadScore: 85 },
          { name: 'Everest Logistics', location: 'Lalitpur', industry: 'Logistics', description: 'Freight forwarding specialist.', website: 'https://everestlogistics.np', leadScore: 72 },
        ];

        for (const lead of mockLeads) {
          await this.prisma.lead.create({
            data: { ...lead, searchQueryId: searchQuery.id },
          });
        }

        await this.prisma.searchQuery.update({
          where: { id: searchQuery.id },
          data: { status: 'completed' },
        });
      }, 2000);

      return searchQuery;
    }

    await this.leadFinderQueue.add('find-leads', {
      searchQueryId: searchQuery.id,
      query,
    }, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 10000,
      },
      removeOnComplete: true,
    });

    return searchQuery;
  }

  async getLeads(queryId?: string) {
    return this.prisma.lead.findMany({
      where: queryId ? { searchQueryId: queryId } : {},
      orderBy: { createdAt: 'desc' },
      include: { insight: true },
    });
  }

  async getLeadById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: { insight: true },
    });
  }

  async getInsights(leadId: string) {
    // 1. Check Redis Cache
    const cachedInsight = await this.redis.get(`insight:${leadId}`);
    if (cachedInsight) {
      this.logger.log(`Serving cached insight for lead ${leadId}`);
      return JSON.parse(cachedInsight);
    }

    // 2. Check Database
    const existingInsight = await this.prisma.insight.findUnique({
      where: { leadId },
    });

    if (existingInsight) {
      // Cache in Redis for future hits
      await this.redis.set(`insight:${leadId}`, JSON.stringify(existingInsight));
      return existingInsight;
    }

    // 3. Generate with AI
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return null;

    try {
      this.logger.log(`Generating new AI insights for lead ${leadId}`);
      const analysis = await this.ai.generateLeadInsights(lead);
      
      const newInsight = await this.prisma.insight.create({
        data: {
          leadId,
          summary: analysis.summary,
          industryClassification: analysis.industryClassification,
          opportunityScore: analysis.opportunityScore,
          buyingIntentScore: analysis.buyingIntentScore,
        },
      });

      // Cache in Redis
      await this.redis.set(`insight:${leadId}`, JSON.stringify(newInsight));
      
      return newInsight;
    } catch (e) {
      this.logger.error(`Failed to generate insights for lead ${leadId}:`, e.stack);
      throw e;
    }
  }
}
