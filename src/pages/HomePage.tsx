import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Search, PlayCircle, CheckCircle, Table, BarChart3, Users, Zap, Download, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="sticky top-0 w-full z-50 glass-effect border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 kinetic-gradient rounded-lg flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            TradeIntel Nepal
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors">How it Works</a>
            <Link to="/billing" className="text-on-surface-variant hover:text-primary transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium text-on-surface-variant hover:text-on-surface">Sign In</Link>
            <Button size="sm" asChild>
              <Link to="/dashboard">Try Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 space-y-8 z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Zap size={14} />
              AI-Powered Trade Intelligence
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Find Real Importers & <span className="text-primary">Exporters</span> in Seconds
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-lg">
              Discover companies, analyze opportunities, and generate B2B leads using AI. TradeIntel Nepal simplifies complex global trade data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/dashboard">Try Free</Link>
              </Button>
              <Button variant="secondary" size="lg">
                <PlayCircle className="mr-2" />
                See Demo
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-on-surface-variant/60">
              <div className="flex items-center gap-1"><CheckCircle size={16} className="text-green-500" /> <span className="text-sm font-medium">No Credit Card</span></div>
              <div className="flex items-center gap-1"><CheckCircle size={16} className="text-green-500" /> <span className="text-sm font-medium">1,000+ Free Credits</span></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 bg-white">
              <div className="h-10 bg-surface-container flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center text-[10px] font-medium text-slate-400 uppercase tracking-widest">TradeIntel Dashboard</div>
              </div>
              <div className="p-4 space-y-4 bg-surface-container-low">
                <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                  <Search size={16} className="text-slate-400" />
                  <div className="text-sm text-slate-400">Search "Orthopedic Implants"...</div>
                  <div className="ml-auto bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold">PRO</div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-3 font-semibold text-slate-500">COMPANY</th>
                        <th className="p-3 font-semibold text-slate-500">LOCATION</th>
                        <th className="p-3 font-semibold text-slate-500">VALUE (USD)</th>
                        <th className="p-3 font-semibold text-slate-500">LEAD SCORE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="p-3 font-medium">Nepal Tea Corp</td>
                        <td className="p-3">Kathmandu, NP</td>
                        <td className="p-3">$2.4M</td>
                        <td className="p-3"><span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">94/100</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Global Everest Exports</td>
                        <td className="p-3">Lalitpur, NP</td>
                        <td className="p-3">$1.8M</td>
                        <td className="p-3"><span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">89/100</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">Platform Highlights</span>
            <h2 className="text-4xl font-bold tracking-tight">Intelligence at Your Fingertips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Lead Discovery', desc: 'Access 50k+ verified trade entities within Nepal.', icon: Users },
              { title: 'AI Insights', desc: 'Automated summaries of market trends and company reputations.', icon: Zap },
              { title: 'Opportunity Scoring', desc: 'Prioritize outreach based on proprietary Lead Score.', icon: BarChart3 },
              { title: 'Export Leads', desc: 'Seamlessly export filtered lists to CSV or CRM.', icon: Download },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-surface-container-low border border-transparent hover:border-primary/10 transition-all"
              >
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-6">
                  <f.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 kinetic-gradient text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Start finding profitable leads today</h2>
          <p className="text-xl opacity-90 leading-relaxed">Join 200+ Nepalese businesses already scaling their global trade with TradeIntel AI.</p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low py-12 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="text-lg font-bold">TradeIntel Nepal</div>
            <p className="text-xs text-on-surface-variant leading-relaxed">The most accurate trade intelligence platform for the Himalayan region.</p>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest mb-4">Product</h5>
            <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <a href="#">Features</a>
              <a href="#">How it Works</a>
              <a href="#">Pricing</a>
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest mb-4">Legal</h5>
            <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest mb-4">Support</h5>
            <div className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <a href="#">Contact Us</a>
              <a href="#">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
