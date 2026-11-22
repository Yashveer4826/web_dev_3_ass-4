import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BACKGROUND_POOL,
  CURRENT_USER_ID,
  FRIENDS,
  INITIAL_JOINED_ROOM_IDS,
  INITIAL_MESSAGES,
  INITIAL_UNREAD,
  ROOMS,
  USERS,
} from "@/data/mock";
import { chatService, newId } from "@/services/chat-service";
import { slugify } from "@/lib/chat-utils";
import type { Friend, Message, Room, RoomCategory, RoomIconKey, Tone, User, UserStatus } from "@/types/chat";

export interface CreateRoomInput {
  name: string;
  description: string;
  category: RoomCategory;
  isPrivate: boolean;
  icon: RoomIconKey;
  tone: Tone;
}

interface ChatStore {
  me: User;
  users: Record<string, User>;
  rooms: Room[];
  joinedIds: string[];
  messages: Record<string, Message[]>;
  unread: Record<string, number>;
  typing: Record<string, string[]>;
  friends: Friend[];
  mutedIds: string[];
  signedOut: boolean;

  // UI state
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  createRoomOpen: boolean;
  profileOpen: boolean;
  membersPanelOpen: boolean;

  setSidebarCollapsed: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
  setCreateRoomOpen: (v: boolean) => void;
  setProfileOpen: (v: boolean) => void;
  setMembersPanelOpen: (v: boolean) => void;

  // Actions
  setActiveRoom: (roomId: string | null) => void;
  sendMessage: (roomId: string, text: string, replyToId?: string) => void;
  toggleReaction: (roomId: string, messageId: string, emoji: string) => void;
  createRoom: (input: CreateRoomInput) => Room;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  toggleMute: (roomId: string) => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "bio" | "status" | "tone">>) => void;
  acceptFriend: (userId: string) => void;
  declineFriend: (userId: string) => void;
  signOut: () => void;
  signIn: () => void;
}

