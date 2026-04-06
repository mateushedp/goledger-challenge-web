import { SeasonWithEpisodes } from "@/types/seasons";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSeasonsWithEpisodes } from "@/services/seasons";
import { getTvShowByKey } from "@/services/tvShows";
import { TvShow } from "@/types/tvShow";
import { EpisodeItem } from "@/components/EpisodeItem";
import Spinner from "@/components/Spinner";

function TvShowDetails() {
	const router = useRouter();
	const showKey = router.query.showKey as string;

	const [seasonsArray, setSeasonsArray] = useState<SeasonWithEpisodes[]>([]);
	const [tvShow, setTvShow] = useState<TvShow | null>(null);
	const [activeSeason, setActiveSeason] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!showKey) return;

		async function load() {
			setIsLoading(true);
			try {
				const [seasons, show] = await Promise.all([
					getSeasonsWithEpisodes(showKey),
					getTvShowByKey(showKey),
				]);
				setSeasonsArray(seasons);
				setTvShow(show);
			} finally {
				setIsLoading(false);
			}
		}

		load();
	}, [showKey]);

	useEffect(() => {

	}, [seasonsArray]);

	const sortedSeasons = [...seasonsArray].sort(
		(a, b) => a.number - b.number,
	);

	const effectiveSeason =
		activeSeason ?? sortedSeasons[0]?.number;

	const selectedSeason = sortedSeasons.find(
		(s) => s.number === effectiveSeason,
	);

	const episodes = (selectedSeason?.episodes ?? []).slice().sort(
		(a, b) => a.episodeNumber - b.episodeNumber,
	);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div>

			<div className="px-8 pt-12 pb-16 border-b border-[#45474b]/20">

				<p className="text-[10px] font-extrabold uppercase text-body">
					recommended age: {tvShow?.recommendedAge}
				</p>

				<h1 className="mt-[55px] text-[60px] md:text-[144px] font-extrabold uppercase italic leading-none text-headline">
					{tvShow?.title}
				</h1>

				<div className="mt-[40px] flex items-center gap-2 text-[11px] font-bold uppercase">
					<span className="text-primary">
						{seasonsArray.length} seasons
					</span>

				</div>

				<p className="mt-[40px] md:mr-[268px] text-[16px] md:text-[24px] font-light text-body leading-relaxed">
					{tvShow?.description}
				</p>
			</div>

			<div className="h-[49px] flex items-center justify-between px-8 border-b border-[#45474b]/20">

				<span className="text-[12px] font-extrabold uppercase text-body">
					seasons
				</span>

				<div className="flex items-center gap-4">
					{sortedSeasons.map((season) => {
						const isActive = effectiveSeason === season.number;

						return (
							<button
								key={season.key}
								onClick={() => setActiveSeason(season.number)}
								className={`
								text-[12px] font-bold uppercase pb-1 transition-colors
								${isActive
										? "text-primary border-b border-primary"
										: "text-body"}
                `}
							>
								{season.number}
							</button>
						);
					})}
				</div>
			</div>

			{!episodes.length
				? <p className="text-[14px] font-extrabold text-center my-5 italic text-body">
					No episodes found.
				</p>

				: <div className="px-2 md:px-8 my-12 md:py-12 space-y-0">
					{episodes.map((ep) => (
						<div key={ep.key} className="border-b border-[#45474b]/20">
							<EpisodeItem episode={ep} />
						</div>
					))}
				</div>}

		</div>
	);
}

export default TvShowDetails;