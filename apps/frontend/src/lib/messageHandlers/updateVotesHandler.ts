import { type VotesMessageType } from "@repo/types";
import { queryClient } from "../createQueryClient";

const updateVotesHandler = (data: VotesMessageType) => {
  console.log("reached here")
  queryClient.setQueriesData({queryKey: [`adminPollQuery`, data.pollId]}, (oldData) => {
    if (!oldData)return;
    return {
      ...oldData, options: data.options
    }
  })
  queryClient.setQueriesData({queryKey: [`userPollQuery`, data.pollId]}, (oldData) => {
    if (!oldData)return;
    return {
      ...oldData, options: data.options
    }
  })
};

export default updateVotesHandler;