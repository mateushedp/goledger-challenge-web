import { apiFetch } from "./api";
import { TvShow, TvShowInput, TvShowApiResponse } from "@/types/tvShow";
import { deleteEpisode } from "./episodes";
import { getSeasonsWithEpisodes } from "./seasons";

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

export async function getTvShowByKey(key: string): Promise<TvShow | null> {
	const data = await apiFetch("/api/query/search", {
		method: "POST",
		body: JSON.stringify({
			query: {
				selector: {
					"@assetType": "tvShows",
					"@key": key,
				},
			},
		}),
	});

	if (!data.result.length) return null;

	return mapTvShow(data.result[0]);
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

export async function deleteTvShow(key: string): Promise<void> {
	const seasons = await getSeasonsWithEpisodes(key);

	for (const season of seasons) {
		for (const episode of season.episodes) {
			await deleteEpisode(episode.episodeNumber, season.key);
		}

		await apiFetch("/api/invoke/deleteAsset", {
			method: "POST",
			body: JSON.stringify({
				key: {
					"@assetType": "seasons",
					number: season.number,
					tvShow: {
						"@key": key,
					},
				},
			}),
		});
	}

	await apiFetch("/api/invoke/deleteAsset", {
		method: "POST",
		body: JSON.stringify({
			key: {
				"@key": key,
				"@assetType": "tvShows",
			},
		}),
	});
}

export async function updateTvShow(
	key: string,
	input: TvShowInput
): Promise<TvShow> {
	const data = await apiFetch("/api/invoke/updateAsset", {
		method: "POST",
		body: JSON.stringify({
			update: {
				"@key": key,
				"@assetType": "tvShows",
				...input,
			},
		}),
	});

	return mapTvShow(data);
}