const ChatContext = createContext<ChatStore | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<Record<string, User>>(() =>
    Object.fromEntries(USERS.map((u) => [u.id, u])),
  );
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [joinedIds, setJoinedIds] = useState<string[]>(INITIAL_JOINED_ROOM_IDS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [unread, setUnread] = useState<Record<string, number>>(INITIAL_UNREAD);
  const [typing, setTyping] = useState<Record<string, string[]>>({});
  const [friends, setFriends] = useState<Friend[]>(FRIENDS);
  const [mutedIds, setMutedIds] = useState<string[]>([]);
  const [signedOut, setSignedOut] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [membersPanelOpen, setMembersPanelOpen] = useState(true);

  const activeRoomRef = useRef<string | null>(null);
  const joinedRef = useRef(joinedIds);
  joinedRef.current = joinedIds;
  const roomsRef = useRef(rooms);
  roomsRef.current = rooms;

  const appendMessage = useCallback((msg: Message) => {
    setMessages((prev) => ({ ...prev, [msg.roomId]: [...(prev[msg.roomId] ?? []), msg] }));
  }, []);

  // Live events from the transport (mock now, Socket.IO later).
  useEffect(() => {
    return chatService.subscribe((event) => {
      if (event.type === "message") {
        appendMessage(event.message);
        if (event.message.roomId !== activeRoomRef.current) {
          setUnread((u) => ({ ...u, [event.message.roomId]: (u[event.message.roomId] ?? 0) + 1 }));
        }
      } else if (event.type === "typing") {
        setTyping((t) => {
          const list = t[event.roomId] ?? [];
          return list.includes(event.userId) ? t : { ...t, [event.roomId]: [...list, event.userId] };
        });
      } else {
        setTyping((t) => ({ ...t, [event.roomId]: (t[event.roomId] ?? []).filter((id) => id !== event.userId) }));
      }
    });
  }, [appendMessage]);

  // Ambient activity: occasionally someone posts in a room you're not looking at.
  useEffect(() => {
    const interval = setInterval(() => {
      const candidates = joinedRef.current.filter((id) => id !== activeRoomRef.current);
      const roomId = candidates[Math.floor(Math.random() * candidates.length)];
      const room = roomsRef.current.find((r) => r.id === roomId);
      if (!room) return;
      const others = room.memberIds.filter((id) => id !== CURRENT_USER_ID);
      const userId = others[Math.floor(Math.random() * others.length)];
      const text = BACKGROUND_POOL[Math.floor(Math.random() * BACKGROUND_POOL.length)];
      if (!userId || !text) return;
      appendMessage({ id: newId(), roomId: room.id, userId, text, createdAt: Date.now(), reactions: {} });
      setUnread((u) => ({ ...u, [room.id]: (u[room.id] ?? 0) + 1 }));
    }, 28_000);
    return () => clearInterval(interval);
  }, [appendMessage]);

  const setActiveRoom = useCallback((roomId: string | null) => {
    activeRoomRef.current = roomId;
    if (roomId) {
      setUnread((u) => (u[roomId] ? { ...u, [roomId]: 0 } : u));
      chatService.joinRoom(roomId);
    }
  }, []);

  const sendMessage = useCallback(
    (roomId: string, text: string, replyToId?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const msg: Message = {
        id: newId(),
        roomId,
        userId: CURRENT_USER_ID,
        text: trimmed,
        createdAt: Date.now(),
        reactions: {},
        ...(replyToId ? { replyToId } : {}),
      };
      appendMessage(msg);
      const room = roomsRef.current.find((r) => r.id === roomId);
      chatService.sendMessage(msg, room?.memberIds ?? []);
    },
    [appendMessage],
  );

  const toggleReaction = useCallback((roomId: string, messageId: string, emoji: string) => {
    setMessages((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] ?? []).map((m) => {
        if (m.id !== messageId) return m;
        const list = m.reactions[emoji] ?? [];
        const next = list.includes(CURRENT_USER_ID)
          ? list.filter((id) => id !== CURRENT_USER_ID)
          : [...list, CURRENT_USER_ID];
        const reactions = { ...m.reactions };
        if (next.length) reactions[emoji] = next;
        else delete reactions[emoji];
        return { ...m, reactions };
      }),
    }));
  }, []);

  const createRoom = useCallback(
    (input: CreateRoomInput): Room => {
      const base = slugify(input.name);
      const exists = roomsRef.current.some((r) => r.id === base);
      const room: Room = {
        id: exists ? `${base}-${Date.now().toString(36).slice(-4)}` : base,
        name: input.name.trim(),
        description: input.description.trim() || "A brand new room. Say hi!",
        category: input.category,
        icon: input.icon,
        tone: input.tone,
        isPrivate: input.isPrivate,
        ownerId: CURRENT_USER_ID,
        memberIds: [CURRENT_USER_ID],
        memberCount: 1,
        tags: [input.category, input.isPrivate ? "Private" : "Public"],
      };
      setRooms((r) => [room, ...r]);
      setJoinedIds((j) => [room.id, ...j]);
      setMessages((m) => ({ ...m, [room.id]: [] }));
      return room;
    },
    [],
  );

  const joinRoom = useCallback((roomId: string) => {
    setJoinedIds((j) => (j.includes(roomId) ? j : [...j, roomId]));
    setRooms((rs) =>
      rs.map((r) =>
        r.id === roomId && !r.memberIds.includes(CURRENT_USER_ID)
          ? { ...r, memberIds: [CURRENT_USER_ID, ...r.memberIds], memberCount: r.memberCount + 1 }
          : r,
      ),
    );
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    setJoinedIds((j) => j.filter((id) => id !== roomId));
    setRooms((rs) =>
      rs.map((r) =>
        r.id === roomId
          ? { ...r, memberIds: r.memberIds.filter((id) => id !== CURRENT_USER_ID), memberCount: Math.max(0, r.memberCount - 1) }
          : r,
      ),
    );
  }, []);

  const toggleMute = useCallback((roomId: string) => {
    setMutedIds((m) => (m.includes(roomId) ? m.filter((id) => id !== roomId) : [...m, roomId]));
  }, []);

  const updateProfile = useCallback((patch: Partial<Pick<User, "name" | "bio" | "status" | "tone">>) => {
    setUsers((u) => {
      const me = u[CURRENT_USER_ID];
      if (!me) return u;
      return { ...u, [CURRENT_USER_ID]: { ...me, ...patch } };
    });
  }, []);

  const acceptFriend = useCallback((userId: string) => {
    setFriends((f) => f.map((x) => (x.userId === userId ? { ...x, pending: false, since: "Just now" } : x)));
  }, []);

  const declineFriend = useCallback((userId: string) => {
    setFriends((f) => f.filter((x) => x.userId !== userId));
  }, []);

  const me = users[CURRENT_USER_ID] as User;

  const value = useMemo<ChatStore>(
    () => ({
      me,
      users,
      rooms,
      joinedIds,
      messages,
      unread,
      typing,
      friends,
      mutedIds,
      signedOut,
      sidebarCollapsed,
      mobileNavOpen,
      createRoomOpen,
      profileOpen,
      membersPanelOpen,
      setSidebarCollapsed,
      setMobileNavOpen,
      setCreateRoomOpen,
      setProfileOpen,
      setMembersPanelOpen,
      setActiveRoom,
      sendMessage,
      toggleReaction,
      createRoom,
      joinRoom,
      leaveRoom,
      toggleMute,
      updateProfile,
      acceptFriend,
      declineFriend,
      signOut: () => setSignedOut(true),
      signIn: () => setSignedOut(false),
    }),
    [me, users, rooms, joinedIds, messages, unread, typing, friends, mutedIds, signedOut, sidebarCollapsed, mobileNavOpen, createRoomOpen, profileOpen, membersPanelOpen, setActiveRoom, sendMessage, toggleReaction, createRoom, joinRoom, leaveRoom, toggleMute, updateProfile, acceptFriend, declineFriend],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatStore {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}

export function useJoinedRooms(): Room[] {
  const { rooms, joinedIds } = useChat();
  return useMemo(
    () => joinedIds.map((id) => rooms.find((r) => r.id === id)).filter((r): r is Room => Boolean(r)),
    [rooms, joinedIds],
  );
}

export type { UserStatus };
