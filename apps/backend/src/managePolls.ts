import {type CreateMessageType, OutgoingMessageType, type OutgoingMessage, type JoinMessageType, type StartPollMessageType, type Option} from "@repo/types";
import { WebSocket } from "ws";

import client from "./index.js";
import { getNewPollId } from "./utils/generators.js";
import crypto from 'crypto';

const connectedSockets = new Map<string, Set<WebSocket>>();

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
    [data.id]: JSON.stringify({
      hasVoted: "false"
    })
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