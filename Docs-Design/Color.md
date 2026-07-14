# 🎨 MMDU Incentives Design Reference

This folder contains local assets, variables, and specs for development. **This directory is ignored by Git and will not be pushed to production or GitHub.**

---

## 🛑 Core Brand Colors

- 🏢 **Asphalt (Main Dark Background)**: `#050101`
- 🎒 **Red (Primary Accent)**: `#de0404`
- 🍒 **Red Berry (Secondary Accent)**: `#8c0404`
- 🪙 **Gray (Muted Text/Icons)**: `#807d7d`
- 🏳️ **White**: `#ffffff`

---

## 📈 Color Palette Shades (Tailwind Scale Map)

Use these exact values when creating layouts or adjusting custom designs in your frontend template.

### 🔘 UI Gray Scale

- `ui-gray-50`: `#c5c3c3`
- `ui-gray-100`: `#b3b1b1`
- `ui-gray-200`: `#a19f9f`
- `ui-gray-300`: `#908d8d`
- `ui-gray-400`: `#7e7b7b`
- `ui-gray-500`: `#6c6969`
- `ui-gray-600`: `#5a5858`
- `ui-gray-700`: `#484646`
- `ui-gray-800`: `#363434`
- `ui-gray-900`: `#242323`

### ⚙️ Neutral Gray Scale

- `neutral-50`: `#c4c4c4`
- `neutral-100`: `#b2b2b2`
- `neutral-200`: `#a0a0a0`
- `neutral-300`: `#8e8e8e`
- `neutral-400`: `#7c7c7c`
- `neutral-500`: `#6b6b6b`
- `neutral-600`: `#595959`
- `neutral-700`: `#474747`
- `neutral-800`: `#353535`
- `neutral-900`: `#232323`

### 🔴 Vivid Red Scale

- `vivid-red-50`: `#fc8b8b`
- `vivid-red-100`: `#fc6868`
- `vivid-red-200`: `#fb4545`
- `vivid-red-300`: `#fb2222`
- `vivid-red-400`: `#f50404`
- `vivid-red-500`: `#d20303`
- `vivid-red-600`: `#af0303`
- `vivid-red-700`: `#8c0202`
- `vivid-red-800`: `#690101`
- `vivid-red-900`: `#460101`

### 🩸 Deep Red / Berry Scale

- `deep-red-50`: `#fb8c8c`
- `deep-red-100`: `#fa6a6a`
- `deep-red-200`: `#f94747`
- `deep-red-300`: `#f82424`
- `deep-red-400`: `#f20606`
- `deep-red-500`: `#d00505`
- `deep-red-600`: `#ad0404`
- `deep-red-700`: `#8a0303`
- `deep-red-800`: `#680202`
- `deep-red-900`: `#450101`

### 🍷 Muted Rose / Burgundy Scale

- `rose-red-50`: `#eb9d9d`
- `rose-red-100`: `#e57f7f`
- `rose-red-200`: `#df6161`
- `rose-red-300`: `#d94444`
- `rose-red-400`: `#d02929`
- `rose-red-500`: `#b22323`
- `rose-red-600`: `#941d1d`
- `rose-red-700`: `#771717`
- `rose-red-800`: `#591111`
- `rose-red-900`: `#3b0b0b`

---

## 🛠️ Quick Copy CSS Variable Setup

If you ever need to restore your `src/index.css` `@theme` block, copy this snippet:

```css
@theme {
  --color-brand-gray: #807d7d;
  --color-brand-red: #de0404;
  --color-brand-berry: #8c0404;
  --color-brand-asphalt: #050101;
  /* ...rest of shades mapped in index.css... */
}
```
