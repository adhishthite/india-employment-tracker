"use client";

import {
	ArrowDown,
	ArrowUp,
	Building2,
	TreePine,
	TrendingDown,
	TrendingUp,
	Users,
	Users2,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import type { NationalSummary } from "@/types/employment";

interface SummaryCardsProps {
	data: NationalSummary;
}

interface StatCardProps {
	title: string;
	value: string | number;
	suffix?: string;
	description?: string;
	icon: React.ReactNode;
	trend?: "up" | "down" | "neutral";
	trendValue?: string;
	accentColor: string;
	iconBgClass: string;
}

function StatCard({
	title,
	value,
	suffix = "%",
	description,
	icon,
	trend,
	trendValue,
	accentColor,
	iconBgClass,
}: StatCardProps) {
	return (
		<Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-border/50">
			<div
				className="absolute inset-x-0 top-0 h-[2px] opacity-80 transition-opacity group-hover:opacity-100"
				style={{
					background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
				}}
			/>
			<CardContent className="pt-5 pb-4 px-5">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
							{title}
						</p>
						<p className="text-2xl font-bold mt-1.5 tabular-nums" style={{ color: accentColor }}>
							{typeof value === "number" ? value.toFixed(1) : value}
							<span className="text-lg">{suffix}</span>
						</p>
						{description && (
							<p className="text-[11px] text-muted-foreground/70 mt-1">{description}</p>
						)}
					</div>
					<div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBgClass}`}>
						{icon}
					</div>
				</div>
				{trend && trendValue && (
					<div
						className={`flex items-center gap-1 mt-3 text-xs font-medium ${
							trend === "down"
								? "text-emerald-500"
								: trend === "up"
									? "text-red-400"
									: "text-muted-foreground"
						}`}
					>
						{trend === "down" ? (
							<ArrowDown className="h-3 w-3" />
						) : trend === "up" ? (
							<ArrowUp className="h-3 w-3" />
						) : null}
						<span>{trendValue} vs last quarter</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export function SummaryCards({ data }: SummaryCardsProps) {
	const urColor =
		data.unemploymentRate <= 4 ? "#22c55e" : data.unemploymentRate <= 6 ? "#eab308" : "#ef4444";

	const youthColor = data.youthUR <= 8 ? "#22c55e" : data.youthUR <= 12 ? "#eab308" : "#ef4444";

	return (
		<StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StaggerItem>
				<StatCard
					title="Unemployment Rate"
					value={data.unemploymentRate}
					description={`Period: ${data.period}`}
					icon={<TrendingDown className="h-5 w-5 text-emerald-500" />}
					iconBgClass="bg-emerald-500/10"
					trend="down"
					trendValue="-0.2%"
					accentColor={urColor}
				/>
			</StaggerItem>
			<StaggerItem>
				<StatCard
					title="LFPR"
					value={data.lfpr}
					description="Labour Force Participation Rate"
					icon={<Users className="h-5 w-5 text-blue-500" />}
					iconBgClass="bg-blue-500/10"
					trend="up"
					trendValue="+0.3%"
					accentColor="#3b82f6"
				/>
			</StaggerItem>
			<StaggerItem>
				<StatCard
					title="Worker Population Ratio"
					value={data.wpr}
					description="Employed per 100 population"
					icon={<Users2 className="h-5 w-5 text-violet-500" />}
					iconBgClass="bg-violet-500/10"
					trend="up"
					trendValue="+0.4%"
					accentColor="#8b5cf6"
				/>
			</StaggerItem>
			<StaggerItem>
				<StatCard
					title="Youth UR (15-29)"
					value={data.youthUR}
					description="Youth unemployment rate"
					icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
					iconBgClass="bg-amber-500/10"
					trend="down"
					trendValue="-0.6%"
					accentColor={youthColor}
				/>
			</StaggerItem>
		</StaggerContainer>
	);
}

interface GenderLfprCardsProps {
	maleLfpr: number;
	femaleLfpr: number;
}

export function GenderLfprCards({ maleLfpr, femaleLfpr }: GenderLfprCardsProps) {
	const gap = maleLfpr - femaleLfpr;

	return (
		<Card className="border-border/50">
			<CardContent className="pt-5 pb-4 px-5">
				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
					Gender LFPR
				</p>
				<div className="grid grid-cols-3 gap-4">
					<div>
						<p className="text-xl font-bold text-blue-500 tabular-nums">{maleLfpr.toFixed(1)}%</p>
						<p className="text-[11px] text-muted-foreground/70 mt-0.5">Male</p>
					</div>
					<div>
						<p className="text-xl font-bold text-pink-500 tabular-nums">{femaleLfpr.toFixed(1)}%</p>
						<p className="text-[11px] text-muted-foreground/70 mt-0.5">Female</p>
					</div>
					<div>
						<p className="text-xl font-bold text-amber-500 tabular-nums">{gap.toFixed(1)}%</p>
						<p className="text-[11px] text-muted-foreground/70 mt-0.5">Gap</p>
					</div>
				</div>
				<div className="mt-3 h-2 rounded-full bg-muted overflow-hidden flex">
					<div
						className="bg-blue-500 rounded-l-full transition-all duration-500"
						style={{ width: `${(maleLfpr / (maleLfpr + femaleLfpr)) * 100}%` }}
					/>
					<div
						className="bg-pink-500 rounded-r-full transition-all duration-500"
						style={{ width: `${(femaleLfpr / (maleLfpr + femaleLfpr)) * 100}%` }}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

interface UrbanRuralCardsProps {
	urbanUR: number;
	ruralUR: number;
}

export function UrbanRuralCards({ urbanUR, ruralUR }: UrbanRuralCardsProps) {
	return (
		<Card className="border-border/50">
			<CardContent className="pt-5 pb-4 px-5">
				<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
					Urban vs Rural UR
				</p>
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/10">
							<Building2 className="h-4 w-4 text-orange-500" />
						</div>
						<div>
							<p className="text-xl font-bold text-orange-500 tabular-nums">
								{urbanUR.toFixed(1)}%
							</p>
							<p className="text-[11px] text-muted-foreground/70">Urban</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10">
							<TreePine className="h-4 w-4 text-emerald-500" />
						</div>
						<div>
							<p className="text-xl font-bold text-emerald-500 tabular-nums">
								{ruralUR.toFixed(1)}%
							</p>
							<p className="text-[11px] text-muted-foreground/70">Rural</p>
						</div>
					</div>
				</div>
				<div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground/70">
					<span>Urban unemployment is {(urbanUR / ruralUR).toFixed(1)}x the rural rate</span>
				</div>
			</CardContent>
		</Card>
	);
}
