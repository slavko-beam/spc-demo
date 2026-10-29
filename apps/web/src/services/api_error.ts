export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiResult<T> = { data?: T; error?: unknown; response: Response };

export const unwrap = <T>({ data, error, response }: ApiResult<T>): T => {
  if (error === undefined && data !== undefined) return data;

  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : response.statusText;
  throw new ApiError(message, response.status);
};
