import type { Friend, Message, Room, User } from "@/types/chat";

export const CURRENT_USER_ID = "u-kapil";

export const USERS: User[] = [
  { id: CURRENT_USER_ID, name: "Kapil", handle: "kapil", tone: "violet", status: "online", bio: "Building things on the internet. Lo-fi + late nights." },
  { id: "u-aanya", name: "Aanya Sharma", handle: "aanya", tone: "pink", status: "online", bio: "UI designer. Coffee is a personality." },
  { id: "u-rohan", name: "Rohan Mehta", handle: "rohanm", tone: "cyan", status: "online", bio: "Full-stack dev, mechanical keyboard enthusiast." },
  { id: "u-zara", name: "Zara Khan", handle: "zarak", tone: "amber", status: "away", bio: "Valorant main. Ranked grind never stops." },
  { id: "u-ishaan", name: "Ishaan Verma", handle: "ishaan", tone: "emerald", status: "online", bio: "CS undergrad. Exams are temporary, bugs are forever." },
  { id: "u-meera", name: "Meera Iyer", handle: "meera", tone: "sky", status: "busy", bio: "Carnatic vocals + indie playlists." },
  { id: "u-dev", name: "Dev Patel", handle: "devp", tone: "indigo", status: "online", bio: "Anime recs on demand." },
  { id: "u-sara", name: "Sara Thomas", handle: "sarat", tone: "rose", status: "offline", bio: "Plant mom. Book club host." },
  { id: "u-arjun", name: "Arjun Nair", handle: "arjun", tone: "amber", status: "online", bio: "Speedrunner and part-time philosopher." },
  { id: "u-nisha", name: "Nisha Rao", handle: "nisha", tone: "emerald", status: "offline", bio: "Studying for GATE. Send motivation." },
  { id: "u-kabir", name: "Kabir Singh", handle: "kabir", tone: "sky", status: "away", bio: "Guitarist. Writes songs nobody hears." },
  { id: "u-tara", name: "Tara Bose", handle: "tara", tone: "pink", status: "online", bio: "Digital illustrator, Ghibli forever." },
];

export const ROOMS: Room[] = [
  {
    id: "gaming-lounge",
    name: "Gaming Lounge",
    description: "Squad up, share clips and argue about the best loadout.",
    category: "Gaming",
    icon: "gamepad",
    tone: "violet",
    isPrivate: false,
    ownerId: "u-zara",
    memberIds: [CURRENT_USER_ID, "u-zara", "u-arjun", "u-rohan", "u-dev", "u-ishaan"],
    memberCount: 1284,
    featured: true,
    tags: ["Valorant", "Co-op", "Clips"],
  },
  {
    id: "tech-talk",
    name: "Tech Talk",
    description: "Frameworks, side projects and the occasional hot take.",
    category: "Technology",
    icon: "cpu",
    tone: "cyan",
    isPrivate: false,
    ownerId: CURRENT_USER_ID,
    memberIds: [CURRENT_USER_ID, "u-rohan", "u-aanya", "u-ishaan", "u-dev", "u-nisha", "u-sara"],
    memberCount: 932,
    featured: true,
    tags: ["React", "Web Dev", "AI"],
  },
  {
    id: "music-vibes",
    name: "Music Vibes",
    description: "Drop the track that's been on repeat all week.",
    category: "Music",
    icon: "music",
    tone: "pink",
    isPrivate: false,
    ownerId: "u-meera",
    memberIds: [CURRENT_USER_ID, "u-meera", "u-kabir", "u-aanya", "u-tara"],
    memberCount: 2140,
    featured: true,
    tags: ["Indie", "Lo-fi", "Playlists"],
  },
  {
    id: "study-hub",
    name: "Study Hub",
    description: "Pomodoro sessions, notes swaps and exam survival.",
    category: "Study",
    icon: "book",
    tone: "emerald",
    isPrivate: false,
    ownerId: "u-nisha",
    memberIds: [CURRENT_USER_ID, "u-nisha", "u-ishaan", "u-sara", "u-rohan"],
    memberCount: 761,
    tags: ["Pomodoro", "Exams", "Notes"],
  },
  {
    id: "anime-world",
    name: "Anime World",
    description: "Seasonal watch-alongs, manga spoilers (tagged!) and fan art.",
    category: "Anime",
    icon: "sparkles",
    tone: "rose",
    isPrivate: false,
    ownerId: "u-dev",
    memberIds: ["u-dev", "u-tara", "u-arjun", "u-zara"],
    memberCount: 3410,
    featured: true,
    tags: ["Seasonal", "Manga", "Fan art"],
  },
  {
    id: "chill-zone",
    name: "Chill Zone",
    description: "No agenda. Just good people and slow conversations.",
    category: "Lifestyle",
    icon: "coffee",
    tone: "amber",
    isPrivate: false,
    ownerId: "u-aanya",
    memberIds: ["u-aanya", "u-kabir", "u-sara", "u-meera"],
    memberCount: 580,
    tags: ["Hangout", "Late night"],
  },
  {
    id: "pixel-studio",
    name: "Pixel Studio",
    description: "Critique corner for illustrators, designers and doodlers.",
    category: "Art",
    icon: "palette",
    tone: "indigo",
    isPrivate: false,
    ownerId: "u-tara",
    memberIds: ["u-tara", "u-aanya"],
    memberCount: 412,
    tags: ["Design", "Feedback"],
  },
  {
    id: "cinephiles",
    name: "Cinephiles",
    description: "Weekly movie club. This week: Villeneuve marathon.",
    category: "Movies",
    icon: "film",
    tone: "sky",
    isPrivate: false,
    ownerId: "u-kabir",
    memberIds: ["u-kabir", "u-dev", "u-sara"],
    memberCount: 655,
    tags: ["Movie club", "Reviews"],
  },
];

