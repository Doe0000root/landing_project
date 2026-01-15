import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Check, ArrowLeft, ShoppingCart } from 'lucide-react';

interface BuyInsuranceProps {
  onNavigate: (page: string) => void;
  user: any;
  token: string | null;
}

interface InsuranceProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  base_price: number;
  features: string[];
}

interface SelectedPlan {
  productId: number;
  planType: string;
  monthlyPrice: number;
  productName: string;
}

export default function BuyInsurance({ onNavigate, user, token }: BuyInsuranceProps) {
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.insurance.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (product: InsuranceProduct, planType: string, price: number) => {
    setSelectedProduct(product);
    setSelectedPlan({
      productId: product.id,
      planType,
      monthlyPrice: price,
      productName: product.name,
    });
  };

  const handlePurchase = async () => {
    if (!selectedPlan || !token) return;

    setPurchasing(true);
    try {
      const response = await api.insurance.purchase(token, selectedPlan.productId, selectedPlan.planType, selectedPlan.monthlyPrice);

      if (response.error) {
        alert('Purchase failed: ' + response.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onNavigate('profile');
        }, 2000);
      }
    } catch (error) {
      console.error('Error purchasing insurance:', error);
      alert('Failed to complete purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
          <p className="text-gray-600 mb-6">Your insurance policy has been activated. You'll be redirected to your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {selectedProduct ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedPlan(null);
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h1>
                <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { type: 'Basic', multiplier: 0.8 },
                  { type: 'Standard', multiplier: 1 },
                  { type: 'Premium', multiplier: 1.5 },
                ].map((plan) => {
                  const price = Math.round(selectedProduct.base_price * plan.multiplier);
                  return (
                    <div
                      key={plan.type}
                      onClick={() => handleSelectPlan(selectedProduct, plan.type, price)}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition ${
                        selectedPlan?.planType === plan.type
                          ? 'border-blue-600 bg-white shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{plan.type} Plan</h3>
                      <div className="text-3xl font-bold text-gray-900 mb-4">
                        ${price}
                        <span className="text-sm text-gray-600 font-normal">/month</span>
                      </div>
                      <ul className="space-y-2">
                        {selectedProduct.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check size={16} className="text-green-600 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {selectedPlan?.planType === plan.type && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <p className="text-sm font-semibold text-blue-600">Selected</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedPlan && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-blue-600" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Product</span>
                      <span className="font-semibold text-gray-900">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Plan Type</span>
                      <span className="font-semibold text-gray-900">{selectedPlan.planType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Coverage Duration</span>
                      <span className="font-semibold text-gray-900">12 Months</span>
                    </div>
                    <div className="border-t border-blue-200 pt-3 mt-3 flex justify-between">
                      <span className="font-semibold text-gray-900">Monthly Premium</span>
                      <span className="font-bold text-blue-600 text-lg">${selectedPlan.monthlyPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Annual Total</span>
                      <span className="text-sm font-semibold text-gray-900">${selectedPlan.monthlyPrice * 12}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 justify-between">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-3">What's Included</h4>
                    <ul className="space-y-2">
                      {selectedProduct.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                          <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setSelectedPlan(null);
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Change Plan
                    </button>
                    <button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {purchasing ? 'Processing...' : (
                        <>
                          <ShoppingCart size={18} />
                          Complete Purchase
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Insurance Plans</h1>
            <p className="text-gray-600 mb-8">Select a plan that best fits your needs</p>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-6">{product.description}</p>

                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Starting at</p>
                        <p className="text-4xl font-bold text-gray-900">
                          ${product.base_price}
                          <span className="text-base font-normal text-gray-600">/month</span>
                        </p>
                      </div>

                      <div className="space-y-3 mb-8">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Check size={20} className="text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleSelectPlan(product, 'Standard', product.base_price)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        View Plans
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
