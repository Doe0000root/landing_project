import { Shield, TrendingUp, Zap } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Our Insurance Services</h2>
            <p className="text-gray-600">
              Discover our comprehensive insurance solutions designed to meet your needs, covering everything from your vehicle to your home and beyond.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <Shield size={24} className="text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Affordable coverage</h3>
                  <p className="text-gray-300 text-sm">
                    Plans on a strict budget won't leave the nothing behind and you have direct unbeatable.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <TrendingUp size={24} className="text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Balanced coverage</h3>
                  <p className="text-gray-600 text-sm">
                    Plan with a mix of benefits that won't leave the nothing behind and you have direct experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <Zap size={24} className="text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comprehensive coverage</h3>
                  <p className="text-gray-600 text-sm">
                    Plans on a strict budget won't leave the nothing behind and you have direct unbeatable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
