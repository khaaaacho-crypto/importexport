import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { LeadsController } from './leads/leads.controller';
import { HealthController } from './health/health.controller';
import { LeadsService } from './leads/leads.service';
import { AIService } from './ai/ai.service';
import { ScraperService } from './scraper/scraper.service';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';
import { LeadFinderAgent } from './agents/lead-finder.agent';
import { DataExtractorAgent } from './agents/data-extractor.agent';
import { AIAnalyzerAgent } from './agents/ai-analyzer.agent';
import { QAValidatorAgent } from './agents/qa-validator.agent';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        maxRetriesPerRequest: null, // Required by BullMQ
      },
    }),
    BullModule.registerQueue(
      { name: 'lead-finder' },
      { name: 'data-extractor' },
      { name: 'ai-analyzer' },
      { name: 'qa-validator' },
    ),
  ],
  controllers: [LeadsController, HealthController],
  providers: [
    LeadsService,
    AIService,
    ScraperService,
    PrismaService,
    RedisService,
    // Multi-Agent Orchestration
    LeadFinderAgent,
    DataExtractorAgent,
    AIAnalyzerAgent,
    QAValidatorAgent,
  ],
})
export class AppModule {}
