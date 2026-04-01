import { apiFetch } from "./api";
import type { Season, SeasonInput, SeasonApiResponse } from "@/types/seasons";

function mapSeason(item: SeasonApiResponse): Season {
	return {
		key: item["@key"],
		number: item.number,
		tvShow: item.tvShow,
		year: item.year,
	};
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