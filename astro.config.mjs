import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://canberramaker.space",
  // Keep pre-v7 lossless whitespace handling - the "jsx" default drops
  // spaces between text and links that sit on separate lines
  compressHTML: true,
});
