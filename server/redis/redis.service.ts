import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redis: Redis | null = null;
  private memoryCache: Map<string, { value: string; expires: number }> = new Map();
  private isMockMode = false;

  constructor() {
    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;

    if (!host || !port) {
      this.logger.warn('Redis configuration missing. Falling back to In-Memory Mock Mode.');
      this.isMockMode = true;
      return;
    }

    try {
      this.redis = new Redis({
        host,
        port: parseInt(port),
        maxRetriesPerRequest: null,
        connectTimeout: 5000,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.error(`Redis connection failed after ${times} attempts. Switching to In-Memory Mock Mode.`);
            this.isMockMode = true;
            return null; // Stop retrying
          }
          return Math.min(times * 100, 3000);
        },
      });

      this.redis.on('error', (err) => {
        this.logger.error(`[Redis] Connection Error: ${err.message}`);
        if (!this.isMockMode) {
          this.logger.warn('Switching to In-Memory Mock Mode due to connection error.');
          this.isMockMode = true;
        }
      });

      this.redis.on('connect', () => {
        this.logger.log('[Redis] Connected successfully. Disabling Mock Mode.');
        this.isMockMode = false;
      });
    } catch (e) {
      this.logger.error('Failed to initialize Redis client. Falling back to Mock Mode.', e.stack);
      this.isMockMode = true;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isMockMode) {
      const item = this.memoryCache.get(key);
      if (!item) return null;
      if (Date.now() > item.expires) {
        this.memoryCache.delete(key);
        return null;
      }
      return item.value;
    }

    if (!this.redis || this.redis.status !== 'ready') {
      return null;
    }
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
    if (this.isMockMode) {
      this.memoryCache.set(key, {
        value,
        expires: Date.now() + ttlSeconds * 1000,
      });
      return;
    }

    if (!this.redis || this.redis.status !== 'ready') {
      return;
    }
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }

  onModuleDestroy() {
    if (this.redis) {
      this.redis.disconnect();
    }
  }
}
