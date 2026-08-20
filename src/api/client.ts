import { httpApi } from './httpClient';
import { mockApi } from './mockClient';

export const api = import.meta.env.VITE_API_MODE === 'real' ? httpApi : mockApi;
