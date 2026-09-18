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
      "Lập làng, giấu vai và xem đồng nghiệp nào đáng tin nhất.",
    url: "https://werewolves-game.laztar.xyz/",
    icon: "wolf",
    category: "Game",
    status: "live",
  },
  {
    id: "office-jukebox",
    name: "Office Jukebox",
    description:
      "Chọn nhạc, vote bài và cùng quyết định hôm nay văn phòng nghe gì.",
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
      "Minh bạch theo cách không ai yêu cầu, nhưng ai cũng muốn xem.",
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
