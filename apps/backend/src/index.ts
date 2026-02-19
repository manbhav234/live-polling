import { WebSocketServer } from 'ws';
import { IncomingMessageType, type IncomingMessage } from '@repo/types';
import { createPoll, joinPoll, startPoll, castVote } from './managePolls.js';
import { createClient, type RedisClientType } from 'redis';

const client: RedisClientType = createClient({
  url: "redis://localhost:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

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

  socket.send('Connected');
});

export default client;