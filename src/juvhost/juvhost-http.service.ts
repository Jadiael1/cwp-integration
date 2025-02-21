import { Inject, Injectable } from '@nestjs/common';
import { Http } from '../http/http';
import { AccountDTO } from '@dtos/account.dto';
import { SimpleResponse } from '@interfaces/simple-response.interface';

@Injectable()
export class JuvHostHttpService {
  constructor(@Inject('juvHostHttp') private http: Http) {}

  async createAccount(postData: AccountDTO): Promise<SimpleResponse> {
    const newPostData = Object.entries(postData).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>,
    );
    const payload = new URLSearchParams(newPostData);
    const response = await this.http.post(postData.api_url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.status === 200 && response?.data?.status !== 'OK') {
      throw response?.data;
    }
    return {
      success: true,
      status: "OK",
      message: response.data.msj || 'CWP account created successfully',
      data: response.data,
    };
  }
}
