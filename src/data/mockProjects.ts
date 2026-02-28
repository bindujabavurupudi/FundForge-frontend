export interface Project {
  id: string;
  title: string;
  description: string;
  creator: string;
  category: string;
  image: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  featured?: boolean;
  rewards: Reward[];
  milestones: Milestone[];
  comments: Comment[];
  updates: Update[];
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  amount: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  reached: boolean;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  date: string;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
}

export const categories = [
  "Technology",
  "Design",
  "Film",
  "Music",
  "Games",
  "Art",
  "Publishing",
  "Food",
  "Fashion",
  "Health",
];

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "NeoLens – AI-Powered Smart Glasses",
    description: "Revolutionary smart glasses that use AI to provide real-time translation, navigation, and augmented reality experiences. NeoLens combines cutting-edge optics with powerful AI processing to deliver a seamless wearable experience. Our lightweight titanium frames house micro-LED displays, spatial audio speakers, and a custom neural processing chip.",
    creator: "Alex Chen",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
    goal: 500000,
    raised: 387500,
    backers: 2841,
    daysLeft: 18,
    featured: true,
    rewards: [
      { id: "r1", title: "Early Bird", description: "Get NeoLens at 40% off retail price", amount: 199 },
      { id: "r2", title: "Pioneer Pack", description: "NeoLens + custom case + extra lenses", amount: 349 },
      { id: "r3", title: "Developer Kit", description: "NeoLens + SDK access + dev documentation", amount: 599 },
    ],
    milestones: [
      { id: "m1", title: "Prototype Complete", description: "Final hardware prototype ready", targetAmount: 100000, reached: true },
      { id: "m2", title: "Manufacturing", description: "Begin mass production", targetAmount: 300000, reached: true },
      { id: "m3", title: "Software Launch", description: "AI software platform release", targetAmount: 500000, reached: false },
    ],
    comments: [
      { id: "c1", user: "Sarah K.", avatar: "SK", text: "This looks incredible! Can't wait to try the AR features.", date: "2 days ago" },
      { id: "c2", user: "Mike R.", avatar: "MR", text: "Will this work with prescription lenses?", date: "5 days ago" },
    ],
    updates: [
      { id: "u1", title: "Manufacturing Update", content: "We've secured our factory partner in Shenzhen!", date: "1 week ago" },
    ],
  },
  {
    id: "2",
    title: "EcoVault – Sustainable Tiny Homes",
    description: "Beautifully designed, off-grid tiny homes built from recycled ocean plastic and sustainable materials. Each EcoVault is a self-contained living space with solar power, rainwater collection, and smart home technology.",
    creator: "Maya Rodriguez",
    category: "Design",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
    goal: 250000,
    raised: 198000,
    backers: 1205,
    daysLeft: 24,
    featured: true,
    rewards: [
      { id: "r1", title: "Supporter", description: "Exclusive updates + EcoVault blueprint poster", amount: 25 },
      { id: "r2", title: "Weekend Stay", description: "2-night stay in a prototype EcoVault", amount: 299 },
      { id: "r3", title: "Own One", description: "Reserve your own EcoVault at launch price", amount: 45000 },
    ],
    milestones: [
      { id: "m1", title: "Design Finalized", description: "Complete architectural plans", targetAmount: 50000, reached: true },
      { id: "m2", title: "First Prototype", description: "Build and test first unit", targetAmount: 150000, reached: true },
      { id: "m3", title: "Production Line", description: "Set up manufacturing facility", targetAmount: 250000, reached: false },
    ],
    comments: [
      { id: "c1", user: "Tom L.", avatar: "TL", text: "Love the sustainability focus!", date: "1 day ago" },
    ],
    updates: [],
  },
  {
    id: "3",
    title: "SonicWave – Immersive Audio System",
    description: "A spatial audio system that creates a 360-degree sound field in any room. Using proprietary beam-forming technology, SonicWave delivers concert-hall quality audio from a single compact device.",
    creator: "Jordan Park",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=400&fit=crop",
    goal: 150000,
    raised: 142500,
    backers: 3102,
    daysLeft: 7,
    featured: true,
    rewards: [
      { id: "r1", title: "Early Access", description: "SonicWave at 35% off retail", amount: 249 },
      { id: "r2", title: "Studio Bundle", description: "SonicWave + subwoofer + calibration mic", amount: 499 },
    ],
    milestones: [
      { id: "m1", title: "Engineering Complete", description: "Finalize audio engineering", targetAmount: 50000, reached: true },
      { id: "m2", title: "Tooling", description: "Create manufacturing molds", targetAmount: 100000, reached: true },
      { id: "m3", title: "Shipping", description: "Begin worldwide shipping", targetAmount: 150000, reached: false },
    ],
    comments: [
      { id: "c1", user: "Anna W.", avatar: "AW", text: "Does this support Dolby Atmos?", date: "3 days ago" },
      { id: "c2", user: "Chris B.", avatar: "CB", text: "Backed! This is the future of home audio.", date: "1 week ago" },
    ],
    updates: [
      { id: "u1", title: "Almost There!", content: "95% funded! Thank you all for the amazing support.", date: "2 days ago" },
    ],
  },
  {
    id: "4",
    title: "Lumina – Interactive Art Installation",
    description: "A traveling interactive art installation that responds to viewer emotions through AI-powered facial recognition and real-time generative art.",
    creator: "Priya Sharma",
    category: "Art",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    goal: 80000,
    raised: 62400,
    backers: 891,
    daysLeft: 31,
    rewards: [
      { id: "r1", title: "Digital Print", description: "Exclusive generative art print", amount: 35 },
      { id: "r2", title: "VIP Opening", description: "Attend the VIP opening night", amount: 150 },
    ],
    milestones: [
      { id: "m1", title: "AI Model Training", description: "Complete emotion recognition model", targetAmount: 30000, reached: true },
      { id: "m2", title: "Installation Build", description: "Physical installation construction", targetAmount: 60000, reached: true },
      { id: "m3", title: "World Tour", description: "Launch global tour", targetAmount: 80000, reached: false },
    ],
    comments: [],
    updates: [],
  },
  {
    id: "5",
    title: "GreenBite – Plant-Based Meal Kits",
    description: "Chef-curated plant-based meal kits delivered weekly. Every recipe is designed to be delicious, nutritious, and takes under 30 minutes to prepare.",
    creator: "Emma Wilson",
    category: "Food",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    goal: 100000,
    raised: 89000,
    backers: 1567,
    daysLeft: 12,
    rewards: [
      { id: "r1", title: "Sample Box", description: "Try 3 meals from our menu", amount: 39 },
      { id: "r2", title: "Monthly Plan", description: "4 weeks of meal kits (3 meals/week)", amount: 199 },
    ],
    milestones: [
      { id: "m1", title: "Recipe Development", description: "Finalize 50 recipes", targetAmount: 30000, reached: true },
      { id: "m2", title: "Supply Chain", description: "Establish supplier partnerships", targetAmount: 70000, reached: true },
      { id: "m3", title: "National Launch", description: "Launch delivery nationwide", targetAmount: 100000, reached: false },
    ],
    comments: [
      { id: "c1", user: "Lisa M.", avatar: "LM", text: "Finally, plant-based meals that actually look good!", date: "4 days ago" },
    ],
    updates: [],
  },
  {
    id: "6",
    title: "PixelForge – Indie RPG Game",
    description: "An epic pixel-art RPG with a branching narrative, hand-crafted dungeons, and a dynamic combat system inspired by classics like Chrono Trigger and Final Fantasy.",
    creator: "Dev Studio Omega",
    category: "Games",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    goal: 200000,
    raised: 175000,
    backers: 4210,
    daysLeft: 15,
    rewards: [
      { id: "r1", title: "Digital Copy", description: "Game + soundtrack on launch", amount: 20 },
      { id: "r2", title: "Collector's Edition", description: "Game + art book + figurine", amount: 89 },
      { id: "r3", title: "Name in Game", description: "Your name as an NPC character", amount: 250 },
    ],
    milestones: [
      { id: "m1", title: "Alpha Build", description: "Playable alpha with 3 chapters", targetAmount: 80000, reached: true },
      { id: "m2", title: "Beta Release", description: "Full game beta for backers", targetAmount: 150000, reached: true },
      { id: "m3", title: "Launch", description: "Full game release", targetAmount: 200000, reached: false },
    ],
    comments: [
      { id: "c1", user: "GameFan99", avatar: "GF", text: "The art style is gorgeous!", date: "2 days ago" },
    ],
    updates: [
      { id: "u1", title: "Beta Access", content: "Beta keys going out to Collector's Edition backers this Friday!", date: "3 days ago" },
    ],
  },
];

export const successStories = [
  {
    id: "s1",
    title: "HyperBoard – E-Ink Dashboard",
    creator: "Tech Collective",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop",
    raised: 1200000,
    goal: 200000,
    backers: 8400,
  },
  {
    id: "s2",
    title: "BreezeBot – Home Air Purifier",
    creator: "CleanAir Labs",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    raised: 890000,
    goal: 150000,
    backers: 5200,
  },
  {
    id: "s3",
    title: "Atlas – Travel Photography Book",
    creator: "Nomad Press",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
    raised: 340000,
    goal: 50000,
    backers: 12000,
  },
];
