import { createServerFn } from "@tanstack/react-start";
import {z} from 'zod';
import connectRedis from "./connectRedisServerOnly.functions";

const CheckUserAndPoll = z.object({
    pollId: z.string().length(6),
    userId: z.uuid()
})


export const checkUserVoteStatusFn = createServerFn().inputValidator((data) => CheckUserAndPoll.parse(data)).handler(async ({data}) => {
    const redis = await connectRedis();
    try {
        const hasVoted = JSON.parse(await redis.hGet(`voters:${data.pollId}`, data.userId) as string);
        return {
            pollId: data.pollId,
            userId: data.userId,
            hasVoted: hasVoted
        }
    } catch (e){
        throw new Error("Error while fetching user vote status");
    }
})