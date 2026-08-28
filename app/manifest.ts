import type { MetadataRoute } from "next";

/**
 * Web App Manifest（移动端添加到主屏 / 主题色）。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nova Layer1",
    short_name: "Nova",
    description:
      "Next Generation Decentralized Infrastructure — Layer1, storage, compute, gaming, and node network.",
    start_url: "/",
    display: "standalone",
    background_color: "#04060B",
    theme_color: "#04060B",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
