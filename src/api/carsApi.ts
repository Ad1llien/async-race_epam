import { requestJson, requestPaged, requestVoid } from './httpClient';
import type { Car, EngineResponse, EngineStatus } from '../types/car';

export interface NewCar {
  name: string;
  color: string;
}

export function fetchCars(page: number, limit: number) {
  return requestPaged<Car>(`/garage?_page=${page}&_limit=${limit}`);
}

export function fetchAllCars(): Promise<Car[]> {
  return requestJson<Car[]>('/garage');
}

export function fetchCar(id: number): Promise<Car> {
  return requestJson<Car>(`/garage/${id}`);
}

export function createCar(car: NewCar): Promise<Car> {
  return requestJson<Car>('/garage', { method: 'POST', body: JSON.stringify(car) });
}

export function updateCar(id: number, car: NewCar): Promise<Car> {
  return requestJson<Car>(`/garage/${id}`, { method: 'PUT', body: JSON.stringify(car) });
}

export function deleteCar(id: number): Promise<void> {
  return requestVoid(`/garage/${id}`, { method: 'DELETE' });
}

export function setEngineStatus(id: number, status: EngineStatus): Promise<EngineResponse> {
  return requestJson<EngineResponse>(`/engine?id=${id}&status=${status}`, { method: 'PATCH' });
}

export function driveCar(id: number): Promise<void> {
  return requestVoid(`/engine?id=${id}&status=drive`, { method: 'PATCH' });
}
