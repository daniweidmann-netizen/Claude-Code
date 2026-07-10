import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#050506",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "-100px",
            width: "700px",
            height: "700px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(216,180,120,0.55) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-220px",
            right: "-120px",
            width: "600px",
            height: "600px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(124,108,240,0.5) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        <div style={{ display: "flex", fontSize: 40, color: "#f4f3ef", letterSpacing: "-0.02em" }}>
          Shop<span style={{ color: "#d8b478" }}>Werk</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 68,
              color: "#f4f3ef",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Digitale Erlebnisse, die Kunden überzeugen.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 26, color: "#9a9aa4" }}>
            Premium Webdesign Agentur aus Grafstal, Schweiz
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
