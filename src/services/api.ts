import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const searchLeads = async (query: string) => {
  const response = await api.post('/search-leads', { query });
  return response.data;
};

export const getLeads = async (queryId?: string) => {
  const response = await api.get('/leads', { params: { queryId } });
  return response.data;
};

export const getLeadById = async (id: string) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const getAIInsights = async (leadId: string) => {
  const response = await api.get(`/insights/${leadId}`);
  return response.data;
};
