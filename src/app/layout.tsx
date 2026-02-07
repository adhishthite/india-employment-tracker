import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "India Employment Tracker | PLFS Analytics Dashboard",
	description:
		"Interactive analytics dashboard visualizing India's employment landscape using PLFS (Periodic Labour Force Survey) data. State-wise unemployment rates, LFPR, gender analysis, sector distribution, and trend analysis.",
	keywords: [
		"PLFS",
		"India employment",
		"unemployment rate",
		"labour force participation",
		"LFPR",
		"WPR",
		"MoSPI",
		"employment statistics",
		"India analytics",
		"state-wise unemployment",
	],
	authors: [{ name: "India Employment Tracker" }],
	openGraph: {
		title: "India Employment Tracker | PLFS Analytics Dashboard",
		description:
			"Interactive analytics dashboard visualizing India's employment landscape using PLFS data. State-wise unemployment, LFPR, gender analysis, and trends.",
		type: "website",
		locale: "en_IN",
		siteName: "India Employment Tracker",
	},
	twitter: {
		card: "summary_large_image",
		title: "India Employment Tracker | PLFS Analytics Dashboard",
		description:
			"Interactive analytics dashboard visualizing India's employment landscape using PLFS data.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
				<meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						<div className="relative min-h-screen flex flex-col bg-grid">
							<Header />
							<main className="flex-1">{children}</main>
							<footer className="border-t border-border/50 py-6 mt-8">
								<div className="container px-4">
									<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
										<div className="flex items-center gap-2">
											<div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
											<p className="text-sm text-muted-foreground">
												Data Source: PLFS (Periodic Labour Force Survey) - Ministry of Statistics
												and Programme Implementation, Government of India
											</p>
										</div>
										<p className="text-xs text-muted-foreground/60">
											Built for analytical purposes. Data reflects PLFS Q4 2024 estimates.
										</p>
									</div>
								</div>
							</footer>
						</div>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
