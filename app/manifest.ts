import type { MetadataRoute } from "next";

/**
 * Web App Manifest（移动端添加到主屏 / 主题色）。
 * 品牌：YAZIMAO（中文：鸭子毛）。
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YAZIMAO — Every Creation Matters.",
    short_name: "YAZIMAO",
    description:
      "A public network for human creation. Every creation matters — writing, music, art, video, ideas and digital works.",
    start_url: "/",
    display: "standalone",
    background_color: "#04060B",
    theme_color: "#04060B",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
