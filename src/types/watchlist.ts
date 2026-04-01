export type Watchlist = {
	key: string;
	title: string;
	description?: string;
	tvShows: { "@key": string }[];
};

export type WatchlistInput = {
	title: string;
	description?: string;
	tvShows?: { "@key": string }[];
};

export type WatchlistApiResponse = {
	"@key": string;
	"@assetType": string;
	title: string;
	description?: string;
	tvShows?: { "@key": string }[];
};