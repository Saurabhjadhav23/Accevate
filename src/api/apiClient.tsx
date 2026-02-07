import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://aapsuj.accevate.co/flutter-api/', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
