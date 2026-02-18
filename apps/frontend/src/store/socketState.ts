import { create } from "zustand";
import pollCreatedHandler from "@/lib/messageHandlers/pollCreated";
import pollJoinedHandler from "@/lib/messageHandlers/pollJoinedHandler";

import {
  type OutgoingMessage,
  OutgoingMessageType,
} from "@repo/types";


export type SocketStateType = {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: () => Promise<void>;
};

export const useSocketState = create<SocketStateType>((set, get) => ({
  socket: null,
  isConnected: false,
  connect: () => {
    return new Promise<void>((resolve, reject) => {
      if (get().socket) {
        resolve();
      }
      const ws = new WebSocket("ws://localhost:8080");
      ws.onopen = () => {
        console.log("connected");
        set({ isConnected: true });
        set({ socket: ws });
        resolve();
      };
      ws.onclose = () => {
        console.log("Disconnected");
        set({ isConnected: false, socket: null });
      };

      ws.onmessage = (event) => {
        try {
          if (event.data == "Connected") {
            return;
          }
          const parsedData: OutgoingMessage = JSON.parse(event.data);
          switch (parsedData.type) {
            case OutgoingMessageType.CREATED:
              console.log("created message recieved");
              console.log(parsedData.payload);
              pollCreatedHandler(parsedData.payload);
              break;
            
            case OutgoingMessageType.POLL_JOINED:
              console.log("joined messaged recieved");
              console.log(parsedData.payload);
              pollJoinedHandler(parsedData.payload);
              break;

          }
        } catch (e) {
          console.log("Error: ", e);
        }
      };
    });
  },
}));
