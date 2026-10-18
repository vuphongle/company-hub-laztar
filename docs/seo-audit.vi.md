# Phân tích SEO cho LAZTAR

Kiểm tra HTTP và HTML công khai ngày 18/10/2026. Đây là đánh giá kỹ thuật và nội dung; chưa có quyền đọc Google Search Console nên chưa xác định được trạng thái lập chỉ mục, truy vấn, backlink, thao tác thủ công hoặc nguyên nhân chính xác website không xuất hiện trên Google.

## Phát hiện trên website đang chạy

| Hạng mục | Kết quả quan sát | Ý nghĩa |
| --- | --- | --- |
| `https://laztar.xyz/` | HTTP 200, nội dung và liên kết ứng dụng có sẵn trong HTML, không có `noindex` hay `X-Robots-Tag` chặn index | Không thấy lệnh cấm lập chỉ mục ở trang chủ lúc kiểm tra |
| HTTP → HTTPS | Tự chuyển về HTTPS | Đã có phiên bản HTTPS chính |
| `/robots.txt` | HTTP 404 | Không đồng nghĩa Google bị chặn; thiếu nơi khai báo sitemap |
| `/sitemap.xml` | HTTP 404 | Chưa có danh sách URL giúp Google phát hiện trang |
| Title / description | `LAZTAR Hub` / “Internal playground…” | Có thương hiệu nhưng mô tả chưa giúp người tìm hiểu rõ các sản phẩm |
| Canonical | Chưa có | Chưa khai báo rõ URL ưu tiên khi có biến thể URL |
| Nội dung | Một trang danh mục ngắn và một form góp ý | Ít nội dung để khớp các truy vấn ngoài thương hiệu |
| `www.laztar.xyz` | Không phân giải DNS từ môi trường kiểm tra | Có thể bổ sung DNS/TLS và redirect 301/308 về tên miền chính; không bắt buộc cho việc index laztar.xyz |

`noindex` xuất hiện ở HTML của các URL 404 là hành vi đúng của Next.js, không phải lệnh chặn trang chủ.

## Các ứng dụng liên quan

| Host | Kết quả | Việc nên làm |
| --- | --- | --- |
| `werewolves-game.laztar.xyz` | Trang chủ HTTP 200; title “Làng trong rừng · Ma Sói”, description ngắn; robots và sitemap 404 | Thêm thương hiệu LAZTAR, nội dung hướng dẫn chơi, canonical và sitemap trong dự án Ma Sói |
| `music.laztar.xyz` | `/` HTTP 401 tại thời điểm kiểm tra | Nếu là ứng dụng nội bộ thì giữ quyền truy cập; dùng trang giới thiệu công khai trên Hub để giải thích sản phẩm |
| `saoke.laztar.xyz` | Chuyển `/` về `/vi`; canonical trỏ `https://tranx.vn`; robots và sitemap cũng dùng `tranx.vn` | Nếu muốn index dưới LAZTAR, sửa URL gốc/canonical/sitemap trong dự án Sao kê. Đây là tín hiệu hợp nhất sang tên miền khác, cần ưu tiên kiểm tra |

Các dự án con là những website riêng: sitemap của Hub không thay thế sitemap và cấu hình SEO của chúng. Không sửa mã nguồn hay runtime của các dự án con trong thay đổi này.

## Thay đổi trong mã nguồn Hub

- Cấu hình chung tại `src/config/site.ts`, dùng URL chính `https://laztar.xyz`.
- Khai báo rõ phạm vi: `LAZTAR Hub` là dự án nội bộ do nhân viên và thành viên `LAZTAR` xây dựng, không phải website giới thiệu công ty hoặc dịch vụ. Liên kết một chiều về `https://laztar.com` chỉ để người dùng tìm thông tin chính thức; JSON-LD ghi nhận nhóm phát triển nội bộ là publisher và công ty là `parentOrganization`, tránh nhận Hub là website chính thức.
- Title, description, canonical riêng cho từng trang công khai; Open Graph, Twitter card và ảnh chia sẻ sinh bằng code.
- JSON-LD `WebSite` có tên LAZTAR Hub và tên thay thế LAZTAR; `ItemList` khớp ứng dụng hiển thị. Breadcrumb cho các trang ứng dụng.
- Trang chủ có nội dung giải thích LAZTAR Hub, các nhóm nhu cầu chính và FAQ hiển thị; mỗi trang app có JSON-LD `SoftwareApplication` cùng breadcrumb.
- Thêm `/about` và `/apps/werewolf`, `/apps/office-jukebox`, `/apps/statements`, mô tả mục đích và cách bắt đầu. Trang được dựng sẵn, có liên kết HTML từ danh mục.
- Thêm robots cho phép crawl và khai báo sitemap. Sitemap chỉ chứa 5 trang có thể index trên tên miền chính, không chứa form, admin, URL lỗi hay tên miền ứng dụng khác.
- `noindex` cho form góp ý và toàn bộ cây `/admin`. Không chặn crawl các trang này trong robots để Google có thể đọc `noindex`. Authentication tiếp tục kiểm soát quyền truy cập.
- Hỗ trợ biến `GOOGLE_SITE_VERIFICATION` khi chọn xác minh Search Console bằng HTML meta tag. Không cần biến này nếu xác minh Domain property qua DNS.
- Không thêm meta keywords, đánh giá giả, số người dùng giả hay schema tìm kiếm không có chức năng tương ứng. Ảnh chia sẻ giúp hiển thị liên kết trên mạng xã hội, không phải yếu tố bảo đảm thứ hạng Google.

