import { ImageResponse } from "next/og";

export const alt = "Tatsuki Kuwano — AR / AI / 3D Creative Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "58px 64px",
        color: "#e8ece7",
        background: "#050808",
        border: "14px solid #a8ff1f",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 5 }}>
        <span>TK / PORTFOLIO</span><span>AR — AI — WEB — 3D</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 116, fontWeight: 800, lineHeight: 0.83, letterSpacing: -6 }}>
        <span>TATSUKI</span><span style={{ color: "#a8ff1f" }}>KUWANO</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24 }}>
        <span>CREATIVE DEVELOPER</span><span style={{ color: "#00e8d0" }}>EXPERIENCE BEYOND THE SCREEN.</span>
      </div>
    </div>,
    size,
  );
}
