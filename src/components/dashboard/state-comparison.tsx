"use client";

import { GitCompareArrows, X } from "lucide-react";
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
			<Card className="border-border/50 border-dashed">
				<CardContent className="py-10 text-center">
					<div className="flex flex-col items-center gap-2">
						<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50">
							<GitCompareArrows className="h-5 w-5 text-muted-foreground/50" />
						</div>
						<p className="text-sm text-muted-foreground">Click states on the map to compare</p>
						<p className="text-xs text-muted-foreground/60">Select up to 5 states</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-border/50">
			<CardHeader className="flex flex-row items-center justify-between pb-3">
				<div className="flex items-center gap-2">
					<CardTitle className="text-sm font-semibold">State Comparison</CardTitle>
					<Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
						{selectedStates.length}/5
					</Badge>
				</div>
				<Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClearAll}>
					Clear All
				</Button>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-1.5 mb-4">
					{selectedStates.map((state) => (
						<Badge key={state.stateCode} variant="secondary" className="gap-1 py-0.5 px-2 text-xs">
							{state.stateName}
							<button
								type="button"
								onClick={() => onRemoveState(state.stateCode)}
								className="ml-0.5 hover:text-destructive transition-colors"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
				</div>
				<div className="overflow-x-auto -mx-5 px-5">
					<table className="w-full text-xs">
						<thead>
							<tr className="border-b border-border/50">
								<th className="text-left py-2 px-2 font-medium text-muted-foreground">State</th>
								<th className="text-right py-2 px-2 font-medium text-muted-foreground">UR</th>
								<th className="text-right py-2 px-2 font-medium text-muted-foreground">LFPR</th>
								<th className="text-right py-2 px-2 font-medium text-muted-foreground">WPR</th>
								<th className="text-right py-2 px-2 font-medium text-muted-foreground">
									Male LFPR
								</th>
								<th className="text-right py-2 px-2 font-medium text-muted-foreground">
									Female LFPR
								</th>
								<th className="text-right py-2 px-2 font-medium text-muted-foreground">Urban UR</th>
								<th className="text-right py-2 px-2 font-medium text-muted-foreground">Rural UR</th>
							</tr>
						</thead>
						<tbody>
							{selectedStates.map((state) => (
								<tr
									key={state.stateCode}
									className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
								>
									<td className="py-2.5 px-2 font-medium">{state.stateName}</td>
									<td className="py-2.5 px-2 text-right">
										<span
											className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
											style={{
												backgroundColor: getUnemploymentColor(state.unemploymentRate),
											}}
										>
											{state.unemploymentRate}%
										</span>
									</td>
									<td className="py-2.5 px-2 text-right tabular-nums">{state.lfpr}%</td>
									<td className="py-2.5 px-2 text-right tabular-nums">{state.wpr}%</td>
									<td className="py-2.5 px-2 text-right text-blue-500 tabular-nums">
										{state.maleLfpr}%
									</td>
									<td className="py-2.5 px-2 text-right text-pink-500 tabular-nums">
										{state.femaleLfpr}%
									</td>
									<td className="py-2.5 px-2 text-right text-orange-500 tabular-nums">
										{state.urbanUnemploymentRate}%
									</td>
									<td className="py-2.5 px-2 text-right text-emerald-500 tabular-nums">
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
