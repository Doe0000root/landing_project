import { ArrowRight, Mail, CheckCircle } from 'lucide-react';

interface HeroSectionProps {
  onGetConsultation: () => void;
  onBuyInsurance: () => void;
}

export default function HeroSection({ onGetConsultation, onBuyInsurance }: HeroSectionProps) {
  return (
    <section className="pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-600">Our updates news</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Protecting Your Future with InsureGuard
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Safeguard your needs with more peace of mind of insurance online families.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={onGetConsultation}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-medium flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Mail size={16} className="text-red-600" />
                </div>
                <span>Get a Quote</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <CheckCircle size={20} className="text-teal-600" />
                <span>Find an Agent</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30"></div>

              <div className="relative z-10 space-y-6">
                <div className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
                </div>

                <div className="flex gap-4 pt-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full"></div>
                  <div className="flex-1 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="text-xs font-medium text-gray-500 mb-2">Rating</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-yellow-400 rounded"></div>
                      ))}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-2">4.8K+</div>
                  </div>
                </div>

                <div className="h-48 bg-gradient-to-b from-gray-300 to-gray-400 rounded-2xl"></div>

                <button
                  onClick={onBuyInsurance}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Browse Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
