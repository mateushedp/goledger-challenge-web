import { useEffect, useState } from "react";
import { getWatchlists, createWatchlist, updateWatchlist, deleteWatchlist } from "@/services/watchlists";
import { getTvShows } from "@/services/tvShows";
import { Watchlist } from "@/types/watchlist";
import { TvShow } from "@/types/tvShow";
import { WatchlistItem } from "@/components/WatchlistItem";
import Spinner from "@/components/Spinner";
import Button from "@/components/Button";
import { Plus, Edit, Trash } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WatchlistPage() {
	const [data, setData] = useState<Watchlist[]>([]);
	const [shows, setShows] = useState<TvShow[]>([]);
	const [showsMap, setShowsMap] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(true);

	const [selected, setSelected] = useState<Watchlist | null>(null);

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	useEffect(() => {
		async function load() {
			setIsLoading(true);

			const [w, s] = await Promise.all([
				getWatchlists(),
				getTvShows(),
			]);

			setData(w);
			setShows(s);

			const map: Record<string, string> = {};
			s.forEach((show) => {
				map[show.key] = show.title;
			});
			setShowsMap(map);

			setIsLoading(false);
		}

		load();
	}, []);

	async function refresh() {
		const w = await getWatchlists();
		setData(w);
	}

	async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		await createWatchlist({
			title: String(formData.get("title")),
			description: String(formData.get("description")),
			tvShows: [],
		});

		setOpenCreate(false);
		await refresh();
	}

	async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!selected) return;

		const formData = new FormData(e.currentTarget);

		await updateWatchlist({
			title: selected.title,
			description: String(formData.get("description")),
			tvShows: selected.tvShows,
		});

		setOpenEdit(false);
		await refresh();
	}

	async function handleDelete() {
		if (!selected) return;

		await deleteWatchlist(selected.title);

		setOpenDelete(false);
		await refresh();
	}

	function toggleShow(showKey: string) {
		if (!selected) return;

		const exists = selected.tvShows.some(s => s["@key"] === showKey);

		const updated = exists
			? selected.tvShows.filter(s => s["@key"] !== showKey)
			: [...selected.tvShows, { "@key": showKey }];

		setSelected({
			...selected,
			tvShows: updated,
		});
	}

	if (isLoading) return <Spinner />;

	return (
		<div>

			<Dialog open={openCreate} onOpenChange={setOpenCreate}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Watchlist</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleCreate} className="space-y-4 mt-4">
						<div className="space-y-2">
							<Label>Title</Label>
							<Input name="title" required />
						</div>

						<div className="space-y-2">
							<Label>Description</Label>
							<Input name="description" />
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="secondary">Cancel</Button>
							</DialogClose>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openEdit} onOpenChange={setOpenEdit}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Watchlist</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleEdit} className="space-y-4 mt-4">
						<div className="space-y-2">
							<Label>Title</Label>
							<Input value={selected?.title} disabled />
						</div>

						<div className="space-y-2">
							<Label>Description</Label>
							<Input
								name="description"
								defaultValue={selected?.description}
							/>
						</div>

						<div className="space-y-2">
							<Label>Shows</Label>
							<div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
								{[...shows]
									.sort((a, b) => {
										const aIn = selected?.tvShows.some(s => s["@key"] === a.key) ? 1 : 0;
										const bIn = selected?.tvShows.some(s => s["@key"] === b.key) ? 1 : 0;
										return bIn - aIn;
									})
									.map((show) => {
										const active = selected?.tvShows.some(
											s => s["@key"] === show.key
										);

										return (
											<button
												type="button"
												key={show.key}
												onClick={() => toggleShow(show.key)}
												className={`
												w-full text-left px-3 py-2 border rounded
												${active ? "border-primary text-primary" : "border-border"}
											`}
											>
												{show.title}
											</button>
										);
									})}
							</div>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="secondary">Cancel</Button>
							</DialogClose>
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openDelete} onOpenChange={setOpenDelete}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Watchlist</DialogTitle>
					</DialogHeader>

					<p>Are you sure?</p>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary">Cancel</Button>
						</DialogClose>
						<Button variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="p-6">
				<h1 className="text-4xl text-headline font-bold">Browse Watchlists.</h1>
				<h2 className="mb-4 text-body">Manage and browse your series collections.</h2>
			</div>

			<div
				className="
					grid grid-cols-1
					md:grid-cols-2
					gap-6
					justify-items-center md:justify-items-stretch
					px-2 md:px-8 py-12
				"
			>
				{data.map((w) => (
					<WatchlistItem
						key={w.key}
						watchlist={w}
						showsMap={showsMap}
					>
						<Button
							variant="secondary"
							icon={<Edit />}
							onClick={() => {
								setSelected(w);
								setOpenEdit(true);
							}}
						>
							Edit
						</Button>

						<Button
							variant="destructive"
							icon={<Trash />}
							onClick={() => {
								setSelected(w);
								setOpenDelete(true);
							}}
						>
							Delete
						</Button>
					</WatchlistItem>
				))}
			</div>
			<div className="m-4 flex justify-center md:w-auto">
				<Button icon={<Plus />} onClick={() => setOpenCreate(true)}>
					Add Watchlist
				</Button>
			</div>
		</div>
	);
}