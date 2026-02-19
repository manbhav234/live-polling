import { queryOptions } from "@tanstack/react-query";
import { checkUserVoteStatusFn } from "@/actions/checkUserVoteStatusFn.functions";
import { redirect } from "@tanstack/react-router";

export interface userVotingStatus {
    pollId: string, 
    userId: string,
    hasVoted: boolean
}

export default function userVoteStatusQuery(pollId: string, userId: string){
    return queryOptions<userVotingStatus>({
        queryKey: ['userVoteStatusQuery', pollId, userId],
        queryFn: async () => {
            try {
                const response = await checkUserVoteStatusFn({data: {pollId, userId}});
                return response;
            }catch(e){
                throw redirect({to: '/'})
            }
        },
    })
}