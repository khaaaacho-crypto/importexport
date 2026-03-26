import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@Controller('api')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('search-leads')
  @ApiOperation({ summary: 'Initiate a lead search' })
  @ApiResponse({ status: 201, description: 'Search query initiated' })
  async searchLeads(@Body('query') query: string) {
    return this.leadsService.searchLeads(query);
  }

  @Get('leads')
  @ApiOperation({ summary: 'Get leads' })
  @ApiQuery({ name: 'queryId', required: false })
  @ApiResponse({ status: 200, description: 'List of leads' })
  async getLeads(@Query('queryId') queryId?: string) {
    return this.leadsService.getLeads(queryId);
  }

  @Get('leads/:id')
  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiResponse({ status: 200, description: 'Lead details' })
  async getLeadById(@Param('id') id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Get('insights/:leadId')
  @ApiOperation({ summary: 'Get AI insights for a lead' })
  @ApiResponse({ status: 200, description: 'AI insights content' })
  async getInsights(@Param('leadId') leadId: string) {
    return this.leadsService.getInsights(leadId);
  }
}
