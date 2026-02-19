import { checkAdminTokenFn } from "@/actions/checkAdminTokenFn.functions";
import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { type Option } from "@repo/types";

interface adminDetails {
    pollId: string, 
    adminToken: string,
    question: string, 
    options: Option[],
    isActive: boolean
}

export default function adminPollQuery(pollId: string, adminToken: string){
    return queryOptions<adminDetails>({
        queryKey: ['adminPollQuery', pollId, adminToken],
        queryFn: async () => {
            const response = await checkAdminTokenFn({data: {pollId, adminToken}});
            if (!response.success){
                throw redirect({to: '/'})
            }
            return response.responseData
            
        },
    })
}