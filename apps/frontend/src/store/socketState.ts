import { create } from "zustand";
import pollCreatedHandler from "@/lib/messageHandlers/pollCreatedHandler";
import pollJoinedHandler from "@/lib/messageHandlers/pollJoinedHandler";
import pollStartHandler from "@/lib/messageHandlers/pollStartHandler";

import {
  type OutgoingMessage,
  OutgoingMessageType,
} from "@repo/types";


export type SocketStateType = {
  socket: WebSocket | null;
  isConnected: boolean;
  disconnect: () => void;
  connect: () => Promise<void>;
};

export const useSocketState = create<SocketStateType>((set, get) => ({
  socket: null,
  isConnected: false,
  connect: () => {
    return new Promise<void>((resolve) => {
      console.log("inside connect");
      const currSocket = get().socket;
      if (currSocket && (currSocket.readyState === WebSocket.OPEN )|| (currSocket?.readyState === WebSocket.CONNECTING)) {
        resolve();
        return;
      }
      const ws = new WebSocket("ws://localhost:8080");
      set({ socket: ws });
      ws.onopen = () => {
        console.log("connected");
        set({ isConnected: true });
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
              pollCreatedHandler(parsedData.payload);
              break;
            
            case OutgoingMessageType.POLL_JOINED:
              pollJoinedHandler(parsedData.payload);
              break;

            case OutgoingMessageType.POLL_STARTED:
              pollStartHandler(parsedData.payload)
              break;
          }
        } catch (e) {
          console.log("Error: ", e);
        }
      };
      
    });
  },
  disconnect: () => {
    const socket = get().socket;
    socket?.close();
    set({ socket: null, isConnected: false });
  },
}));
