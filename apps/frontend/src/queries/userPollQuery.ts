import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { type Option } from "@repo/types";
import { checkUserTokenFn } from "@/actions/checkUserTokenFn.functions";

interface userDetails {
    pollId: string, 
    userId: string,
    question: string, 
    options: Option[],
    isActive: boolean
}

export default function userPollQuery(pollId: string, userId: string){
    return queryOptions<userDetails>({
        queryKey: ['userPollQuery', pollId, userId],
        queryFn: async () => {
            const response = await checkUserTokenFn({data: {pollId, userId}});
            if (!response.success){
                throw redirect({to: '/'})
            }
            return response.responseData
            
        },
    })
}