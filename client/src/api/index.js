// src/api/index.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:3001', // Your Fastify backend
});

export default instance;
