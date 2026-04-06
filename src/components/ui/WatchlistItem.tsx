import Link from "next/link";
import { Watchlist } from "@/types/watchlist";

type Props = {
	watchlist: Watchlist;
	showsMap: Record<string, string>;
	children?: React.ReactNode;
};

export function WatchlistItem({ watchlist, showsMap, children }: Props) {
	const { key, title, description, tvShows } = watchlist;

	return (
		<div
			className="
				relative
				w-full
				flex flex-col
				min-h-[330px]
				p-6
				border-b border-[#45474b]/20
				md:rounded-lg border border-[#45474b]/20
				transition-colors hover:border-primary/40
			"
		>
			<Link href={`/collections/${key}`} className="contents">

				<div className="absolute right-2 md:right-6 top-6">
					<span className="text-[10px] font-semibold uppercase text-primary border border-primary rounded md:rounded-full p-2">
						{tvShows.length} {tvShows.length === 1 ? "show" : "shows"}
					</span>
				</div>

				<h3 className="text-2xl md:text-lg font-semibold text-headline">
					{title}
				</h3>

				{description && (
					<p className="
						text-sm font-light text-body mt-4
						md:overflow-hidden md:text-ellipsis md:line-clamp-3
					">
						{description}
					</p>
				)}

				<div className="my-4 flex flex-wrap gap-2">
					{tvShows.length === 0 ? (
						<span className="text-xs text-body/60 italic">
							No shows yet
						</span>
					) : (
						tvShows.map((show) => (
							<span
								key={show["@key"]}
								className="text-[10px] uppercase border border-border px-2 py-1 rounded"
							>
								{showsMap[show["@key"]] || show["@key"]}
							</span>
						))
					)}
				</div>

			</Link>

			{children && (
				<div
					className="mt-auto flex flex-col gap-2 z-10"
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</div>
			)}
		</div>
	);
}