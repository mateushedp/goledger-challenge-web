import { apiFetch } from "./api";
import { TvShow, TvShowInput, TvShowApiResponse } from "@/types/tvShow";

function mapTvShow(item: TvShowApiResponse): TvShow {
	return {
		key: item["@key"],
		title: item.title,
		description: item.description,
		recommendedAge: item.recommendedAge,
	};
}

export async function getTvShows(): Promise<TvShow[]> {
	const data = await apiFetch("/api/query/search", {
		method: "POST",
		body: JSON.stringify({
			query: {
				selector: {
					"@assetType": "tvShows",
				},
			},
		}),
	});

	return data.result.map(mapTvShow);
}

export async function createTvShow(input: TvShowInput): Promise<TvShow> {
	const data = await apiFetch("/api/invoke/createAsset", {
		method: "POST",
		body: JSON.stringify({
			asset: [
				{
					"@assetType": "tvShows",
					...input,
				},
			],
		}),
	});
	return mapTvShow(data[0]);
}

export async function deleteTvShow(title: string): Promise<void> {
	await apiFetch("/api/invoke/deleteAsset", {
		method: "POST",
		body: JSON.stringify({
			key: {
				"@assetType": "tvShows",
				title: title,
			},
		}),
	});
}

export async function updateTvShow(input: TvShowInput): Promise<TvShow> {
	const data = await apiFetch("/api/invoke/updateAsset", {
		method: "POST",
		body: JSON.stringify({
			update: {
				"@assetType": "tvShows",
				...input,
			},
		}),
	});

	return mapTvShow(data);
}