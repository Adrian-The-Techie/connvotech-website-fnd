import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.data.access);
          }
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/admin/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Typed API functions
export const getSiteSettings = () => api.get('/site-settings/').then(res => res.data);
export const getServices = () => api.get('/services/').then(res => res.data);
export const getServiceBySlug = (slug: string) => api.get(`/services/${slug}/`).then(res => res.data);
export const getSectors = () => api.get('/sectors/').then(res => res.data);
export const getSectorBySlug = (slug: string) => api.get(`/sectors/${slug}/`).then(res => res.data);
export const getPortfolio = (tagSlug?: string) => 
  api.get(`/portfolio/${tagSlug ? `?tags__slug=${tagSlug}` : ''}`).then(res => res.data);
export const getProjectBySlug = (slug: string) => api.get(`/portfolio/${slug}/`).then(res => res.data);
export const getBlogPosts = (params?: any) => 
  api.get('/blog/', { params }).then(res => res.data);
export const getBlogPostBySlug = (slug: string) => api.get(`/blog/${slug}/`).then(res => res.data);
export const getTestimonials = () => api.get('/testimonials/').then(res => res.data);
export const getProducts = () => api.get('/products/').then(res => res.data);
export const submitContactForm = (data: any) => api.post('/contact/', data).then(res => res.data);

// Admin functions
export const adminLogin = (data: any) => api.post('/auth/token/', data).then(res => res.data);
export const getAdminSubmissions = () => api.get('/contact/').then(res => res.data);
export const getAdminSubmission = (id: string) => api.get(`/contact/${id}/`).then(res => res.data);
export const markSubmissionAsRead = (id: string) => api.patch(`/contact/${id}/`, { is_read: true });
export const updateLeadStatus = (id: string, status: string) => api.patch(`/contact/${id}/`, { lead_status: status });
export const addLeadInteraction = (id: string, data: { interaction_type: string, notes: string }) => api.post(`/contact/${id}/add_interaction/`, data).then(res => res.data);
