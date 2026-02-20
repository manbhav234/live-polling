import { WebSocketServer } from 'ws';
import { IncomingMessageType, type IncomingMessage, OutgoingMessageType, type OutgoingMessage } from '@repo/types';
import { createPoll, joinPoll, startPoll, castVote } from './managePolls.js';
import { createClient, type RedisClientType } from 'redis';
import {type WebSocket as WebSocketInterface} from 'ws';

const client: RedisClientType = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();
const subscriber = client.duplicate();
await subscriber.connect();

export const connectedSockets = new Map<string, Set<WebSocketInterface>>();

export interface NotiMessageType {
  pollId: string,
  messageType: "VOTE" | "START"
}

subscriber.subscribe("POLL_UPDATES", async (message) => {
  const { pollId, messageType }: NotiMessageType = JSON.parse(message);
  const sockets = connectedSockets.get(pollId);
  console.log("reached inside poll updater: ", pollId, messageType);
  if (!sockets || sockets.size === 0){
    return;
  }
  const [pollOptions, pollData] = await Promise.all([
    client.hGetAll(`votes:${pollId}`),
    client.hGetAll(`poll:${pollId}`)
  ]);
  console.log("number of sockets: ", sockets.size);
  const options = Object.entries(pollOptions).map(([title, count]) => ({title,count: parseInt(count)}));

  if (messageType == 'VOTE'){
    console.log("sending vote increment message")
    const broadcastMessage: OutgoingMessage = {
      type: OutgoingMessageType.INC_VOTE,
      payload: {
        pollId: pollId,
        options: options
      }
    };
    const payloadString = JSON.stringify(broadcastMessage);
    sockets.forEach(s => {
      if (s.readyState === WebSocket.OPEN) s.send(payloadString);
    });
  }

  if (messageType == "START"){
    const broadcastMessage: OutgoingMessage = {
      type: OutgoingMessageType.POLL_STARTED,
      payload: {
        pollId: pollId,
        options: options,
        isActive: JSON.parse(pollData.isActive as string)
      }
    }
    const payloadString = JSON.stringify(broadcastMessage);
    sockets.forEach(s => {
      if (s.readyState === WebSocket.OPEN) s.send(payloadString);
    });
  }
});


const wss = new WebSocketServer({port: 8080});

wss.on('connection', function connection(socket) {
  socket.on('error', console.error);
  socket.on('message', (data) => {
    const parsedData: IncomingMessage = JSON.parse(data.toString());
    switch(parsedData.type){
      case IncomingMessageType.CREATE:
        createPoll(parsedData.payload, socket);
        break;
      case IncomingMessageType.JOIN:
        joinPoll(parsedData.payload, socket);
        break;
      case IncomingMessageType.START_POLL:
        startPoll(parsedData.payload, socket);
        break;
      case IncomingMessageType.VOTE:
        castVote(parsedData.payload, socket);
    }
  });

  socket.on('close', () => {
    connectedSockets.forEach((socketSet: Set<WebSocketInterface>, pollId: string) => {
      const sockets = Array.from(socketSet);
      for (const socket of sockets){
        socketSet.delete(socket);
        if (socketSet.size === 0) {
          connectedSockets.delete(pollId);
        }
      }
    });
  });

  socket.send('Connected');
});

export default client;