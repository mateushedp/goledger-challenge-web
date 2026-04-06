import { Episode } from "@/types/episodes";
import { format, parseISO } from "date-fns";

type Props = {
	episode: Episode;
	children?: React.ReactNode;
};

export function EpisodeItem({ episode, children }: Props) {
	return (
		<div className="md:h-[212px] my-8 md:my-4 flex flex-col px-2 md:px-8">

			<div className="flex items-center md:items-start">
				<div className="md:ml-[24px] md:mr-[40px] mr-4 text-[18px] md:text-[36px] font-extrabold italic text-[#27272A]">
					{episode.episodeNumber}
				</div>

				<div className="flex flex-col uppercase flex-1 min-w-0">
					<span className="text-[22px] mr-4 font-bold text-headline break-words">
						{episode.title}
					</span>
					<span className="text-[10px] font-bold text-body">
						released: {format(parseISO(episode.releaseDate), "dd/MM/yyyy")}
					</span>
				</div>

				<div className="ml-auto text-[11px] font-bold uppercase whitespace-nowrap flex-shrink-0">
					score: <span className="text-primary">{episode.rating ?? "-"}</span>
				</div>
			</div>

			<div className="mt-4 ml-6 md:ml-[80px] mr-[64px] md:mr-[268px]">
				<p className="text-[14px] font-normal text-body leading-relaxed text-justify">
					{episode.description}
				</p>
			</div>

			{children && (
				<div
					className="mt-auto md:ml-[80px] flex gap-2 pt-4"
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</div>
			)}
		</div>
	);
}