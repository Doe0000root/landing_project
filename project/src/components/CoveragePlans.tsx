import { Check } from 'lucide-react';

interface CoveragePlansProps {
  onSelectPlan: (plan: string) => void;
}

export default function CoveragePlans({ onSelectPlan }: CoveragePlansProps) {
  const plans = [
    {
      name: 'Basic Plan',
      price: 20,
      description: 'Perfect for getting started',
      popular: false,
      features: ['Unlimited product updates', 'Unlimited product', 'Unlimited product', 'Email and community support'],
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-teal-600 hover:bg-teal-700',
    },
    {
      name: 'Favorite Plan',
      price: 60,
      description: 'Most popular choice',
      popular: true,
      features: ['Unlimited product updates', 'Unlimited product', 'Unlimited product', 'Email and community support'],
      bgColor: 'bg-gradient-to-b from-blue-100 to-blue-50',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Standard Plan',
      price: 40,
      description: 'For professionals',
      popular: false,
      features: ['Unlimited product updates', 'Unlimited product', 'Unlimited product', 'Email and community support'],
      bgColor: 'bg-orange-50',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Coverage Plans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive insurance solutions designed to meet your needs, covering everything from your vehicle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 relative transition ${plan.popular ? 'ring-2 ring-blue-600 shadow-xl' : ''} ${plan.bgColor}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>

              <button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full text-white py-3 rounded-lg transition font-medium mb-6 ${plan.buttonColor}`}
              >
                Continue to membership
              </button>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
