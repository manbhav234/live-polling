import { type PollStartedMessageType } from "@repo/types";
import { queryClient } from "../createQueryClient";

const pollStartHandler = (data: PollStartedMessageType) => {
  console.log("reached here")
  queryClient.setQueriesData({queryKey: [`adminPollQuery`, data.pollId]}, (oldData) => {
    if (!oldData)return;
    return {
      ...oldData, isActive: data.isActive, options: data.options
    }
  })
  queryClient.setQueriesData({queryKey: [`userPollQuery`, data.pollId]}, (oldData) => {
    if (!oldData)return;
    return {
      ...oldData, isActive: data.isActive, options: data.options
    }
  })
};

export default pollStartHandler;
