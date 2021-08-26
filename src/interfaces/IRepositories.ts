/* eslint-disable camelcase */
import { IRepositoryData } from './IRepositoryData';

export type IRepositories = {
  total_count: number;
  incomplete_results: boolean;
  items: IRepositoryData[];
  name: string;
};
