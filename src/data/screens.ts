export interface ScreenData {
  id: number;
  screenNumber: number;
  name: string;
  category: "splash" | "onboarding";
  title?: string;
  description?: string;
  stepIndex?: number; // 0, 1, 2 for the 3 dots
  totalSteps?: number;
  hasBackButton?: boolean;
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export const SCREENS: ScreenData[] = [
  {
    id: 1,
    screenNumber: 1,
    name: "Initial Splash Screen",
    category: "splash",
    description: "App launch screen with central AfriGuide compass badge.",
  },
  {
    id: 2,
    screenNumber: 2,
    name: "Your story starts here",
    category: "onboarding",
    title: "Your story starts here",
    description:
      "Whether you're looking for adventure or culture, Afriguide brings the continent to your fingertips. Join a community of storytellers and explorers.",
    stepIndex: 2, // dot 3 active in screenshot 2
    totalSteps: 3,
    hasBackButton: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
        alt: "African sandstone desert rock arch formation under clear sky",
        caption: "Ennedi Desert Arch",
      },
      {
        src: "https://images.unsplash.com/photo-1526095179574-86e545346ae6?auto=format&fit=crop&w=800&q=80",
        alt: "Zebra portrait in African savanna under dramatic cloudy sky",
        caption: "Serengeti Zebra",
      },
      {
        src: "https://images.unsplash.com/photo-1505148230895-d9a785a555fa?auto=format&fit=crop&w=800&q=80",
        alt: "Zebra rolling happily upside down in grass",
        caption: "Playful Zebra",
      },
      {
        src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80",
        alt: "Two majestic African elephants greeting trunk-to-trunk by the water",
        caption: "Elephant Greeting",
      },
    ],
  },
  {
    id: 3,
    screenNumber: 3,
    name: "Find your perfect guide",
    category: "onboarding",
    title: "Find your perfect guide",
    description:
      "Browse verified local guides with deep knowledge of Zimbabwe's hidden gems, wildlife, culture, and history. Read reviews from fellow travellers and find your ideal match.",
    stepIndex: 1, // dot 2 active in screenshot 3
    totalSteps: 3,
    hasBackButton: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
        alt: "Travelers riding camels in golden desert dunes",
        caption: "Desert Caravan",
      },
      {
        src: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80",
        alt: "Hippo with mouth wide open in African river",
        caption: "Zambezi Hippo",
      },
      {
        src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
        alt: "Safari 4x4 land cruiser watching a tall giraffe in the bush",
        caption: "Guided Game Drive",
      },
      {
        src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80",
        alt: "Towering red dunes of Sossusvlei with ancient trees and hikers",
        caption: "Sossusvlei Dunes",
      },
    ],
  },
  {
    id: 4,
    screenNumber: 4,
    name: "Discover Hidden Gems",
    category: "onboarding",
    title: "Discover Hidden Gems",
    description:
      "Connect with local storytellers who reveal the secrets of Africa's most breathtaking landscapes.",
    stepIndex: 0, // dot 1 active in screenshot 4
    totalSteps: 3,
    hasBackButton: false,
    images: [
      {
        src: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80",
        alt: "Two white rhinos standing together in golden African bushveld",
        caption: "Savanna Rhinoceros",
      },
      {
        src: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=800&q=80",
        alt: "Elephants walking through lush green savanna with mountains behind",
        caption: "Kilimanjaro Elephants",
      },
      {
        src: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=800&q=80",
        alt: "Hippo submerged in river with mouth open",
        caption: "River Hippo",
      },
    ],
  },
  {
    id: 5,
    screenNumber: 5,
    name: "AfriGuide Brand Splash",
    category: "splash",
    description: "Completion screen showcasing the centered AfriGuide brand pill emblem.",
  },
];
