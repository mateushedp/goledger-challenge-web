import { Episode } from "./episodes";


export type Season = {
	key: string;
	number: number;
	tvShow: { "@key": string };
	year: number;
};

export type SeasonInput = {
	number: number;
	tvShow: { "@key": string };
	year: number;
}

export type SeasonApiResponse = {
	"@key": string;
	"@assetType": string;
	number: number;
	tvShow: { "@key": string };
	year: number;
};

export type SeasonWithEpisodes = Season & {
	episodes: Episode[];
};