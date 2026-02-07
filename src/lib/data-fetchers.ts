import type {
	AgeGroupData,
	NationalSummary,
	SectorData,
	StateEmploymentData,
	TrendData,
} from "@/types/employment";
import { buildCacheKey, getCached, setCache } from "./mcp-cache";
import { fetchAllPLFSData, type PLFSRecord } from "./mcp-client";

// MoSPI state_code -> our 2-letter stateCode mapping
const MOSPI_STATE_MAP: Record<string, { code: string; name: string }> = {
	"Andhra Pradesh": { code: "AP", name: "Andhra Pradesh" },
	"Arunachal Pradesh": { code: "AR", name: "Arunachal Pradesh" },
	Assam: { code: "AS", name: "Assam" },
	Bihar: { code: "BR", name: "Bihar" },
	Chhattisgarh: { code: "CT", name: "Chhattisgarh" },
	Delhi: { code: "DL", name: "Delhi" },
	Goa: { code: "GA", name: "Goa" },
	Gujarat: { code: "GJ", name: "Gujarat" },
	Haryana: { code: "HR", name: "Haryana" },
	"Himachal Pradesh": { code: "HP", name: "Himachal Pradesh" },
	"Jammu & Kashmir": { code: "JK", name: "Jammu & Kashmir" },
	Jharkhand: { code: "JH", name: "Jharkhand" },
	Karnataka: { code: "KA", name: "Karnataka" },
	Kerala: { code: "KL", name: "Kerala" },
	"Madhya Pradesh": { code: "MP", name: "Madhya Pradesh" },
	Maharashtra: { code: "MH", name: "Maharashtra" },
	Manipur: { code: "MN", name: "Manipur" },
	Meghalaya: { code: "ML", name: "Meghalaya" },
	Mizoram: { code: "MZ", name: "Mizoram" },
	Nagaland: { code: "NL", name: "Nagaland" },
	Odisha: { code: "OR", name: "Odisha" },
	Punjab: { code: "PB", name: "Punjab" },
	Rajasthan: { code: "RJ", name: "Rajasthan" },
	Sikkim: { code: "SK", name: "Sikkim" },
	"Tamil Nadu": { code: "TN", name: "Tamil Nadu" },
	Telangana: { code: "TG", name: "Telangana" },
	Tripura: { code: "TR", name: "Tripura" },
	Uttarakhand: { code: "UT", name: "Uttarakhand" },
	"Uttar Pradesh": { code: "UP", name: "Uttar Pradesh" },
	"West Bengal": { code: "WB", name: "West Bengal" },
	"Andaman & Nicobar Islands": { code: "AN", name: "Andaman & Nicobar" },
	Chandigarh: { code: "CH", name: "Chandigarh" },
	"Dadra & Nagar Haveli": { code: "DN", name: "Dadra & Nagar Haveli" },
	"Daman & Diu": { code: "DD", name: "Daman & Diu" },
	Lakshadweep: { code: "LD", name: "Lakshadweep" },
	Puducherry: { code: "PY", name: "Puducherry" },
	Ladakh: { code: "LA", name: "Ladakh" },
	"Dadra & Nagar Haveli & Daman & Diu": {
		code: "DN",
		name: "Dadra & Nagar Haveli & Daman & Diu",
	},
};

// All state codes 1-38 as comma-separated string
const ALL_STATES =
	"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38";

// Latest year available in the API
const LATEST_YEAR = "2023-24";

// All years for trend data
const ALL_YEARS = "2017-18,2018-19,2019-20,2020-21,2021-22,2022-23,2023-24";

function parseValue(val: string): number {
	const n = Number.parseFloat(val);
	return Number.isNaN(n) ? 0 : n;
}

function findRecord(records: PLFSRecord[], criteria: Partial<PLFSRecord>): PLFSRecord | undefined {
	return records.find((r) => {
		for (const [key, value] of Object.entries(criteria)) {
			if (r[key as keyof PLFSRecord] !== value) return false;
		}
		return true;
	});
}

function filterRecords(records: PLFSRecord[], criteria: Partial<PLFSRecord>): PLFSRecord[] {
	return records.filter((r) => {
		for (const [key, value] of Object.entries(criteria)) {
			if (r[key as keyof PLFSRecord] !== value) return false;
		}
		return true;
	});
}

/**
 * Fetch state-level employment data (UR, LFPR, WPR) for all states.
 * Returns data shaped for StateEmploymentData[].
 */
