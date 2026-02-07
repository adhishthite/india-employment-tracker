const MCP_URL = "https://mcp.mospi.gov.in/";

interface McpToolResult {
	content: { type: string; text: string }[];
	structuredContent?: Record<string, unknown>;
	isError?: boolean;
}

interface McpSession {
	sessionId: string;
	nextId: number;
}

/**
 * Parse SSE response body and extract the JSON-RPC result.
 * MoSPI returns `event: message\ndata: {json}\n\n` format.
 */
function parseSSE(raw: string): unknown {
	const lines = raw.split("\n");
	for (const line of lines) {
		if (line.startsWith("data: ")) {
			const json = line.slice(6);
			const parsed = JSON.parse(json);
			if (parsed.error) {
				throw new Error(`MCP error ${parsed.error.code}: ${parsed.error.message}`);
			}
			return parsed.result;
		}
	}
	throw new Error("No data line found in SSE response");
}

/**
 * Initialize an MCP session with the MoSPI server.
 */
async function initSession(): Promise<McpSession> {
	const res = await fetch(MCP_URL, {
		method: "POST",
		headers: {
			Accept: "text/event-stream, application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "initialize",
			params: {
				protocolVersion: "2025-03-26",
				capabilities: {},
				clientInfo: { name: "india-employment-tracker", version: "1.0.0" },
			},
		}),
	});

	if (!res.ok) {
		throw new Error(`MCP init failed: HTTP ${res.status}`);
	}

	const sessionId = res.headers.get("mcp-session-id");
	if (!sessionId) {
		throw new Error("No mcp-session-id header in init response");
	}

	// Consume the body to confirm success
	const body = await res.text();
	parseSSE(body);

	return { sessionId, nextId: 2 };
}

/**
 * Call an MCP tool on an existing session.
 */
async function callTool(
	session: McpSession,
	toolName: string,
	args: Record<string, unknown>,
): Promise<McpToolResult> {
	const id = session.nextId++;
	const res = await fetch(MCP_URL, {
		method: "POST",
		headers: {
			Accept: "text/event-stream, application/json",
			"Content-Type": "application/json",
			"mcp-session-id": session.sessionId,
		},
		body: JSON.stringify({
			jsonrpc: "2.0",
			id,
			method: "tools/call",
			params: { name: toolName, arguments: args },
		}),
	});

	if (!res.ok) {
		throw new Error(`MCP tool call failed: HTTP ${res.status}`);
	}

	const body = await res.text();
	const result = parseSSE(body) as McpToolResult;

	if (result.isError) {
		const errorText = result.content?.[0]?.text ?? "Unknown MCP tool error";
		throw new Error(`MCP tool error: ${errorText}`);
	}

	return result;
}

/**
 * Extract structured data from an MCP tool result.
 * The server returns data either in structuredContent or as JSON text in content[0].text.
 */
function extractData(result: McpToolResult): Record<string, unknown> {
	if (result.structuredContent) {
		return result.structuredContent;
	}
	if (result.content?.[0]?.text) {
		return JSON.parse(result.content[0].text);
	}
	throw new Error("No data in MCP tool result");
}

export interface PLFSRecord {
	year: string;
	frequency: string;
	indicator: string;
	state: string;
	gender: string;
	sector: string;
	AgeGroup: string;
	weekly_status: string;
	religion: string;
	socialGroup: string;
	General_Education: string;
	quarter: string;
	month: string | null;
	value: string;
	unit: string;
	// indicator 4 specific fields
	broad_industry_work?: string;
	broad_status_employment?: string;
	industry_section?: string;
	nic_group?: string;
	nco_division?: string;
	enterprise_type?: string;
	enterprise_size?: string;
}

export interface PLFSDataResponse {
	data: PLFSRecord[];
	meta_data: {
		page: number;
		totalRecords: number;
		totalPages: number;
		recordPerPage: number;
	};
	msg: string;
	statusCode: boolean;
}

export interface PLFSFilters {
	indicator_code: string;
	frequency_code: string;
	year?: string;
	state_code?: string;
	gender_code?: string;
	sector_code?: string;
	age_code?: string;
	weekly_status_code?: string;
	education_code?: string;
	religion_code?: string;
	social_category_code?: string;
	broad_industry_work_code?: string;
	broad_status_employment_code?: string;
	industry_section_code?: string;
	nic_group_code?: string;
	nco_division_code?: string;
	enterprise_type_code?: string;
	enterprise_size_code?: string;
	quarter_code?: string;
	limit?: string;
	page?: string;
	Format?: string;
}

