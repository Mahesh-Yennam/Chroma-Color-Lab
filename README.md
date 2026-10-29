# The Chroma Lab: Color Mixing & Spectral Synthesis Explorer

An interactive chromatic physics laboratory, pigment alchemy simulator, and optical synthesis explorer. Built with 100% client-side vanilla web technologies (HTML5, CSS3, JavaScript, Web Audio API).

## 🌟 Core Features

- **Central Circular Chroma Orb**: A live, animated viewport at the center of the screen that dynamically blends and morphs as you adjust color buckets and percentages.
- **4-Slot Interactive Color Bucket Dock**: 4 circular color stations with native pickers, quick-swatch palettes, direct hex inputs, and percentage/weight sliders.
- **Physical Subtractive Pigment vs. Optical Additive Light**:
  - **Subtractive (Pigment)**: Simulates physical paint, acrylics, and watercolor (e.g., *Yellow + Blue = Green*, *Cyan + Magenta = Deep Violet*).
  - **Additive (Light)**: Simulates optical spotlights and digital screens (e.g., *Red + Green = Yellow*, *Red + Green + Blue = White*).
  - **Modern OKLCH**: Uniform perceptual blending with zero muddy gray dead zones.
- **1-Click Multi-Format Export**: Instantly copy **HEX**, **RGB**, **RGBA**, **HSL**, **OKLCH**, **CMYK**, and native CSS `color-mix()` code.
- **Perceptual Color Name Classifier**: Identifies the nearest named color shade from a comprehensive dictionary of 1,200+ artistic pigments.
- **Color Harmonies & Palette Expansion**: Derives Complementary, Triadic, Analogous, Split-Complementary, and 7-step Tint/Shade ramps.
- **Historical Pigment Recipes**: 1-click loading of legendary artist paints (*Tyrian Purple*, *French Ultramarine*, *Egyptian Blue*, *Terracotta*, *Tiffany Teal*).
- **Chroma Match Quiz**: Interactive challenge where users adjust color ratios to recreate mystery target colors with real-time Delta-E match feedback.
- **Procedural Web Audio API Sound**: Subtle fluid droplet sounds, chimes, and fanfare.

## 🚀 Local Run

To run locally:
```bash
npx serve .
# or
python -m http.server 8080
```
Open `http://localhost:8080/index.html` in your browser.

## 📄 License
MIT License. Part of the [Gamility](https://mahesh-yennam.github.io/Gamility/) project.
