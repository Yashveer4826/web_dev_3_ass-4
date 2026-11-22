import {
  BookOpen,
  Camera,
  Code2,
  Coffee,
  Cpu,
  Dumbbell,
  Film,
  Gamepad2,
  Music2,
  Palette,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { RoomCategory, RoomIconKey } from "@/types/chat";

export const ROOM_ICONS: Record<RoomIconKey, LucideIcon> = {
  gamepad: Gamepad2,
  cpu: Cpu,
  music: Music2,
  book: BookOpen,
  sparkles: Sparkles,
  coffee: Coffee,
  palette: Palette,
  code: Code2,
  film: Film,
  rocket: Rocket,
  camera: Camera,
  dumbbell: Dumbbell,
};

export const ROOM_ICON_KEYS = Object.keys(ROOM_ICONS) as RoomIconKey[];

export const ROOM_CATEGORIES: RoomCategory[] = [
  "Gaming",
  "Technology",
  "Music",
  "Study",
  "Anime",
  "Lifestyle",
  "Art",
  "Movies",
  "Fitness",
];
