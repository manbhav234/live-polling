import { VoteCasted } from "@repo/types";
import { queryClient } from "../createQueryClient";

const voteCastedHandler = (data: VoteCasted) => {
  console.log("reached here")
  queryClient.setQueryData([`userVoteStatusQuery`, data.pollId, data.userId], (oldData) => {
    if (!oldData)return;
    return {
      ...oldData, hasVoted: data.hasVoted
    }
  })
};

export default voteCastedHandler;