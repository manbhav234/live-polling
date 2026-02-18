import {type CreateMessageType, OutgoingMessageType, type OutgoingMessage, type JoinMessageType} from "@repo/types";
import { WebSocket } from "ws";

import client from "./index.js";
import { getNewPollId } from "./utils/generators.js";
import crypto from 'crypto';


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

  const broadcastPayload: OutgoingMessage = {
    type: OutgoingMessageType.CREATED,
    payload: {
      adminToken: adminToken,
      pollId,
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
  
  const isActive = JSON.parse(await client.hGet(`poll:${data.pollId}`, "isActive") as string);
  if (isActive){
    const pollOptions = await client.hGetAll(`votes:${data.pollId}`);
    const responseMessage: OutgoingMessage = {
      type: OutgoingMessageType.POLL_JOINED,
      payload: {
        isActive: true,
        options: Object.entries(pollOptions).map(([key, value]) => ({title: key, count: parseInt(value)}))
      }
    }
    socket.send(JSON.stringify(responseMessage));
    return;
  }
  const responseMessage: OutgoingMessage = {
      type: OutgoingMessageType.POLL_JOINED,
      payload: {
        isActive: false
      }
  }
  socket.send(JSON.stringify(responseMessage));
}