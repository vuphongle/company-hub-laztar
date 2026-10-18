export const appCategories = ["Game", "Music", "Fun / Experiment"] as const;
export const appStatuses = ["live", "beta", "coming_soon"] as const;

export type AppCategory = (typeof appCategories)[number];
export type AppStatus = (typeof appStatuses)[number];
export type AppIconName = "wolf" | "music" | "receipt";

export type CompanyApp = {
  id: string;
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  icon: AppIconName;
  category: AppCategory;
  status: AppStatus;
};

export const apps: CompanyApp[] = [
  {
    id: "ma-soi",
    name: "Ma Sói",
    description:
      "Chơi Ma Sói online cùng nhóm bạn và đồng nghiệp với quản trò tự động của LAZTAR.",
    url: "https://werewolves-game.laztar.xyz/",
    icon: "wolf",
    category: "Game",
    status: "live",
  },
  {
    id: "office-jukebox",
    name: "Office Jukebox",
    description:
      "Ứng dụng chọn nhạc và bình chọn bài hát để cả văn phòng cùng quyết định nghe gì.",
    url: "https://music.laztar.xyz/guest",
    githubUrl: "https://github.com/vuphongle/office-jukebox",
    icon: "music",
    category: "Music",
    status: "live",
  },
  {
    id: "sao-ke",
    name: "Sao kê",
    description:
      "Dự án thử nghiệm dashboard lì xì và sao kê với cách trình bày minh bạch, vui nhộn.",
    url: "https://saoke.laztar.xyz/",
    githubUrl: "https://github.com/vuphongle/nuoitoi",
    icon: "receipt",
    category: "Fun / Experiment",
    status: "live",
  },
];

export function getAppById(id: string) {
  return apps.find((app) => app.id === id);
}
