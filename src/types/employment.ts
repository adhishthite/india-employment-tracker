// PLFS (Periodic Labour Force Survey) data types
// Based on MoSPI PLFS quarterly and annual reports

export interface StateEmploymentData {
	stateCode: string;
	stateName: string;
	unemploymentRate: number; // UR - percentage of unemployed in labour force
	lfpr: number; // Labour Force Participation Rate - percentage
	wpr: number; // Worker Population Ratio - percentage
	maleLfpr: number;
	femaleLfpr: number;
	urbanUnemploymentRate: number;
	ruralUnemploymentRate: number;
}

export interface AgeGroupData {
	ageGroup: string;
	unemploymentRate: number;
	lfpr: number;
	maleUnemploymentRate: number;
	femaleUnemploymentRate: number;
}

export interface SectorData {
	sector: string;
	percentage: number;
	malePercentage: number;
	femalePercentage: number;
	urbanPercentage: number;
	ruralPercentage: number;
}

export interface TrendData {
	period: string;
	year: number;
	quarter?: number;
	unemploymentRate: number;
	lfpr: number;
	wpr: number;
	urbanUR: number;
	ruralUR: number;
}

export interface NationalSummary {
	unemploymentRate: number;
	lfpr: number;
	wpr: number;
	maleLfpr: number;
	femaleLfpr: number;
	urbanUR: number;
	ruralUR: number;
	youthUR: number; // 15-29 years
	totalLabourForce: number; // in millions
	period: string;
}

export type AreaType = "all" | "urban" | "rural";
export type GenderType = "all" | "male" | "female";
export type TimePeriod =
	| "Q1-2024"
	| "Q2-2024"
	| "Q3-2024"
	| "Q4-2024"
	| "Annual-2023"
	| "Annual-2024";
