import { config } from '@/config';
import { TStore } from '@/store';
import axios from 'axios';

const instance = axios.create({
  baseURL: config.V2EX_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

interface IError {
  message: string;
  data: any;
  status: number;
}

export const handleError = ({ message, data, status }: IError) => {
  return Promise.reject({ message, data, status });
};

/**
 * set Cookie from store and prevent require cycle
 *
 * @param store - the return of configureStore()
 */
export function setCookie(store: TStore) {
  instance.interceptors.request.use((request) => {
    const cookies = store.getState().user.cookies;
    request.headers.cookie = cookies || '';
    return request;
  });
}

instance.interceptors.response.use(
  (response) => response,
  ({ message, response: { data, status } }) => {
    return handleError({ message, data, status });
  },
);

export default instance;
