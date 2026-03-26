import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Mail, Phone, MapPin, BarChart3, Zap, ShieldCheck, ExternalLink, Download, Users } from 'lucide-react';
import { Card, Badge } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { getLeadById, getAIInsights } from '../services/api';
import ReactMarkdown from 'react-markdown';

export const LeadDetailPage = () => {
  const { id } = useParams();
  const [lead, setLead] = useState<any>(null);
  const [insight, setInsight] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const leadData = await getLeadById(id);
      setLead(leadData);
      
      setIsLoadingInsights(true);
      try {
        const aiInsight = await getAIInsights(id);
        setInsight(aiInsight);
      } catch (e) {
        console.error("Failed to fetch insights:", e);
      } finally {
        setIsLoadingInsights(false);
      }
    };
    fetchData();
  }, [id]);

  if (!lead) return <div className="p-20 text-center">Loading lead details...</div>;

  return (
    <div className="space-y-8">
      <Link to="/leads" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft size={16} />
        Back to Leads
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <Card className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                  {lead.name[0]}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{lead.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <MapPin size={16} />
                      {lead.location || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                      <BarChart3 size={16} />
                      {insight?.industryClassification || lead.industry || 'N/A'}
                    </div>
                    <Badge variant="success">Verified Entity</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Download size={18} className="mr-2" />
                  Export
                </Button>
                <Button>Contact Lead</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-outline-variant/20">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Annual Value</p>
                <p className="text-2xl font-bold mt-1">{lead.annualValue || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Lead Score</p>
                <p className="text-2xl font-bold mt-1">{lead.leadScore}/100</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</p>
                <p className="text-2xl font-bold mt-1">Active</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="font-bold text-lg">Company Overview</h3>
            <p className="text-on-surface-variant leading-relaxed">{lead.description || 'No description available.'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center gap-4">
                <Globe size={20} className="text-primary" />
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Website</p>
                  {lead.website ? (
                    <a href={lead.website} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline flex items-center gap-1">
                      {lead.website.replace('https://', '').replace('http://', '')} <ExternalLink size={12} />
                    </a>
                  ) : <p className="text-sm font-medium">N/A</p>}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center gap-4">
                <Mail size={20} className="text-primary" />
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Email</p>
                  <p className="text-sm font-medium">{lead.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full lg:w-80 space-y-8">
          <Card className="kinetic-gradient text-white">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={20} fill="currentColor" />
              <span className="font-bold text-xs uppercase tracking-widest">AI Insights</span>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-70">Opportunity</p>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-2xl font-bold">{insight?.opportunityScore || lead.leadScore}</span>
                    <span className="text-[10px] mb-1 opacity-70">/100</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-70">Buying Intent</p>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-2xl font-bold">{insight?.buyingIntentScore || 'N/A'}</span>
                    <span className="text-[10px] mb-1 opacity-70">/100</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                {isLoadingInsights ? (
                  <div className="flex items-center gap-2">
                    <Zap className="animate-pulse" size={16} />
                    <span className="text-sm">Analyzing lead...</span>
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{insight?.summary || 'No insights generated yet.'}</ReactMarkdown>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck size={16} />
                  <span>Industry: {insight?.industryClassification || 'Verified'}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h4 className="font-bold">Quick Actions</h4>
            <Button variant="outline" className="w-full justify-start">
              <Mail size={18} className="mr-3" />
              Send Email
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Phone size={18} className="mr-3" />
              Request Call
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users size={18} className="mr-3" />
              Find Similar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
