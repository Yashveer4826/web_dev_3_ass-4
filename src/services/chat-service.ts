
import { io } from "socket.io-client";
import type { Message } from "@/types/chat";

export type ChatEvent =
  | { type: "message"; message: Message }
  | { type: "typing"; roomId: string; userId: string }
  | { type: "stop-typing"; roomId: string; userId: string };

export interface ChatService {
  joinRoom(roomId: string): void;
  sendMessage(message: Message, roomMemberIds: string[]): void;
  setTyping(roomId: string, isTyping: boolean): void;
  subscribe(handler: (event: ChatEvent) => void): () => void;
}

let idCounter = 0;

export function newId(prefix = "m"): string {
  idCounter++;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

// Connect to backend Socket.IO server
const socket = io("http://localhost:8080");

socket.on("connect", () => {
  console.log("Connected to VibeRooms backend:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Backend connection error:", error.message);
});

export const chatService: ChatService = {
  joinRoom(_roomId) {
    // Current backend does not support room joining yet
  },

  sendMessage(message, _roomMemberIds) {
    socket.emit("chatMessage", message);
  },

  setTyping(_roomId, _isTyping) {
    // Typing events are not supported by the current backend
  },

  subscribe(handler) {
    const onMessage = (message: Message) => {
      handler({ type: "message", message });
    };

    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
    };
  },
};
