import { Inject, Injectable } from '@nestjs/common';
import { Http } from '../http/http';
import { AccountDTO } from '@dtos/account.dto';
import { SimpleResponse } from '@interfaces/simple-response.interface';

type JuvHostApiResponse = {
  status: string;
  msj?: string;
  [key: string]: unknown;
};

function isJuvHostApiResponse(data: unknown): data is JuvHostApiResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    typeof (data as { status: unknown }).status === 'string'
  );
}

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

    const rawData: unknown = response.data;

    if (!isJuvHostApiResponse(rawData)) {
      throw new Error('Unexpected response from JuvHost API');
    }

    const data: JuvHostApiResponse = rawData;

    if (response.status === 200 && data.status !== 'OK') {
      throw new Error(data.msj ?? 'Error creating CWP account');
    }

    return {
      success: true,
      status: 'OK',
      message: data.msj ?? 'CWP account created successfully',
      data,
    };
  }
}
