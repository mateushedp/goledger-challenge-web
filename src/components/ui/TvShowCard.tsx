import Link from "next/link";

interface TvShowCardProps {
	showKey: string;
	title: string;
	description: string;
	recommendedAge: number;
	children?: React.ReactNode;
}

export default function TvShowCard({
	showKey,
	title,
	description,
	recommendedAge,
	children,
}: TvShowCardProps) {
	return (
		<div
			className="
        relative
        flex flex-col
        min-h-[330px]
        py-6 border-b border-[#45474b]/20
        md:p-6 md:rounded-lg md:border md:border-[#45474b]/20
        transition-colors hover:border-primary/40
      "
		>
			<Link href={`/shows/${showKey}`} className="contents">
				<h3 className="text-2xl md:text-lg font-semibold text-headline">
					{title}
				</h3>

				<div className="flex items-center gap-4 mt-4 md:hidden text-[10px]">
					<span className="font-semibold text-primary">
						{recommendedAge}+
					</span>
				</div>

				<p className="text-sm font-light text-body mt-4 md:overflow-hidden md:text-ellipsis md:line-clamp-3">
					{description}
				</p>

				<div className="hidden md:block text-xs text-body/60 mt-6">
					Recommended age: {recommendedAge}+
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