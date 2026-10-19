# Mobile header, intro marquee và feedback cards

## Lỗi đã xác nhận

- Header mobile trước đây cao khoảng 116px: `flex-wrap` cùng navigation `width: 100%` tạo hai hàng. Header compact còn khoảng 65px (chưa cộng safe area), giữ nguyên desktop.
- Marquee bị `animation: none !important` ghi đè; class kích hoạt cũ không được gắn. Hai bản text chỉ phủ khoảng 990px trên viewport 1440px. Khôi phục loop phải sang trái bằng hai track giống nhau, mỗi track lặp ba bản text và rộng tối thiểu bằng viewport. Pause ngoài màn hình bằng IntersectionObserver, disconnect khi unmount; reduced motion giữ tĩnh.
- Card góp ý cao theo nội dung: ở 390/1440px, “Báo lỗi” cao 84px, các card khác 103px. Grid dùng các hàng bằng nhau và body stretch theo card, không đổi copy hoặc radio behavior.

## Evidence

| Khu vực | Trước | Sau |
| --- | --- | --- |
| Header 390px | [Trước](before-header-390.png) | [Sau](after-header-390.png) |
| Marquee 1440px | [Trước](before-marquee-1440.png) | [Sau](after-marquee-1440.png) |
| Feedback 1440px | [Trước](before-feedback-1440.png) | [Sau](after-feedback-1440.png) |

Screenshots chụp từ browser automation. Bản sau dùng production build local; bản trước được giữ trước khi sửa. Raw screenshots tại 320/375/390/430/768/1440px, JSON bounds và video Chromium giữ local trong `docs/visual-qa/intro-feedback/` (ignored).

## Verification

- Lint, typecheck, 9 unit tests, production build và SEO checks đạt.
- Browser suite đạt: navigation, project selector, search/filter, CTA contrast/focus, mobile targets và không có page errors/GSAP warnings.
- Motion suite đạt: 40 layout checks, 40 scroll sequences, reverse, remount, back/forward, resize, reduced motion.
- Runtime integration đạt: feedback, admin authentication, protected reads và persistence.
- Axe WCAG 2A/2AA/2.1AA: 6 checks trên homepage/feedback tại 320/1440px, gồm menu mobile mở; không có violation tự động.
- `BASE_URL=http://localhost:3003 npm run test:mobile-polish`: Chromium và WebKit tại 320/375/390/430/768/1440px. Kiểm tra marquee chạy trái, coverage toàn vòng lặp/seam, pause offscreen, reduced motion, card đồng chiều cao và radio keyboard selection. Header kiểm tra focus, Escape/nút đóng/backdrop, giữ scroll và đóng khi chuyển desktop.
- Independent code review: không có finding cần sửa.

WebKit automation không thay thế Safari iOS trên thiết bị thật.

## Manual QA trên Safari iOS / Chrome Android

- [ ] Header một hàng; brand/menu không bị notch che trong portrait và landscape.
- [ ] Mở/đóng menu bằng nút, backdrop, Escape khi dùng bàn phím; focus trở về trigger.
- [ ] Mở/đóng lặp lại ở giữa trang không làm đổi vị trí scroll; thử browser bars thu/mở và đổi orientation.
- [ ] Mọi navigation link, Back/Forward, menu đóng sau khi chuyển trang.
- [ ] Marquee chạy từ phải sang trái, không để trống bên phải hoặc nhảy ở vòng lặp.
- [ ] Reduced Motion; chuyển preference rồi quay lại/refresh trang.
- [ ] Bốn card bằng chiều cao, chọn bằng touch/keyboard; kiểm tra text zoom.

Không merge hoặc deploy production.
