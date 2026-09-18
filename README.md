# Company Hub

Company Hub là cổng nội bộ để nhân viên mở các app của công ty từ một URL, gửi feedback và để admin quản lý feedback trong một workflow gọn nhẹ.

## Tính năng V1

- App directory data-driven, tìm theo tên và lọc theo category.
- Dữ liệu demo cho Ma Sói, Office Jukebox và Sao Kê.
- Public feedback cho Bug, Feature Request, Idea và Contribution.
- Feedback được validate phía server và lưu trong SQLite.
- `/admin` đăng nhập bằng email/password, dùng session server-side.
- Admin xem danh sách, chi tiết và đổi trạng thái New / In Progress / Done.
- Responsive riêng cho mobile admin cards và desktop table.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- SQLite, Drizzle ORM và Drizzle migrations
- Argon2id cho password hash, opaque database session cho admin
- CSS thuần với semantic design tokens
- Vitest + ESLint

## Local Development

### 1. Requirements

- Node.js `20.9.0` trở lên
- npm

Không cần database hoặc authentication service bên ngoài.

### 2. Install và cấu hình environment

```bash
npm install
cp .env.example .env.local
```

Các biến cần thiết:

```dotenv
# Application
PORT=3000

# SQLite database. Có thể dùng đường dẫn tương đối hoặc tuyệt đối.
DATABASE_URL=file:./data/company-hub.db
```

`DATABASE_URL` chỉ được đọc ở server. File database local, WAL và các file `.env*` (trừ `.env.example`) đều được ignore khỏi Git.

Không cần `SESSION_SECRET`: session dùng token ngẫu nhiên, browser chỉ giữ token trong cookie `HttpOnly`, còn database chỉ lưu SHA-256 hash của token.

### 3. Tạo database từ migration

```bash
npm run db:migrate
```

Lệnh này tạo database và toàn bộ bảng `feedback`, `admin_users`, `admin_sessions` từ migration đã commit. Có thể chạy lại sau khi xóa database local để dựng môi trường sạch mà không cần chạy SQL thủ công.

### 4. Tạo admin đầu tiên

```bash
npm run admin:create
```

Nhập email và password tối thiểu 12 ký tự khi được hỏi. Password được nhập ẩn, hash bằng Argon2id rồi mới lưu; repository không có admin hoặc password mặc định. Nếu email đã tồn tại, script sẽ dừng với thông báo rõ ràng.

### 5. Chạy ứng dụng

```bash
npm run dev
```

Mở `http://localhost:<PORT>` với giá trị `PORT` đang cấu hình.

Để đổi port, chỉ cần sửa `.env.local` rồi chạy lại app:

```dotenv
PORT=3105
```

`npm run dev` và `npm run start` đều đọc `PORT` qua cùng runtime runner; không cần sửa source hoặc package scripts.

### 6. Dừng local

Nhấn `Ctrl+C` tại terminal đang chạy Next.js. SQLite không có service riêng cần dừng.

## Database Commands

```bash
npm run db:generate  # tạo migration mới sau khi thay schema
npm run db:migrate   # áp dụng migration vào DATABASE_URL hiện tại
npm run db:studio    # mở Drizzle Studio cho database hiện tại
```

Không chạy `db:generate` cho setup thông thường; migration hiện có đã đủ để dựng database sạch.

## Production Runtime

Phase này chưa deploy production. Khi triển khai lên VPS, đặt database ngoài source/build directory và bảo đảm process có quyền đọc/ghi thư mục đó, ví dụ:

```dotenv
PORT=3100
DATABASE_URL=file:/var/lib/company-hub/company-hub.db
```

Sau đó chạy migration trước khi khởi động production runtime:

```bash
npm ci
npm run build
npm run db:migrate
npm run start
```

Không hard-code port hoặc database path trong source, nên cùng VPS có thể chạy nhiều service với cấu hình riêng.

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

UI, search, filter và dropdown chọn project trong form feedback tự đọc từ nguồn dữ liệu này. Nếu cần icon/category mới, mở rộng union trong cùng file và mapping icon tại `src/components/app-directory.tsx`.

## Kiểm tra chất lượng

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Với application đang chạy bằng `npm run dev` hoặc `npm run start`, chạy thêm:

```bash
npm run test:integration
```

Integration check tự tạo rồi dọn admin/feedback tạm để xác minh public submit, login, session cookie, protected admin reads và SQLite status persistence.
