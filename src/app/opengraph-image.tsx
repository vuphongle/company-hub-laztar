import { ImageResponse } from "next/og";

export const alt = "LAZTAR Hub — Play. Build. Share.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        width: "100%", height: "100%", padding: 72, background: "#fffaf0",
        color: "#101936", border: "20px solid #f3b022",
      }}>
        <div style={{ display: "flex", fontSize: 28 }}>laztar.xyz</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 100, fontWeight: 700 }}>LAZTAR Hub</div>
          <div style={{ display: "flex", fontSize: 44 }}>Play. Build. Share.</div>
        </div>
        <div style={{ display: "flex", fontSize: 26 }}>Games · Music · Experiments</div>
      </div>
    ),
    size,
  );
}
