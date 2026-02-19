import { usePollState } from "@/store/pollState";
import { type PollJoinedMessageType } from "@repo/types";
import { queryClient } from "../createQueryClient";

const pollJoinedHandler = (data: PollJoinedMessageType) => {
  const onSuccess = usePollState.getState().joinPollCallback;
  queryClient.setQueryData(['userPollQuery', data.pollId, data.userId], {
     isActive: data.isActive, options: data.options, question: data.question, pollId: data.pollId, userId: data.userId
  })
  console.log("reaching join handler on frontend")
  if (onSuccess) {
    onSuccess();
    usePollState.setState({ joinPollCallback: null });
  }

};

export default pollJoinedHandler;
