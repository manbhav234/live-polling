import { usePollState } from "@/store/pollState";
import { type CreatedMessageType } from "@repo/types";
import { queryClient } from "../createQueryClient";

const pollCreatedHandler = (data: CreatedMessageType) => {
  queryClient.setQueryData(['adminPollQuery', data.pollId, data.adminToken],  {
      pollId: data.pollId,
      adminToken: data.adminToken,
      question: data.question, 
      options: data.options,
      isActive: data.isActive
  })
  const onSuccess = usePollState.getState().createPollCallback;
  if (onSuccess) {
    onSuccess(data.adminToken, data.pollId);
    usePollState.setState({ createPollCallback: null });
  }

};

export default pollCreatedHandler;
