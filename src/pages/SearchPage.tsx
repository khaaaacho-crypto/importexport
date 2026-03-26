import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { Card, Badge, Input } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { searchLeads, getLeads } from '../services/api';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [queryId, setQueryId] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (queryId && isLoading) {
      interval = setInterval(async () => {
        const leads = await getLeads(queryId);
        if (leads.length > 0) {
          setResults(leads);
          setIsLoading(false);
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [queryId, isLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    setResults([]);
    try {
      const searchResult = await searchLeads(query);
      setQueryId(searchResult.id);
    } catch (error) {
      console.error("Search Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Find Your Next Big Lead</h1>
        <p className="text-on-surface-variant">Search across 50,000+ verified importers and exporters.</p>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <Input 
              placeholder="Search by product, HS code, or company name..." 
              className="pl-12 border-none bg-surface-container-low rounded-2xl h-14"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button size="lg" className="h-14 px-10">Search</Button>
        </form>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-on-surface-variant">{results.length} Results Found</p>
        <Button variant="outline" size="sm">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-on-surface-variant font-medium">Analyzing trade data...</p>
            </div>
          ) : (
            results.map((result, i) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/leads/${result.id}`}>
                  <Card className="hover:border-primary/20 hover:shadow-md group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-xl">
                          {result.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{result.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-on-surface-variant">{result.location}</span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant" />
                            <span className="text-xs text-on-surface-variant">{result.industry}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Annual Value</p>
                          <p className="font-bold">{result.value}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Lead Score</p>
                          <Badge variant="success">{result.leadScore}/100</Badge>
                        </div>
                        <ArrowRight size={20} className="text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
