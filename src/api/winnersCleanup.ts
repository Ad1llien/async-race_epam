import { ApiError } from './httpClient';
import { deleteWinner } from './winnersApi';
import { HTTP_STATUS_NOT_FOUND } from '../utils/constants';

export async function deleteWinnerSafe(id: number): Promise<void> {
  try {
    await deleteWinner(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === HTTP_STATUS_NOT_FOUND) {
      return;
    }
    throw error;
  }
}