export async function fetchStateData(): Promise<StateEmploymentData[]> {
	const cacheKey = buildCacheKey("stateData", LATEST_YEAR);
	const cached = getCached<StateEmploymentData[]>(cacheKey);
	if (cached) return cached;

	// Fetch UR (3), LFPR (1), and WPR (2) for all states
	// We need: all genders (1,2,3), all sectors (1,2,3), age 15+ (1), PS+SS (1)
	// But to keep requests manageable, fetch per indicator with specific filters

	const baseFilters = {
		frequency_code: "1",
		year: LATEST_YEAR,
		state_code: ALL_STATES,
		age_code: "1",
		weekly_status_code: "1",
		education_code: "10",
		religion_code: "1",
		social_category_code: "1",
	};

	const [urRecords, lfprRecords, wprRecords] = await Promise.all([
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "3",
			gender_code: "1,2,3",
			sector_code: "1,2,3",
		}),
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "1",
			gender_code: "1,2,3",
			sector_code: "3",
		}),
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "2",
			gender_code: "3",
			sector_code: "3",
		}),
	]);

	const stateNames = Object.keys(MOSPI_STATE_MAP);
	const result: StateEmploymentData[] = [];

	for (const stateName of stateNames) {
		const mapping = MOSPI_STATE_MAP[stateName];

		// UR combined (person, rural+urban)
		const urCombined = findRecord(urRecords, {
			state: stateName,
			gender: "person",
			sector: "rural + urban",
		});

		// UR urban
		const urUrban = findRecord(urRecords, {
			state: stateName,
			gender: "person",
			sector: "urban",
		});

		// UR rural
		const urRural = findRecord(urRecords, {
			state: stateName,
			gender: "person",
			sector: "rural",
		});

		// LFPR male (rural+urban)
		const lfprMale = findRecord(lfprRecords, {
			state: stateName,
			gender: "male",
		});

		// LFPR female (rural+urban)
		const lfprFemale = findRecord(lfprRecords, {
			state: stateName,
			gender: "female",
		});

		// LFPR person (rural+urban)
		const lfprPerson = findRecord(lfprRecords, {
			state: stateName,
			gender: "person",
		});

		// WPR person (rural+urban)
		const wprPerson = findRecord(wprRecords, {
			state: stateName,
			gender: "person",
		});

		if (!urCombined) continue;

		result.push({
			stateCode: mapping.code,
			stateName: mapping.name,
			unemploymentRate: parseValue(urCombined?.value ?? "0"),
			lfpr: parseValue(lfprPerson?.value ?? "0"),
			wpr: parseValue(wprPerson?.value ?? "0"),
			maleLfpr: parseValue(lfprMale?.value ?? "0"),
			femaleLfpr: parseValue(lfprFemale?.value ?? "0"),
			urbanUnemploymentRate: parseValue(urUrban?.value ?? "0"),
			ruralUnemploymentRate: parseValue(urRural?.value ?? "0"),
		});
	}

	setCache(cacheKey, result);
	return result;
}

/**
 * Fetch national summary data.
 */
export async function fetchNationalSummary(): Promise<NationalSummary> {
	const cacheKey = buildCacheKey("nationalSummary", LATEST_YEAR);
	const cached = getCached<NationalSummary>(cacheKey);
	if (cached) return cached;

	const baseFilters = {
		frequency_code: "1",
		year: LATEST_YEAR,
		state_code: "99",
		weekly_status_code: "1",
		education_code: "10",
		religion_code: "1",
		social_category_code: "1",
	};

	const [urRecords, lfprRecords, wprRecords] = await Promise.all([
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "3",
			gender_code: "3",
			sector_code: "1,2,3",
			age_code: "1,2",
		}),
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "1",
			gender_code: "1,2,3",
			sector_code: "3",
			age_code: "1",
		}),
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "2",
			gender_code: "3",
			sector_code: "3",
			age_code: "1",
		}),
	]);

	const filter = { state: "All India" };

	const urAll = findRecord(urRecords, {
		...filter,
		sector: "rural + urban",
		AgeGroup: "15 years and above",
	});
	const urUrban = findRecord(urRecords, {
		...filter,
		sector: "urban",
		AgeGroup: "15 years and above",
	});
	const urRural = findRecord(urRecords, {
		...filter,
		sector: "rural",
		AgeGroup: "15 years and above",
	});
	const urYouth = findRecord(urRecords, {
		...filter,
		sector: "rural + urban",
		AgeGroup: "15-29 years",
	});

	const lfprPerson = findRecord(lfprRecords, {
		...filter,
		gender: "person",
	});
	const lfprMale = findRecord(lfprRecords, {
		...filter,
		gender: "male",
	});
	const lfprFemale = findRecord(lfprRecords, {
		...filter,
		gender: "female",
	});
	const wprPerson = findRecord(wprRecords, {
		...filter,
		gender: "person",
	});

	const summary: NationalSummary = {
		unemploymentRate: parseValue(urAll?.value ?? "0"),
		lfpr: parseValue(lfprPerson?.value ?? "0"),
		wpr: parseValue(wprPerson?.value ?? "0"),
		maleLfpr: parseValue(lfprMale?.value ?? "0"),
		femaleLfpr: parseValue(lfprFemale?.value ?? "0"),
		urbanUR: parseValue(urUrban?.value ?? "0"),
		ruralUR: parseValue(urRural?.value ?? "0"),
		youthUR: parseValue(urYouth?.value ?? "0"),
		totalLabourForce: 0, // Not directly available from this indicator
		period: LATEST_YEAR,
	};

	setCache(cacheKey, summary);
	return summary;
}

