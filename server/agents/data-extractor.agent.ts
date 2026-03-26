import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ScraperService } from '../scraper/scraper.service';
import { Logger } from '@nestjs/common';

@Processor('data-extractor')
export class DataExtractorAgent extends WorkerHost {
  private readonly logger = new Logger(DataExtractorAgent.name);

  constructor(
    private scraper: ScraperService,
    @InjectQueue('ai-analyzer') private analyzerQueue: Queue,
  ) {
    super();
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Data Extractor Agent: Job ${job.id} started scraping URL: ${job.data.url}...`);
  }

  async process(job: Job<{ searchQueryId: string; query: string; url: string }>) {
    const { searchQueryId, query, url } = job.data;

    try {
      this.logger.log(`Scraping content from URL: ${url}`);
      const scrapedText = await this.scraper.extractTextFromUrl(url);
      
      this.logger.log(`Scraping successful. Passing raw text to AI Analyzer Agent.`);
      
      await this.analyzerQueue.add('analyze-data', {
        searchQueryId,
        query,
        url,
        scrapedText,
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      });

    } catch (e) {
      this.logger.error(`Data Extractor Agent error for URL ${url}:`, e.stack);
      throw e;
    }
  }
}