Không tạo ngày `lastmod` theo thời gian mỗi lần build: chỉ thêm khi có ngày thay đổi nội dung thực tế.

### URL công khai bằng tiếng Anh

Theo yêu cầu chủ website, các đường dẫn được chuyển sang tiếng Anh. Nội dung và tên hiển thị vẫn bằng tiếng Việt. Sitemap, canonical, Open Graph, JSON-LD và liên kết nội bộ đều sử dụng URL mới; các URL cũ được chuyển hướng HTTP 308, giữ nguyên query string:

| URL cũ | URL mới |
| --- | --- |
| `/gioi-thieu` | `/about` |
| `/ung-dung/ma-soi` | `/apps/werewolf` |
| `/ung-dung/office-jukebox` | `/apps/office-jukebox` |
| `/ung-dung/sao-ke` | `/apps/statements` |

Định danh ứng dụng trong feedback (`ma-soi`, `office-jukebox`, `sao-ke`) không đổi. Trang chủ và URL sitemap vẫn giữ nguyên. Sau khi triển khai, yêu cầu Google index các URL mới; không cần gửi yêu cầu index URL cũ. Google có thể cần thời gian đọc lại sitemap và chuyển hướng.

## Việc cần làm sau khi triển khai

1. Triển khai bản build mới lên môi trường phục vụ laztar.xyz bằng quy trình vận hành hiện có. Các thay đổi trong repository không tự xuất hiện trên website đang chạy.
2. Chạy kiểm tra từ bên ngoài:

   ```bash
   SEO_TEST_BASE_URL=https://laztar.xyz npm run test:seo
   ```

