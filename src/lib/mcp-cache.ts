interface CacheEntry<T> {
	data: T;
	expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getCached<T>(key: string): T | null {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() > entry.expiresAt) {
		cache.delete(key);
		return null;
	}
	return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
	cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearCache(): void {
	cache.clear();
}

export function buildCacheKey(...parts: (string | number | undefined)[]): string {
	return parts.filter((p) => p !== undefined).join(":");
}
