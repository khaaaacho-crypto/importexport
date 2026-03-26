import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ScraperService } from '../scraper/scraper.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('lead-finder')
export class LeadFinderAgent extends WorkerHost {
  private readonly logger = new Logger(LeadFinderAgent.name);

  constructor(
    private scraper: ScraperService,
    private prisma: PrismaService,
    @InjectQueue('data-extractor') private extractorQueue: Queue,
  ) {
    super();
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Lead Finder Agent: Job ${job.id} started searching for leads...`);
  }

  async process(job: Job<{ searchQueryId: string; query: string }>) {
    const { searchQueryId, query } = job.data;

    try {
      this.logger.log(`Searching for lead sources for query: ${query}`);
      const links = await this.scraper.findLeadSources(query);
      
      this.logger.log(`Found ${links.length} sources. Passing to Data Extractor Agent.`);
      
      for (const link of links) {
        await this.extractorQueue.add('extract-data', {
          searchQueryId,
          query,
          url: link,
        }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        });
      }

    } catch (e) {
      this.logger.error(`Lead Finder Agent error:`, e.stack);
      await this.prisma.searchQuery.update({
        where: { id: searchQueryId },
        data: { status: 'failed' },
      });
      throw e;
    }
  }
}
