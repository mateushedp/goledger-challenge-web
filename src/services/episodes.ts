import { apiFetch } from "./api";
import type { Episode, EpisodeInput, EpisodeApiResponse } from "@/types/episodes";

function mapEpisode(item: EpisodeApiResponse): Episode {
	return {
		key: item["@key"],
		season: item.season,
		episodeNumber: item.episodeNumber,
		title: item.title,
		releaseDate: item.releaseDate,
		description: item.description,
		rating: item.rating,
	};
}

export async function getEpisodes(seasonKey: string): Promise<Episode[]> {
	const data = await apiFetch("/api/query/search", {
		method: "POST",
		body: JSON.stringify({
			query: {
				selector: {
					"@assetType": "episodes",
					"season.@key": seasonKey,
				},
			},
		}),
	});

	return data.result.map(mapEpisode);
}

export async function createEpisode(input: EpisodeInput): Promise<Episode> {
	const data = await apiFetch("/api/invoke/createAsset", {
		method: "POST",
		body: JSON.stringify({
			asset: [
				{
					"@assetType": "episodes",
					...input,
				},
			],
		}),
	});
	return mapEpisode(data[0]);
}

export async function updateEpisode(input: EpisodeInput): Promise<Episode> {
	const data = await apiFetch("/api/invoke/updateAsset", {
		method: "POST",
		body: JSON.stringify({
			update: {
				"@assetType": "episodes",
				...input,
			},
		}),
	});

	return mapEpisode(data);
}

export async function deleteEpisode(episodeNumber: number, seasonKey: string): Promise<void> {
	await apiFetch("/api/invoke/deleteAsset", {
		method: "POST",
		body: JSON.stringify({
			key: {
				"@assetType": "episodes",
				episodeNumber: episodeNumber,
				season: {
					"@key": seasonKey,
				},
			},
		}),
	});
}