export const INITIAL_JOINED_ROOM_IDS = ["gaming-lounge", "tech-talk", "music-vibes", "study-hub"];

export const INITIAL_UNREAD: Record<string, number> = {
  "gaming-lounge": 3,
  "music-vibes": 12,
  "study-hub": 1,
};

export const FRIENDS: Friend[] = [
  { userId: "u-aanya", since: "Mar 2025", mutualRooms: 3 },
  { userId: "u-rohan", since: "Jan 2025", mutualRooms: 4 },
  { userId: "u-zara", since: "Aug 2025", mutualRooms: 1 },
  { userId: "u-ishaan", since: "Sep 2024", mutualRooms: 3 },
  { userId: "u-meera", since: "Jun 2025", mutualRooms: 1 },
  { userId: "u-dev", since: "Feb 2026", mutualRooms: 2 },
  { userId: "u-sara", since: "Nov 2024", mutualRooms: 2 },
  { userId: "u-tara", since: "", mutualRooms: 1, pending: true },
  { userId: "u-kabir", since: "", mutualRooms: 1, pending: true },
];

// ---- Messages -------------------------------------------------------------
// Timestamps are offsets from module load so the conversation always reads as recent.

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

type Seed = [userId: string, text: string, agoMs: number, reactions?: Record<string, string[]>, replyTo?: number];

