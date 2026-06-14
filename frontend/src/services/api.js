import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const triggerDemo = async () => {
  const response = await api.post('/upload/demo');
  return response.data;
};

export const getAnalysis = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

export const getRecommendations = async (analysisId) => {
  const response = await api.get(`/products/recommendations/${analysisId}`);
  return response.data;
};

export const getFormulation = async (analysisId) => {
  const response = await api.get(`/formulation/${analysisId}`);
  return response.data;
};

export const getAllProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export default api;
