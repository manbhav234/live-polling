import { createServerFn } from "@tanstack/react-start";
import {z} from 'zod';
import connectRedis from "./connectRedisServerOnly.functions";
import {type Option} from '@repo/types'

const CheckUserAndPoll = z.object({
    pollId: z.string().length(6),
    userId: z.uuid()
})


export const checkUserAndPollStatus = createServerFn().inputValidator((data) => CheckUserAndPoll.parse(data)).handler(async ({data}) => {
    const redis = await connectRedis();
    const findUser = await redis.hExists(`voters:${data.pollId}`, data.userId);

    if (findUser){

            const pollDetails = Object(await redis.hGetAll(`poll:${data.pollId}`));
            const question = pollDetails.question;
            const pollOptions: Option[] = (JSON.parse(pollDetails.options) as {title: string}[]).map((option) => ({...option, count: 0}));
        return {
            success: true,
            message: "Found the user",
            responseData: {
                pollId: data.pollId,
                question: question,
                options: pollOptions
            }
        }
    }
    return {
        success: false,
        message: "No such user exists"
    }

})