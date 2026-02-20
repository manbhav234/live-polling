import { checkAdminTokenFn } from "@/actions/checkAdminTokenFn.functions";
import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { type Option } from "@repo/types";

export interface adminDetails {
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
            try {
                console.log("executing admin query function");
                const response = await checkAdminTokenFn({data: {pollId, adminToken}});
                return response.responseData;
            }catch(e){
                throw redirect({to: '/'})
            }

            
        },
    })
}