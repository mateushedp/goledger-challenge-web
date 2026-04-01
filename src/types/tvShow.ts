export type TvShow = {
  key: string;
  title: string;
  description: string;
  recommendedAge: number;
};

export type TvShowInput = {
  title: string;
  description: string;
  recommendedAge: number;
};

export type TvShowApiResponse = {
  "@key": string;
  "@assetType": string;
  title: string;
  description: string;
  recommendedAge: number;
};