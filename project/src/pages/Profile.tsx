import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Calendar, DollarSign, CheckCircle, Plus, Trash2 } from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string) => void;
  user: any;
  token: string | null;
}

interface Policy {
  id: number;
  product_name: string;
  plan_type: string;
  monthly_price: number;
  status: string;
  start_date: string;
}

export default function Profile({ onNavigate, user, token }: ProfileProps) {
  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
    });
  };

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchPolicies();
    }
  }, [token]);

  const fetchPolicies = async () => {
    try {
      if (!token) return;
      const data = await api.insurance.getMyPolicies(token);
      setPolicies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePolicy = async (policyId: number) => {
  if (!token) return;

  if (!window.confirm('Are you sure you want to delete this policy?')) return;

  try {
    await api.insurance.deletePolicy(policyId, token);

    setPolicies((prev) => prev.filter((p) => p.id !== policyId));
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Failed to delete policy');
  }
};


  const statusColors: any = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Policies</p>
                  <p className="text-lg font-semibold text-gray-900">{policies.filter((p: any) => p.status === 'active').length}</p>
                </div>
                <div>
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                      })
                    : '—'}
                </p>
              </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <button
              onClick={() => onNavigate('buy-insurance')}
              className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium mb-4"
            >
              <Plus size={20} />
              Buy Insurance
            </button>
            <div className="bg-white/20 rounded-lg p-4 text-sm">
              <p className="font-semibold mb-1">Protect Your Future</p>
              <p className="text-blue-100">Get comprehensive coverage for all your needs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Insurance Policies</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : policies.length === 0 ? (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-12 text-center border-2 border-dashed border-blue-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-blue-600" />
              </div>
              <p className="text-gray-700 mb-4 font-medium">No insurance policies yet</p>
              <p className="text-gray-600 mb-6">Start protecting yourself with our comprehensive insurance plans</p>
              <button
                onClick={() => onNavigate('buy-insurance')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Browse Plans
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {policies.map((policy) => (
                <div key={policy.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{policy.product_name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[policy.status]}`}>
                          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Monthly Premium</p>
                        <p className="text-2xl font-bold text-blue-600">${policy.monthly_price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4 grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Plan Type</p>
                      <p className="font-semibold text-gray-900">{policy.plan_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Start Date</p>
                      <p className="font-semibold text-gray-900">{new Date(policy.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Annual Cost</p>
                      <p className="font-semibold text-gray-900">${(policy.monthly_price * 12).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Coverage</p>
                      <p className="font-semibold text-gray-900">Active</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                      File Claim
                    </button>
                    <button
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Delete Policy"
                  >
                    <Trash2 size={18} />
                  </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
