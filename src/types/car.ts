export interface Car {
  id: number;
  name: string;
  color: string;
}

export type EngineStatus = 'started' | 'stopped' | 'drive';

export interface EngineResponse {
  velocity: number;
  distance: number;
}
