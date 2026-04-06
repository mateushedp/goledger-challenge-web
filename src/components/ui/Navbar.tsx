import { useRouter } from "next/router";
import Link from "next/link";
import { Tv } from "lucide-react";

export default function Navbar() {
	const router = useRouter();

	const isWatchlist = router.pathname === "/watchlists";
	const isShows = !isWatchlist;

	return (
		<nav className="flex items-center gap-6 px-8 h-[56px] border-b border-[#45474b]/20">
			<Link href="/" className="flex items-center gap-2 mr-4">
				<Tv className="text-primary" size={20} />
				<span className="text-[13px] font-extrabold uppercase tracking-widest text-headline">
					ShowTracker
				</span>
			</Link>

			<div className="flex items-center gap-1">
				<Link
					href="/"
					className={`px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide transition-colors rounded-sm
						${isShows
							? "text-primary border-b-2 border-primary"
							: "text-body hover:text-headline"
						}`}
				>
					TV Shows
				</Link>

				<Link
					href="/watchlists"
					className={`px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide transition-colors rounded-sm
						${isWatchlist
							? "text-primary border-b-2 border-primary"
							: "text-body hover:text-headline"
						}`}
				>
					Watchlists
				</Link>
			</div>
		</nav>
	);
}