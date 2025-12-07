import { Injectable } from '@nestjs/common';
import { SimpleResponse } from '@interfaces/simple-response.interface';

type SafePromiseRejectedResult = {
  status: 'rejected';
  reason: unknown;
};

type SafePromiseFulfilledResult<T> = {
  status: 'fulfilled';
  value: T;
};

type SafePromiseSettledResult<T> =
  | SafePromiseFulfilledResult<T>
  | SafePromiseRejectedResult;

@Injectable()
export class ResponseManagerService {
  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isSimpleResponse(value: unknown): value is SimpleResponse {
    if (!this.isObject(value)) return false;

    return (
      'success' in value &&
      'status' in value &&
      'message' in value &&
      'data' in value
    );
  }

  private extractMessageFromReason(reason: unknown): string {
    if (typeof reason === 'string') {
      return reason;
    }

    if (this.isObject(reason)) {
      const maybeMessage = (reason as { message?: unknown }).message;
      if (typeof maybeMessage === 'string') {
        return maybeMessage;
      }

      const maybeMsj = (reason as { msj?: unknown }).msj;
      if (typeof maybeMsj === 'string') {
        return maybeMsj;
      }
    }

    return 'Unknown error';
  }

  private normalizeRejectedResult(reason: unknown): SimpleResponse {
    if (this.isObject(reason) && 'response' in reason) {
      const resp = (reason as { response: unknown }).response;
      if (this.isSimpleResponse(resp)) {
        return resp;
      }
    }

    const message = this.extractMessageFromReason(reason);

    const fallback: SimpleResponse = {
      success: false,
      status: 'Error',
      data: null,
      error: reason,
      message,
    };

    return fallback;
  }

  processPromisesResult(
    settledResults: SafePromiseSettledResult<SimpleResponse>[],
  ): SimpleResponse[] {
    const responses: SimpleResponse[] = settledResults.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }

      return this.normalizeRejectedResult(result.reason);
    });

    const hasRejections = responses.some(({ success }) => !success);

    if (hasRejections) {
      const newResponse = JSON.stringify(responses);
      throw new Error(newResponse);
    }

    return responses;
  }
}
