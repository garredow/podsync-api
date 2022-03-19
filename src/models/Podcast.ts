export type Podcast = {
  id: number;
  itunesId?: number;
  title: string;
  author: string;
  description?: string;
  artworkUrl: string;
  feedUrl: string;
  categories?: number[];
  lastFetchedEpisodes: string;
  createdAt: string;
  updatedAt: string;
};
