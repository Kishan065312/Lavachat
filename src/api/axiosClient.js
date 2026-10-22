
import axios from 'axios';
import { BASE_URL } from '../config';

const client = axios.create({ baseURL: BASE_URL, timeout: 10000 });

client.interceptors.request.use(c => { c.headers.Authorization="Bearer tempToken"; return c; });

export default client;
