import { apiFetch } from "./api";
import { Watchlist, WatchlistInput, WatchlistApiResponse } from "@/types/watchlist";

function mapWatchlist(item: WatchlistApiResponse): Watchlist {
	return {
		key: item["@key"],
		title: item.title,
		description: item.description,
		tvShows: item.tvShows || [],
	};
}

export async function getWatchlists(): Promise<Watchlist[]> {
	const data = await apiFetch("/api/query/search", {
		method: "POST",
		body: JSON.stringify({
			query: {
				selector: {
					"@assetType": "watchlist",
				},
			},
		}),
	});

	return data.result.map(mapWatchlist);
}

export async function createWatchlist(
	input: WatchlistInput,
): Promise<Watchlist> {
	const data = await apiFetch("/api/invoke/createAsset", {
		method: "POST",
		body: JSON.stringify({
			asset: [
				{
					"@assetType": "watchlist",
					...input,
				},
			],
		}),
	});

	return mapWatchlist(data[0]);
}

export async function updateWatchlist(
	input: WatchlistInput,
): Promise<Watchlist> {
	const data = await apiFetch("/api/invoke/updateAsset", {
		method: "POST",
		body: JSON.stringify({
			update: {
				"@assetType": "watchlist",
				...input,
			},
		}),
	});

	return mapWatchlist(data);
}

export async function deleteWatchlist(title: string): Promise<void> {
	await apiFetch("/api/invoke/deleteAsset", {
		method: "POST",
		body: JSON.stringify({
			key: {
				"@assetType": "watchlist",
				title,
			},
		}),
	});
}