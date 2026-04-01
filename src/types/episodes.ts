export type Episode = {
	key: string;
	season: { "@key": string };
	episodeNumber: number;
	title: string;
	releaseDate: string;
	description: string;
	rating?: number;
};

export type EpisodeInput = {
	season: { "@key": string };
	episodeNumber: number;
	title: string;
	releaseDate: string;
	description: string;
	rating?: number;
};

export type EpisodeApiResponse = {
	"@key": string;
	"@assetType": string;
	season: { "@key": string };
	episodeNumber: number;
	title: string;
	releaseDate: string;
	description: string;
	rating?: number;
};