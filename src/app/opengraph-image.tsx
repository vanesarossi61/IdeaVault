import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "IdeaVault — Validated Business Ideas & Market Intelligence";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #7c3aed22 0%, transparent 50%), radial-gradient(circle at 75% 75%, #a855f722 0%, transparent 50%)",
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
              fontSize: 44,
            }}
          >
            <span style={{ color: "white" }}>IV</span>
          </div>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              background: "linear-gradient(90deg, #c4b5fd, #a855f7)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            IdeaVault
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Discover data-validated business ideas, market trends, builder tools,
          and startup post-mortems.
        </div>

        {/* Stats Bar */}
        <div
          style={{
            display: "flex",
            gap: 60,
            marginTop: 50,
          }}
        >
          {[
            { label: "Ideas", value: "200+" },
            { label: "Trends", value: "50+" },
            { label: "Tools", value: "100+" },
            { label: "Post-Mortems", value: "300+" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#c4b5fd",
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: 16, color: "#71717a" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 18,
            color: "#52525b",
          }}
        >
          ideavault.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
