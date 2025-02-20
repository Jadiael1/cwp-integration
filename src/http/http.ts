import { HttpException } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class Http {
  constructor(private instance: AxiosInstance) {}

  public async get(url: string, config?: AxiosRequestConfig) {
    try {
      return await this.instance.get(url, config);
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status);
      }
    }
  }

  public async post(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      return await this.instance.post(url, data, config);
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status);
      }
    }
  }

  public async put(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      return await this.instance.put(url, data, config);
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status);
      }
    }
  }

  public async patch(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      return await this.instance.patch(url, data, config);
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status);
      }
    }
  }

  public async delete(url: string, config?: AxiosRequestConfig) {
    try {
      return await this.instance.delete(url, config);
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status);
      }
    }
  }
}
