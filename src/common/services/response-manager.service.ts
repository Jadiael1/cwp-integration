import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SimpleResponse } from '@interfaces/simple-response.interface';

@Injectable()
export class ResponseManagerService {
  processPromisesResult(setledResults: PromiseSettledResult<SimpleResponse>[]): SimpleResponse[] {
    const response = setledResults.map(setledResult =>
      setledResult.status === 'rejected'
        ? setledResult?.reason?.response ?? {
            success: false,
            data: null,
            error: setledResult?.reason,
            message: setledResult?.reason?.message || setledResult?.reason?.msj || 'Unknown error',
          }
        : setledResult.value,
    );

    const hasRejections = response.some(({ success }) => !success);
    if (hasRejections) {
      // reject para bullboard tem que ser um objeto ou string.
      const newResponse = JSON.stringify(response);
      throw new Error(newResponse);
    }
    return response;
  }
}
