import { HttpException } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

function normalizeAxiosErrorBody(
  error: AxiosError<unknown>,
): string | Record<string, any> {
  const data = error.response?.data;

  if (typeof data === 'string') {
    return data;
  }

  if (data && typeof data === 'object') {
    return data as Record<string, any>;
  }

  return String(data);
}

export class Http {
  constructor(private instance: AxiosInstance) {}

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    try {
      return await this.instance.get<T>(url, config);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const body = normalizeAxiosErrorBody(err);
        throw new HttpException(body, err.response.status);
      }
      throw err;
    }
  }

  public async post<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    try {
      return await this.instance.post<T>(url, data, config);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const body = normalizeAxiosErrorBody(err);
        throw new HttpException(body, err.response.status);
      }
      throw err;
    }
  }

  public async put<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    try {
      return await this.instance.put<T>(url, data, config);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const body = normalizeAxiosErrorBody(err);
        throw new HttpException(body, err.response.status);
      }
      throw err;
    }
  }

  public async patch<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    try {
      return await this.instance.patch<T>(url, data, config);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const body = normalizeAxiosErrorBody(err);
        throw new HttpException(body, err.response.status);
      }
      throw err;
    }
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    try {
      return await this.instance.delete<T>(url, config);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const body = normalizeAxiosErrorBody(err);
        throw new HttpException(body, err.response.status);
      }
      throw err;
    }
  }
}
