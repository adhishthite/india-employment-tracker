"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUnemploymentColor } from "@/data/plfs-data";
import type { StateEmploymentData } from "@/types/employment";

interface StateComparisonProps {
	selectedStates: StateEmploymentData[];
	onRemoveState: (stateCode: string) => void;
	onClearAll: () => void;
}

export function StateComparison({
	selectedStates,
	onRemoveState,
	onClearAll,
}: StateComparisonProps) {
	if (selectedStates.length === 0) {
		return (
			<Card>
				<CardContent className="py-8 text-center text-muted-foreground">
					<p>Click on states in the map to compare them</p>
					<p className="text-sm mt-1">Select up to 5 states for comparison</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-lg">State Comparison</CardTitle>
				<Button variant="ghost" size="sm" onClick={onClearAll}>
					Clear All
				</Button>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-2 mb-4">
					{selectedStates.map((state) => (
						<Badge key={state.stateCode} variant="secondary" className="gap-1 py-1">
							{state.stateName}
							<button
								type="button"
								onClick={() => onRemoveState(state.stateCode)}
								className="ml-1 hover:text-destructive"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b">
								<th className="text-left py-2 px-2 font-medium">State</th>
								<th className="text-right py-2 px-2 font-medium">UR</th>
								<th className="text-right py-2 px-2 font-medium">LFPR</th>
								<th className="text-right py-2 px-2 font-medium">WPR</th>
								<th className="text-right py-2 px-2 font-medium">Male LFPR</th>
								<th className="text-right py-2 px-2 font-medium">Female LFPR</th>
								<th className="text-right py-2 px-2 font-medium">Urban UR</th>
								<th className="text-right py-2 px-2 font-medium">Rural UR</th>
							</tr>
						</thead>
						<tbody>
							{selectedStates.map((state) => (
								<tr key={state.stateCode} className="border-b last:border-0">
									<td className="py-2 px-2 font-medium">{state.stateName}</td>
									<td className="py-2 px-2 text-right">
										<span
											className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium text-white"
											style={{ backgroundColor: getUnemploymentColor(state.unemploymentRate) }}
										>
											{state.unemploymentRate}%
										</span>
									</td>
									<td className="py-2 px-2 text-right">{state.lfpr}%</td>
									<td className="py-2 px-2 text-right">{state.wpr}%</td>
									<td className="py-2 px-2 text-right text-blue-500">{state.maleLfpr}%</td>
									<td className="py-2 px-2 text-right text-pink-500">{state.femaleLfpr}%</td>
									<td className="py-2 px-2 text-right text-orange-500">
										{state.urbanUnemploymentRate}%
									</td>
									<td className="py-2 px-2 text-right text-green-500">
										{state.ruralUnemploymentRate}%
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
