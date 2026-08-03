import { API_URL } from '../utils/constants';

export interface PagedResult<T> {
  data: T[];
  totalCount: number;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseError(response: Response): Promise<never> {
  const text = await response.text();
  throw new ApiError(response.status, text || response.statusText);
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    await parseError(response);
  }

  return (await response.json()) as T;
}

export async function requestPaged<T>(path: string): Promise<PagedResult<T>> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    await parseError(response);
  }

  const data = (await response.json()) as T[];
  const totalCountHeader = response.headers.get('X-Total-Count');
  const totalCount = totalCountHeader ? Number(totalCountHeader) : data.length;

  return { data, totalCount };
}

export async function requestVoid(path: string, init?: RequestInit): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    await parseError(response);
  }
}
