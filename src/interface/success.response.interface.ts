export interface SuccessResponse<T> {
  isError?: boolean;
  message?: string;
  data: T;
}
