import { gql } from 'mercurius-codegen';

export const Episode = gql`
  type Episode {
    id: BigInt!
    podcastId: BigInt!
    date: DateTime!
    title: String!
    description: String
    progress: Int
    duration: Int
    fileSize: Int
    fileType: String
    fileUrl: String
    chaptersUrl: String
    transcriptUrl: String
    season: Int
    episode: Int
    episodeType: String
    podcast: Podcast!
    artwork: Artwork!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;
