"use client";

import { AlertTriangle, Lightbulb, Users } from "lucide-react";
import { useCallback, useState } from "react";
import {
	AgeGroupChart,
	GenderComparisonChart,
	IndiaMap,
	SectorPieChart,
	TrendChart,
	UnemploymentBarChart,
	UrbanRuralChart,
} from "@/components/charts";
import {
	Filters,
	GenderLfprCards,
	StateComparison,
	SummaryCards,
	UrbanRuralCards,
} from "@/components/dashboard";
import { FadeInUp } from "@/components/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ageGroupData, nationalSummary, sectorData, stateData, trendData } from "@/data/plfs-data";
import type { AreaType, StateEmploymentData } from "@/types/employment";

export default function Dashboard() {
	const [selectedState, setSelectedState] = useState("all");
	const [areaType, setAreaType] = useState<AreaType>("all");
	const [timePeriod, setTimePeriod] = useState("Q4-2024");
	const [compareStates, setCompareStates] = useState<string[]>([]);
	const [mapMetric, setMapMetric] = useState<"unemploymentRate" | "lfpr" | "wpr">(
		"unemploymentRate",
	);
	const [showUrbanRuralTrend, setShowUrbanRuralTrend] = useState(false);
	const [showGenderAge, setShowGenderAge] = useState(false);

	const handleStateClick = useCallback((stateCode: string) => {
		setCompareStates((prev) => {
			if (prev.includes(stateCode)) {
				return prev.filter((s) => s !== stateCode);
			}
			if (prev.length >= 5) {
				return prev;
			}
			return [...prev, stateCode];
		});
	}, []);

	const handleRemoveState = useCallback((stateCode: string) => {
		setCompareStates((prev) => prev.filter((s) => s !== stateCode));
	}, []);

	const handleClearAll = useCallback(() => {
		setCompareStates([]);
	}, []);

	const selectedStatesData: StateEmploymentData[] = compareStates
		.map((code) => stateData.find((s) => s.stateCode === code))
		.filter((s): s is StateEmploymentData => s !== undefined);

	return (
		<div className="container px-4 py-6">
			{/* Filters Bar */}
			<FadeInUp>
				<div className="flex items-center justify-between mb-6">
					<Filters
						selectedState={selectedState}
						onStateChange={setSelectedState}
						areaType={areaType}
						onAreaTypeChange={setAreaType}
						timePeriod={timePeriod}
						onTimePeriodChange={setTimePeriod}
					/>
				</div>
			</FadeInUp>

			{/* Top-level nav tabs */}
			<Tabs defaultValue="overview" className="space-y-6">
				<FadeInUp delay={0.05}>
					<TabsList className="inline-flex h-9 bg-muted/50 p-0.5 rounded-lg">
						<TabsTrigger value="overview" className="text-xs px-4 rounded-md">
							Overview
						</TabsTrigger>
						<TabsTrigger value="states" className="text-xs px-4 rounded-md">
							State Analysis
						</TabsTrigger>
						<TabsTrigger value="trends" className="text-xs px-4 rounded-md">
							Trends
						</TabsTrigger>
						<TabsTrigger value="demographics" className="text-xs px-4 rounded-md">
							Gender & Demographics
						</TabsTrigger>
					</TabsList>
				</FadeInUp>

				{/* ===== OVERVIEW TAB ===== */}
				<TabsContent value="overview" className="space-y-6 mt-0">
					{/* Summary Cards */}
					<SummaryCards data={nationalSummary} />

					{/* Gender and Urban/Rural Quick Stats */}
					<FadeInUp delay={0.15}>
						<div className="grid gap-4 lg:grid-cols-2">
							<GenderLfprCards
								maleLfpr={nationalSummary.maleLfpr}
								femaleLfpr={nationalSummary.femaleLfpr}
							/>
							<UrbanRuralCards
								urbanUR={nationalSummary.urbanUR}
								ruralUR={nationalSummary.ruralUR}
							/>
						</div>
					</FadeInUp>

					{/* Map + Bar Chart */}
					<FadeInUp delay={0.2}>
						<div className="grid gap-4 lg:grid-cols-2">
							<Card className="border-border/50">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-sm font-semibold">Employment Map</CardTitle>
											<CardDescription className="text-xs">
												Click states to compare (max 5)
											</CardDescription>
										</div>
										<select
											value={mapMetric}
											onChange={(e) =>
												setMapMetric(e.target.value as "unemploymentRate" | "lfpr" | "wpr")
											}
											className="text-xs bg-muted/50 border border-border/50 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
										>
											<option value="unemploymentRate">Unemployment Rate</option>
											<option value="lfpr">LFPR</option>
											<option value="wpr">WPR</option>
										</select>
									</div>
								</CardHeader>
								<CardContent>
									<IndiaMap
										data={stateData}
										onStateClick={handleStateClick}
										selectedStates={compareStates}
										metric={mapMetric}
									/>
								</CardContent>
							</Card>

							<div className="space-y-4">
								<Card className="border-border/50">
									<CardHeader className="pb-3">
										<CardTitle className="text-sm font-semibold">
											Highest Unemployment States
										</CardTitle>
										<CardDescription className="text-xs">
											Top 10 by unemployment rate
										</CardDescription>
									</CardHeader>
									<CardContent>
										<UnemploymentBarChart
											data={stateData}
											maxItems={10}
											sortOrder="desc"
											onStateClick={handleStateClick}
										/>
									</CardContent>
								</Card>

								<StateComparison
									selectedStates={selectedStatesData}
									onRemoveState={handleRemoveState}
									onClearAll={handleClearAll}
								/>
							</div>
						</div>
					</FadeInUp>

					{/* Insights */}
					<FadeInUp delay={0.25}>
						<div className="grid gap-4 md:grid-cols-3">
							<Card className="border-border/50 group hover:shadow-sm transition-shadow">
								<CardContent className="pt-5 pb-4 px-5">
									<div className="flex items-center gap-2 mb-2">
										<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10">
											<Lightbulb className="h-3.5 w-3.5 text-amber-500" />
										</div>
										<p className="text-xs font-semibold">Key Insight</p>
									</div>
									<p className="text-xs text-muted-foreground leading-relaxed">
										Youth unemployment (15-29) remains at{" "}
										<span className="font-semibold text-foreground">
											{nationalSummary.youthUR}%
										</span>
										, well above the national average of {nationalSummary.unemploymentRate}%.
										Targeted employment programs for young job seekers are critical.
									</p>
								</CardContent>
							</Card>
							<Card className="border-border/50 group hover:shadow-sm transition-shadow">
								<CardContent className="pt-5 pb-4 px-5">
									<div className="flex items-center gap-2 mb-2">
										<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-500/10">
											<Users className="h-3.5 w-3.5 text-pink-500" />
										</div>
										<p className="text-xs font-semibold">Gender Gap</p>
									</div>
									<p className="text-xs text-muted-foreground leading-relaxed">
										Female LFPR at{" "}
										<span className="font-semibold text-foreground">
											{nationalSummary.femaleLfpr}%
										</span>{" "}
										vs male LFPR of {nationalSummary.maleLfpr}%. The{" "}
										{(nationalSummary.maleLfpr - nationalSummary.femaleLfpr).toFixed(1)}% gap
										highlights the need for policies promoting women's workforce participation.
									</p>
								</CardContent>
							</Card>
							<Card className="border-border/50 group hover:shadow-sm transition-shadow">
								<CardContent className="pt-5 pb-4 px-5">
									<div className="flex items-center gap-2 mb-2">
										<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/10">
											<AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
										</div>
										<p className="text-xs font-semibold">Urban-Rural Divide</p>
									</div>
									<p className="text-xs text-muted-foreground leading-relaxed">
										Urban unemployment ({nationalSummary.urbanUR}%) is{" "}
										{(nationalSummary.urbanUR / nationalSummary.ruralUR).toFixed(1)}x the rural rate
										({nationalSummary.ruralUR}%), reflecting the dynamics of formal vs agricultural
										employment.
									</p>
								</CardContent>
							</Card>
						</div>
					</FadeInUp>
				</TabsContent>

				{/* ===== STATE ANALYSIS TAB ===== */}
				<TabsContent value="states" className="space-y-6 mt-0">
					<FadeInUp>
						<div className="grid gap-4 lg:grid-cols-2">
							<Card className="lg:row-span-2 border-border/50">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-sm font-semibold">State-wise Map</CardTitle>
											<CardDescription className="text-xs">
												Click to select states for comparison
											</CardDescription>
										</div>
										<select
											value={mapMetric}
											onChange={(e) =>
												setMapMetric(e.target.value as "unemploymentRate" | "lfpr" | "wpr")
											}
											className="text-xs bg-muted/50 border border-border/50 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
										>
											<option value="unemploymentRate">Unemployment Rate</option>
											<option value="lfpr">LFPR</option>
											<option value="wpr">WPR</option>
										</select>
									</div>
								</CardHeader>
								<CardContent>
									<IndiaMap
										data={stateData}
										onStateClick={handleStateClick}
										selectedStates={compareStates}
										metric={mapMetric}
									/>
								</CardContent>
							</Card>

							<Card className="border-border/50">
								<CardHeader className="pb-3">
									<CardTitle className="text-sm font-semibold">
										States by Unemployment Rate
									</CardTitle>
									<CardDescription className="text-xs">
										Click bars to add to comparison
									</CardDescription>
								</CardHeader>
								<CardContent>
									<UnemploymentBarChart
										data={stateData}
										maxItems={10}
										sortOrder="desc"
										onStateClick={handleStateClick}
									/>
								</CardContent>
							</Card>

							<StateComparison
								selectedStates={selectedStatesData}
								onRemoveState={handleRemoveState}
								onClearAll={handleClearAll}
							/>
						</div>
					</FadeInUp>

					<FadeInUp delay={0.1}>
						<Card className="border-border/50">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-semibold">
									Urban vs Rural Unemployment by State
								</CardTitle>
								<CardDescription className="text-xs">
									States with largest urban-rural gap
								</CardDescription>
							</CardHeader>
							<CardContent>
								<UrbanRuralChart data={stateData} maxItems={12} />
							</CardContent>
						</Card>
					</FadeInUp>
				</TabsContent>

				{/* ===== TRENDS TAB ===== */}
				<TabsContent value="trends" className="space-y-6 mt-0">
					<FadeInUp>
						<Card className="border-border/50">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-sm font-semibold">
											Employment Trends (2020-2024)
										</CardTitle>
										<CardDescription className="text-xs">
											Quarterly trend analysis with gradient area charts
										</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground">Urban/Rural</span>
										<Switch
											checked={showUrbanRuralTrend}
											onCheckedChange={setShowUrbanRuralTrend}
										/>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<TrendChart data={trendData} showUrbanRural={showUrbanRuralTrend} />
							</CardContent>
						</Card>
					</FadeInUp>

					<FadeInUp delay={0.1}>
						<Card className="border-border/50">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-sm font-semibold">Age-Group Unemployment</CardTitle>
										<CardDescription className="text-xs">
											Unemployment and LFPR across age cohorts
										</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground">By Gender</span>
										<Switch checked={showGenderAge} onCheckedChange={setShowGenderAge} />
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<AgeGroupChart data={ageGroupData} showGender={showGenderAge} />
							</CardContent>
						</Card>
					</FadeInUp>
				</TabsContent>

				{/* ===== DEMOGRAPHICS TAB ===== */}
				<TabsContent value="demographics" className="space-y-6 mt-0">
					<FadeInUp>
						<div className="grid gap-4 lg:grid-cols-2">
							<GenderLfprCards
								maleLfpr={nationalSummary.maleLfpr}
								femaleLfpr={nationalSummary.femaleLfpr}
							/>
							<UrbanRuralCards
								urbanUR={nationalSummary.urbanUR}
								ruralUR={nationalSummary.ruralUR}
							/>
						</div>
					</FadeInUp>

					<FadeInUp delay={0.1}>
						<Card className="border-border/50">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm font-semibold">Gender-wise LFPR by State</CardTitle>
								<CardDescription className="text-xs">
									Male vs Female Labour Force Participation Rate (top 15 states)
								</CardDescription>
							</CardHeader>
							<CardContent>
								<GenderComparisonChart data={stateData} maxItems={15} />
							</CardContent>
						</Card>
					</FadeInUp>

					<FadeInUp delay={0.15}>
						<div>
							<h3 className="text-sm font-semibold mb-3">Sector Distribution</h3>
							<div className="grid gap-4 lg:grid-cols-3">
								<Card className="border-border/50">
									<CardHeader className="pb-3">
										<CardTitle className="text-xs font-semibold">Overall</CardTitle>
										<CardDescription className="text-[11px]">All areas combined</CardDescription>
									</CardHeader>
									<CardContent>
										<SectorPieChart data={sectorData} areaType="all" />
									</CardContent>
								</Card>
								<Card className="border-border/50">
									<CardHeader className="pb-3">
										<CardTitle className="text-xs font-semibold">Urban</CardTitle>
										<CardDescription className="text-[11px]">Urban areas only</CardDescription>
									</CardHeader>
									<CardContent>
										<SectorPieChart data={sectorData} areaType="urban" />
									</CardContent>
								</Card>
								<Card className="border-border/50">
									<CardHeader className="pb-3">
										<CardTitle className="text-xs font-semibold">Rural</CardTitle>
										<CardDescription className="text-[11px]">Rural areas only</CardDescription>
									</CardHeader>
									<CardContent>
										<SectorPieChart data={sectorData} areaType="rural" />
									</CardContent>
								</Card>
							</div>
						</div>
					</FadeInUp>

					<FadeInUp delay={0.2}>
						<Card className="border-border/50">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-sm font-semibold">Age-Group Analysis</CardTitle>
										<CardDescription className="text-xs">
											Unemployment and LFPR by age group
										</CardDescription>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground">By Gender</span>
										<Switch checked={showGenderAge} onCheckedChange={setShowGenderAge} />
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<AgeGroupChart data={ageGroupData} showGender={showGenderAge} />
							</CardContent>
						</Card>
					</FadeInUp>
				</TabsContent>
			</Tabs>
		</div>
	);
}
