import Link from "next/link";

import { publicPageMetadata } from "@/config/site";
import { apps } from "@/data/apps";

export const metadata = publicPageMetadata({
  title: "LAZTAR là gì? Giới thiệu LAZTAR Hub và các dự án",
  description:
    "Tìm hiểu LAZTAR Hub, nơi tập hợp Ma Sói, Office Jukebox, Sao kê và các dự án nội bộ để cùng trải nghiệm, góp ý và đóng góp mã nguồn.",
  path: "/gioi-thieu",
});

export default function AboutPage() {
  return (
    <section className="page-section">
      <article className="shell narrow-shell content-page">
        <div className="page-heading">
          <p className="eyebrow">Giới thiệu</p>
          <h1>LAZTAR Hub là gì?</h1>
          <p>Nơi tập hợp các ứng dụng, ý tưởng và dự án thử nghiệm của LAZTAR.</p>
        </div>
        <p>
          LAZTAR Hub tại laztar.xyz là điểm bắt đầu để khám phá những project nội bộ
          được xây dựng cho việc chơi, làm việc và thử nghiệm cùng nhau. Bạn có thể
          tìm ứng dụng theo tên, lọc theo nhóm và mở từng dự án từ một nơi.
        </p>
        <h2>Các dự án trên LAZTAR Hub</h2>
        <ul>
          {apps.map((app) => (
            <li key={app.id}>
              <Link href={`/ung-dung/${app.id}`}>{app.name}</Link>: {app.description}
            </li>
          ))}
        </ul>
        <h2>Ai có thể sử dụng?</h2>
        <p>
          Bạn có thể xem danh mục và phần giới thiệu dự án ngay trên website.
          Các ứng dụng được phát triển cho nhu cầu của nhóm và đồng nghiệp;
          một số ứng dụng có thể yêu cầu quyền truy cập riêng.
        </p>
        <h2>Góp ý và tham gia xây dựng</h2>
        <p>
          Hub tiếp nhận báo lỗi, đề xuất tính năng, ý tưởng mới và mong muốn tham gia
          dự án qua <Link href="/feedback">trang góp ý</Link>. Khi báo lỗi, hãy ghi
          ứng dụng liên quan, các bước tái hiện, kết quả mong đợi và điều thực tế đã xảy ra.
          Với dự án có liên kết GitHub, bạn có thể mở repository từ trang giới thiệu
          để tìm hiểu mã nguồn.
        </p>
        <p>
          Các project có thể thay đổi trong quá trình phát triển. Góp ý từ người dùng
          giúp nhóm biết điều gì hữu ích và điều gì cần làm tốt hơn.
        </p>
        <Link className="button button-primary" href="/">Khám phá ứng dụng LAZTAR</Link>
      </article>
    </section>
  );
}
