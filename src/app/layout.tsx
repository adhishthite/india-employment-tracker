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
	title: "India Employment Tracker | PLFS Dashboard",
	description:
		"Comprehensive employment analytics dashboard for India using PLFS (Periodic Labour Force Survey) data. Visualize state-wise unemployment rates, LFPR, gender analysis, and sector-wise employment.",
	keywords: [
		"PLFS",
		"India employment",
		"unemployment rate",
		"labour force",
		"LFPR",
		"MoSPI",
		"employment statistics",
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						<div className="relative min-h-screen flex flex-col">
							<Header />
							<main className="flex-1">{children}</main>
							<footer className="border-t py-4 text-center text-sm text-muted-foreground">
								<p>
									Data Source: PLFS (Periodic Labour Force Survey) - Ministry of Statistics and
									Programme Implementation
								</p>
							</footer>
						</div>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
