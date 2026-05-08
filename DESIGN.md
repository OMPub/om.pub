# OM Pub Design System Specification

This document defines the core visual language, interactions, and aesthetics for the **OM Pub** application. All AI-generated UI components should strictly adhere to these tokens to guarantee a premium, dynamic, and cohesive user experience.

## Brand Identity & Vibe
- **Aesthetic:** Modern, Glassmorphic, Vibrant, and Dynamic.
- **Tone:** Energetic, premium, tech-forward, and inviting. 
- **Goal:** To create a "WOW" factor immediately upon load. The UI should feel responsive, alive, and distinctly high-end. Avoid flat, generic, or boring minimum viable product looks.

## Colors & Gradients
We utilize a rich, carefully tailored color palette with smooth gradients. Avoid standard CSS named colors (e.g., `red`, `blue`).

- **Background (Deep Void):** `#09090B` (Pitch dark with a hint of warm espresso).
- **Surface / Cards (Smoked Glass):** `rgba(25, 20, 20, 0.4)` with a `1px` inner border of `rgba(255, 153, 0, 0.1)`. Use `backdrop-filter: blur(20px)` to achieve a smoky, ambient pub atmosphere.
- **Primary Accent (Liquid Amber Gradient):** `linear-gradient(135deg, #FFB000 0%, #E65C00 100%)` (Rich Gold transitioning to Burnt Orange). Use this for main buttons, active states, and glowing highlights.
- **Secondary Accent (Electric Cyan):** `#00F0FF` for stark contrast, hover states on secondary links, or terminal-style data readouts.
- **Text Primary:** `#FAFAF9` (Warm off-white).
- **Text Secondary:** `#A8A29E` (Warm stone/taupe for metadata).
- **Borders:** `rgba(255, 176, 0, 0.15)` for subtle dividers, giving a faint neon underglow effect.

## Typography
We use modern, highly legible sans-serif fonts to maintain a sleek technical look.

- **Primary Font:** `Inter` or `Outfit` (Fallback: `system-ui, sans-serif`).
- **Heading 1:** 48px to 64px, Extra Bold (800 weight), tight tracking (`letter-spacing: -0.02em`).
- **Heading 2:** 32px, Bold (700 weight), `line-height: 1.2`.
- **Body:** 16px, Regular (400 weight), `line-height: 1.6`.
- **Labels/Captions:** 12px to 14px, Medium (500 weight), uppercase with wide tracking (`letter-spacing: 0.05em`).

## Spacing, Layout & Shapes
- **Base Unit:** 4px or 8px scale.
- **Border Radius:** Use heavily rounded corners for a modern feel. 
  - Main cards/containers: `24px`.
  - Buttons: `12px` or fully pill-shaped (`9999px`).
  - Inputs: `12px`.
- **Grid:** Max content width of `1280px`. Use generous padding (e.g., `32px` or `48px` inside main cards).

## Component Rules & Micro-Animations
An interface that feels responsive and alive encourages interaction. All interactive elements MUST have micro-animations.

- **Buttons:** 
  - Hover state: Slight lift (`transform: translateY(-2px)`), increased shadow glow (`box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4)`).
  - Active/Click state: Slight scale down (`transform: scale(0.97)`).
  - Transition duration: `0.2s ease-out`.
- **Cards (Glassmorphism):**
  - Hover state: Border opacity increases to `rgba(255, 255, 255, 0.2)`, background lightens slightly.
  - Entrance: Fade in and slide up gracefully when scrolled into view.
- **Inputs:**
  - Focus state: Outline glows with the Primary Accent color. Background shifts to slightly more opaque `rgba(255, 255, 255, 0.06)`.

## Explicit Don'ts
- **DO NOT** use generic, unstyled HTML default appearances for any element.
- **DO NOT** use flat, solid background colors for cards (always favor subtle transparency + blur).
- **DO NOT** ignore hover and focus states; everything clickable must react smoothly.
- **DO NOT** use pure black `#000000` or pure white `#FFFFFF` for large background areas; always tint them.
- **DO NOT** clutter the interface. Embrace negative space to let the typography and gradients breathe.
