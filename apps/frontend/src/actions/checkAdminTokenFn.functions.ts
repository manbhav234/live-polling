import { createServerFn } from "@tanstack/react-start";
import connectRedis from "./connectRedisServerOnly.functions";
import {z} from 'zod';
import {type Poll, type Option} from '@repo/types'

const CheckAdminType = z.object({
    adminToken: z.uuid()
})
export const checkAdminTokenFn = createServerFn().inputValidator((data: unknown) => CheckAdminType.parse(data)).handler(async ({data}) => {

    console.log("inside checkAdminTokenFn");

    const redis = await connectRedis();
    const adminToken = data.adminToken;   
    const pollKey = await redis.hGet('adminDetails', adminToken);
    console.log(pollKey);
    if (!pollKey){
        return ({
            success: false,
            message: "Invalid Admin Token. No Poll Exists for this Token",
            responseData: null
        })
    }
    const pollId = pollKey.slice(5);
    const pollDetails = Object(await redis.hGetAll(`poll:${pollId}`));
    const question = pollDetails.question;
    const pollOptions: Option[] = (JSON.parse(pollDetails.options) as {title: string}[]).map((option) => ({...option, count: 0}));
    return ({
        success: true, 
        message: "Successfully fetched poll details",
        responseData: {pollId: pollId, question: question,  options: pollOptions}
    })
})