import { Check, Zap } from 'lucide-react';
import { Card, Badge } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export const BillingPage = () => {
  const { user, setPlan } = useStore();

  const plans = [
    {
      name: 'Free',
      price: '0',
      desc: 'Explore the landscape',
      features: [
        '10 basic searches / month',
        'Public trade entities only',
        'Community support',
        'Basic lead table',
      ],
      button: 'Current Plan',
      variant: 'outline' as const,
    },
    {
      name: 'Pro',
      price: '49',
      desc: 'Scale your exports',
      features: [
        'Unlimited searches & leads',
        'AI-Powered Opportunity Scoring',
        'Verified contact direct dials',
        'Priority 24/7 account manager',
        'Export to CSV & CRM',
        'Predictive Market Analysis',
      ],
      button: 'Upgrade to Pro',
      variant: 'primary' as const,
      popular: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-on-surface-variant">Choose the plan that fits your business needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan) => {
          const isCurrent = user?.plan === plan.name.toLowerCase();
          return (
            <Card 
              key={plan.name} 
              className={cn(
                "relative flex flex-col p-8",
                plan.popular && "border-2 border-primary shadow-2xl scale-105 z-10"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                  Best Value
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-on-surface-variant">{plan.desc}</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className="text-on-surface-variant">/mo</span>
                </div>
              </div>
              <ul className="flex-1 space-y-4 mb-10">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-on-surface-variant">{f}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full"
                disabled={isCurrent}
                onClick={() => plan.name === 'Pro' && setPlan('pro')}
              >
                {isCurrent ? 'Current Plan' : plan.button}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="bg-surface-container-low border-none p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-primary shadow-sm">
          <Zap size={32} fill="currentColor" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Need a custom enterprise solution?</h3>
          <p className="text-on-surface-variant max-w-md mx-auto">For large organizations requiring API access, custom data scrapers, and dedicated account management.</p>
        </div>
        <Button variant="outline">Contact Sales</Button>
      </Card>
    </div>
  );
};
