import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { type Option } from "@repo/types";
import { checkUserTokenFn } from "@/actions/checkUserTokenFn.functions";

export interface userDetails {
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
            try {
                const response = await checkUserTokenFn({data: {pollId, userId}});
                return response.responseData
            }catch(e){
                throw redirect({to: '/'})
            }
        },
    })
}