import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './inedx';
import { message } from 'antd';

// 创建一个 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: API_URL + '/api/v1', // 根据实际情况设置基础 URL
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = JSON.parse(localStorage.getItem('app')).globalToken;
    if (token) {
      config.headers.Token = token;
    } else {
      message.warning('无Token, 请重新登录！');
      // 使用回调函数处理导航
      if (typeof window !== 'undefined' && (window as any).handleNavigate) {
        (window as any).handleNavigate('/login');
      }
      return Promise.reject(new Error('未找到 token，跳转到登录页面'));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    if (response.data.code == 10024) {
      message.warning('Token已过期，请重新登录！');
      // 使用回调函数处理导航
      if (typeof window !== 'undefined' && (window as any).handleNavigate) {
        (window as any).handleNavigate('/login');
      }
      return Promise.reject(new Error('未找到 token，跳转到登录页面'));
    }
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 通用的 GET 请求方法
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: any = await instance.get<T>(url, config);
  return response.result.data;
};

// 通用的 POST 请求方法
export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: any = await instance.post<T>(url, data, config);
  return response.result.data;
};

// 通用的 PUT 请求方法
export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response: any = await instance.put<T>(url, data, config);
  return response.result.data;
};

// 通用的 DELETE 请求方法
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: any = await instance.delete<T>(url, config);
  return response.result.data;
};