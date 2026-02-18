import { createServerOnlyFn } from '@tanstack/react-start';
import { createClient, type RedisClientType } from 'redis';

const redis: RedisClientType = createClient({
    url: "redis://localhost:6379",
});

redis.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = createServerOnlyFn(async () => {
    if (!redis.isOpen) {
        await redis.connect();
    }
    return redis;
})

export default connectRedis;