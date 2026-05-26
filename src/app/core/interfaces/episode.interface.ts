import { Episode } from "../models/episode.model";

export interface EpisodeApiResponse {
  info: PaginationInfo;
  results: Episode[];
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface EpisodeFilters {
  name: string;
  episode: string;
}