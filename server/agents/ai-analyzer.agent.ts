import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { AIService } from '../ai/ai.service';
import { Logger } from '@nestjs/common';

@Processor('ai-analyzer')
export class AIAnalyzerAgent extends WorkerHost {
  private readonly logger = new Logger(AIAnalyzerAgent.name);

  constructor(
    private ai: AIService,
    @InjectQueue('qa-validator') private qaQueue: Queue,
  ) {
    super();
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`AI Analyzer Agent: Job ${job.id} started analyzing scraped text...`);
  }

  async process(job: Job<{ searchQueryId: string; query: string; url: string; scrapedText: string }>) {
    const { searchQueryId, query, url, scrapedText } = job.data;

    try {
      this.logger.log(`Extracting leads with AI for query: ${query} from URL: ${url}`);
      const leads = await this.ai.extractLeadsFromText(scrapedText, query);

      this.logger.log(`Extracted ${leads.length} leads. Passing to QA Agent.`);
      
      for (const lead of leads) {
        await this.qaQueue.add('validate-lead', {
          searchQueryId,
          query,
          url,
          lead,
        }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        });
      }

    } catch (e) {
      this.logger.error(`AI Analyzer Agent error for job ${job.id}:`, e.stack);
      throw e;
    }
  }
}
