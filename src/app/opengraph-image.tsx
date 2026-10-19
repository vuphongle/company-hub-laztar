import { ImageResponse } from "next/og";

export const alt = "LAZTAR Hub — Play. Build. Share.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        width: "100%", height: "100%", padding: 72, background: "#18151f",
        color: "#fffdf8", border: "20px solid #b9f24a",
      }}>
        <div style={{ display: "flex", fontSize: 28, color: "#b9f24a" }}>laztar.xyz / playground</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 100, fontWeight: 700 }}>Make room for weird.</div>
          <div style={{ display: "flex", fontSize: 44, color: "#b9f24a" }}>Play. Build. Experiment. Share.</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#ff6b4a" }}>Games · Music · Experiments</div>
      </div>
    ),
    size,
  );
}
