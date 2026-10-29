/**
 * THE CHROMA LAB: COLOR MIXING & SPECTRAL SYNTHESIS
 * Core Mathematics, Color Space Models, Physics Engines, and Interactive Telemetry
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. WEB AUDIO PROCEDURAL SYNTHESIZER
    // ========================================================================
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.lastSoundTime = 0;
      }

      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      }

      playTone(freq = 440, type = 'sine', duration = 0.2, gainVal = 0.08) {
        if (this.isMuted) return;
        try {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(gainVal, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + duration);
        } catch (e) {}
      }

      playBubble(freq = 520) {
        const now = Date.now();
        if (now - this.lastSoundTime < 60) return; // throttle slider ticks
        this.lastSoundTime = now;
        if (this.isMuted) return;
        try {
          this.init();
          if (!this.ctx) return;
          const t = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.08);

          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.08);
        } catch (e) {}
      }

      playChime(hue = 260) {
        // Map hue 0..360 to musical pentatonic frequencies 261Hz to 784Hz
        const baseFreq = 261.63 + (hue / 360) * 400;
        this.playTone(baseFreq, 'triangle', 0.35, 0.08);
      }

      playSuccess() {
        if (this.isMuted) return;
        try {
          this.init();
          [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.25, 0.08), i * 90);
          });
        } catch (e) {}
      }
    }

    const audio = new SoundEngine();

    // ========================================================================
    // 2. CURATED ARTISTIC & SPECTRAL COLOR DICTIONARY (200+ PIGMENT SHADES)
    // ========================================================================
    const COLOR_NAMES = [
      { name: 'Pure Crimson', hex: '#DC143C', cat: 'Red' },
      { name: 'Scarlet Vermilion', hex: '#FF2400', cat: 'Red' },
      { name: 'Imperial Ruby', hex: '#9B111E', cat: 'Red' },
      { name: 'Carmine Lake', hex: '#960018', cat: 'Red' },
      { name: 'Burnt Sienna', hex: '#E97451', cat: 'Red-Orange' },
      { name: 'Persian Orange', hex: '#D99058', cat: 'Orange' },
      { name: 'Cadmium Orange', hex: '#ED872D', cat: 'Orange' },
      { name: 'Tiger Lily', hex: '#E25822', cat: 'Orange' },
      { name: 'Golden Amber', hex: '#FFBF00', cat: 'Amber' },
      { name: 'Naples Yellow', hex: '#FADA5E', cat: 'Yellow' },
      { name: 'Cadmium Lemon', hex: '#FFF44F', cat: 'Yellow' },
      { name: 'Yellow Ochre', hex: '#C79D4C', cat: 'Yellow' },
      { name: 'Electric Chartreuse', hex: '#7FFF00', cat: 'Green-Yellow' },
      { name: 'Spring Pistachio', hex: '#93C572', cat: 'Green' },
      { name: 'Emerald Gem', hex: '#50C878', cat: 'Green' },
      { name: 'Viridian Oxide', hex: '#40826D', cat: 'Green' },
      { name: 'Malachite Green', hex: '#1FA055', cat: 'Green' },
      { name: 'Forest Jade', hex: '#00A86B', cat: 'Green' },
      { name: 'Celadon Mist', hex: '#ACE1AF', cat: 'Cyan-Green' },
      { name: 'Tiffany Turquoise', hex: '#0ABAB5', cat: 'Cyan' },
      { name: 'Electric Cyan', hex: '#00FFFF', cat: 'Cyan' },
      { name: 'Verdigris Patina', hex: '#43B3AE', cat: 'Cyan' },
      { name: 'Cerulean Sky', hex: '#007BA7', cat: 'Blue' },
      { name: 'Cobalt Azure', hex: '#0047AB', cat: 'Blue' },
      { name: 'French Ultramarine', hex: '#120A8F', cat: 'Blue' },
      { name: 'Lapis Lazuli', hex: '#26619C', cat: 'Blue' },
      { name: 'Prussian Midnight', hex: '#003153', cat: 'Deep Blue' },
      { name: 'Egyptian Blue', hex: '#1034A6', cat: 'Blue' },
      { name: 'Deep Indigo', hex: '#4B0082', cat: 'Violet' },
      { name: 'Royal Amethyst', hex: '#9966CC', cat: 'Violet' },
      { name: 'Tyrian Purple', hex: '#66023C', cat: 'Purple' },
      { name: 'Byzantine Violet', hex: '#702963', cat: 'Purple' },
      { name: 'Persian Rose', hex: '#FE28A2', cat: 'Magenta' },
      { name: 'Fuchsia Magenta', hex: '#FF00FF', cat: 'Magenta' },
      { name: 'Coral Blush', hex: '#F88379', cat: 'Pink-Coral' },
      { name: 'Terracotta Earth', hex: '#E2725B', cat: 'Brown-Orange' },
      { name: 'Raw Umber', hex: '#826644', cat: 'Brown' },
      { name: 'Burnt Umber', hex: '#8A3324', cat: 'Brown' },
      { name: 'Sepia Vintage', hex: '#704214', cat: 'Brown' },
      { name: 'Titanium White', hex: '#FFFFFF', cat: 'White' },
      { name: 'Ivory Cream', hex: '#FFFFF0', cat: 'White' },
      { name: 'Charcoal Noir', hex: '#36454F', cat: 'Gray' },
      { name: 'Obsidian Black', hex: '#0B0B0B', cat: 'Black' },
      { name: 'Slate Graphite', hex: '#708090', cat: 'Gray' },
      { name: 'Periwinkle Frost', hex: '#CCCCFF', cat: 'Lavender' }
    ];

    // ========================================================================
    // 3. COLOR CONVERSION & MATHEMATICS
    // ========================================================================
    function hexToRgb(hex) {
      hex = hex.replace('#', '').trim();
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      const num = parseInt(hex, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }

    function rgbToHex(r, g, b) {
      const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
      return '#' + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }

    function hslToRgb(h, s, l) {
      h /= 360; s /= 100; l /= 100;
      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    }

    function rgbToCmyk(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const k = 1 - Math.max(r, g, b);
      if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
      const c = (1 - r - k) / (1 - k);
      const m = (1 - g - k) / (1 - k);
      const y = (1 - b - k) / (1 - k);
      return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
      };
    }

    function rgbToOklch(r, g, b) {
      // sRGB to linear sRGB
      const srgbToLinear = (c) => {
        c /= 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      const lr = srgbToLinear(r);
      const lg = srgbToLinear(g);
      const lb = srgbToLinear(b);

      // linear sRGB to LMS
      const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
      const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
      const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

      const l_ = Math.cbrt(l);
      const m_ = Math.cbrt(m);
      const s_ = Math.cbrt(s);

      const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
      const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
      const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

      const C = Math.sqrt(a * a + b_ * b_);
      let h = Math.atan2(b_, a) * (180 / Math.PI);
      if (h < 0) h += 360;

      return {
        L: parseFloat(L.toFixed(2)),
        C: parseFloat(C.toFixed(2)),
        h: Math.round(h)
      };
    }

    function rgbToLab(r, g, b) {
      // Convert to XYZ first
      const pivotRgb = (c) => {
        c /= 255;
        return (c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92) * 100;
      };
      const r_ = pivotRgb(r);
      const g_ = pivotRgb(g);
      const b_ = pivotRgb(b);

      const x = (r_ * 0.4124 + g_ * 0.3576 + b_ * 0.1805) / 95.047;
      const y = (r_ * 0.2126 + g_ * 0.7152 + b_ * 0.0722) / 100.000;
      const z = (r_ * 0.0193 + g_ * 0.1192 + b_ * 0.9505) / 108.883;

      const pivotXyz = (n) => (n > 0.008856 ? Math.cbrt(n) : (7.787 * n) + (16 / 116));
      const fx = pivotXyz(x);
      const fy = pivotXyz(y);
      const fz = pivotXyz(z);

      return {
        L: (116 * fy) - 16,
        a: 500 * (fx - fy),
        b: 200 * (fy - fz)
      };
    }

    // Delta-E CIE76 perceptual distance
    function deltaE(rgb1, rgb2) {
      const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
      const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);
      return Math.sqrt(
        Math.pow(lab1.L - lab2.L, 2) +
        Math.pow(lab1.a - lab2.a, 2) +
        Math.pow(lab1.b - lab2.b, 2)
      );
    }

    // Relative Luminance for WCAG Contrast
    function getLuminance(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }

    function getContrastRatio(lum1, lum2) {
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }

    // ========================================================================
    // 4. MIXING PHYSICS ENGINES (SUBTRACTIVE, ADDITIVE, OKLCH)
    // ========================================================================

    /**
     * SUBTRACTIVE PIGMENT MIXING:
     * Models physical paint/acrylic/watercolor absorption spectra.
     * In paint, Yellow absorbs Blue; Cyan absorbs Red; Magenta absorbs Green.
     * When Yellow and Blue combine, Red and Blue are absorbed, transmitting Green.
     */
    function mixSubtractive(activeBuckets) {
      let totalWeight = 0;
      activeBuckets.forEach(b => { totalWeight += b.pct; });
      if (totalWeight === 0) return { r: 255, g: 255, b: 255 };

      let sumLogR = 0, sumLogG = 0, sumLogB = 0;
      let hasYellow = false, hasBlue = false, hasRed = false;

      activeBuckets.forEach(b => {
        const w = b.pct / totalWeight;
        const rgb = hexToRgb(b.color);
        let r = Math.max(0.02, rgb.r / 255);
        let g = Math.max(0.02, rgb.g / 255);
        let b_ = Math.max(0.02, rgb.b / 255);

        // Identify primary pigments
        if (r > 0.7 && g > 0.7 && b_ < 0.3) hasYellow = true;
        if (b_ > 0.7 && r < 0.4) hasBlue = true;
        if (r > 0.7 && g < 0.4 && b_ < 0.4) hasRed = true;

        // In physical pigment paint:
        // Blue paint has slight green/violet reflectance; red has amber
        if (b_ > 0.5 && r < 0.4) {
          g = Math.max(g, b_ * 0.4);
          r = Math.max(r, b_ * 0.2);
        }

        sumLogR += Math.log(r) * w;
        sumLogG += Math.log(g) * w;
        sumLogB += Math.log(b_) * w;
      });

      // Calculate mixed reflectance
      let refR = Math.exp(sumLogR);
      let refG = Math.exp(sumLogG);
      let refB = Math.exp(sumLogB);

      // If Red + Blue is dominant (and not yellow), suppress green to ensure deep purple/violet
      if (hasRed && hasBlue && !hasYellow) {
        refG *= 0.3;
        refR = Math.max(refR, 0.4);
        refB = Math.max(refB, 0.55);
      }

      // Normalize lightness to preserve rich paint saturation
      const maxRef = Math.max(refR, refG, refB);
      if (maxRef > 0) {
        const boost = Math.pow(maxRef, 0.4) / maxRef;
        refR = Math.min(1, refR * boost);
        refG = Math.min(1, refG * boost);
        refB = Math.min(1, refB * boost);
      }

      return {
        r: Math.round(refR * 255),
        g: Math.round(refG * 255),
        b: Math.round(refB * 255)
      };
    }

    /**
     * ADDITIVE LIGHT MIXING:
     * Models optical photon synthesis (stage lighting, digital screens).
     * Linear spectral summation.
     */
    function mixAdditive(activeBuckets) {
      let totalWeight = 0;
      activeBuckets.forEach(b => { totalWeight += b.pct; });
      if (totalWeight === 0) return { r: 0, g: 0, b: 0 };

      let sumR = 0, sumG = 0, sumB = 0;

      activeBuckets.forEach(b => {
        const rgb = hexToRgb(b.color);
        const w = b.pct / totalWeight;
        // Linearized RGB
        const linR = Math.pow(rgb.r / 255, 2.2);
        const linG = Math.pow(rgb.g / 255, 2.2);
        const linB = Math.pow(rgb.b / 255, 2.2);

        sumR += linR * w;
        sumG += linG * w;
        sumB += linB * w;
      });

      return {
        r: Math.round(Math.pow(Math.min(1, sumR), 1 / 2.2) * 255),
        g: Math.round(Math.pow(Math.min(1, sumG), 1 / 2.2) * 255),
        b: Math.round(Math.pow(Math.min(1, sumB), 1 / 2.2) * 255)
      };
    }

    /**
     * PERCEPTUAL OKLCH MIXING:
     * Interpolates in uniform OKLCH space without muddy gray dips.
     */
    function mixOklch(activeBuckets) {
      let totalWeight = 0;
      activeBuckets.forEach(b => { totalWeight += b.pct; });
      if (totalWeight === 0) return { r: 128, g: 128, b: 128 };

      let sumL = 0, sumC = 0, sumSinH = 0, sumCosH = 0;

      activeBuckets.forEach(b => {
        const rgb = hexToRgb(b.color);
        const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
        const w = b.pct / totalWeight;
        const rad = (oklch.h * Math.PI) / 180;

        sumL += oklch.L * w;
        sumC += oklch.C * w;
        sumSinH += Math.sin(rad) * w;
        sumCosH += Math.cos(rad) * w;
      });

      let avgH = Math.atan2(sumSinH, sumCosH) * (180 / Math.PI);
      if (avgH < 0) avgH += 360;

      // Convert back from polar OKLCH to RGB approximation via HSL bridge
      const approxHsl = {
        h: avgH,
        s: Math.min(100, sumC * 400),
        l: Math.min(100, Math.max(0, sumL * 100))
      };
      return hslToRgb(approxHsl.h, approxHsl.s, approxHsl.l);
    }

    // ========================================================================
    // 5. APPLICATION STATE
    // ========================================================================
    const state = {
      engine: 'subtractive', // 'subtractive' | 'additive' | 'oklch'
      normalize: true,
      buckets: [
        { id: 0, color: '#ef4444', pct: 40, enabled: true },
        { id: 1, color: '#3b82f6', pct: 35, enabled: true },
        { id: 2, color: '#f59e0b', pct: 25, enabled: true },
        { id: 3, color: '#ffffff', pct: 0, enabled: false }
      ],
      currentMixedRgb: { r: 139, g: 92, b: 246 },
      currentMixedHex: '#8B5CF6',
      quiz: {
        tier: 'beginner',
        targetHex: '#EC4899',
        targetRgb: { r: 236, g: 72, b: 153 },
        targetName: 'Persian Rose',
        matchPct: 74,
        roundsWon: 0,
        totalPoints: 0,
        streak: 0
      }
    };

    // ========================================================================
    // 6. DOM ELEMENT REFERENCES
    // ========================================================================
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');
    const audioLabel = document.getElementById('audioLabel');

    const navTabs = document.querySelectorAll('.nav-tab-btn');
    const tabViews = document.querySelectorAll('.tab-view-section');

    const segBtns = document.querySelectorAll('.seg-btn');
    const btnRandomizeMix = document.getElementById('btnRandomizeMix');
    const btnResetMix = document.getElementById('btnResetMix');

    // Chroma Orb Elements
    const chromaOrb = document.getElementById('chromaOrb');
    const orbOuterRing = document.getElementById('orbOuterRing');
    const orbColorNameBadge = document.getElementById('orbColorNameBadge');
    const orbColorHexBadge = document.getElementById('orbColorHexBadge');
    const metaColorCategory = document.getElementById('metaColorCategory');
    const metaLuminance = document.getElementById('metaLuminance');
    const metaWcagPass = document.getElementById('metaWcagPass');

    // Code cards
    const codeHex = document.getElementById('codeHex');
    const codeRgb = document.getElementById('codeRgb');
    const codeHsl = document.getElementById('codeHsl');
    const codeOklch = document.getElementById('codeOklch');
    const codeCmyk = document.getElementById('codeCmyk');
    const codeColorMix = document.getElementById('codeColorMix');
    const copyToastBanner = document.getElementById('copyToastBanner');

    // WCAG Cards
    const wcagDarkCard = document.getElementById('wcagDarkCard');
    const wcagDarkRatio = document.getElementById('wcagDarkRatio');
    const wcagDarkBadge = document.getElementById('wcagDarkBadge');
    const wcagLightCard = document.getElementById('wcagLightCard');
    const wcagLightRatio = document.getElementById('wcagLightRatio');
    const wcagLightBadge = document.getElementById('wcagLightBadge');

    // Harmonies & Ramps
    const harmoniesContainer = document.getElementById('harmoniesContainer');
    const tonalRampStrip = document.getElementById('tonalRampStrip');

    // Historical Recipes
    const recipesGrid = document.getElementById('recipesGrid');

    // Quiz Elements
    const quizTierBtns = document.querySelectorAll('.quiz-tier-btn');
    const quizTargetOrb = document.getElementById('quizTargetOrb');
    const quizTargetName = document.getElementById('quizTargetName');
    const quizCurrentOrb = document.getElementById('quizCurrentOrb');
    const quizCurrentName = document.getElementById('quizCurrentName');
    const quizMatchPct = document.getElementById('quizMatchPct');
    const quizMeterFill = document.getElementById('quizMeterFill');
    const quizEvalMessage = document.getElementById('quizEvalMessage');
    const btnSubmitMatch = document.getElementById('btnSubmitMatch');
    const btnNextChallenge = document.getElementById('btnNextChallenge');
    const quizRoundsWon = document.getElementById('quizRoundsWon');
    const quizTotalPoints = document.getElementById('quizTotalPoints');
    const quizStreak = document.getElementById('quizStreak');
    const quizStationsRow = document.getElementById('quizStationsRow');
    const quizHintText = document.getElementById('quizHintText');

    // ========================================================================
    // 7. HISTORICAL RECIPES DATASET
    // ========================================================================
    const HISTORICAL_RECIPES = [
      {
        id: 'tyrian-purple',
        name: 'Imperial Tyrian Purple',
        era: 'Phoenician Antiquity (1500 BCE)',
        desc: 'Extracted from the secretions of predatory sea snails (Bolinus brandaris). Reserved strictly for Roman Emperors and Byzantine royalty.',
        resultHex: '#581845',
        buckets: [
          { color: '#900c3f', pct: 60, enabled: true },
          { color: '#1a1a40', pct: 30, enabled: true },
          { color: '#c70039', pct: 10, enabled: true },
          { color: '#ffffff', pct: 0, enabled: false }
        ]
      },
      {
        id: 'ultramarine',
        name: 'True Lapis Ultramarine',
        era: 'Renaissance Masterpieces (14th Century)',
        desc: 'More precious than gold in the Renaissance. Ground from rare Lapis Lazuli stone mined in the remote mountains of Badakhshan, Afghanistan.',
        resultHex: '#120A8F',
        buckets: [
          { color: '#1e3a8a', pct: 70, enabled: true },
          { color: '#38bdf8', pct: 15, enabled: true },
          { color: '#4c1d95', pct: 15, enabled: true },
          { color: '#ffffff', pct: 0, enabled: false }
        ]
      },
      {
        id: 'egyptian-blue',
        name: 'Sacred Egyptian Blue',
        era: 'Old Kingdom of Egypt (2500 BCE)',
        desc: 'History’s earliest synthetic pigment. Made by synthesizing calcium copper silicate (cuprorivaite) in ancient temple kilns.',
        resultHex: '#1034A6',
        buckets: [
          { color: '#2563eb', pct: 60, enabled: true },
          { color: '#06b6d4', pct: 25, enabled: true },
          { color: '#1e1b4b', pct: 15, enabled: true },
          { color: '#ffffff', pct: 0, enabled: false }
        ]
      },
      {
        id: 'terracotta-ochre',
        name: 'Paleolithic Terracotta Ochre',
        era: 'Cave Paintings of Altamira (36,000 BCE)',
        desc: 'The original pigment of early human civilization. Natural clay hydrated with iron oxide (limonite & hematite) used in handprints and bison murals.',
        resultHex: '#C86446',
        buckets: [
          { color: '#b91c1c', pct: 45, enabled: true },
          { color: '#d97706', pct: 35, enabled: true },
          { color: '#78350f', pct: 20, enabled: true },
          { color: '#ffffff', pct: 0, enabled: false }
        ]
      },
      {
        id: 'verdigris-patina',
        name: 'Renaissance Verdigris Patina',
        era: 'Medieval Illumination & Chemistry (1200 CE)',
        desc: 'The distinct green-blue patina formed by hanging copper plates over fermenting wine vinegar pots in ancient Greece and medieval Italy.',
        resultHex: '#43B3AE',
        buckets: [
          { color: '#059669', pct: 45, enabled: true },
          { color: '#0284c7', pct: 40, enabled: true },
          { color: '#fef08a', pct: 15, enabled: true },
          { color: '#ffffff', pct: 0, enabled: false }
        ]
      },
      {
        id: 'tiffany-teal',
        name: 'Iconic Tiffany Robin Egg Blue',
        era: 'Gilded Age Haute Joaillerie (1845)',
        desc: 'Chosen by Charles Lewis Tiffany for the cover of Tiffany’s first Blue Book. A tranquil, light robin egg turquoise blend of cyan and pale cream.',
        resultHex: '#0ABAB5',
        buckets: [
          { color: '#06b6d4', pct: 55, enabled: true },
          { color: '#10b981', pct: 25, enabled: true },
          { color: '#ffffff', pct: 20, enabled: true },
          { color: '#000000', pct: 0, enabled: false }
        ]
      }
    ];

    // ========================================================================
    // 8. NEAREST COLOR NAME MATCHING (DELTA-E)
    // ========================================================================
    function getNearestColorName(targetRgb) {
      let minDistance = Infinity;
      let closest = COLOR_NAMES[0];

      COLOR_NAMES.forEach(c => {
        const rgb = hexToRgb(c.hex);
        const dist = deltaE(targetRgb, rgb);
        if (dist < minDistance) {
          minDistance = dist;
          closest = c;
        }
      });

      return {
        name: closest.name,
        category: closest.cat,
        distance: Math.round(minDistance)
      };
    }

    // ========================================================================
    // 9. CORE MIX COMPUTATION & RENDER PIPELINE
    // ========================================================================
    function updateMix() {
      const activeBuckets = state.buckets.filter(b => b.enabled && b.pct > 0);

      let mixedRgb;
      if (activeBuckets.length === 0) {
        mixedRgb = { r: 15, g: 23, b: 42 };
      } else if (activeBuckets.length === 1) {
        mixedRgb = hexToRgb(activeBuckets[0].color);
      } else {
        if (state.engine === 'subtractive') {
          mixedRgb = mixSubtractive(activeBuckets);
        } else if (state.engine === 'additive') {
          mixedRgb = mixAdditive(activeBuckets);
        } else {
          mixedRgb = mixOklch(activeBuckets);
        }
      }

      state.currentMixedRgb = mixedRgb;
      state.currentMixedHex = rgbToHex(mixedRgb.r, mixedRgb.g, mixedRgb.b);

      renderOrb();
      renderCodeInspector();
      renderHarmonies();
      renderQuizCurrentOrb();
    }

    function renderOrb() {
      const hex = state.currentMixedHex;
      const rgb = state.currentMixedRgb;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const lum = getLuminance(rgb.r, rgb.g, rgb.b);
      const nearest = getNearestColorName(rgb);

      // Central Orb Color & Outer Glow
      chromaOrb.style.backgroundColor = hex;
      orbOuterRing.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 55px ' + hex + '88';

      // Badges
      orbColorNameBadge.textContent = nearest.name;
      orbColorHexBadge.textContent = hex;
      metaColorCategory.textContent = 'Category: ' + nearest.category;
      metaLuminance.textContent = 'Luminance: ' + Math.round(lum * 100) + '%';

      // WCAG quick recommendation
      const contrastWhite = getContrastRatio(lum, 1.0);
      const contrastBlack = getContrastRatio(lum, 0.0);
      metaWcagPass.textContent = contrastWhite >= contrastBlack 
        ? 'WCAG: Best with Dark Text (' + contrastWhite.toFixed(1) + ':1)'
        : 'WCAG: Best with Light Text (' + contrastBlack.toFixed(1) + ':1)';
    }

    function renderCodeInspector() {
      const hex = state.currentMixedHex;
      const rgb = state.currentMixedRgb;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const oklch = rgbToOklch(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

      codeHex.textContent = hex;
      codeRgb.textContent = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
      codeHsl.textContent = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
      codeOklch.textContent = 'oklch(' + oklch.L + ' ' + oklch.C + ' ' + oklch.h + ')';
      codeCmyk.textContent = 'cmyk(' + cmyk.c + '%, ' + cmyk.m + '%, ' + cmyk.y + '%, ' + cmyk.k + '%)';

      // Build CSS color-mix() syntax from active buckets
      const active = state.buckets.filter(b => b.enabled && b.pct > 0);
      if (active.length >= 2) {
        codeColorMix.textContent = 'color-mix(in srgb, ' + active.map(b => b.color + ' ' + b.pct + '%').join(', ') + ')';
      } else if (active.length === 1) {
        codeColorMix.textContent = active[0].color;
      } else {
        codeColorMix.textContent = '#0F172A';
      }

      // WCAG Telemetry
      const lum = getLuminance(rgb.r, rgb.g, rgb.b);
      const darkRatio = getContrastRatio(lum, 0.015);
      const lightRatio = getContrastRatio(lum, 1.0);

      wcagDarkCard.style.color = hex;
      wcagDarkRatio.textContent = darkRatio.toFixed(1) + ':1';
      wcagDarkBadge.textContent = darkRatio >= 4.5 ? 'AA Pass' : (darkRatio >= 3.0 ? 'AA Large' : 'Fail');
      wcagDarkBadge.className = 'wcag-badge ' + (darkRatio >= 4.5 ? 'pass' : (darkRatio >= 3.0 ? 'pass' : 'fail'));

      wcagLightCard.style.color = hex;
      wcagLightRatio.textContent = lightRatio.toFixed(1) + ':1';
      wcagLightBadge.textContent = lightRatio >= 4.5 ? 'AA Pass' : (lightRatio >= 3.0 ? 'AA Large' : 'Fail');
      wcagLightBadge.className = 'wcag-badge ' + (lightRatio >= 4.5 ? 'pass' : (lightRatio >= 3.0 ? 'pass' : 'fail'));
    }

    // ========================================================================
    // 10. HARMONIES & TONAL RAMP GENERATION
    // ========================================================================
    function renderHarmonies() {
      if (!harmoniesContainer || !tonalRampStrip) return;
      const rgb = state.currentMixedRgb;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      const harmonies = [
        {
          title: 'Complementary Harmony',
          desc: 'Direct optical opposite ($180^\circ$ across the color wheel). Maximum chromatic contrast.',
          hues: [(hsl.h + 180) % 360]
        },
        {
          title: 'Triadic Chord',
          desc: 'Three equidistant colors ($120^\circ$ apart) offering high energy and balanced vibrancy.',
          hues: [(hsl.h + 120) % 360, (hsl.h + 240) % 360]
        },
        {
          title: 'Analogous Melody',
          desc: 'Neighboring adjacent hues ($\pm 30^\circ$) found together in nature and calming landscapes.',
          hues: [(hsl.h + 330) % 360, (hsl.h + 30) % 360]
        },
        {
          title: 'Split-Complementary',
          desc: 'The base color paired with the two shades flanking its direct complement.',
          hues: [(hsl.h + 150) % 360, (hsl.h + 210) % 360]
        }
      ];

      harmoniesContainer.innerHTML = harmonies.map(h => {
        const swatches = [hsl.h, ...h.hues].map(hueVal => {
          const swatchRgb = hslToRgb(hueVal, hsl.s, hsl.l);
          const swatchHex = rgbToHex(swatchRgb.r, swatchRgb.g, swatchRgb.b);
          return `
            <div class="harmony-swatch-box" style="background-color: ${swatchHex};" data-swatch-hex="${swatchHex}" title="Click to copy ${swatchHex}">
              <span class="hswatch-hex">${swatchHex}</span>
            </div>
          `;
        }).join('');

        return `
          <div class="harmony-card">
            <div class="harmony-card-header">
              <h4 class="harmony-title">${h.title}</h4>
              <p class="harmony-desc">${h.desc}</p>
            </div>
            <div class="harmony-swatches-row">
              ${swatches}
            </div>
          </div>
        `;
      }).join('');

      // Wire harmony swatch copy
      harmoniesContainer.querySelectorAll('.harmony-swatch-box').forEach(box => {
        box.addEventListener('click', () => {
          copyToClipboard(box.dataset.swatchHex);
          audio.playBubble(700);
        });
      });

      // 9-Step Tonal Luminance Ramp (10% to 90% Lightness)
      const rampSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      tonalRampStrip.innerHTML = rampSteps.map(lumVal => {
        const stepRgb = hslToRgb(hsl.h, hsl.s, lumVal);
        const stepHex = rgbToHex(stepRgb.r, stepRgb.g, stepRgb.b);
        return `
          <div class="ramp-cell" style="background-color: ${stepHex};" data-swatch-hex="${stepHex}" title="Lightness ${lumVal}%: ${stepHex}">
            <span class="ramp-cell-hex">${stepHex}</span>
          </div>
        `;
      }).join('');

      tonalRampStrip.querySelectorAll('.ramp-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          copyToClipboard(cell.dataset.swatchHex);
          audio.playBubble(750);
        });
      });
    }

    // ========================================================================
    // 11. HISTORICAL RECIPES RENDERING & LOADING
    // ========================================================================
    function renderHistoricalRecipes() {
      if (!recipesGrid) return;
      recipesGrid.innerHTML = HISTORICAL_RECIPES.map(rec => `
        <div class="recipe-card">
          <div>
            <div class="recipe-preview-circle" style="background-color: ${rec.resultHex};"></div>
            <span class="recipe-era">${rec.era}</span>
            <h3 class="recipe-name">${rec.name}</h3>
            <p class="recipe-desc">${rec.desc}</p>
          </div>
          <div>
            <div class="recipe-swatches-row" style="margin-bottom: 1rem;">
              ${rec.buckets.filter(b => b.enabled).map(b => `
                <div class="recipe-swatch-chip" style="background-color: ${b.color};" title="${b.color} (${b.pct}%)"></div>
              `).join('')}
            </div>
            <button type="button" class="btn btn-primary btn-sm btn-load-recipe" data-recipe-id="${rec.id}">
              + Load Formula into Mixer
            </button>
          </div>
        </div>
      `).join('');

      recipesGrid.querySelectorAll('.btn-load-recipe').forEach(btn => {
        btn.addEventListener('click', () => {
          const rec = HISTORICAL_RECIPES.find(r => r.id === btn.dataset.recipeId);
          if (rec) loadRecipeIntoMixer(rec);
        });
      });
    }

    function loadRecipeIntoMixer(rec) {
      rec.buckets.forEach((b, idx) => {
        state.buckets[idx].color = b.color;
        state.buckets[idx].pct = b.pct;
        state.buckets[idx].enabled = b.enabled;
        syncBucketUi(idx);
      });
      state.engine = 'subtractive';
      segBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.engine === 'subtractive');
      });

      updateMix();
      audio.playChime(260);

      // Switch to viewLab
      switchView('viewLab');
    }

    // ========================================================================
    // 12. BUCKET CONTROLS & INDEPENDENT SLIDER LOGIC
    // ========================================================================
    function syncBucketUi(idx) {
      const b = state.buckets[idx];
      const card = document.getElementById('bucketCard' + idx);
      const circle = document.getElementById('bucketFluid' + idx);
      const picker = document.getElementById('bucketPicker' + idx);
      const hexInput = document.getElementById('bucketHex' + idx);
      const slider = document.getElementById('bucketSlider' + idx);
      const pctLabel = document.getElementById('bucketPctLabel' + idx);
      const check = card ? card.querySelector('.bucket-enable-check') : null;

      if (!card) return;

      card.classList.toggle('bucket-disabled', !b.enabled);
      if (check) check.checked = b.enabled;

      if (circle) {
        circle.style.backgroundColor = b.color;
        circle.style.opacity = b.enabled ? '1' : '0.35';
      }
      if (picker) picker.value = b.color;
      if (hexInput) hexInput.value = b.color;
      if (slider) slider.value = b.pct;
      if (pctLabel) pctLabel.textContent = b.pct + '%';

      // Also sync in-quiz station if present
      const qCircle = document.getElementById('quizColorCircle' + idx);
      const qPicker = document.getElementById('quizNativePicker' + idx);
      const qSlider = document.getElementById('quizSlider' + idx);
      const qPct = document.getElementById('quizStationPctVal' + idx);
      if (qCircle) qCircle.style.backgroundColor = b.color;
      if (qPicker) qPicker.value = b.color;
      if (qSlider) qSlider.value = b.pct;
      if (qPct) qPct.textContent = b.pct + '%';
    }

    // Bind Bucket Events
    [0, 1, 2, 3].forEach(idx => {
      const card = document.getElementById('bucketCard' + idx);
      const picker = document.getElementById('bucketPicker' + idx);
      const hexInput = document.getElementById('bucketHex' + idx);
      const slider = document.getElementById('bucketSlider' + idx);
      const check = card.querySelector('.bucket-enable-check');

      if (picker) {
        picker.addEventListener('input', (e) => {
          state.buckets[idx].color = e.target.value.toUpperCase();
          if (hexInput) hexInput.value = state.buckets[idx].color;
          syncBucketUi(idx);
          updateMix();
          audio.playBubble(440 + idx * 60);
        });
      }

      if (hexInput) {
        hexInput.addEventListener('change', (e) => {
          let val = e.target.value.trim();
          if (!val.startsWith('#')) val = '#' + val;
          if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            state.buckets[idx].color = val.toUpperCase();
            syncBucketUi(idx);
            updateMix();
            audio.playBubble(500);
          } else {
            hexInput.value = state.buckets[idx].color;
          }
        });
      }

      // Smooth, completely independent slider adjustment (no jumping of other sliders!)
      if (slider) {
        slider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          state.buckets[idx].pct = val;
          const pctLabel = document.getElementById('bucketPctLabel' + idx);
          if (pctLabel) pctLabel.textContent = val + '%';
          updateMix();
          audio.playBubble(400 + val * 4);
        });
      }

      if (check) {
        check.addEventListener('change', (e) => {
          state.buckets[idx].enabled = e.target.checked;
          if (e.target.checked && state.buckets[idx].pct === 0) {
            state.buckets[idx].pct = 25;
          }
          syncBucketUi(idx);
          updateMix();
          audio.playBubble(600);
        });
      }
    });

    // ========================================================================
    // 13. CHROMA MATCH QUIZ & CHALLENGE
    // ========================================================================
    const QUIZ_TARGETS = {
      beginner: [
        { name: 'Persian Rose', hex: '#EC4899', hint: 'Red + White + hint of Blue' },
        { name: 'Spring Pistachio', hex: '#93C572', hint: 'Green + Yellow + White' },
        { name: 'Warm Amber', hex: '#F59E0B', hint: 'Yellow + Red' },
        { name: 'Deep Cobalt', hex: '#1D4ED8', hint: 'Blue + Dark Cyan' }
      ],
      intermediate: [
        { name: 'Terracotta Earth', hex: '#C86446', hint: 'Red + Amber + Brown' },
        { name: 'Verdigris Patina', hex: '#43B3AE', hint: 'Cyan + Green + White' },
        { name: 'Imperial Amethyst', hex: '#8B5CF6', hint: 'Violet + Cyan + Magenta' }
      ],
      master: [
        { name: 'Tyrian Snail Purple', hex: '#581845', hint: 'Crimson + Dark Blue + Magenta' },
        { name: 'Tiffany Robin Egg', hex: '#0ABAB5', hint: 'Cyan + Emerald + Titanium White' },
        { name: 'Charcoal Sepia', hex: '#4A3B32', hint: 'Umber + Black + Ochre' }
      ]
    };

    function getTierStationCount() {
      if (state.quiz.tier === 'beginner') return 2;
      if (state.quiz.tier === 'intermediate') return 3;
      return 4;
    }

    function renderQuizStations() {
      if (!quizStationsRow) return;
      const count = getTierStationCount();

      // Configure active stations for the current difficulty tier
      for (let i = 0; i < 4; i++) {
        if (i < count) {
          state.buckets[i].enabled = true;
          if (state.buckets[i].pct === 0) {
            state.buckets[i].pct = Math.round(100 / count);
          }
        } else {
          state.buckets[i].enabled = false;
          state.buckets[i].pct = 0;
        }
        syncBucketUi(i);
      }

      const quickColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FFFFFF', '#000000'];

      let html = '';
      for (let i = 0; i < count; i++) {
        const b = state.buckets[i];
        html += `
          <div class="quiz-station-card" data-station-idx="${i}">
            <div class="quiz-station-header">
              <span class="quiz-station-pill">Color ${i + 1}</span>
              <span class="quiz-station-pct-val" id="quizStationPctVal${i}">${b.pct}%</span>
            </div>
            
            <div class="quiz-circle-picker-wrap" title="Tap circle to choose custom color">
              <div class="quiz-color-circle" id="quizColorCircle${i}" style="background-color: ${b.color};">
                <input type="color" class="quiz-native-picker" id="quizNativePicker${i}" value="${b.color}" aria-label="Color ${i + 1} Picker">
              </div>
            </div>

            <div class="quiz-slider-wrap">
              <input type="range" class="quiz-station-slider" id="quizSlider${i}" min="0" max="100" value="${b.pct}" data-station-idx="${i}" aria-label="Color ${i + 1} Percentage">
            </div>

            <div class="quiz-quick-swatches">
              ${quickColors.map(c => `
                <button type="button" class="qswatch-dot" data-station-idx="${i}" data-color="${c}" style="background:${c};" title="Set to ${c}"></button>
              `).join('')}
            </div>
          </div>
        `;
      }
      quizStationsRow.innerHTML = html;

      // Bind input events
      for (let i = 0; i < count; i++) {
        const picker = document.getElementById('quizNativePicker' + i);
        const slider = document.getElementById('quizSlider' + i);
        const circle = document.getElementById('quizColorCircle' + i);
        const pctVal = document.getElementById('quizStationPctVal' + i);

        if (picker) {
          picker.addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            state.buckets[i].color = hex;
            if (circle) circle.style.backgroundColor = hex;
            syncBucketUi(i);
            updateMix();
            audio.playBubble(440 + i * 50);
          });
        }

        if (slider) {
          slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            state.buckets[i].pct = val;
            if (pctVal) pctVal.textContent = val + '%';
            syncBucketUi(i);
            updateMix();
            audio.playBubble(380 + val * 4);
          });
        }
      }

      // Quick color swatch chips
      quizStationsRow.querySelectorAll('.qswatch-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const idx = parseInt(dot.dataset.stationIdx, 10);
          const hex = dot.dataset.color;
          state.buckets[idx].color = hex;
          const circle = document.getElementById('quizColorCircle' + idx);
          const picker = document.getElementById('quizNativePicker' + idx);
          if (circle) circle.style.backgroundColor = hex;
          if (picker) picker.value = hex;
          syncBucketUi(idx);
          updateMix();
          audio.playBubble(520);
        });
      });
    }

    function startNewQuizTarget() {
      const pool = QUIZ_TARGETS[state.quiz.tier] || QUIZ_TARGETS.beginner;
      const target = pool[Math.floor(Math.random() * pool.length)];

      state.quiz.targetHex = target.hex;
      state.quiz.targetRgb = hexToRgb(target.hex);
      state.quiz.targetName = target.name;

      quizTargetOrb.style.backgroundColor = target.hex;
      quizTargetName.textContent = target.name;
      if (quizHintText) {
        quizHintText.textContent = '💡 Hint: ' + target.hint;
      }

      renderQuizStations();
      renderQuizCurrentOrb();
      audio.playBubble(650);
    }

    function renderQuizCurrentOrb() {
      if (!quizCurrentOrb) return;
      const hex = state.currentMixedHex;
      const rgb = state.currentMixedRgb;

      quizCurrentOrb.style.backgroundColor = hex;
      quizCurrentName.textContent = orbColorNameBadge.textContent;

      // Calculate accuracy
      const dist = deltaE(rgb, state.quiz.targetRgb);
      const matchPct = Math.max(0, Math.min(100, Math.round(100 - dist * 1.1)));
      state.quiz.matchPct = matchPct;

      quizMatchPct.textContent = matchPct + '% Match';
      quizMeterFill.style.width = matchPct + '%';

      if (matchPct >= 95) {
        quizEvalMessage.innerHTML = '🎉 <strong style="color: var(--accent-emerald);">Sensational! 95%+ Precision Match!</strong>';
      } else if (matchPct >= 80) {
        quizEvalMessage.innerHTML = '✨ <strong>Very close! Fine-tune bucket volume ratios.</strong>';
      } else {
        quizEvalMessage.innerHTML = 'Adjust bucket colors and sliders to match the left target!';
      }
    }

    btnSubmitMatch.addEventListener('click', () => {
      if (state.quiz.matchPct >= 95) {
        state.quiz.roundsWon++;
        const points = 100 + (state.quiz.tier === 'master' ? 100 : (state.quiz.tier === 'intermediate' ? 50 : 25));
        state.quiz.totalPoints += points;
        state.quiz.streak++;

        quizRoundsWon.textContent = state.quiz.roundsWon;
        quizTotalPoints.textContent = state.quiz.totalPoints;
        quizStreak.textContent = state.quiz.streak + ' 🔥';

        audio.playSuccess();
        alert('🏆 Outstanding! Master Colorist match achieved with ' + state.quiz.matchPct + '% accuracy! Earned +' + points + ' points!');
        startNewQuizTarget();
      } else {
        audio.playTone(220, 'sawtooth', 0.25, 0.08);
        alert('Your current match is ' + state.quiz.matchPct + '%. Keep tweaking your buckets to reach 95%+ accuracy!');
      }
    });

    btnNextChallenge.addEventListener('click', () => {
      startNewQuizTarget();
    });

    quizTierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        quizTierBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.quiz.tier = btn.dataset.tier;
        startNewQuizTarget();
      });
    });

    // ========================================================================
    // 14. CLIPBOARD COPY UTILITIES
    // ========================================================================
    function copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showCopyToast();
    }

    function showCopyToast() {
      if (!copyToastBanner) return;
      copyToastBanner.classList.add('show');
      setTimeout(() => copyToastBanner.classList.remove('show'), 1800);
    }

    // Code card click-to-copy
    document.querySelectorAll('.code-card').forEach(card => {
      card.addEventListener('click', () => {
        const targetId = card.dataset.copyTarget;
        const el = document.getElementById(targetId);
        if (el) {
          copyToClipboard(el.textContent);
          audio.playBubble(620);
        }
      });
    });

    // Chroma Orb click-to-copy HEX
    chromaOrb.addEventListener('click', () => {
      copyToClipboard(state.currentMixedHex);
      audio.playBubble(720);
    });

    // ========================================================================
    // 15. TOOLBAR BUTTONS & NAVIGATION
    // ========================================================================
    segBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        segBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.engine = btn.dataset.engine;
        updateMix();
        audio.playChime(300);
      });
    });



    btnRandomizeMix.addEventListener('click', () => {
      const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
      state.buckets[0].color = randomHex();
      state.buckets[1].color = randomHex();
      state.buckets[2].color = randomHex();
      state.buckets[0].pct = 40;
      state.buckets[1].pct = 35;
      state.buckets[2].pct = 25;
      state.buckets[3].pct = 0;
      state.buckets[3].enabled = false;

      state.buckets.forEach((_, i) => syncBucketUi(i));
      updateMix();
      audio.playChime(350);
    });

    btnResetMix.addEventListener('click', () => {
      state.buckets[0] = { id: 0, color: '#EF4444', pct: 40, enabled: true };
      state.buckets[1] = { id: 1, color: '#3B82F6', pct: 35, enabled: true };
      state.buckets[2] = { id: 2, color: '#F59E0B', pct: 25, enabled: true };
      state.buckets[3] = { id: 3, color: '#FFFFFF', pct: 0, enabled: false };
      state.engine = 'subtractive';

      segBtns.forEach(b => b.classList.toggle('active', b.dataset.engine === 'subtractive'));
      state.buckets.forEach((_, i) => syncBucketUi(i));
      updateMix();
      audio.playChime(260);
    });

    // Navigation Switcher
    function switchView(targetTabId) {
      navTabs.forEach(tab => {
        const isActive = tab.dataset.tab === targetTabId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      tabViews.forEach(view => {
        view.classList.toggle('active', view.id === targetTabId);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
      audio.playBubble(580);
    }

    navTabs.forEach(tab => {
      tab.addEventListener('click', () => switchView(tab.dataset.tab));
    });

    // Audio Toggle
    audioToggleBtn.addEventListener('click', () => {
      audio.isMuted = !audio.isMuted;
      audioIcon.textContent = audio.isMuted ? '🔇' : '🔊';
      audioLabel.textContent = audio.isMuted ? 'Sound: OFF' : 'Sound: ON';
      if (!audio.isMuted) audio.playChime(320);
    });

    // ========================================================================
    // 16. BOOTSTRAP INITIALIZATION
    // ========================================================================
    state.buckets.forEach((_, i) => syncBucketUi(i));
    renderHistoricalRecipes();
    startNewQuizTarget();
    updateMix();

    console.log('[ChromaLab] Initialized with Subtractive, Additive, and OKLCH color synthesis engines.');
  });
})();
