# Design System Requirements Document

**Version:** 1.0.0
**Source:** `context/tmp/style.css`
**Context:** Kid-friendly application (Word Wonder)

---

## 1. Color System

All colors are defined as HSL (Hue Saturation Lightness) values to support opacity modifiers in Tailwind CSS (e.g., `bg-primary/50`).

### 1.1 Primitive Palette (Raw Tokens)
*Note: These are the underlying palette values inferred from the variables.*

| Token Name | Value (HSL) | Description |
| :--- | :--- | :--- |
| `color.coral` | `16 90% 60%` | Primary warm color |
| `color.coral.light` | `16 90% 75%` | Lighter coral |
| `color.teal` | `174 60% 50%` | Primary cool color |
| `color.teal.light` | `174 60% 70%` | Lighter teal |
| `color.sunny` | `45 95% 60%` | Bright yellow/gold |
| `color.sunny.light` | `45 95% 80%` | Light yellow |
| `color.mint` | `150 50% 70%` | Soft green |
| `color.lavender` | `260 60% 75%` | Soft purple |
| `color.sky` | `200 80% 70%` | Light blue |

### 1.2 Semantic Tokens (Theming)
These tokens map primitives to UI roles. Support both Light and Dark modes.

| Token | CSS Variable | Description |
| :--- | :--- | :--- |
| **Primary** | `--primary` | Main action color (Coral) |
| **Primary Foreground** | `--primary-foreground` | Text on primary button (White) |
| **Secondary** | `--secondary` | Secondary action color (Teal) |
| **Secondary Foreground** | `--secondary-foreground` | Text on secondary elements |
| **Accent** | `--accent` | Highlights and special UI elements (Sunny) |
| **Accent Foreground** | `--accent-foreground` | Text on accent elements |
| **Destructive** | `--destructive` | Error states, dangerous actions |
| **Destructive Foreground**| `--destructive-foreground`| Text on destructive elements |
| **Background** | `--background` | Page background |
| **Foreground** | `--foreground` | Default text color |
| **Muted** | `--muted` | Secondary backgrounds, deactivated items |
| **Muted Foreground** | `--muted-foreground` | Secondary text, hints, placeholders |
| **Card** | `--card` | Card background surface |
| **Card Foreground** | `--card-foreground` | Text on cards |
| **Popover** | `--popover` | Popover/Modal background |
| **Popover Foreground** | `--popover-foreground` | Text in popovers |
| **Border** | `--border` | Default border color |
| **Input** | `--input` | Input field borders |
| **Ring** | `--ring` | Focus rings |

### 1.3 Sidebar Specific
| Token | CSS Variable | Description |
| :--- | :--- | :--- |
| `sidebar.background` | `--sidebar-background` | Sidebar container background |
| `sidebar.foreground` | `--sidebar-foreground` | Sidebar text |
| `sidebar.primary` | `--sidebar-primary` | Selected item background |
| `sidebar.primary.fg` | `--sidebar-primary-foreground`| Selected item text |
| `sidebar.accent` | `--sidebar-accent` | Hover state background |
| `sidebar.accent.fg` | `--sidebar-accent-foreground`| Hover state text |
| `sidebar.border` | `--sidebar-border` | Sidebar right border |

### 1.4 Gradients
| Token | CSS Variable | Value |
| :--- | :--- | :--- |
| `gradient.fun` | `--gradient-fun` | linear-gradient(135deg, Coral -> Sunny) |
| `gradient.cool` | `--gradient-cool` | linear-gradient(135deg, Teal -> Sky) |
| `gradient.page` | `--gradient-page` | linear-gradient(180deg, Light Cream -> Lighter Cream) |

