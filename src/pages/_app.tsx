import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import Head from "next/head";
import Navbar from "@/components/ui/Navbar";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>ShowTracker 📺</title>
				<meta name="description" content="Browse and manage your TV Shows, Seasons, Episodes and Watchlists." />
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📺</text></svg>"
				/>
			</Head>

			<Navbar />

			<Component {...pageProps} />
			<Toaster />
		</>
	);
}