import { createServerFn } from "@tanstack/react-start";
import connectRedis from "./connectRedisServerOnly.functions";
import {z} from 'zod';
import {type Option} from '@repo/types'

const CheckAdminType = z.object({
    adminToken: z.uuid()
})
export const checkAdminTokenFn = createServerFn().inputValidator((data: unknown) => CheckAdminType.parse(data)).handler(async ({data}) => {

    console.log("inside checkAdminTokenFn");

    const redis = await connectRedis();
    const adminToken = data.adminToken;   
    const pollKey = await redis.hGet('adminDetails', adminToken);
    console.log(pollKey);
    if (pollKey){
         const pollId = pollKey.slice(5);
        const pollDetails = Object(await redis.hGetAll(`poll:${pollId}`));
        const question = pollDetails.question;
        const pollOptions: Option[] = (JSON.parse(pollDetails.options) as {title: string}[]).map((option) => ({...option, count: 0}));
        console.log("reaching the final stage")
        return ({
            success: true, 
            message: "Successfully fetched poll details",
            responseData: {pollId: pollId, adminToken: adminToken, question: question,  options: pollOptions, isActive: JSON.parse(pollDetails.isActive)}
        })
    }
    throw new Error("Invalid Admin Token. No Poll Exists for this Token");
})