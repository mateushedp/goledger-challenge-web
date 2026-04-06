import { SeasonWithEpisodes } from "@/types/seasons";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
	getSeasonsWithEpisodes,
	createSeason,
	deleteSeason,
	updateSeason,
} from "@/services/seasons";
import { getTvShowByKey } from "@/services/tvShows";
import { TvShow } from "@/types/tvShow";
import { EpisodeItem } from "@/components/ui/EpisodeItem";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash } from "lucide-react";
import { Episode } from "@/types/episodes";
import {
	createEpisode,
	updateEpisode,
	deleteEpisode,
} from "@/services/episodes";
import { toast } from "sonner";

function TvShowDetails() {
	const router = useRouter();
	const showKey = router.query.showKey as string;

	const [seasonsArray, setSeasonsArray] = useState<SeasonWithEpisodes[]>([]);
	const [tvShow, setTvShow] = useState<TvShow | null>(null);
	const [activeSeason, setActiveSeason] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [openAddSeason, setOpenAddSeason] = useState(false);
	const [openEditSeason, setOpenEditSeason] = useState(false);
	const [openDeleteSeason, setOpenDeleteSeason] = useState(false);

	const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

	const [openAddEpisode, setOpenAddEpisode] = useState(false);
	const [openEditEpisode, setOpenEditEpisode] = useState(false);
	const [openDeleteEpisode, setOpenDeleteEpisode] = useState(false);

	async function loadData() {
		try {
			const [seasons, show] = await Promise.all([
				getSeasonsWithEpisodes(showKey),
				getTvShowByKey(showKey),
			]);

			setSeasonsArray(seasons);
			setTvShow(show);
		} catch (err) {
			console.error("Failed to load data:", err);
			toast.error("Failed to load data");
		} finally {
			setIsSubmitting(false);
		}
	}

	useEffect(() => {
		if (!showKey) return;

		async function init() {
			setIsLoading(true);
			await loadData();
			setIsLoading(false);
		}

		init();
	}, [showKey]);

	const sortedSeasons = [...seasonsArray].sort((a, b) => a.number - b.number);

	const effectiveSeason = activeSeason ?? sortedSeasons[0]?.number;

	const selectedSeason = sortedSeasons.find((s) => s.number === effectiveSeason);

	const episodes = (selectedSeason?.episodes ?? [])
		.slice()
		.sort((a, b) => a.episodeNumber - b.episodeNumber);

	async function handleAddSeason(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);

			await createSeason({
				number: Number(formData.get("number")),
				tvShow: { "@key": showKey },
				year: Number(formData.get("year")),
			});

			toast.success("Season created successfully");
			await loadData();
			setOpenAddSeason(false);
		} catch (err) {
			toast.error("Failed to create season");
			setIsSubmitting(false);
		}
	}

	async function handleEditSeason(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!selectedSeason) return;

		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);

			await updateSeason({
				number: selectedSeason.number,
				tvShow: { "@key": showKey },
				year: Number(formData.get("year")),
			});

			toast.success("Season updated successfully");
			await loadData();
			setOpenEditSeason(false);
		} catch (err) {
			toast.error("Failed to update season");
			setIsSubmitting(false);
		}
	}

	async function handleDeleteSeason() {
		if (!selectedSeason) return;

		setIsSubmitting(true);

		try {
			await deleteSeason(selectedSeason.number, showKey);

			toast.success("Season deleted successfully");
			await loadData();
			setActiveSeason(sortedSeasons[0]?.number);
			setOpenDeleteSeason(false);
		} catch (err) {
			toast.error("Failed to delete season");
			setIsSubmitting(false);
		}
	}

	async function handleAddEpisode(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!selectedSeason) return;

		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);

			await createEpisode({
				season: { "@key": selectedSeason.key },
				episodeNumber: Number(formData.get("episodeNumber")),
				title: String(formData.get("title")),
				releaseDate: new Date(String(formData.get("releaseDate"))).toISOString(),
				description: String(formData.get("description")),
				rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
			});

			toast.success("Episode created successfully");
			await loadData();
			setOpenAddEpisode(false);
		} catch (err) {
			toast.error("Failed to create episode");
			setIsSubmitting(false);
		}
	}

	async function handleEditEpisode(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!selectedSeason || !selectedEpisode) return;

		setIsSubmitting(true);

		try {
			const formData = new FormData(e.currentTarget);

			await updateEpisode({
				season: { "@key": selectedSeason.key },
				episodeNumber: selectedEpisode.episodeNumber,
				title: String(formData.get("title")),
				releaseDate: new Date(String(formData.get("releaseDate"))).toISOString(),
				description: String(formData.get("description")),
				rating: formData.get("rating") ? Number(formData.get("rating")) : undefined,
			});

			toast.success("Episode updated successfully");
			await loadData();
			setOpenEditEpisode(false);
		} catch (err) {
			toast.error("Failed to update episode");
			setIsSubmitting(false);
		}
	}

	async function handleDeleteEpisode() {
		if (!selectedSeason || !selectedEpisode) return;

		setIsSubmitting(true);

		try {
			await deleteEpisode(selectedEpisode.episodeNumber, selectedSeason.key);

			toast.success("Episode deleted successfully");
			await loadData();
			setOpenDeleteEpisode(false);
		} catch (err) {
			toast.error("Failed to delete episode");
			setIsSubmitting(false);
		}
	}

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div>
			<Dialog open={openAddSeason} onOpenChange={setOpenAddSeason}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Season</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleAddSeason} className="space-y-4 mt-4">
						<Input name="number" type="number" placeholder="Season number" />
						<Input name="year" type="number" placeholder="Year" />

						<DialogFooter>
							<Button variant="secondary" type="button" onClick={() => setOpenAddSeason(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" isLoading={isSubmitting}>
								Save
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openEditSeason} onOpenChange={setOpenEditSeason}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Season</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleEditSeason} className="space-y-4 mt-4">
						<Input name="year" type="number" defaultValue={selectedSeason?.year} />

						<DialogFooter>
							<Button variant="secondary" type="button" onClick={() => setOpenEditSeason(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" isLoading={isSubmitting}>
								Save
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openDeleteSeason} onOpenChange={setOpenDeleteSeason}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Season</DialogTitle>
					</DialogHeader>

					<p className="mt-4 text-sm text-body">
						Are you sure you want to delete season <strong>{selectedSeason?.number}</strong>?
					</p>

					<DialogFooter className="mt-6">
						<Button variant="secondary" onClick={() => setOpenDeleteSeason(false)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteSeason} isLoading={isSubmitting}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={openAddEpisode} onOpenChange={setOpenAddEpisode}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Episode</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleAddEpisode} className="space-y-4 mt-4">
						<Input name="episodeNumber" type="number" placeholder="Episode #" />
						<Input name="title" placeholder="Title" />
						<Input name="releaseDate" type="date" />
						<Textarea name="description" placeholder="Description" />
						<Input name="rating" type="number" step="0.1" placeholder="Rating" />

						<DialogFooter>
							<Button variant="secondary" type="button" onClick={() => setOpenAddEpisode(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" isLoading={isSubmitting}>
								Save
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openEditEpisode} onOpenChange={setOpenEditEpisode}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Episode</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleEditEpisode} className="space-y-4 mt-4">
						<Input name="episodeNumber" defaultValue={selectedEpisode?.episodeNumber} disabled />
						<Input name="title" defaultValue={selectedEpisode?.title} />
						<Input name="releaseDate" type="date" defaultValue={selectedEpisode?.releaseDate?.split("T")[0]} />
						<Textarea name="description" defaultValue={selectedEpisode?.description} />
						<Input name="rating" type="number" step="0.1" defaultValue={selectedEpisode?.rating} />

						<DialogFooter>
							<Button variant="secondary" type="button" onClick={() => setOpenEditEpisode(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" isLoading={isSubmitting}>
								Save
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openDeleteEpisode} onOpenChange={setOpenDeleteEpisode}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Episode</DialogTitle>
					</DialogHeader>

					<p className="mt-4 text-sm text-body">Delete episode {selectedEpisode?.episodeNumber}?</p>

					<DialogFooter className="mt-6">
						<Button variant="secondary" onClick={() => setOpenDeleteEpisode(false)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteEpisode} isLoading={isSubmitting}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="px-8 pt-12 pb-16 border-b border-[#45474b]/20">
				<p className="text-[10px] font-extrabold uppercase text-body">recommended age: {tvShow?.recommendedAge}</p>

				<h1 className="mt-[55px] text-[60px] md:text-[144px] font-extrabold uppercase italic leading-none text-headline">
					{tvShow?.title}
				</h1>

				<div className="mt-[40px] text-[11px] font-bold uppercase">
					<span className="text-primary">{seasonsArray.length} seasons</span>
				</div>

				<p className="mt-[40px] md:mr-[268px] text-[16px] md:text-[24px] font-light text-body">{tvShow?.description}</p>
			</div>

			<div className="h-[49px] flex items-center justify-between px-8 border-b border-[#45474b]/20">
				<span className="text-[12px] font-extrabold uppercase text-body">seasons</span>

				<div className="flex items-center gap-6">
					<div className="flex gap-4">
						{sortedSeasons.map((season) => {
							const isActive = effectiveSeason === season.number;

							return (
								<button
									key={season.key}
									onClick={() => setActiveSeason(season.number)}
									className={`text-[12px] font-bold uppercase pb-1 ${isActive ? "text-primary border-b border-primary" : "text-body"
										}`}
								>
									{season.number}
								</button>
							);
						})}
					</div>

					<Button icon={<Plus />} onClick={() => setOpenAddSeason(true)}>
						Add Season
					</Button>
				</div>
			</div>

			<div className="mt-4 md:h-[49px] flex flex-col md:flex-row items-start md:items-center justify-end gap-2 px-8 border-b border-[#45474b]/20">
				{selectedSeason && (
					<>
						<Button icon={<Plus />} onClick={() => setOpenAddEpisode(true)}>
							Add Episode
						</Button>

						<Button variant="secondary" icon={<Edit />} onClick={() => setOpenEditSeason(true)}>
							Edit Season
						</Button>

						<Button variant="destructive" icon={<Trash />} onClick={() => setOpenDeleteSeason(true)}>
							Delete Season
						</Button>
					</>
				)}
			</div>
			<span className="md:ml-8 text-[12px] font-extrabold uppercase text-body">season released: {selectedSeason?.year}</span>

			{!episodes.length ? (
				<p className="text-[14px] font-extrabold text-center my-5 italic text-body">No episodes found.</p>
			) : (
				<div className="px-2 md:px-8 my-12 md:py-12 space-y-0">
					{episodes.map((ep) => (
						<div key={ep.key} className="border-b border-[#45474b]/20">
							<EpisodeItem episode={ep}>
								<Button
									variant="secondary"
									icon={<Edit />}
									onClick={() => {
										setSelectedEpisode(ep);
										setOpenEditEpisode(true);
									}}
								>
									Edit
								</Button>

								<Button
									variant="destructive"
									icon={<Trash />}
									onClick={() => {
										setSelectedEpisode(ep);
										setOpenDeleteEpisode(true);
									}}
								>
									Delete
								</Button>
							</EpisodeItem>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default TvShowDetails;