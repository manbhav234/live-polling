import { WebSocket } from "ws"
// import type { CreateMessageType, JoinMessageType, VoteMessageType } from "./incomingMessages.js";
// import { OutgoingMessageType, type OutgoingMessage } from "./outgoingMessages.js";
import crypto from 'crypto';


// class PollManager {
//     constructor(private polls: Map<string, Poll>){
//     }

//     findPoll(pollId: string, socket: WebSocket){
//         const isPoll = this.polls.get(pollId);
//         const messagePayload: OutgoingMessage = {
//             type: OutgoingMessageType.FOUND_POLL,
//             payload: {
//                 pollId,
//                 found: !!isPoll
//             }
//         }
//         socket.send(JSON.stringify(messagePayload));
//     }

//     joinPoll(data: JoinMessageType, socket: WebSocket){
//         const pollId = data.pollId;
//         const poll = this.polls.get(pollId);
//         if (!poll){
//             return;
//         }
//         if (poll.participants.find((user) => user.id == data.id)){
//             return;
//         }
//         poll.participants.push({id: data.id, socket});
//         const broadcastMessage: OutgoingMessage = {
//             type: OutgoingMessageType.NEW_VOTER,
//             payload: {
//                 id: data.id,
//                 pollId,
//                 totalParticipants: poll.participants.length
//             }
//         };
//         this.broadcast(poll.participants, broadcastMessage);
//     }

//     votePoll(data: VoteMessageType, socket: WebSocket){
//         const pollId = data.pollId;
//         const poll = this.polls.get(pollId);
//         if (!poll){
//             return;
//         }
//         if (!poll.participants.find((user) => user.id == data.id)){
//             return;
//         }
//         poll.options = poll.options.map((option) => (option.title === data.vote) ? {...option, votes: option.votes + 1} : option);
//         const broadcastMessage: OutgoingMessage = {
//             type: OutgoingMessageType.INC_VOTE,
//             payload: {
//                 pollId,
//                 optionTitle: data.vote,
//                 currentStatus: poll.options
//             }
//         };
//         this.broadcast(poll.participants, broadcastMessage );
//     }

//     private broadcast(participants: Participant[], broadcastMessage: OutgoingMessage){
//         participants.forEach((participant) => {
//             participant.socket.send(JSON.stringify(broadcastMessage));
//         })
//     }

// }

// const pollManager = new PollManager(new Map<string, Poll>);

// export { pollManager };