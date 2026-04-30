// All API communication lives here.
// Components import named functions — no raw fetch() calls scattered around.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ─── Core helper ─────────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  // Attach JWT from localStorage if present
  const token = typeof window !== 'undefined' ? localStorage.getItem('zenvy_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    // Throw the server's message so UI can display it directly
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsAPI = {
  // params: { category, featured, bestseller, search, sort }
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null))
    ).toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },

  getOne: (id) => request(`/products/${id}`),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersAPI = {
  create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders/my'),
  getOne: (id) => request(`/orders/${id}`),
};
