export interface SimpleResponse {
  success: boolean;
  status: string;
  message: string;
  data?: any;
  error?: any;
}