/**
 * Fetch age group data for UR (unemployment by age).
 * MoSPI only has 3 age groups (15+, 15-29, 15-59, all) for UR.
 * We fetch what is available and map to our AgeGroupData type.
 */
export async function fetchAgeGroupData(): Promise<AgeGroupData[]> {
	const cacheKey = buildCacheKey("ageGroupData", LATEST_YEAR);
	const cached = getCached<AgeGroupData[]>(cacheKey);
	if (cached) return cached;

	const baseFilters = {
		frequency_code: "1",
		year: LATEST_YEAR,
		state_code: "99",
		weekly_status_code: "1",
		education_code: "10",
		religion_code: "1",
		social_category_code: "1",
		sector_code: "3",
	};

	const [urRecords, lfprRecords] = await Promise.all([
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "3",
			gender_code: "1,2,3",
			age_code: "1,2,3,4",
		}),
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "1",
			gender_code: "3",
			age_code: "1,2,3,4",
		}),
	]);

	// Map available MoSPI age groups to our format
	const ageGroups: { ageGroup: string; mospiAge: string }[] = [
		{ ageGroup: "15-29", mospiAge: "15-29 years" },
		{ ageGroup: "15-59", mospiAge: "15-59 years" },
		{ ageGroup: "15+", mospiAge: "15 years and above" },
	];

	const result: AgeGroupData[] = [];

	for (const ag of ageGroups) {
		const urPerson = findRecord(urRecords, {
			state: "All India",
			gender: "person",
			AgeGroup: ag.mospiAge,
		});
		const urMale = findRecord(urRecords, {
			state: "All India",
			gender: "male",
			AgeGroup: ag.mospiAge,
		});
		const urFemale = findRecord(urRecords, {
			state: "All India",
			gender: "female",
			AgeGroup: ag.mospiAge,
		});
		const lfprPerson = findRecord(lfprRecords, {
			state: "All India",
			AgeGroup: ag.mospiAge,
		});

		result.push({
			ageGroup: ag.ageGroup,
			unemploymentRate: parseValue(urPerson?.value ?? "0"),
			lfpr: parseValue(lfprPerson?.value ?? "0"),
			maleUnemploymentRate: parseValue(urMale?.value ?? "0"),
			femaleUnemploymentRate: parseValue(urFemale?.value ?? "0"),
		});
	}

	setCache(cacheKey, result);
	return result;
}

/**
 * Fetch sector/industry distribution data.
 * Uses indicator 4 (percentage distribution of workers) with broad_industry_work_code.
 */
export async function fetchSectorData(): Promise<SectorData[]> {
	const cacheKey = buildCacheKey("sectorData", LATEST_YEAR);
	const cached = getCached<SectorData[]>(cacheKey);
	if (cached) return cached;

	// Fetch worker distribution by broad industry (primary=1, secondary=2, tertiary=3)
	// Also by NIC groups for finer breakdown
	const baseFilters = {
		frequency_code: "1",
		indicator_code: "4",
		year: LATEST_YEAR,
		state_code: "99",
		age_code: "1",
		weekly_status_code: "1",
	};

	const records = await fetchAllPLFSData({
		...baseFilters,
		gender_code: "1,2,3",
		sector_code: "1,2,3",
		nic_group_code: "4,5,6,7,8,10,11,12,13",
	});

	// NIC group mapping to our sector names
	const nicGroupSectors: { nicGroup: string; sector: string }[] = [
		{ nicGroup: "01-03 (agriculture)", sector: "Agriculture" },
		{ nicGroup: "10-33 (manufacturing)", sector: "Manufacturing" },
		{ nicGroup: "41-43 (construction)", sector: "Construction" },
		{ nicGroup: "45-47 (trade)", sector: "Trade & Commerce" },
		{ nicGroup: "49-53( transport)", sector: "Transport & Storage" },
		{ nicGroup: "55-56 (accommodation & food services", sector: "Accommodation & Food" },
		{ nicGroup: "58-99 (other services)", sector: "Other Services" },
		{ nicGroup: "05-09 (mining & quarrying)", sector: "Mining & Quarrying" },
		{ nicGroup: "35-39 (electricity and water supply)", sector: "Utilities" },
	];

	const result: SectorData[] = [];

	for (const { nicGroup, sector } of nicGroupSectors) {
		const personAll = findRecord(records, {
			state: "All India",
			gender: "person",
			sector: "rural + urban",
			nic_group: nicGroup,
		});
		const maleAll = findRecord(records, {
			state: "All India",
			gender: "male",
			sector: "rural + urban",
			nic_group: nicGroup,
		});
		const femaleAll = findRecord(records, {
			state: "All India",
			gender: "female",
			sector: "rural + urban",
			nic_group: nicGroup,
		});
		const personUrban = findRecord(records, {
			state: "All India",
			gender: "person",
			sector: "urban",
			nic_group: nicGroup,
		});
		const personRural = findRecord(records, {
			state: "All India",
			gender: "person",
			sector: "rural",
			nic_group: nicGroup,
		});

		const pct = parseValue(personAll?.value ?? "0");
		if (pct === 0) continue;

		result.push({
			sector,
			percentage: pct,
			malePercentage: parseValue(maleAll?.value ?? "0"),
			femalePercentage: parseValue(femaleAll?.value ?? "0"),
			urbanPercentage: parseValue(personUrban?.value ?? "0"),
			ruralPercentage: parseValue(personRural?.value ?? "0"),
		});
	}

	// Sort by percentage descending
	result.sort((a, b) => b.percentage - a.percentage);

	setCache(cacheKey, result);
	return result;
}

