import { createServerFn } from "@tanstack/react-start";
import {z} from 'zod'
import connectRedis from "./connectRedisServerOnly.functions";
import crypto from 'crypto';

const HandleUserJoin = z.object({
    pollId: z.string().length(6)
})


export const handleUserJoinFn = createServerFn().inputValidator((data: unknown) => HandleUserJoin.parse(data)).handler(async ({data}) => {
    const redis = await connectRedis();
    const pollId = data.pollId;
    const pollExists = await redis.exists(`poll:${pollId}`);

    if (pollExists){
        return {
            isExisting: true,
            userId: crypto.randomUUID()
        }
    }

    return {
        isExisting: false
    }

})