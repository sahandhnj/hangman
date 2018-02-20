export interface IGame {
  id?: number;
  playername?: string;
  word?: string;
  answers?: [string];
  status?: number;
  mistakes?: number;
}
