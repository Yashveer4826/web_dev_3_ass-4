export type Tone = "violet" | "indigo" | "cyan" | "pink" | "amber" | "emerald" | "rose" | "sky";

export type UserStatus = "online" | "away" | "busy" | "offline";

export type RoomIconKey =
  | "gamepad"
  | "cpu"
  | "music"
  | "book"
  | "sparkles"
  | "coffee"
  | "palette"
  | "code"
  | "film"
  | "rocket"
  | "camera"
  | "dumbbell";

export type RoomCategory =
  | "Gaming"
  | "Technology"
  | "Music"
  | "Study"
  | "Anime"
  | "Lifestyle"
  | "Art"
  | "Movies"
  | "Fitness";

export interface User {
  id: string;
  name: string;
  handle: string;
  tone: Tone;
  status: UserStatus;
  bio: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  category: RoomCategory;
  icon: RoomIconKey;
  tone: Tone;
  isPrivate: boolean;
  ownerId: string;
  memberIds: string[];
  /** Total member count shown on discovery cards (includes people not in memberIds). */
  memberCount: number;
  featured?: boolean;
  tags: string[];
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  text: string;
  /** Epoch milliseconds */
  createdAt: number;
  /** emoji -> list of userIds who reacted */
  reactions: Record<string, string[]>;
  replyToId?: string;
}

export interface Friend {
  userId: string;
  since: string;
  mutualRooms: number;
  pending?: boolean;
}
