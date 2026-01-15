import { Car, Heart, Plane, Home } from 'lucide-react';

interface InsuranceTypesProps {
  onGetQuote: (type: string) => void;
}

export default function InsuranceTypes({ onGetQuote }: InsuranceTypesProps) {
  const types = [
    {
      name: 'Auto Coverage',
      icon: Car,
      description: 'Get a Quote',
      color: 'from-blue-100 to-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Life Insurance',
      icon: Heart,
      description: 'Get a Quote',
      color: 'from-green-100 to-green-50',
      iconColor: 'text-green-600',
    },
    {
      name: 'Travel Insurance',
      icon: Plane,
      description: 'Get a Quote',
      color: 'from-purple-100 to-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Home Insurance',
      icon: Home,
      description: 'Get a Quote',
      color: 'from-orange-100 to-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {types.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.name}
                className={`bg-gradient-to-br ${type.color} rounded-2xl p-8 text-center hover:shadow-lg transition`}
              >
                <div className="flex justify-center mb-4">
                  <Icon size={40} className={`${type.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                <button
                  onClick={() => onGetQuote(type.name)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {type.description}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
