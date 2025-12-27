# Frontend System Architecture Planning Document

**Project:** Word Wonder
**Version:** 1.0.0
**Role:** Frontend System Architect
**Status:** Approved for Implementation

---

## 1. Style Implementation Plan (Tailwind v4 + daisyUI v5)

This section defines how the "Word Wonder" unique design system maps to the implementation technologies.

### 1.1 daisyUI Theme Configuration
We will define a custom daisyUI theme named `word-wonder`.

| Design Token | daisyUI Token | Value (HSL / CSS Var) | Notes |
| :--- | :--- | :--- | :--- |
| `color.coral` | `primary` | `16 90% 60%` | Main brand color |
| `white` | `primary-content`| `0 0% 100%` | Text on primary |
| `color.teal` | `secondary` | `174 60% 50%` | Secondary actions |
| `white` | `secondary-content`| `0 0% 100%` | Text on secondary |
| `color.sunny` | `accent` | `45 95% 60%` | Highlights/Stars |
| `color.background`| `base-100` | Light: `45 100% 96%` <br> Dark: `220 25% 12%` | Page background |
| `color.card` | `base-200` | Light: `0 0% 100%` <br> Dark: `220 25% 16%` | Card surface |
| `color.muted` | `base-300` | `45 40% 90%` | Input backgrounds |
| `color.foreground`| `base-content` | `220 25% 20%` | Primary text |
| `color.sky` | `info` | `200 80% 70%` | Informational elements |
| `color.mint` | `success` | `150 50% 70%` | Success states |
| `color.destructive`| `error` | `0 84% 60%` | Error states |

**Theme Variables Configuration (CSS):**
```css
@plugin "daisyui/theme" {
  name: "word-wonder";
  default: true;
  --color-primary: hsl(16 90% 60%);
  --color-secondary: hsl(174 60% 50%);
  --color-accent: hsl(45 95% 60%);
  --color-base-100: hsl(45 100% 96%); /* Cream */
  /* ... other mappings ... */
  
  --radius-box: 1rem; /* Card rounded-2xl */
  --radius-field: 1rem; /* Inputs/Buttons rounded-2xl */
}
```

### 1.2 Tailwind Theme Extensions
Some design aspects fall outside daisyUI's semantic tokens and must be handled via Tailwind v4 theme usage.

*   **Typography**:
    *   `font-display`: `"Fredoka One", cursive` (Map to `font-display`)
    *   `font-body`: `"Nunito", sans-serif` (Map to `font-body` and default sans)
*   **Shadows (Custom)**:
    *   `shadow-soft`: `0 4px 20px -4px hsl(var(--base-content) / 0.1)`
    *   `shadow-button`: `0 4px 14px -4px hsl(var(--primary) / 0.4)`
