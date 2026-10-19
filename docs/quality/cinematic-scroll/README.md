# Phase 2 — Cinematic scroll storytelling

Baseline: `a96acc8824896c91fe33913dcb4f29999dfd503e`, PR #7 đã merge, gồm compact mobile header `ac51ee0`. Worktree sạch trước khi tạo `feat/cinematic-scroll-storytelling`.

## Ba signature sequences

1. **Hero → Playground:** camera của hero nghiêng/lùi, tiếp nối bằng triptych ba artwork mở theo perspective và camera push; “Small ideas” nhường chỗ cho “Three worlds”. Mobile bố cục chồng theo chiều dọc, khoảng scroll 112svh thay vì 145svh desktop.
2. **Three Worlds Journey:** chapter mới tiến lên phía trước khi chapter cũ lùi/thu nhỏ theo chiều sâu. Ma Sói dùng eclipse tròn; Jukebox xoay vinyl và artwork; Sao kê đưa artwork/dữ liệu đi lên. Runway từ 175svh xuống 160svh desktop, 155svh xuống 132svh mobile, có overlap giữa chương. Search/filter vẫn điều khiển danh sách gốc và mỗi chapter tự sở hữu timeline khi mount/unmount.
3. **Playground → Your Turn:** thay ba shape trừu tượng bằng artwork ba thế giới; ba plane xoay/gom thành fan, chữ YOUR / TURN đi từ hai phía và CTA góp ý xuất hiện trong cùng composition. Mobile typography chia dọc, artwork nằm giữa hai dòng.

Giữ màu ink `#19171f`, plum `#302739`, lime `#b9f24a`, music `#c8f579`, receipt `#edce72`; giữ font Unbounded/Nunito Sans, header, artwork và toàn bộ đường dẫn/chức năng.

## Architecture

Tái sử dụng GSAP **3.14.2** + ScrollTrigger, không thêm dependency hoặc ảnh mới. `PlaygroundMotion` sở hữu hero/gateway/closing; `useWorldMotion` sở hữu từng chapter và revert theo GSAP media context. `WorldTriptych` là server component, dùng đúng các file WebP responsive đã có, lazy loading và intrinsic ratio.

Native scroll, CSS sticky và `svh`; không snap, smooth-scroll library, scroll interception, fixed scene hay JS pin spacer. Transform children, không transform ancestor của sticky. Header height lấy từ ResizeObserver hiện có. `matchMedia` revert khi thay viewport/preference; cleanup observers/listeners theo lifecycle hiện có. Reduced motion hiển thị composition tĩnh, không sticky runway. Short-height <=740px dùng layout tĩnh cho gateway để tránh range end trước start; chapter/closing theo fallback native của Phase 1.

## Research

- [Codrops Scroll3DGrid](https://github.com/codrops/Scroll3DGrid): scroll progress điều khiển perspective/rotation/camera; đọc source `js/index.js`.
- [Codrops ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations): choreography của nhóm ảnh thay đổi bố cục. Không dùng runway 900%, Lenis hay Flip trong implementation này.
- [GSAP Showcase](https://gsap.com/showcase/): hướng composition thống nhất, typography/artwork làm chủ scene; không sao chép artwork.
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) và [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/): scrub trực tiếp, refresh, responsive setup và scoped revert. Codrops article host trả 403; nguồn repo chính thức vẫn đọc được.

## Video

| Viewport | Baseline | Phase 2 |
| --- | --- | --- |
| Desktop 1440×900 | [Before desktop](before-desktop.mp4) | [After desktop](after-desktop.mp4) |
| Mobile 390×844 | [Before mobile](before-mobile.mp4) | [After mobile](after-mobile.mp4) |

Video Chromium từ production build local, gồm hero entrance, full journey chậm, reverse, scroll nhanh và reverse nhanh. Đã tự xem frame sequence trích từ video trước/sau. Một vòng visual refinement: tăng kích thước gateway và giữ ba artwork closing thành fan thay vì gom thành một ảnh nhỏ. Independent review phát hiện short-height jump, đã sửa và regression kiểm tra riêng.

## Verification

- `npm run lint`, `npm run typecheck`, `npm test`: 9 unit tests.
- `npm run build`, `npm run test:seo`: metadata, JSON-LD, redirects, robots, sitemap, 404 và noindex.
- `npm run test:integration`: feedback, admin auth, protected reads và persistence trên local runtime.
- `BASE_URL=http://localhost:3000 npm run test:browser`: selector, search/filter, navigation/app links, focus/contrast, mobile targets; không page errors/GSAP warnings.
- `npm run test:motion`: 40 layout checks, 40 scroll sequences; reverse, filter/remount, Back/Forward, resize và preference changes.
- `npm run test:mobile-polish`: Chromium/WebKit 320/375/390/430/768/1440px; marquee, compact header/menu lifecycle và feedback cards.
- `npm run test:cinematic`: Chromium/WebKit, 320×844 / 390×844 / 768×900 / 1440×900 / 844×390; scroll-linked states, reverse, reload giữa scene, resize, reduced motion và sticky/header clearance. Landscape gateway phải giữ trạng thái tĩnh.
- Independent read-only review về lifecycle, motion continuity, mobile/short-height và regression; P2 short-height đã sửa, không còn finding được xác nhận.

## Performance

Đo bằng `scripts/capture-cinematic.mjs`, hai production build tại exact baseline và final tree, cùng máy/Chromium, cùng viewport, native scroll 22px mỗi requestAnimationFrame. Measurement chạy ngoài video recording; không CPU/network throttle. Số liệu local frame interval và single-run page metrics chỉ cho phép so sánh môi trường này, không đại diện Core Web Vitals thực tế hay thiết bị thật.

| Chỉ số | Desktop trước / sau | Mobile trước / sau |
| --- | --- | --- |
| Frame interval p95 | 16,7 / 16,7ms | 16,8 / 16,7ms |
| Frame >50ms | 0 / 0 | 0 / 0 |
| CLS trong capture | 0,0205 / 0,0215 | 0,0102 / 0,0102 |
| Tổng resource transfer | 1.337.671 / 1.339.785 bytes | 678.857 / 680.973 bytes |

Chi tiết số liệu ở [performance.json](performance.json). Payload chỉ tăng khoảng 2,1KB ở cả hai viewport. Không phát sinh dependency/image payload mới; mỗi triptych dùng lại URL artwork của các chapter. CLS nhỏ đã có ở baseline, chênh lệch desktop khoảng 0,001; không có jump từ pin spacer hoặc thay đổi chiều cao scene. LCP ghi trong raw capture kéo dài qua lượt scroll nên không dùng như navigation LCP hoặc Core Web Vitals.

## Manual QA cần làm trên thiết bị thật

- [ ] Safari iOS và Chrome Android: portrait/landscape, notch/safe area, browser bars thu/mở, xoay giữa scene; không header che scene hoặc sticky jump.
- [ ] Scroll chậm/nhanh và reverse toàn trang; đánh giá cảm giác liên tục và độ mượt thực tế.
- [ ] Refresh giữa từng chapter/closing, Back/Forward từ app detail hoặc feedback; scroll position và scene đúng.
- [ ] Search/filter/reset khi đang ở giữa journey; mở app, GitHub, menu và feedback bằng touch/keyboard.
- [ ] Reduced Motion từ OS, bật/tắt rồi quay lại; nội dung và CTA đầy đủ.

WebKit automation không thay thế Safari iOS thật. Không merge hoặc deploy tự động.
