"use client";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
		<div className="container px-4 py-6 space-y-6">
			{/* Filters */}
			<Filters
				selectedState={selectedState}
				onStateChange={setSelectedState}
				areaType={areaType}
				onAreaTypeChange={setAreaType}
				timePeriod={timePeriod}
				onTimePeriodChange={setTimePeriod}
			/>

			{/* Summary Cards */}
			<SummaryCards data={nationalSummary} />

			{/* Gender and Urban/Rural Quick Stats */}
			<div className="grid gap-6 lg:grid-cols-2">
				<GenderLfprCards
					maleLfpr={nationalSummary.maleLfpr}
					femaleLfpr={nationalSummary.femaleLfpr}
				/>
				<UrbanRuralCards urbanUR={nationalSummary.urbanUR} ruralUR={nationalSummary.ruralUR} />
			</div>

			<Separator />

			{/* Main Content: Map and Charts */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* India Map */}
				<Card className="lg:row-span-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>State-wise Employment Map</CardTitle>
								<CardDescription>Click states to compare (max 5)</CardDescription>
							</div>
							<select
								value={mapMetric}
								onChange={(e) =>
									setMapMetric(e.target.value as "unemploymentRate" | "lfpr" | "wpr")
								}
								className="text-sm bg-secondary border border-border rounded-md px-2 py-1"
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

				{/* Top Unemployed States */}
				<Card>
					<CardHeader>
						<CardTitle>States by Unemployment Rate</CardTitle>
						<CardDescription>Top 10 states with highest unemployment</CardDescription>
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

				{/* State Comparison */}
				<StateComparison
					selectedStates={selectedStatesData}
					onRemoveState={handleRemoveState}
					onClearAll={handleClearAll}
				/>
			</div>

			<Separator />

			{/* Trends Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Employment Trends (2020-2024)</CardTitle>
							<CardDescription>Quarterly trend analysis</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">Urban/Rural</span>
							<Switch checked={showUrbanRuralTrend} onCheckedChange={setShowUrbanRuralTrend} />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<TrendChart data={trendData} showUrbanRural={showUrbanRuralTrend} />
				</CardContent>
			</Card>

			{/* Detailed Analysis Tabs */}
			<Tabs defaultValue="age" className="space-y-4">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="age">Age Groups</TabsTrigger>
					<TabsTrigger value="gender">Gender Analysis</TabsTrigger>
					<TabsTrigger value="sector">Sector Distribution</TabsTrigger>
					<TabsTrigger value="urbanrural">Urban vs Rural</TabsTrigger>
				</TabsList>

				<TabsContent value="age">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle>Age-Group Analysis</CardTitle>
									<CardDescription>Unemployment and LFPR by age group</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground">By Gender</span>
									<Switch checked={showGenderAge} onCheckedChange={setShowGenderAge} />
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<AgeGroupChart data={ageGroupData} showGender={showGenderAge} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="gender">
					<Card>
						<CardHeader>
							<CardTitle>Gender-wise LFPR Comparison</CardTitle>
							<CardDescription>
								Male vs Female Labour Force Participation Rate by state
							</CardDescription>
						</CardHeader>
						<CardContent>
							<GenderComparisonChart data={stateData} maxItems={15} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="sector">
					<div className="grid gap-6 lg:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>Overall Distribution</CardTitle>
								<CardDescription>All areas combined</CardDescription>
							</CardHeader>
							<CardContent>
								<SectorPieChart data={sectorData} areaType="all" />
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Urban Sector Distribution</CardTitle>
								<CardDescription>Urban areas only</CardDescription>
							</CardHeader>
							<CardContent>
								<SectorPieChart data={sectorData} areaType="urban" />
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Rural Sector Distribution</CardTitle>
								<CardDescription>Rural areas only</CardDescription>
							</CardHeader>
							<CardContent>
								<SectorPieChart data={sectorData} areaType="rural" />
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="urbanrural">
					<Card>
						<CardHeader>
							<CardTitle>Urban vs Rural Unemployment</CardTitle>
							<CardDescription>States with largest urban-rural unemployment gap</CardDescription>
						</CardHeader>
						<CardContent>
							<UrbanRuralChart data={stateData} maxItems={12} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Insights Section */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Key Insight</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Youth unemployment (15-29 years) remains significantly higher at{" "}
							<span className="font-semibold text-foreground">{nationalSummary.youthUR}%</span>{" "}
							compared to the national average of {nationalSummary.unemploymentRate}%. This
							indicates the need for targeted employment programs for young job seekers.
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Gender Gap</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Female LFPR stands at{" "}
							<span className="font-semibold text-foreground">{nationalSummary.femaleLfpr}%</span>,
							significantly lower than male LFPR of {nationalSummary.maleLfpr}%. The gender gap of{" "}
							{(nationalSummary.maleLfpr - nationalSummary.femaleLfpr).toFixed(1)}% highlights the
							need for policies promoting women's workforce participation.
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Urban-Rural Divide</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Urban unemployment ({nationalSummary.urbanUR}%) is more than double the rural rate (
							{nationalSummary.ruralUR}%). This reflects both the job market dynamics and
							measurement differences between formal urban employment and agricultural rural work.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
