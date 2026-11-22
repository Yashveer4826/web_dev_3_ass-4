/**
 * Chat transport layer.
 *
 * The UI only talks to this interface. Today it is backed by a mock that simulates
 * other people typing and replying. To connect the professor's Socket.IO backend,
 * implement the same interface with socket.io-client, e.g.:
 *
 *   const socket = io(import.meta.env.VITE_SOCKET_URL);
 *   joinRoom:     (roomId)  => socket.emit("joinRoom", roomId)
 *   sendMessage:  (msg)     => socket.emit("chatMessage", msg)
 *   setTyping:    (r, on)   => socket.emit(on ? "typing" : "stopTyping", r)
 *   subscribe:    (handler) => { socket.on("message", m => handler({ type: "message", message: m })); ... }
 *
 * and export it as `chatService` instead of `createMockChatService()`.
 */
import { REPLY_POOL, USERS, CURRENT_USER_ID } from "@/data/mock";
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
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

function pick<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

function contextualReply(text: string): string {
  const t = text.toLowerCase();
  if (/\b(hi|hey|hello|yo|sup)\b/.test(t)) return pick(["Hey Kapil! 👋", "Yo! What's up?", "Heyy, welcome back"]) ?? "Hey!";
  if (t.includes("?")) return pick(["Good question 🤔 I think yes?", "Not sure, but I'd love to find out", "Honestly depends — what do you think?"]) ?? "Hmm";
  if (/(thanks|thank you|ty)\b/.test(t)) return "Anytime 🙌";
  return pick(REPLY_POOL) ?? "Nice!";
}

export function createMockChatService(): ChatService {
  const handlers = new Set<(event: ChatEvent) => void>();
  const emit = (e: ChatEvent) => handlers.forEach((h) => h(e));

  return {
    joinRoom() {
      /* no-op in mock mode */
    },
    setTyping() {
      /* the mock server ignores our own typing state */
    },
    sendMessage(message, roomMemberIds) {
      const candidates = roomMemberIds.filter((id) => {
        if (id === CURRENT_USER_ID) return false;
        const u = USERS.find((x) => x.id === id);
        return u && u.status !== "offline";
      });
      const responderId = pick(candidates);
      if (!responderId) return;

      const startDelay = 500 + Math.random() * 700;
      const typingDuration = 1400 + Math.random() * 1400;
      setTimeout(() => {
        emit({ type: "typing", roomId: message.roomId, userId: responderId });
        setTimeout(() => {
          emit({ type: "stop-typing", roomId: message.roomId, userId: responderId });
          emit({
            type: "message",
            message: {
              id: newId(),
              roomId: message.roomId,
              userId: responderId,
              text: contextualReply(message.text),
              createdAt: Date.now(),
              reactions: {},
            },
          });
        }, typingDuration);
      }, startDelay);
    },
    subscribe(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
  };
}

export const chatService: ChatService = createMockChatService();
