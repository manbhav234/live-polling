import { usePollState } from "@/store/pollState";
import { type PollJoinedMessageType } from "@repo/types";

const pollJoinedHandler = (data: PollJoinedMessageType) => {
  console.log("inside poll join handler on recieve")
  const onSuccess = usePollState.getState().joinPollCallback;
  usePollState.setState({isActive: data.isActive, options: data.options});
  if (onSuccess) {
    onSuccess();
    usePollState.setState({ joinPollCallback: null });
  }

};

export default pollJoinedHandler;
