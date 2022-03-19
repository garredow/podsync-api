export type Episode = {
  id: number;
  podcastId: number;
  date: string;
  title: string;
  description?: string;
  duration: number;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  chaptersUrl?: string;
  transcriptUrl?: string;
  season?: number;
  episode?: number;
  episodeType?: string;
  createdAt: string;
  updatedAt: string;
};
