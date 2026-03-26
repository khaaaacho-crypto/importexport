import React from 'react';
import { Search, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';
import { Card, Badge } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const DashboardPage = () => {
  const { user } = useStore();

  const stats = [
    { label: 'Total Leads', value: '52,408', icon: Users, color: 'text-blue-500' },
    { label: 'Active Importers', value: '12,890', icon: Globe, color: 'text-green-500' },
    { label: 'Market Growth', value: '+14.2%', icon: TrendingUp, color: 'text-purple-500' },
  ];

  const recentSearches = [
    'Orthopedic Implants',
    'Himalayan Herbs',
    'Organic Black Tea',
    'Pashmina Shawls'
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.email.split('@')[0]}</h1>
          <p className="text-on-surface-variant">Here's what's happening in the trade market today.</p>
        </div>
        <Button>
          <Search size={18} className="mr-2" />
          New Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl bg-surface-container-high", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Recent Market Activity</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="font-bold">New Importer in Germany</p>
                    <p className="text-xs text-on-surface-variant">Tea & Spices sector • 2 hours ago</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-6">
          <h3 className="font-bold">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, i) => (
              <button key={i} className="px-4 py-2 rounded-xl bg-surface-container-low text-sm hover:bg-primary hover:text-white transition-all">
                {search}
              </button>
            ))}
          </div>
          <div className="pt-6 border-t border-outline-variant/20">
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-4">Pro Insights</p>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-sm italic text-primary-container">
                "Significant demand surge detected in European markets for organic black tea. 14 new importers identified this month."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
