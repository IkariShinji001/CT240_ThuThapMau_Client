import axios from 'axios';

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
};

const api = axios.create({
  baseURL: 'http://localhost:8080',
  ...commonConfig,
});

export default api;