function build(roomId: string, seeds: Seed[]): Message[] {
  const msgs: Message[] = seeds.map(([userId, text, ago, reactions], i) => ({
    id: `${roomId}-m${i}`,
    roomId,
    userId,
    text,
    createdAt: NOW - ago,
    reactions: reactions ?? {},
  }));
  seeds.forEach((s, i) => {
    const replyIdx = s[4];
    const msg = msgs[i];
    if (replyIdx !== undefined && msg) msg.replyToId = `${roomId}-m${replyIdx}`;
  });
  return msgs;
}

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  "tech-talk": build("tech-talk", [
    ["u-rohan", "Anyone tried the new React compiler in a real project yet?", DAY + 3 * HOUR],
    ["u-ishaan", "Using it on my capstone. Deleted like 40 useMemo calls 😅", DAY + 3 * HOUR - 4 * MIN, { "😂": ["u-rohan", "u-aanya"] }],
    ["u-aanya", "Wait it's stable now?", DAY + 3 * HOUR - 6 * MIN],
    ["u-rohan", "Pretty much. Edge cases with refs still bite though.", DAY + 3 * HOUR - 7 * MIN],
    ["u-dev", "Morning folks ☕ what are we building today?", 2 * HOUR + 15 * MIN],
    [CURRENT_USER_ID, "Working on the real-time chat assignment for Web Dev 3 — Socket.IO backend is ready, doing the frontend now.", 2 * HOUR + 10 * MIN, { "🔥": ["u-dev", "u-rohan", "u-ishaan"] }],
    [CURRENT_USER_ID, "Trying to make it not look like every other chat clone 👀", 2 * HOUR + 9 * MIN],
    ["u-rohan", "Tip: keep your socket logic in one service file. Makes swapping mock data for real events trivial.", 2 * HOUR + 2 * MIN, { "💯": [CURRENT_USER_ID, "u-ishaan"] }, 5],
    ["u-ishaan", "+1. And debounce the typing events or your server will cry", 1 * HOUR + 58 * MIN],
    ["u-aanya", "Send screenshots when it's ready! Happy to give design feedback ✨", 1 * HOUR + 40 * MIN, { "❤️": [CURRENT_USER_ID] }],
    ["u-nisha", "Is anyone else's laptop fan sounding like a jet engine during builds", 32 * MIN],
    ["u-dev", "That's just the sound of productivity", 30 * MIN, { "😂": ["u-nisha", CURRENT_USER_ID, "u-aanya"] }],
    ["u-rohan", "Okay who wants to pair on the room-join flow later? I'm free after 6.", 6 * MIN],
  ]),
  "gaming-lounge": build("gaming-lounge", [
    ["u-zara", "Ranked tonight? Need two more for a five stack.", 5 * HOUR],
    ["u-arjun", "I'm in after dinner 🍜", 4 * HOUR + 50 * MIN],
    ["u-dev", "Only if Zara doesn't instalock Jett again", 4 * HOUR + 45 * MIN, { "😂": ["u-arjun", "u-rohan"] }],
    ["u-zara", "Skill issue on your side tbh", 4 * HOUR + 44 * MIN, { "💀": ["u-dev", "u-arjun", CURRENT_USER_ID] }],
    [CURRENT_USER_ID, "Count me in. 9pm?", 3 * HOUR],
    ["u-zara", "9pm works. I'll create the lobby.", 2 * HOUR + 50 * MIN, { "👍": [CURRENT_USER_ID, "u-arjun"] }, 4],
    ["u-arjun", "Just hit a 1-tap through smoke, clip incoming 🎯", 20 * MIN],
    ["u-ishaan", "Clip or it didn't happen", 18 * MIN],
  ]),
  "music-vibes": build("music-vibes", [
    ["u-meera", "Sunday playlist thread 🎧 drop one song that feels like a slow morning.", 7 * HOUR],
    ["u-kabir", "Prateek Kuhad — cold/mess. No notes.", 6 * HOUR + 40 * MIN, { "❤️": ["u-meera", "u-aanya", "u-tara"] }],
    ["u-aanya", "Khruangbin – White Gloves", 6 * HOUR + 30 * MIN],
    ["u-tara", "Anything by Nujabes honestly", 6 * HOUR + 10 * MIN, { "🙌": ["u-kabir"] }],
    [CURRENT_USER_ID, "Lofi Girl on loop while I code, does that count", 3 * HOUR],
    ["u-meera", "Absolutely counts 😌", 2 * HOUR + 55 * MIN, undefined, 4],
    ["u-kabir", "Recorded a rough demo last night. Might share it here if you promise not to roast me", 40 * MIN],
    ["u-aanya", "We promise nothing but we'll be nice", 38 * MIN, { "😂": ["u-kabir", "u-meera"] }],
  ]),
  "study-hub": build("study-hub", [
    ["u-nisha", "Starting a 50/10 pomodoro in 5. Who's joining?", 90 * MIN],
    ["u-ishaan", "Joining. DBMS normalization is eating my brain.", 88 * MIN],
    ["u-sara", "3NF is just 'no transitive dependencies'. You got this 💪", 85 * MIN, { "🙏": ["u-ishaan"] }],
    [CURRENT_USER_ID, "In. Finishing my chat app UI first session.", 80 * MIN],
    ["u-nisha", "Break time! Stretch, hydrate, no doomscrolling 👀", 25 * MIN, { "💧": ["u-sara", CURRENT_USER_ID] }],
  ]),
  "anime-world": build("anime-world", [
    ["u-dev", "This season is stacked. Frieren S2 hype?", 3 * HOUR],
    ["u-tara", "Drew some fan art over the weekend, posting soon ✏️", 2 * HOUR],
    ["u-arjun", "Hot take: the manga is better", HOUR],
    ["u-zara", "That's not a hot take, that's just correct", 50 * MIN, { "😂": ["u-dev", "u-arjun"] }],
  ]),
  "chill-zone": build("chill-zone", [
    ["u-aanya", "Rainy evening here. Chai + window seat kind of day 🌧️", 2 * HOUR],
    ["u-kabir", "Sounds perfect. Mumbai?", 110 * MIN],
    ["u-aanya", "Pune! Same vibe though", 105 * MIN],
  ]),
  "pixel-studio": build("pixel-studio", [
    ["u-tara", "Critique Friday is back. Post your WIPs!", 4 * HOUR],
    ["u-aanya", "Sharing a landing page concept in a bit", 3 * HOUR],
  ]),
  cinephiles: build("cinephiles", [
    ["u-kabir", "Dune Part Two rewatch tonight. Who's in?", 6 * HOUR],
    ["u-dev", "The sound design alone is worth it", 5 * HOUR],
  ]),
};

/** Lines mock participants use when simulating live replies. */
export const REPLY_POOL: string[] = [
  "Haha true 😄",
  "Wait, that's actually a great point",
  "Okay I'm stealing that idea",
  "Same here honestly",
  "Can you share more about that?",
  "This room never disappoints ✨",
  "100% agree",
  "Lol I was literally thinking the same thing",
  "Brb grabbing coffee, keep going",
  "That's so cool, nice work!",
  "Hmm, I'd try it the other way around",
  "Let's do it 🚀",
];

export const BACKGROUND_POOL: string[] = [
  "Anyone around? 👋",
  "Just saw something hilarious, one sec",
  "Reminder: be kind, have fun",
  "Who's up for a quick session later?",
  "New here — hi everyone!",
  "That last update was so good",
];