3. Mở [Google Search Console](https://search.google.com/search-console), thêm **Domain property** `laztar.xyz` và xác minh bằng bản ghi DNS TXT mà Google cung cấp. Loại property này bao gồm các subdomain. Không chia sẻ quyền truy cập hay token bí mật vào mã nguồn.
4. Trong **Sitemaps**, gửi `https://laztar.xyz/sitemap.xml`. Gửi thêm sitemap riêng của ứng dụng con sau khi chúng được cấu hình đúng.
5. Trong **URL Inspection**, kiểm tra `https://laztar.xyz/`, chạy **Test live URL**, xem rendered HTML và yêu cầu index. Lặp lại cho trang giới thiệu và các trang ứng dụng quan trọng. Không cần gửi lặp hằng ngày.
6. Theo dõi **Page indexing**: phân biệt “Discovered – currently not indexed”, “Crawled – currently not indexed”, trang bị `noindex`, lỗi máy chủ và canonical Google chọn. Kiểm tra **Manual actions** và **Security issues** nếu có thông báo.
7. Nếu cần cung cấp phiên bản `www`, thêm DNS, chứng chỉ và redirect về `https://laztar.xyz`; không tạo hai phiên bản có nội dung trùng nhau.

## Lộ trình nội dung và đo lường

### Nghiên cứu truy vấn sơ bộ (18/10/2026)

Kiểm tra gợi ý Google bằng giao diện tiếng Việt cho các tên thương hiệu và chức năng
đang có trên Hub. Đây là tín hiệu định hướng nội dung, không phải số liệu volume,
CTR hay độ cạnh tranh; các truy vấn thương hiệu như `LAZTAR Hub` và `Office Jukebox
LAZTAR` chưa có gợi ý đủ tin cậy để kết luận có nhu cầu tìm kiếm lớn.

| Cụm truy vấn ưu tiên | Ý định | URL nên đáp ứng | Cách triển khai |
| --- | --- | --- | --- |
| `LAZTAR`, `LAZTAR Hub`, `ứng dụng nội bộ LAZTAR` | Tìm thương hiệu | `/`, `/about` | Giữ tên thương hiệu nhất quán; mô tả Hub là danh mục app nội bộ và liên kết về từng project |
| `Ma Sói online`, `Ma Sói online với bạn bè` | Tìm game để chơi | `/apps/werewolf` | Mô tả chơi trên trình duyệt, nhóm bạn/đồng nghiệp, quản trò tự động và các bước bắt đầu |
| `quản trò Ma Sói tự động` | Tìm chức năng cụ thể | `/apps/werewolf` | Chỉ dùng khi tính năng thực tế còn đúng; cập nhật hướng dẫn theo phiên bản game |
| `Office Jukebox`, `bình chọn nhạc văn phòng`, `chọn nhạc văn phòng` | Tìm công cụ âm nhạc nhóm | `/apps/office-jukebox` | Giải thích chọn bài, bình chọn, điều kiện truy cập và bối cảnh dùng trong văn phòng |
| `Sao kê LAZTAR`, `dashboard lì xì` | Tìm dự án/trải nghiệm thử nghiệm | `/apps/statements` | Nêu rõ đây là dashboard thử nghiệm, ngữ cảnh số liệu và giới hạn; không gọi là dịch vụ tài chính |

Không nên tạo trang riêng cho từng biến thể từ khóa hoặc lặp cụm từ trong metadata.
Mỗi URL cần trả lời trọn một nhu cầu thật. Sau khi triển khai, lấy **Queries** và
**Pages** trong Search Console để thay thứ tự ưu tiên bằng impressions, CTR và vị trí
thực tế; dùng Google Keyword Planner nếu cần volume thị trường.

### Tuần đầu: giúp Google hiểu thương hiệu

- Giữ thống nhất tên LAZTAR / LAZTAR Hub trong website, repository GitHub và các hồ sơ công khai thực sự thuộc dự án.
- Không cần tạo liên kết ngược từ `laztar.com` về Hub. Hai website giữ mục đích và canonical độc lập; chỉ duy trì liên kết một chiều từ Hub tới website chính thức của công ty để phân biệt phạm vi.
- Thêm liên kết về Hub và trang giới thiệu ứng dụng trong README GitHub, website dự án và các kênh đang sở hữu. Liên kết phải hữu ích cho người đọc.
- Đọc lại phần giới thiệu từng ứng dụng với người phụ trách sản phẩm; cập nhật ảnh chụp, điều kiện truy cập và hướng dẫn thực tế khi có thay đổi.
- Xác nhận lại canonical `tranx.vn` của Sao kê có phải chủ đích hay cấu hình sót từ bản mẫu.

### Tuần 2–4: mở rộng theo nhu cầu thật

| Nhóm truy vấn | Trang phù hợp | Nội dung nên phát triển |
| --- | --- | --- |
| `laztar`, `laztar hub`, `ứng dụng laztar` | Trang chủ, giới thiệu | LAZTAR là gì, dự án nào đang có, ai dùng được, cách góp ý |
| `ma sói laztar`, `ma sói quản trò tự động` | Trang giới thiệu Ma Sói và trang công khai của game | Hướng dẫn tạo/tham gia ván theo chức năng thực tế, luật chơi, vai trò, xử lý lỗi |
| `office jukebox laztar`, `bình chọn nhạc văn phòng` | Trang Office Jukebox | Cách dùng, quyền truy cập và cách nhóm cùng chọn nhạc |
| `sao kê laztar`, `dashboard lì xì` | Trang Sao kê và ứng dụng | Mục đích thử nghiệm, giải thích số liệu, giới hạn và ngữ cảnh sử dụng |

Đây là các chủ đề đề xuất theo chức năng dự án, chưa phải kết quả nghiên cứu lượng tìm kiếm hay độ cạnh tranh. Không hứa xếp hạng cho từ rộng như “ma sói” hoặc “sao kê”. Mỗi bài cần trả lời một nhu cầu cụ thể bằng nội dung thực tế; tránh tạo hàng loạt trang mỏng chỉ thay từ khóa.

### Theo dõi hằng tuần trong 4–8 tuần đầu

- **Indexing:** sitemap được đọc chưa; bao nhiêu trang công khai đã index; Google có chọn đúng canonical không.
- **Search performance:** impressions, clicks, CTR, vị trí theo truy vấn LAZTAR và từng URL. So sánh cùng khoảng thời gian; không gộp truy vấn thương hiệu với truy vấn rộng khi đánh giá hiệu quả.
- **Trải nghiệm:** kiểm tra PageSpeed Insights trên mobile; theo dõi LCP, INP, CLS khi Search Console có đủ dữ liệu. Chưa đo Core Web Vitals trong audit này.
- Ưu tiên cải thiện trang đã có impressions: title/mô tả rõ hơn, câu trả lời đầy đủ hơn và liên kết nội bộ phù hợp. Không cần thay metadata liên tục nếu chưa có dữ liệu.

Google có thể cần vài ngày đến vài tuần hoặc lâu hơn để crawl và index; không có thời hạn hay thứ hạng được bảo đảm. Sitemap, canonical và schema giúp phát hiện và hiểu nội dung, không thay thế chất lượng nội dung, mức độ liên quan và uy tín từ các nguồn khác.

## Kiểm tra cho lập trình viên

```bash
npm run lint
npm run typecheck
npm test
npm run build
# Khi ứng dụng đã chạy, có database đã migrate:
npm run test:seo
npm run test:integration
```

`test:seo` chỉ đọc HTTP, không gửi góp ý hay sửa dữ liệu. Nó kiểm tra HTML trả cho Googlebot, canonical, metadata, JSON-LD, liên kết, ảnh chia sẻ, robots, sitemap, noindex và HTTP 404.

Tài liệu tham khảo: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [site names](https://developers.google.com/search/docs/appearance/site-names).
