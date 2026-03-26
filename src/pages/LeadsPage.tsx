import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, MoreVertical, ChevronLeft, ChevronRight, Mail, Phone, Globe } from 'lucide-react';
import { Card, Badge } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { getLeads } from '../services/api';

export const LeadsPage = () => {
  const { user } = useStore();
  const [leads, setLeads] = useState<any[]>([]);
  const isPro = user?.plan === 'pro';

  useEffect(() => {
    const fetchLeads = async () => {
      const data = await getLeads();
      setLeads(data);
    };
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Leads</h1>
          <p className="text-on-surface-variant">Manage and track your potential trade partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter size={18} className="mr-2" />
            Filter
          </Button>
          <Button>
            <Download size={18} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/20">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Primary Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lead Score</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {leads.map((lead, i) => (
                <tr key={lead.id} className={cn("hover:bg-surface-container-low transition-colors", !isPro && i > 1 && "blur-[2px] pointer-events-none")}>
                  <td className="px-6 py-4">
                    <Link to={`/leads/${lead.id}`} className="font-bold hover:text-primary transition-colors">{lead.name}</Link>
                    <p className="text-xs text-on-surface-variant">ID: {lead.id.substring(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{lead.industry || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                          <Mail size={14} />
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                          <Phone size={14} />
                        </a>
                      )}
                      {lead.website && (
                        <a href={lead.website} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                          <Globe size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={lead.leadScore > 80 ? 'success' : 'default'}>{lead.leadScore > 80 ? 'High Potential' : 'Active'}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${lead.leadScore}%` }} />
                      </div>
                      <span className="text-xs font-bold">{lead.leadScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-on-surface-variant hover:text-on-surface">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isPro && (
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-lg font-bold mb-2">Unlock 50,000+ Leads</h3>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md">Upgrade to Pro to see full contact details, verified direct dials, and export unlimited leads.</p>
            <Button size="lg">Upgrade to Pro</Button>
          </div>
        )}

        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">Showing 1-5 of 1,240 leads</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="sm"><ChevronRight size={16} /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
