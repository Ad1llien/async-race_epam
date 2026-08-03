import { ApiError, requestJson, requestPaged, requestVoid } from './httpClient';
import type { SortOrder, Winner, WinnerSortField } from '../types/winner';

export function fetchWinners(
  page: number,
  limit: number,
  sort: WinnerSortField,
  order: SortOrder,
) {
  return requestPaged<Winner>(`/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`);
}

export async function fetchWinner(id: number): Promise<Winner | null> {
  try {
    return await requestJson<Winner>(`/winners/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function createWinner(winner: Winner): Promise<Winner> {
  return requestJson<Winner>('/winners', { method: 'POST', body: JSON.stringify(winner) });
}

export function updateWinner(id: number, wins: number, time: number): Promise<Winner> {
  return requestJson<Winner>(`/winners/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ wins, time }),
  });
}

export function deleteWinner(id: number): Promise<void> {
  return requestVoid(`/winners/${id}`, { method: 'DELETE' });
}

export async function registerWin(id: number, time: number): Promise<void> {
  const existing = await fetchWinner(id);

  if (!existing) {
    await createWinner({ id, wins: 1, time });
    return;
  }

  await updateWinner(id, existing.wins + 1, Math.min(existing.time, time));
}