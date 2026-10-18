type AppGuide = {
  overview: string;
  highlights: string[];
  steps: string[];
  note: string;
};

export const appGuides: Record<string, AppGuide> = {
  "ma-soi": {
    overview:
      "Ma Sói là trò chơi suy luận theo vai, nơi người chơi thảo luận để tìm ra ai thuộc phe đối địch. Dự án Ma Sói của LAZTAR đưa trải nghiệm này lên web với quản trò tự động, dành cho những buổi chơi cùng nhóm bạn hoặc đồng nghiệp.",
    highlights: [
      "Trải nghiệm Ma Sói online ngay trên trình duyệt.",
      "Quản trò tự động hỗ trợ điều phối ván chơi.",
      "Tập trung vào thảo luận, suy luận và tương tác trong nhóm.",
    ],
    steps: [
      "Mở ứng dụng Ma Sói bằng liên kết bên dưới.",
      "Làm theo hướng dẫn trong ứng dụng để chuẩn bị ván chơi cùng nhóm.",
      "Thống nhất thời gian chơi để mọi người cùng tham gia thảo luận.",
    ],
    note: "Đây là dự án đang được phát triển. Nếu gặp lỗi khi chơi, hãy gửi góp ý kèm các bước tái hiện và thông tin trình duyệt.",
  },
  "office-jukebox": {
    overview:
      "Office Jukebox là ứng dụng âm nhạc dùng chung của LAZTAR. Thay vì để một người chọn toàn bộ nhạc cho văn phòng, mọi người có thể chọn bài và bình chọn để cùng định hình danh sách nghe.",
    highlights: [
      "Chọn nhạc cho không gian làm việc chung.",
      "Bình chọn bài hát cùng các thành viên trong văn phòng.",
      "Có repository GitHub để tìm hiểu mã nguồn và đóng góp.",
    ],
    steps: [
      "Mở trang khách của Office Jukebox bằng liên kết bên dưới.",
      "Làm theo hướng dẫn truy cập của văn phòng nếu ứng dụng yêu cầu.",
      "Chọn nhạc và bình chọn các bài bạn muốn nghe cùng mọi người.",
    ],
    note: "Office Jukebox phục vụ nhu cầu nội bộ. Quyền truy cập có thể phụ thuộc cấu hình của văn phòng; việc thấy trang giới thiệu không đồng nghĩa được cấp quyền vào ứng dụng.",
  },
  "sao-ke": {
    overview:
      "Sao kê là dự án thử nghiệm của LAZTAR về cách trình bày thông tin lì xì và chuyển khoản bằng dashboard. Trang trải nghiệm kết hợp số liệu, phong cách Tết và nội dung vui nhộn để thử một cách thể hiện khác cho chủ đề minh bạch.",
    highlights: [
      "Khám phá giao diện dashboard theo chủ đề lì xì và sao kê.",
      "Trải nghiệm cách trình bày số liệu theo phong cách vui nhộn.",
      "Có repository GitHub để xem mã nguồn và đề xuất cải tiến.",
    ],
    steps: [
      "Mở ứng dụng Sao kê bằng liên kết bên dưới.",
      "Khám phá dashboard và đọc ngữ cảnh của các thông tin được hiển thị.",
      "Gửi góp ý nếu có ý tưởng giúp giao diện hoặc nội dung dễ hiểu hơn.",
    ],
    note: "Đây là dự án thử nghiệm giao diện, không phải dịch vụ ngân hàng hay công cụ xác thực giao dịch.",
  },
};
