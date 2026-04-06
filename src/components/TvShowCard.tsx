import Link from "next/link";

interface TvShowCardProps {
	showKey: string;
	title: string;
	description: string;
	recommendedAge: number;
	numberOfSeasons?: number;
}

export default function TvShowCard({
	showKey,
	title,
	description,
	recommendedAge,
	numberOfSeasons = 0,
}: TvShowCardProps) {
	return (
		<Link
			href={`/shows/${showKey}`}
			className="
        flex flex-col
        min-h-[170px]
        py-6 border-b border-[#45474b]/20
        md:p-6 md:rounded-lg md:border md:border-[#45474b]/20
        transition-colors hover:border-primary/40
      "
		>
			<h3 className="text-2xl md:text-lg font-semibold text-headline">
				{title}
			</h3>

			<div className="flex items-center gap-4 mt-4 md:hidden text-[10px]">
				<span className="font-semibold text-primary">
					{recommendedAge}+
				</span>
				<span className="text-body">
					{numberOfSeasons} {numberOfSeasons === 1 ? "season" : "seasons"}
				</span>
			</div>

			<p className="text-sm font-light text-body mt-4 md:overflow-hidden md:text-ellipsis md:line-clamp-3">
				{description}
			</p>

			<div className="hidden md:block text-xs text-body/60 mt-6">
				{recommendedAge}+ • {numberOfSeasons} {numberOfSeasons === 1 ? "season" : "seasons"}
			</div>
		</Link>
	);
}