"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <section className="page-section">
      <div className="shell narrow-shell empty-state not-found-state">
        <p className="eyebrow">Có lỗi xảy ra</p>
        <h1>LAZTAR Hub chưa thể tải nội dung này.</h1>
        <p>Kiểm tra kết nối hoặc thử tải lại. Dữ liệu bạn đã gửi không bị hiển thị công khai.</p>
        <button className="button button-primary" type="button" onClick={reset}>
          Thử lại
        </button>
      </div>
    </section>
  );
}
