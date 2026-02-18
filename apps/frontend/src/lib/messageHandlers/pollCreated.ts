import { usePollState } from "@/store/pollState";
import { type CreatedMessageType } from "@repo/types";

const pollCreatedHandler = (data: CreatedMessageType) => {
  console.log("inside poll created handler")
  const setPollCredentials = usePollState.getState().setPollCredentials;
  setPollCredentials(data.pollId, data.adminToken);
  const onSuccess = usePollState.getState().createPollCallback;
  if (onSuccess) {
    onSuccess(data.adminToken);
    usePollState.setState({ createPollCallback: null });
  }

};

export default pollCreatedHandler;
