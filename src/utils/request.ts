import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// 创建一个 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api/v1', // 根据实际情况设置基础 URL
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，例如添加 token
    // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 通用的 GET 请求方法
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response:any = await instance.get<T>(url, config);
  return response.result.data;
};

// 通用的 POST 请求方法
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response:any = await instance.post<T>(url, data, config);
  return response.result.data;
};

// 通用的 PUT 请求方法
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response:any = await instance.put<T>(url, data, config);
  return response.result.data;
};

// 通用的 DELETE 请求方法
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response:any = await instance.delete<T>(url, config);
  return response.result.data;
};