*   **Gradients**:
    *   `.bg-gradient-fun`: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)`
    *   `.bg-gradient-cool`: `linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--info)) 100%)`

### 1.3 Animation Strategy
Animations will be defined as standard CSS keyframes in the global stylesheet but applied via utility classes.

*   `animate-bounce-soft`: For floating UI elements (like the star logo).
*   `animate-wiggle`: For error feedback.
*   `animate-pulse-glow`: For the recording button state.

---

## 2. Angular Component Architecture

We strictly separate **Smart Components** (Containers/Pages) and **Dumb Components** (Presentational).
*Pattern*: Dumb components wrap daisyUI classes. Smart components strictly handle logic and layout orchestration.

### 2.1 Feature: Home (`/home`)
**Smart Component**: `HomeComponent`
*   **Responsibilities**: Determines view state (`EditText` vs `UploadMode`), handles file uploads, navigates to Learn.

**Dumb Components**:
1.  **`HeroHeaderComponent`**
    *   *Usage*: Top logo and app title.
    *   *Inputs*: `title`, `subtitle`.
    *   *Styling*: `font-display`, `text-center`, `animate-bounce-soft` (on logo).
2.  **`EditTextCardComponent`**
    *   *Usage*: The main text input area.
    *   *Inputs*: `initialText`.
    *   *Outputs*: `textChange`, `startLearning`, `back`.
    *   *Styling*: `card`, `bg-base-100`, `shadow-card`. Wraps `textarea` styled with `textarea textarea-bordered`.
3.  **`UploadOptionComponent`**
    *   *Usage*: "Upload an Image" card.
    *   *Outputs*: `uploadClicked`, `cameraClicked`.
    *   *Styling*: `card`, `shadow-card`, Uses `btn btn-ghost` for large icon buttons.
4.  **`StoryListComponent`**
    *   *Usage*: List of pre-made stories.
    *   *Inputs*: `stories: Story[]`.
    *   *Outputs*: `storySelected(id)`.
    *   *Styling*: Vertical list of `btn btn-block` or clickable cards.

### 2.2 Feature: Learn (`/learn`)
**Smart Component**: `LearnComponent`
*   **Responsibilities**: Managing `LearnStore`, Text-to-Speech orchestration, Highlight logic.

**Dumb Components**:
1.  **`LearnHeaderComponent`**
    *   *Usage*: "Listen & Learn" header with Back button.
    *   *Inputs*: `title`.
    *   *Outputs*: `back`.
2.  **`ModeToggleComponent`**
    *   *Usage*: Toggle between "Listen" and "Practice" modes.
    *   *Inputs*: `activeMode: 'listen' | 'practice'`.
    *   *Outputs*: `modeChanged`.
    *   *Styling*: Segmented control or two buttons with conditional `btn-primary`.
3.  **`InteractiveTextDisplayComponent`**
    *   *Usage*: The main reading area.
    *   *Inputs*: `words: Word[]`, `highlightedIndex`.
    *   *Outputs*: `wordClicked(index)`.
    *   *Styling*: `card`, `text-xl`, flex-wrap layout. Highlighted word gets `.animate-word-highlight` and `bg-accent`.
4.  **`PlayerControlsComponent`**
    *   *Usage*: Slider controls for Speed and Position, Play/Reset buttons.
    *   *Inputs*: `speed`, `currentIndex`, `totalLength`, `isPlaying`.
    *   *Outputs*: `speedChange`, `seek`, `togglePlay`, `reset`.
    *   *Styling*: Wraps daisyUI `range` inputs (`range range-primary`). Control buttons use `btn btn-outline` and `btn btn-primary`.
5.  **`RecordingMicrophoneComponent`**
    *   *Usage*: The big recording button in Practice mode.
    *   *Inputs*: `isRecording`.
    *   *Outputs*: `toggleRecording`.
    *   *Styling*: `btn btn-circle btn-xl`. When recording: `animate-pulse-glow`, `btn-error`. When idle: `btn-primary`.

### 2.3 Shared / Core Components
1.  **`BottomNavComponent`**
    *   *Pattern*: Wraps daisyUI `dock` component.
    *   *Styling*: `dock dock-md`. Active item uses `dock-active`.
2.  **`WordDetailModalComponent`**
    *   *Pattern*: Wraps daisyUI `modal`.
    *   *Inputs*: `word`, `isOpen`.
    *   *Outputs*: `close`.
3.  **`SettingsModalComponent`**
    *   *Pattern*: daisyUI `modal`.
    *   *Inputs*: `currentLanguage`.
    *   *Outputs*: `languageChanged`.

---

## 3. UI Patterns & Styling Strategy

### 3.1 Buttons & Interactions
*   **Primary Actions**: `btn btn-primary shadow-button rounded-box`.
*   **Secondary Actions**: `btn btn-secondary rounded-box` (e.g., Play buttons).
*   **Ghost/Nav**: `btn btn-ghost` for back arrows or less prominent icons.
*   **Floating Actions**: Use `btn-circle` for microphones or special toggles.

### 3.2 Forms & Inputs
*   **Text Areas**: `textarea textarea-bordered w-full rounded-box focus:textarea-primary`.
*   **Sliders**: `range range-primary range-sm`.

### 3.3 Layout Containers
*   **Page Wrapper**: Standard padding container `p-4 max-w-md mx-auto min-h-screen pb-24` (pb-24 to account for Dock).
*   **Cards**: `card bg-base-100 shadow-card p-6`.

---

## 4. Rules & Risks

1.  **Avoid Raw Color Utilities**: Never use `bg-[#...]`. Always use `bg-primary`, `bg-base-100`, etc., to respect the theme.
2.  **Responsive Design**: The app is mobile-first. Ensure `dock` is handled correctly on iOS (safe areas).
3.  **Accessibility**:
    *   Sliders must have `aria-label`.
    *   The "Highlight" effect on words must represent focus or be distinguishable for color-blind users (underline or scale is good, which we have).
4.  **DaisyUI 5 Migration**:
    *   Use `@plugin "daisyui"` syntax.
    *   Ensure deprecated class names (if any from v4 habits) are not used.

---

## 5. Next Steps for Implementation
1.  Update `style.css` with the Theme Configuration.
2.  Generate `HeroHeaderComponent` and `BottomNavComponent` to scaffold the shell.
3.  Refactor `HomeComponent` to use the new dumb components.
4.  Refactor `LearnComponent` to use the new dumb components.
