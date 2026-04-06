"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTvShows, createTvShow, deleteTvShow, updateTvShow } from "@/services/tvShows";
import { TvShow } from "@/types/tvShow";
import TvShowCard from "@/components/TvShowCard";
import Spinner from "@/components/Spinner";
import Button from "@/components/Button";
import { Plus, Edit, Trash } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Home() {
	const router = useRouter();

	const [shows, setShows] = useState<TvShow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);

	const [selectedShow, setSelectedShow] = useState<TvShow | null>(null);

	useEffect(() => {
		loadShows();
	}, []);

	async function loadShows() {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getTvShows();
			setShows(data);
		} catch (err) {
			setError("Failed to load TV shows.");
			toast.error("Failed to load TV shows");
		} finally {
			setIsLoading(false);
			setIsSubmitting(false);
		}
	}

	async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
		setIsSubmitting(true);
		e.preventDefault();

		try {
			const formData = new FormData(e.currentTarget);

			await createTvShow({
				title: String(formData.get("title")),
				description: String(formData.get("description")),
				recommendedAge: Number(formData.get("recommendedAge")),
			});

			toast.success("TV Show created successfully");
			setOpenAdd(false);
			loadShows();
		} catch (err) {
			toast.error("Failed to create TV Show");
			setIsSubmitting(false);
		}
	}

	async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
		setIsSubmitting(true);
		e.preventDefault();

		if (!selectedShow) return;

		try {
			const formData = new FormData(e.currentTarget);

			await updateTvShow(selectedShow.key, {
				title: selectedShow.title,
				description: String(formData.get("description")),
				recommendedAge: Number(formData.get("recommendedAge")),
			});

			toast.success("TV Show updated successfully");
			setOpenEdit(false);
			loadShows();
		} catch (err) {
			toast.error("Failed to update TV Show");
			setIsSubmitting(false);
		}
	}

	async function handleDeleteConfirm() {
		setIsSubmitting(true);
		if (!selectedShow) return;

		try {
			await deleteTvShow(selectedShow.key);

			toast.success("TV Show deleted successfully");
			setOpenDelete(false);
			loadShows();
		} catch (err) {
			toast.error("Failed to delete TV Show");
			setIsSubmitting(false);
		}
	}

	if (isLoading) return <Spinner />;

	return (
		<div className="p-6">
			<Dialog open={openAdd} onOpenChange={setOpenAdd}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add TV Show</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleCreate} className="space-y-4 mt-4">
						<Input name="title" placeholder="Title" />
						<Textarea name="description" placeholder="Description" />
						<Input name="recommendedAge" type="number" placeholder="Recommended Age" />

						<DialogFooter>
							<Button type="button" variant="secondary" onClick={() => setOpenAdd(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" isLoading={isSubmitting}>Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openEdit} onOpenChange={setOpenEdit}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit TV Show</DialogTitle>
					</DialogHeader>

					<form onSubmit={handleEdit} className="space-y-4 mt-4">
						<Textarea
							name="description"
							defaultValue={selectedShow?.description}
						/>
						<Input
							name="recommendedAge"
							type="number"
							defaultValue={selectedShow?.recommendedAge}
						/>

						<DialogFooter>
							<Button type="button" variant="secondary" onClick={() => setOpenEdit(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type="submit" isLoading={isSubmitting}>Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={openDelete} onOpenChange={setOpenDelete}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete TV Show</DialogTitle>
					</DialogHeader>

					<p className="mt-4 text-sm text-body">
						Are you sure you want to delete{" "}
						<strong>{selectedShow?.title}</strong>?
					</p>

					<DialogFooter className="mt-6">
						<Button variant="secondary" onClick={() => setOpenDelete(false)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteConfirm} isLoading={isSubmitting}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<h1 className="text-4xl text-headline font-bold">Browse TV Shows</h1>
			<h2 className="mb-4 text-body">Click a TV Show to see details.</h2>

			<div className="flex flex-col md:grid md:grid-cols-4 md:gap-6">
				{shows.map((show) => (
					<div key={show.key}>
						<TvShowCard
							key={show.key}
							showKey={show.key}
							title={show.title}
							description={show.description}
							recommendedAge={show.recommendedAge}
						>
							<Button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedShow(show);
									setOpenEdit(true);
								}}
								variant="secondary"
								icon={<Edit />}
							>
								Edit
							</Button>

							<Button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedShow(show);
									setOpenDelete(true);
								}}
								variant="destructive"
								icon={<Trash />}
							>
								Delete
							</Button>
						</TvShowCard>
					</div>
				))}
			</div>
			<div className="mt-4 flex justify-center w-full md:w-auto">
				<Button icon={<Plus />} onClick={() => setOpenAdd(true)}>
					Add New TV Show
				</Button>
			</div>
		</div>
	);
}