"use client";

import { BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
						<BarChart3 className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="text-lg font-semibold tracking-tight">India Employment Tracker</h1>
						<p className="text-xs text-muted-foreground">PLFS Data Visualization Dashboard</p>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<Badge variant="outline" className="hidden sm:flex">
						Data: PLFS Q4 2024
					</Badge>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
