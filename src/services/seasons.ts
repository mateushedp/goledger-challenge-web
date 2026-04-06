import { apiFetch } from "./api";
import type { Season, SeasonInput, SeasonApiResponse, SeasonWithEpisodes } from "@/types/seasons";
import { deleteEpisode, getEpisodes } from "./episodes";

function mapSeason(item: SeasonApiResponse): Season {
	return {
		key: item["@key"],
		number: item.number,
		tvShow: item.tvShow,
		year: item.year,
	};
}

export async function getSeasonsWithEpisodes(
	tvShowKey: string,
): Promise<SeasonWithEpisodes[]> {
	const seasons = await getSeasons(tvShowKey);

	const result = await Promise.all(
		seasons.map(async (season) => {
			const episodes = await getEpisodes(season.key);

			return {
				...season,
				episodes,
			};
		}),
	);

	return result;
}

export async function getSeasons(tvShowKey: string): Promise<Season[]> {
	const data = await apiFetch("/api/query/search", {
		method: "POST",
		body: JSON.stringify({
			query: {
				selector: {
					"@assetType": "seasons",
					"tvShow.@key": tvShowKey,
				},
			},
		}),
	});

	return data.result.map(mapSeason);
}

export async function createSeason(input: SeasonInput): Promise<Season> {
	const data = await apiFetch("/api/invoke/createAsset", {
		method: "POST",
		body: JSON.stringify({
			asset: [
				{
					"@assetType": "seasons",
					...input,
				},
			],
		}),
	});
	return mapSeason(data[0]);
}

export async function updateSeason(input: SeasonInput): Promise<Season> {
	const data = await apiFetch("/api/invoke/updateAsset", {
		method: "POST",
		body: JSON.stringify({
			update: {
				"@assetType": "seasons",
				...input,
			},
		}),
	});

	return mapSeason(data);
}

export async function deleteSeason(number: number, tvShowKey: string): Promise<void> {
	const seasons = await getSeasons(tvShowKey);
	const season = seasons.find(s => s.number === number);

	if (season) {
		const episodes = await getEpisodes(season.key);

		for (const episode of episodes) {
			await deleteEpisode(episode.episodeNumber, season.key);
		}
	}

	await apiFetch("/api/invoke/deleteAsset", {
		method: "POST",
		body: JSON.stringify({
			key: {
				"@assetType": "seasons",
				number: number,
				tvShow: {
					"@key": tvShowKey,
				},
			},
		}),
	});
}

