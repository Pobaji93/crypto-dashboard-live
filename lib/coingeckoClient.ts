import { setTimeout as delay } from "timers/promises";

export type RequestParams = Record<string, string | number>;

interface CacheEntry {
  data: any;
  expires: number;
}

interface ClientOptions {
  /** default cache time in ms */
  ttl?: number;
  /** max number of requests per second */
  requestsPerSecond?: number;
  /** number of retries when receiving 429 */
  retries?: number;
}

export class CoinGeckoClient {
  private baseUrl = "https://api.coingecko.com/api/v3";
  private cache: Map<string, CacheEntry> = new Map();
  private queue: (() => void)[] = [];
  private lastRequest = 0;
  private interval: number;
  private ttl: number;
  private retries: number;

  constructor(options: ClientOptions = {}) {
    this.ttl = options.ttl ?? 60 * 1000; // default 1 minute
    const rps = options.requestsPerSecond ?? 3;
    this.interval = 1000 / rps;
    this.retries = options.retries ?? 3;
  }

  /** generic GET request */
  async get(
    path: string,
    params: RequestParams = {},
    cacheTtl = this.ttl
  ): Promise<any> {
    const url = new URL(this.baseUrl + path);
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.append(k, String(v))
    );
    const cacheKey = url.toString();

    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    return new Promise((resolve, reject) => {
      this.enqueue(async () => {
        try {
          const data = await this.fetchWithRetry(cacheKey);
          this.cache.set(cacheKey, {
            data,
            expires: Date.now() + cacheTtl,
          });
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private enqueue(fn: () => void) {
    this.queue.push(fn);
    this.processQueue();
  }

  private processQueue() {
    if (!this.queue.length) return;

    const now = Date.now();
    const wait = Math.max(this.interval - (now - this.lastRequest), 0);
    const fn = this.queue.shift();

    setTimeout(() => {
      this.lastRequest = Date.now();
      fn?.();
      this.processQueue();
    }, wait);
  }

  private async fetchWithRetry(url: string): Promise<any> {
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      const res = await fetch(url);
      if (res.status === 429) {
        if (attempt === this.retries) throw new Error("Rate limit exceeded");
        const backoff = Math.pow(2, attempt) * 500; // exponential backoff
        await delay(backoff);
        continue;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    }
    throw new Error("Request failed");
  }
}

export const coingeckoClient = new CoinGeckoClient({
  ttl: 5 * 60 * 1000,
  requestsPerSecond: 3,
});

