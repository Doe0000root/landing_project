const API_URL = 'http://localhost:5000/api';

export const api = {
  auth: {
    register: async (email: string, password: string, full_name: string) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name }),
      });
      return response.json();
    },

    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },

    verify: async (token: string) => {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },

  insurance: {
    getProducts: async () => {
      const response = await fetch(`${API_URL}/insurance/products`);
      return response.json();
    },

    deletePolicy: async (policyId: number, token: string) => {
      const res = await fetch(
        `${API_URL}/insurance/policies/${policyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to delete policy');
      }
    },

    purchase: async (token: string, product_id: number, plan_type: string, monthly_price: number) => {
      const response = await fetch(`${API_URL}/insurance/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, plan_type, monthly_price }),
      });
      return response.json();
    },
    

    getMyPolicies: async (token: string) => {
      const response = await fetch(`${API_URL}/insurance/my-policies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
};