// Quarter code mapping for financial year quarters
// The MoSPI API uses quarter_code (1-35) which maps to specific quarters across years
// For trend data, we fetch annual data across all years without quarter filtering
// and also try quarterly breakdowns

/**
 * Fetch trend data across years.
 * Uses annual UR, LFPR, WPR for All India across all available years.
 */
export async function fetchTrendData(): Promise<TrendData[]> {
	const cacheKey = buildCacheKey("trendData");
	const cached = getCached<TrendData[]>(cacheKey);
	if (cached) return cached;

	const baseFilters = {
		frequency_code: "1",
		year: ALL_YEARS,
		state_code: "99",
		age_code: "1",
		weekly_status_code: "1",
		education_code: "10",
		religion_code: "1",
		social_category_code: "1",
		gender_code: "3",
	};

	const [urRecords, lfprRecords, wprRecords] = await Promise.all([
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "3",
			sector_code: "1,2,3",
		}),
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "1",
			sector_code: "3",
		}),
		fetchAllPLFSData({
			...baseFilters,
			indicator_code: "2",
			sector_code: "3",
		}),
	]);

	const years = ["2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24"];

	const result: TrendData[] = [];

	for (const yr of years) {
		const yearRecords = {
			ur: filterRecords(urRecords, { state: "All India" }).filter((r) => r.year === yr),
			lfpr: filterRecords(lfprRecords, { state: "All India" }).filter((r) => r.year === yr),
			wpr: filterRecords(wprRecords, { state: "All India" }).filter((r) => r.year === yr),
		};

		const urAll = yearRecords.ur.find((r) => r.sector === "rural + urban" && r.quarter === "all");
		const urUrban = yearRecords.ur.find((r) => r.sector === "urban" && r.quarter === "all");
		const urRural = yearRecords.ur.find((r) => r.sector === "rural" && r.quarter === "all");
		const lfpr = yearRecords.lfpr.find((r) => r.quarter === "all");
		const wpr = yearRecords.wpr.find((r) => r.quarter === "all");

		// Extract start year for sorting, e.g. "2023-24" -> 2023
		const startYear = Number.parseInt(yr.split("-")[0], 10);

		result.push({
			period: yr,
			year: startYear,
			unemploymentRate: parseValue(urAll?.value ?? "0"),
			lfpr: parseValue(lfpr?.value ?? "0"),
			wpr: parseValue(wpr?.value ?? "0"),
			urbanUR: parseValue(urUrban?.value ?? "0"),
			ruralUR: parseValue(urRural?.value ?? "0"),
		});
	}

	// Sort by year
	result.sort((a, b) => a.year - b.year);

	setCache(cacheKey, result);
	return result;
}

/**
 * Fetch all dashboard data in a single call.
 * Used by the main API route.
 */
export async function fetchAllDashboardData(): Promise<{
	nationalSummary: NationalSummary;
	stateData: StateEmploymentData[];
	ageGroupData: AgeGroupData[];
	sectorData: SectorData[];
	trendData: TrendData[];
}> {
	// Fetch sequentially to avoid 429 rate limiting from MoSPI API
	const nationalSummary = await fetchNationalSummary();
	const stateData = await fetchStateData();
	const ageGroupData = await fetchAgeGroupData();
	const sectorData = await fetchSectorData();
	const trendData = await fetchTrendData();

	return { nationalSummary, stateData, ageGroupData, sectorData, trendData };
}
