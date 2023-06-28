import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export async function makeRequest(url, options) {
  try {
    const response = await api(url, options);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message ?? 'Error';
  }
}
