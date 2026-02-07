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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	colorClass?: string;
}

function StatCard({
	title,
	value,
	suffix = "%",
	description,
	icon,
	trend,
	trendValue,
	colorClass = "text-foreground",
}: StatCardProps) {
	return (
		<Card className="relative overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
				<div className="text-muted-foreground">{icon}</div>
			</CardHeader>
			<CardContent>
				<div className={`text-2xl font-bold ${colorClass}`}>
					{typeof value === "number" ? value.toFixed(1) : value}
					{suffix}
				</div>
				{description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
				{trend && trendValue && (
					<div
						className={`flex items-center gap-1 mt-2 text-xs ${
							trend === "down"
								? "text-green-500"
								: trend === "up"
									? "text-red-500"
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
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title="National Unemployment Rate"
				value={data.unemploymentRate}
				description={`Period: ${data.period}`}
				icon={<TrendingDown className="h-4 w-4" />}
				trend="down"
				trendValue="-0.2%"
				colorClass={
					data.unemploymentRate <= 4
						? "text-green-500"
						: data.unemploymentRate <= 6
							? "text-yellow-500"
							: "text-red-500"
				}
			/>
			<StatCard
				title="Labour Force Participation Rate"
				value={data.lfpr}
				description="Persons in labour force per 100"
				icon={<Users className="h-4 w-4" />}
				trend="up"
				trendValue="+0.3%"
				colorClass="text-blue-500"
			/>
			<StatCard
				title="Worker Population Ratio"
				value={data.wpr}
				description="Employed persons per 100 population"
				icon={<Users2 className="h-4 w-4" />}
				trend="up"
				trendValue="+0.4%"
				colorClass="text-green-500"
			/>
			<StatCard
				title="Youth Unemployment (15-29)"
				value={data.youthUR}
				description="Youth unemployment rate"
				icon={<TrendingUp className="h-4 w-4" />}
				trend="down"
				trendValue="-0.6%"
				colorClass={
					data.youthUR <= 8
						? "text-green-500"
						: data.youthUR <= 12
							? "text-yellow-500"
							: "text-red-500"
				}
			/>
		</div>
	);
}

interface GenderLfprCardsProps {
	maleLfpr: number;
	femaleLfpr: number;
}

export function GenderLfprCards({ maleLfpr, femaleLfpr }: GenderLfprCardsProps) {
	const gap = maleLfpr - femaleLfpr;

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">Male LFPR</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-blue-500">{maleLfpr.toFixed(1)}%</div>
					<p className="text-xs text-muted-foreground mt-1">Male labour force participation</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">Female LFPR</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-pink-500">{femaleLfpr.toFixed(1)}%</div>
					<p className="text-xs text-muted-foreground mt-1">Female labour force participation</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">Gender Gap</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-orange-500">{gap.toFixed(1)}%</div>
					<p className="text-xs text-muted-foreground mt-1">Difference in LFPR</p>
				</CardContent>
			</Card>
		</div>
	);
}

interface UrbanRuralCardsProps {
	urbanUR: number;
	ruralUR: number;
}

export function UrbanRuralCards({ urbanUR, ruralUR }: UrbanRuralCardsProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Urban Unemployment
					</CardTitle>
					<Building2 className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-orange-500">{urbanUR.toFixed(1)}%</div>
					<p className="text-xs text-muted-foreground mt-1">Urban areas unemployment rate</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						Rural Unemployment
					</CardTitle>
					<TreePine className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-500">{ruralUR.toFixed(1)}%</div>
					<p className="text-xs text-muted-foreground mt-1">Rural areas unemployment rate</p>
				</CardContent>
			</Card>
		</div>
	);
}
