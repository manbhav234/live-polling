import { usePollState } from "@/store/pollState";
import { Button } from "./ui/button";
import { type adminDetails } from "@/queries/adminPollQuery";
import { type userDetails } from "@/queries/userPollQuery";
import { queryClient } from "@/lib/createQueryClient";

type DisplayChartProps = {
    token: string,
    isAdmin: boolean,
    data: adminDetails | userDetails,
    hasVoted: boolean
}


export default function DisplayChart({data, isAdmin, token, hasVoted} : DisplayChartProps) {

    const castVote = usePollState((state) => state.castVote);
    const handleVoteCast = (title: string) => {
        queryClient.setQueriesData({queryKey: ['userPollQuery', data.pollId]}, (oldData) => {
            if (!oldData)return;
            return {
                ...oldData, options: data.options.map((option) => option.title === title ? ({title: option.title, count: option.count + 1}) : option)
            }
        })
        queryClient.setQueriesData({queryKey: ['adminPollQuery', data.pollId]}, (oldData) => {
            if (!oldData)return;
            return {
                ...oldData, options: data.options.map((option) => option.title === title ? ({title: option.title, count: option.count + 1}) : option)
            }
        })
        castVote(data.pollId, token, title);
    }

    return (
        <>
        <div className="w-2/3 mx-auto h-[70%] grid grid-cols-3 justify-center items-center border-2 border-red-500">
            {data.options.map((option) => (
                <div className="flex justify-center items-center gap-4" key={option.title}>
                    <span className="text-white font-bold text-xl md:text-3xl">{option.title}</span>
                    <span className="text-white font-bold text-xl md:text-3xl">{option.count}</span>
                    {!isAdmin && !hasVoted && <Button disabled={!data.isActive} onClick={() => handleVoteCast(option.title)}>Vote</Button>}
                </div>    
            ))}
        </div>
        {hasVoted && <p className="text-center font-bold text-white text-2xl">Your Vote Has Been Casted</p>}
        </>
    )
}