### 1.5 Accessibility Notes
*   **Contrast**: Primary foreground is fixed to White (`0 0% 100%`) in light mode; ensure Primary color maintains WCAG AA against white. (Coral `16 90% 60%` is approx #F06A3D, which is safe).
*   **Dark Mode**: Dark mode inverses background to deep navy (`220 25% 12%`) and foreground to light cream (`45 100% 96%`).
*   **Focus**: Use `--ring` for custom focus states.

---

## 2. Typography

### 2.1 Font Families
| Role | Family Name | CSS Variable | Description |
| :--- | :--- | :--- | :--- |
| **Display** | "Fredoka One", cursive | `--font-display` | Used for H1-H6. Playful, rounded. |
| **Body** | "Nunito", sans-serif | `--font-body` | Used for Body copy. Rounded, legible sans. |

### 2.2 Text Styles & Mapping
*Assumptions: Standard Tailwind sizing applies unless overridden.*

| Element | Font Family | Weight (Inferred) | Usage |
| :--- | :--- | :--- | :--- |
| `h1` - `h6` | Display | Regular (400) | Section headings, Titles |
| `body`, `p` | Body | Regular (400) | General content |
| `strong` | Body | Bold (700) | Emphasis |

---

## 3. Spacing & Layout

### 3.1 Radius
*   **Global Radius**: `--radius` = `1rem` (16px).
    *   Applies to Cards, Inputs, Buttons, Modals.
    *   *Design Intent*: Soft, friendly, "bubble-like" UI.

### 3.2 Shadows (Elevation)
| Token | CSS Variable | Usage |
| :--- | :--- | :--- |
| `elevation.soft` | `--shadow-soft` | Subtle depth for actionable items. |
| `elevation.card` | `--shadow-card` | Main card container elevation. |
| `elevation.button` | `--shadow-button` | Primary button shadow (tinted primary). |
| `elevation.bounce` | `--shadow-bounce` | Floating/Active states (tinted primary). |

---

## 4. Components

### 4.1 Card
*   **Background**: `--card`
*   **Foreground**: `--card-foreground`
*   **Border**: `--border` (Implicit generic border usage)
*   **Shadow**: `--shadow-card`
*   **Radius**: `--radius`

### 4.2 Buttons
*   **Primary Variant**:
    *   Bg: `--primary`
    *   Text: `--primary-foreground`
    *   Shadow: `--shadow-button`
    *   Hover: Brightness bump (Inferred)
*   **Secondary Variant**:
    *   Bg: `--secondary`
    *   Text: `--secondary-foreground`
*   **Ghost/Accent Variant**:
    *   Text: `--accent-foreground`
    *   Bg (Hover): `--accent` (Inferred via ghost patterns)

### 4.3 Inputs
*   **Background**: Explicitly not set in vars, usually inherits or uses `--input` as border.
*   **Border**: `--input`
*   **Ring**: `--ring` (Focus state)
*   **Radius**: `--radius`

---

## 5. Motion & Animations

### 5.1 Keyframe Definitions
| Name | Description | Keyframes |
| :--- | :--- | :--- |
| `bounce-soft` | Gentle up/down float | `0%,100%: y(0); 50%: y(-8px)` |
| `wiggle` | "No" or Attention shake | `0%,100%: rot(-3deg); 50%: rot(3deg)` |
| `pulse-glow` | Radiant ring effect | Shadow spreads from 0 to 12px active size |
| `float` | Complex float (translate + rotate) | `0,100%: 0/0; 33%: -10px/2deg; 66%: -5px/-2deg` |
| `word-highlight` | Text background pop | Scale 1.05 + Bg `--sunny` (50% opacity) |

### 5.2 Animation Tokens and Usage
| Token | CSS Class | Duration | Easing | Loop | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `anim.bounce` | `.animate-bounce-soft` | 2s | ease-in-out | Infinite | Idle states, call-to-actions. |
| `anim.wiggle` | `.animate-wiggle` | 0.5s | ease-in-out | **Once** | Error states, wrong answers. |
| `anim.pulse` | `.animate-pulse-glow` | 2s | ease-in-out | Infinite | Recording indicators, active listening. |
| `anim.float` | `.animate-float` | 4s | ease-in-out | Infinite | Mascot, decorations. |
| `anim.highlight`| `.animate-word-highlight`| 0.6s | ease-in-out| **Once** | Correct answer, word selection playback. |

---

## 6. Rules for Implementation

1.  **Strict Token Usage**: Always use `hsl(var(--variable))` for colors to ensure theme switching (Light/Dark) works automatically.
2.  **Kid-Friendly Aesthetic**:
    *   Prefer rounded corners (`rounded-[var(--radius)]` or `rounded-2xl`).
    *   Use `font-display` for all headers to maintain the brand voice.
    *   Use `shadow-button` on primary actions to give them "pop".
3.  **Gradients**: Use `bg-gradient-fun` for primary high-energy areas and `bg-gradient-cool` for calming/secondary areas.
4.  **Dark Mode Compliance**: Do not hardcode hex values. Rely on the CSS variables which have defined dark mode overrides.
