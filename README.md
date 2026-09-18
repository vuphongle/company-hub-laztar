# Company Hub

Company Hub là cổng nội bộ nhỏ gọn để nhân viên mở các app của công ty từ một URL, gửi feedback và để admin theo dõi feedback trong một workflow đơn giản.

## Tính năng V1

- App directory data-driven, tìm theo tên và lọc theo category.
- Dữ liệu demo cho Ma Sói, Office Jukebox và Sao Kê.
- Public feedback cho Bug, Feature Request, Idea và Contribution.
- Feedback lưu trong Supabase PostgreSQL.
- `/admin` dùng Supabase Auth và bảng allowlist `admin_users`.
- Admin xem danh sách, chi tiết và đổi trạng thái New / In Progress / Done.
- Responsive riêng cho mobile admin cards và desktop table.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Supabase Auth + PostgreSQL + Row Level Security
- CSS thuần với semantic design tokens
- Vitest + ESLint

## Chạy local

Yêu cầu Node.js `20.9.0` trở lên.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`. Home và UI feedback vẫn xem được khi chưa cấu hình Supabase; thao tác lưu và khu vực admin cần cấu hình đầy đủ.

## Cấu hình Supabase

1. Tạo một Supabase project.
2. Mở SQL Editor và chạy `supabase/migrations/001_company_hub.sql`.
3. Điền các biến sau vào `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` chỉ được dùng trong server-only data module. Không đưa key này vào biến có prefix `NEXT_PUBLIC_`.

## Tạo admin đầu tiên

1. Trong Supabase Dashboard, tạo user email/password tại Authentication → Users.
2. Lấy UUID của user.
3. Chạy SQL sau trong SQL Editor:

```sql
insert into public.admin_users (user_id)
values ('USER_UUID_HERE');
```

Sau đó đăng nhập tại `/admin/login`. Một tài khoản Auth không có record tương ứng trong `admin_users` sẽ bị từ chối.

## Thêm app mới

Mở `src/data/apps.ts` và thêm một object vào mảng `apps`:

```ts
{
  id: "project-slug",
  name: "Project Name",
  description: "Mô tả ngắn giúp nhân viên hiểu app dùng để làm gì.",
  url: "https://project.company.example",
  icon: "receipt",
  category: "Productivity",
  status: "live",
}
```

UI, search, filter và dropdown chọn project trong form feedback sẽ tự đọc từ nguồn dữ liệu này. Nếu cần icon/category mới, mở rộng union tương ứng trong cùng file và mapping icon trong `src/components/app-directory.tsx`.

## Kiểm tra chất lượng

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deploy

Vercel + Supabase là đường deploy đơn giản nhất: import repository vào Vercel, thêm ba environment variables, deploy, rồi thay các URL demo trong `src/data/apps.ts` bằng URL thật của công ty.
