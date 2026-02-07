"use client";

import { Activity, BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 glass-effect">
			<div className="container flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-3">
					<div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 ring-1 ring-primary/20">
						<BarChart3 className="h-5 w-5 text-primary" />
					</div>
					<div className="flex flex-col">
						<h1 className="text-base font-semibold tracking-tight leading-tight">
							India Employment Tracker
						</h1>
						<p className="text-[11px] text-muted-foreground leading-tight hidden sm:block">
							PLFS Analytics Dashboard
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Badge
						variant="outline"
						className="hidden sm:flex items-center gap-1.5 text-xs font-normal border-border/50 bg-secondary/50"
					>
						<Activity className="h-3 w-3 text-emerald-500" />
						PLFS Q4 2024
					</Badge>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