/**
 * Full PLFS data fetch following the mandatory 4-step MCP workflow.
 * The MoSPI server enforces sequential tool calls: 1 → 2 → 3 → 4.
 * Skipping steps results in errors.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Shared session: initialized once, reused across all fetchers
let sharedSession: McpSession | null = null;
let sessionReady = false;

/**
 * Get or create a shared MCP session with steps 1-3 already done.
 */
async function getSharedSession(indicatorCode: number, frequencyCode: number): Promise<McpSession> {
	if (sharedSession && sessionReady) {
		return sharedSession;
	}

	sharedSession = await initSession();
	await delay(1000);

	// Step 1: mandatory overview
	await callTool(sharedSession, "1_know_about_mospi_api", {});
	await delay(1000);

	// Step 2: get indicators for PLFS
	await callTool(sharedSession, "2_get_indicators", {
		dataset: "PLFS",
		user_query: "employment unemployment labour force data",
		frequency_code: frequencyCode,
	});
	await delay(1000);

	// Step 3: get metadata
	await callTool(sharedSession, "3_get_metadata", {
		dataset: "PLFS",
		indicator_code: indicatorCode,
		frequency_code: frequencyCode,
	});
	await delay(1000);

	sessionReady = true;
	return sharedSession;
}

/**
 * Reset shared session (e.g., on error)
 */
function resetSession() {
	sharedSession = null;
	sessionReady = false;
}

export async function fetchPLFSData(filters: PLFSFilters): Promise<PLFSDataResponse> {
	const session = await getSharedSession(
		Number.parseInt(filters.indicator_code) || 1,
		Number.parseInt(filters.frequency_code) || 1,
	);

	await delay(1500); // Rate limit: wait between data calls

	// Step 4: fetch actual data (session already has steps 1-3 done)
	let result: McpToolResult;
	try {
		result = await callTool(session, "4_get_data", {
			dataset: "PLFS",
			filters: {
				...filters,
				Format: filters.Format ?? "JSON",
			},
		});
	} catch (err) {
		// On session error, reset and retry once
		resetSession();
		const freshSession = await getSharedSession(
			Number.parseInt(filters.indicator_code) || 1,
			Number.parseInt(filters.frequency_code) || 1,
		);
		await delay(2000);
		result = await callTool(freshSession, "4_get_data", {
			dataset: "PLFS",
			filters: {
				...filters,
				Format: filters.Format ?? "JSON",
			},
		});
	}

	const raw = extractData(result);

	// MCP may return an error string in the data
	if ("error" in raw && typeof raw.error === "string") {
		throw new Error(`MoSPI API error: ${raw.error}`);
	}

	const data = raw as unknown as PLFSDataResponse;

	if (!data.statusCode && data.statusCode !== undefined) {
		const errorDetail = data.msg || JSON.stringify(data).slice(0, 200);
		throw new Error(`PLFS data fetch failed: ${errorDetail}`);
	}

	// Handle case where meta_data is missing (single page response)
	if (!data.meta_data) {
		data.meta_data = {
			page: 1,
			totalRecords: data.data?.length ?? 0,
			totalPages: 1,
			recordPerPage: data.data?.length ?? 0,
		};
	}

	return data;
}

/**
 * Fetch all pages of PLFS data for a given filter set.
 * The API defaults to 10 records per page; we request larger pages
 * and iterate if needed.
 */
export async function fetchAllPLFSData(filters: PLFSFilters): Promise<PLFSRecord[]> {
	const pageSize = "500";
	const firstPage = await fetchPLFSData({
		...filters,
		limit: pageSize,
		page: "1",
	});

	const allRecords = [...firstPage.data];
	const totalPages = firstPage.meta_data.totalPages;

	if (totalPages > 1) {
		// Fetch remaining pages sequentially to avoid overwhelming the server
		for (let page = 2; page <= totalPages; page++) {
			const pageData = await fetchPLFSData({
				...filters,
				limit: pageSize,
				page: String(page),
			});
			allRecords.push(...pageData.data);
		}
	}

	return allRecords;
}
