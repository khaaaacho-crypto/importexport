import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('qa-validator')
export class QAValidatorAgent extends WorkerHost {
  private readonly logger = new Logger(QAValidatorAgent.name);

  constructor(
    private prisma: PrismaService,
  ) {
    super();
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`QA Agent: Job ${job.id} started validating lead: ${job.data.lead.name}...`);
  }

  async process(job: Job<{ searchQueryId: string; query: string; url: string; lead: any }>) {
    const { searchQueryId, lead } = job.data;

    try {
      this.logger.log(`Validating lead: ${lead.name}`);
      
      // 1. Basic Validation
      if (!lead.name || lead.name.length < 2) {
        this.logger.warn(`Invalid lead name: ${lead.name}. Skipping.`);
        return;
      }

      // 2. Duplicate Check
      const existingLead = await this.prisma.lead.findFirst({
        where: {
          OR: [
            { name: lead.name },
            lead.website ? { website: lead.website } : undefined,
          ].filter(Boolean) as any,
        },
      });

      if (existingLead) {
        this.logger.log(`Duplicate lead found: ${lead.name}. Skipping.`);
        return;
      }

      // 3. Save to Database
      this.logger.log(`QA Passed. Saving lead: ${lead.name} to database.`);
      await this.prisma.lead.create({
        data: {
          ...lead,
          searchQueryId,
        },
      });

      // Update SearchQuery status to completed (at least one lead found)
      await this.prisma.searchQuery.update({
        where: { id: searchQueryId },
        data: { status: 'completed' },
      });

    } catch (e) {
      this.logger.error(`QA Agent error for lead ${lead.name}:`, e.stack);
      throw e;
    }
  }
}
