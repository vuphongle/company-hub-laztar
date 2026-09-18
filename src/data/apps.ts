export const appCategories = ["Entertainment", "Finance", "Productivity"] as const;
export const appStatuses = ["live", "beta", "coming_soon"] as const;

export type AppCategory = (typeof appCategories)[number];
export type AppStatus = (typeof appStatuses)[number];
export type AppIconName = "wolf" | "music" | "receipt";

export type CompanyApp = {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: AppIconName;
  category: AppCategory;
  status: AppStatus;
};

export const apps: CompanyApp[] = [
  {
    id: "ma-soi",
    name: "Ma Sói",
    description:
      "Tạo phòng, mời đồng đội và bắt đầu một ván Ma Sói vui vẻ sau giờ làm.",
    url: "https://wolf.example.com",
    icon: "wolf",
    category: "Entertainment",
    status: "live",
  },
  {
    id: "office-jukebox",
    name: "Office Jukebox",
    description:
      "Tìm, yêu cầu và cùng nhau tạo hàng đợi nhạc cho không gian văn phòng.",
    url: "https://music.example.com",
    icon: "music",
    category: "Entertainment",
    status: "beta",
  },
  {
    id: "sao-ke",
    name: "Sao Kê",
    description:
      "Tra cứu và tổng hợp các khoản thu chi nội bộ theo cách rõ ràng, dễ theo dõi.",
    url: "https://statements.example.com",
    icon: "receipt",
    category: "Finance",
    status: "live",
  },
];

export function getAppById(id: string) {
  return apps.find((app) => app.id === id);
}
