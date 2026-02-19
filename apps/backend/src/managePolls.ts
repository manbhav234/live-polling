import {type CreateMessageType, OutgoingMessageType, type OutgoingMessage, type JoinMessageType, type StartPollMessageType, type Option, type IncrementVoteMessageType} from "@repo/types";
import { WebSocket } from "ws";

import client from "./index.js";
import { getNewPollId } from "./utils/generators.js";
import crypto from 'crypto';

const connectedSockets = new Map<string, Set<WebSocket>>();

setInterval(() => {
  connectedSockets.forEach(async (value: Set<WebSocket>, key: string) => {
    const pollOptions = await client.hGetAll(`votes:${key}`);
    const options = Object.entries(pollOptions).map(([key, value]) => ({title: key, count: parseInt(value)}))
    value.forEach((socket: WebSocket) => {
      const responseMessage: OutgoingMessage = {
        type: OutgoingMessageType.INC_VOTE,
        payload: {
          pollId: key,
          options: options
        }
      }
      socket.send(JSON.stringify(responseMessage));
    })
  })
}, 400)


export const createPoll = async (data: CreateMessageType, socket: WebSocket) => {
  let pollId: string;
  do {
    pollId = getNewPollId();
  } while (await client.exists(`poll:${pollId}`));

  const adminToken = crypto.randomUUID();
  const pollDetails = {
    isActive: "false",
    adminToken: adminToken,
    question: data.question,
    options: JSON.stringify(data.options),
  }
  
  const pollOptions = Object.fromEntries(data.options.map((option) => [option.title, "0"]));
 
  await Promise.all([
    client.hSet("adminDetails", {
      [`${adminToken}`]: `poll:${pollId}`
    }),
    client.hSet(`poll:${pollId}`, pollDetails),
    client.hSet(`votes:${pollId}`, pollOptions)
  ]);

  connectedSockets.set(`${pollId}`, new Set<WebSocket>().add(socket));

  const broadcastPayload: OutgoingMessage = {
    type: OutgoingMessageType.CREATED,
    payload: {
      adminToken: adminToken,
      pollId,
      isActive: false,
      question: data.question,
      options: data.options.map((option) => ({title: option.title, count: 0}))
    },
  };

  socket.send(JSON.stringify(broadcastPayload));
};


export const joinPoll = async (data: JoinMessageType, socket: WebSocket) => {
  console.log("reached join backend handler")
  await client.hSet(`voters:${data.pollId}`, {
    [data.id]: "false"
  })

  const pollSet = connectedSockets.get(`${data.pollId}`);
  pollSet?.add(socket);
  
  const pollDetails = Object(await client.hGetAll(`poll:${data.pollId}`));

  const pollOptions = await client.hGetAll(`votes:${data.pollId}`);
  const responseMessage: OutgoingMessage = {
      type: OutgoingMessageType.POLL_JOINED,
      payload: {
        isActive: JSON.parse(pollDetails.isActive),
        pollId: data.pollId,
        userId: data.id,
        question: pollDetails.question,
        options: Object.entries(pollOptions).map(([key, value]) => ({title: key, count: parseInt(value)}))
      }
  }
  socket.send(JSON.stringify(responseMessage));
}


export const startPoll = async (data: StartPollMessageType, socket: WebSocket) => {
  //TODO: implement proper error handling in place of simple return
  const adminPollId = await client.hGet('adminDetails', `${data.adminToken}`);
  if (!adminPollId){
    return;
  }
  if (adminPollId.slice(5) !== data.pollId){
    return;
  }

  const response = await Promise.all([client.hSet(`poll:${data.pollId}`, "isActive", "true"), client.hGetAll(`votes:${data.pollId}`)]);
  const pollOptions: Option[] = Object.entries(response[1]).map(([key, value]) => ({title: key, count: parseInt(value)}));
  const broadcastList = connectedSockets.get(`${data.pollId}`);
  broadcastList?.forEach((socket) => {
    const responseMessage: OutgoingMessage = {
      type: OutgoingMessageType.POLL_STARTED,
      payload: {
        pollId: data.pollId,
        isActive: true, 
        options: pollOptions
      }
    } 
    socket.send(JSON.stringify(responseMessage))
  })

} 


export const castVote = async(data: IncrementVoteMessageType, socket: WebSocket) => {

  const response = await Promise.all([client.hIncrBy(`votes:${data.pollId}`, data.option, 1), client.hSet(`voters:${data.pollId}`, data.userId, "true")]);
  const votingStatus = JSON.parse(await client.hGet(`voters:${data.pollId}`, data.userId) as string);

  const responseMessage: OutgoingMessage = {
    type: OutgoingMessageType.VOTE_CASTED,
    payload: {
        pollId: data.pollId, 
        userId: data.userId, 
        hasVoted: votingStatus
    }
  } 

  socket.send(JSON.stringify(responseMessage));

}