import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kim",
    short_name: "Kim",
    description: "Kim AI agent web app with chat, tools, voice, files, and 3D presence.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050714",
    theme_color: "#050714",
    icons: [
      {
        src: "/models/kim-avatar.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/models/kim-avatar.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
