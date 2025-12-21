# Design System & Theme Definition Prompt

**GOAL**: Define a comprehensive theme and global app style for a kid-friendly learning application based on the provided CSS design tokens and mockup screenshots. This will serve as the foundational design system for all future component implementations.

---

## 📋 Context

I'm building a kid-friendly learning application and need to establish a consistent, playful, and engaging design system. I have existing CSS with design tokens and mockup screenshots that demonstrate the visual style. Your task is to extract, document, and create a reusable theme definition that any developer or AI can reference.

**CRITICAL REQUIREMENT**: This application uses **DaisyUI 5** as the component library built on top of Tailwind CSS 4. Before generating anything, you MUST:

1. **Read the official DaisyUI llms.txt** at `../context/daisyui-llms.txt`
2. **Understand DaisyUI 5 specifics**:
   - DaisyUI 5 requires Tailwind CSS 4
   - No `tailwind.config.js` file (deprecated in Tailwind v4)
   - Configuration is done in CSS using `@plugin` directive
   - Theme customization uses CSS variables in OKLCH color space
3. **Verify ALL component APIs** - Do NOT hallucinate classes or patterns
4. **Follow DaisyUI's usage rules** from the llms.txt

**Why this matters**: DaisyUI 5 has specific conventions. Using made-up patterns or outdated v4 syntax will break the implementation. Always reference the actual documentation.

---

## 🎨 DESIGN TOKENS (Extracted from CSS)

### Color Palette (Current HSL Values)
```
PRIMARY (Coral):
- Base: hsl(16 90% 60%)
- Light: hsl(16 90% 75%)
- Usage: Main CTAs, primary buttons, key interactive elements

SECONDARY (Teal):
- Base: hsl(174 60% 50%)
- Light: hsl(174 60% 70%)
- Usage: Secondary actions, complementary elements

ACCENT (Sunny Yellow):
- Base: hsl(45 95% 60%)
- Light: hsl(45 95% 80%)
- Usage: Highlights, success states, cheerful accents

BACKGROUND:
- Base: hsl(45 100% 96%)
- Gradient: linear-gradient(180deg, hsl(45 100% 96%) 0%, hsl(45 80% 92%) 100%)
- Usage: Page backgrounds with subtle gradient

CARD/SURFACE:
- Base: hsl(0 0% 100%) - Pure white
- Usage: Cards, modals, elevated surfaces

FOREGROUND/TEXT:
- Base: hsl(220 25% 20%) - Dark blue-gray
- Muted: hsl(220 15% 45%) - Medium gray
- Usage: Body text, headings

ADDITIONAL COLORS:
- Mint: hsl(150 50% 70%)
- Lavender: hsl(260 60% 75%)
- Sky Blue: hsl(200 80% 70%)
- Muted Background: hsl(45 40% 90%)

BORDERS:
- Default: hsl(45 30% 85%)
- Usage: Subtle borders, dividers
```

### Typography
```
DISPLAY FONT (Headings):
- Family: "Fredoka One", cursive
- Usage: All h1-h6, titles, playful text
- Weight: Bold (default for this font)
- Characteristics: Rounded, chunky, kid-friendly

BODY FONT (Content):
- Family: "Nunito", sans-serif
- Usage: Paragraphs, labels, UI text
- Weights: 400 (regular), 600 (semi-bold), 700 (bold)
- Characteristics: Friendly, highly readable
```

### Border Radius (To map to DaisyUI theme)
```
DEFAULT: 1rem (16px)
- Cards: rounded-2xl (16px) → maps to --radius-box
- Buttons: rounded-2xl (16px) → maps to --radius-field
- Small elements: rounded-lg (12px)
- Inputs: rounded-xl (12px) → maps to --radius-field
- Badges/Pills: rounded-full → maps to --radius-selector

NOTE: DaisyUI 5 uses three radius variables:
- --radius-selector: for checkbox, toggle, badge (prefer 1rem for our design)
- --radius-field: for button, input, select, tab (prefer 1rem for our design)
- --radius-box: for card, modal, alert (prefer 0.5rem for our design)
```

### Shadows (Critical for Depth)
```
SOFT SHADOW (Subtle elevation):
- Value: 0 4px 20px -4px hsl(220 25% 20% / 0.1)
- Usage: Hover states, gentle elevation

CARD SHADOW (Default cards):
- Value: 0 8px 30px -8px hsl(220 25% 20% / 0.15)
- Usage: All cards, panels, elevated surfaces

BUTTON SHADOW (Interactive elements):
- Value: 0 4px 14px -4px hsl(16 90% 60% / 0.4)
- Usage: Primary buttons, CTAs
- Color matches the button (use primary color with 40% opacity)

BOUNCE SHADOW (Hover/Active state):
- Value: 0 10px 40px -10px hsl(16 90% 60% / 0.3)
- Usage: Button hovers, active cards
- Larger spread, softer opacity

IMPORTANT: These shadows should be applied via Tailwind utility classes
DaisyUI has optional --depth variable (0 or 1) but our custom shadows are more specific
```

### Gradients
```
FUN GRADIENT (Warm):
- Value: linear-gradient(135deg, hsl(16 90% 60%) 0%, hsl(45 95% 60%) 100%)
- Direction: 135deg (diagonal)
- Colors: Coral → Sunny Yellow
- Usage: Primary buttons, hero sections, celebration elements
- Implementation: Custom Tailwind utility class or inline style

COOL GRADIENT (Fresh):
- Value: linear-gradient(135deg, hsl(174 60% 50%) 0%, hsl(200 80% 70%) 100%)
- Direction: 135deg (diagonal)
- Colors: Teal → Sky Blue
- Usage: Secondary buttons, info sections, calm areas
- Implementation: Custom Tailwind utility class or inline style

PAGE GRADIENT (Background):
- Value: linear-gradient(180deg, hsl(45 100% 96%) 0%, hsl(45 80% 92%) 100%)
- Direction: 180deg (top to bottom)
- Usage: Main page background
- Implementation: Applied to body element via custom CSS
```

### Spacing Scale
```
PADDING (Cards/Containers):
- Default: 24px (p-6)
- Compact: 16px (p-4)
- Spacious: 32px (p-8)

GAPS (Between elements):
- Tight: 8px (gap-2)
- Default: 16px (gap-4)
- Comfortable: 24px (gap-6)

MARGINS (Between sections):
- Default: 32px (my-8)
- Large sections: 48px (my-12)
```

### Animation & Transitions
```
BOUNCE (Playful hover):
- Transform: translateY(-8px)
- Duration: 200ms
- Easing: ease-in-out
- Usage: Buttons, interactive cards
- Implementation: hover:translate-y-[-8px] transition-all duration-200

WIGGLE (Attention-grabber):
- Transform: rotate(-3deg) to rotate(3deg)
- Duration: 500ms
- Usage: Error states, fun interactions
- Implementation: Custom @keyframes animation

PULSE GLOW (Focus/Active):
- Shadow: 0 0 0 12px with fading opacity
- Duration: 2s infinite
- Usage: Active elements, loading states
- Implementation: Custom @keyframes animation

FLOAT (Ambient motion):
- Transform: translateY(-10px) + slight rotation
- Duration: 4s infinite
- Easing: ease-in-out
- Usage: Decorative elements, icons
- Implementation: Custom @keyframes animation

WORD HIGHLIGHT (Reading feedback):
- Background: Sunny yellow at 50% opacity
- Scale: 1.05
- Duration: 600ms
- Usage: Text-to-speech, word tracking
- Implementation: Custom @keyframes animation

DEFAULT TRANSITION:
- Duration: 200ms
- Easing: ease-in-out
- Properties: all (transform, shadow, colors)
- Implementation: transition-all duration-200
```

---

## 🎯 COMPONENT PATTERNS

**IMPORTANT**: Use DaisyUI 5 component classes as documented. Customize via theme configuration or Tailwind utilities.

### DaisyUI 5 Usage Rules (from official docs)
1. Add daisyUI class names: component class + part classes + modifier classes
2. Customize using Tailwind utilities when needed (e.g., `btn px-10`)
3. Use `!` suffix to force override if needed (e.g., `btn bg-red-500!`) - use sparingly
4. Create custom components with Tailwind if daisyUI component doesn't exist
5. Make layouts responsive using Tailwind responsive prefixes
6. Only use existing daisyUI or Tailwind class names

### ACTUAL IMPLEMENTATION STYLE (From React App Reference)

The React implementation reveals key patterns to maintain in Angular:

**Layout Structure:**
```
- Consistent max-width container: max-w-lg mx-auto
- Generous padding: px-4 for mobile, pt-6/pt-8 for headers
- Bottom navigation space: pb-24 to account for fixed nav
- Vertical spacing: space-y-4 or space-y-6 between sections
```

**Visual Hierarchy:**
```
- Headers are centered with decorative icon circles
- Icon containers (small): w-16 h-16 rounded-full with soft background (bg-sunny/30)
- Icon containers (large/animated): w-20 h-20 bg-gradient-fun rounded-full shadow-bounce
  - Can wrap in animate-float for floating animation
- Section icons (within cards): w-10 h-10 bg-teal/20 rounded-xl (square with less rounding)
- Card list icons: w-12 h-12 rounded-xl with color-specific backgrounds (bg-coral/20, bg-teal/20, bg-sunny/20)
- Titles: text-3xl or text-4xl md:text-5xl font-display text-gradient
- Subtitles: text-lg text-muted-foreground font-body
- Section headers (within cards): text-xl font-display text-foreground
```

**Card Styling Pattern:**
```
Standard card: 
- Base: p-6 bg-card
- Shadow: shadow-card (our custom shadow)
- Border: border-2 border-muted
- Rounded: rounded-3xl (larger radius for main cards)
- Small cards: rounded-2xl

Empty state cards:
- Centered content with icon circle
- w-20 h-20 bg-muted/50 rounded-full for icon container
- Clear hierarchy: icon → title → description → CTA button
```

**Button Patterns:**
```
Primary actions: variant="fun" or variant="cool" (custom variants)
Secondary: variant="secondary"
Icon buttons: size="icon" className="rounded-xl"
Destructive: text-destructive hover:bg-destructive hover:text-destructive-foreground
Large CTAs: size="lg"
```

**Interactive Elements:**
```
Mode tabs / Selection buttons:
- Container: p-1 bg-muted/50 rounded-2xl (pill container)
- Active state: bg-primary/10 border-2 border-primary
- Inactive: bg-muted/30 border-2 border-transparent hover:bg-muted/50
- Smooth transitions: transition-all duration-200
- Icon + text layout: flex items-center gap-4

Toggle/Radio-style buttons:
- Full width: w-full flex items-center gap-4 p-4 rounded-2xl
- Selected indicator: w-6 h-6 bg-primary rounded-full with check icon
- Flag/emoji prefix: text-2xl
- Text alignment: text-start (for RTL support)

Record button (special):
- Large circular: w-24 h-24 rounded-full
- Active state: bg-destructive animate-pulse-glow scale-110
- Inactive: bg-primary shadow-button hover:scale-105
- Centered with label below

Upload zones (dashed borders):
- Border: border-3 border-dashed border-muted rounded-2xl p-6
- Hover: hover:border-primary hover:bg-primary/5 (or hover:border-teal hover:bg-teal/5)
- Icon hover: group-hover:text-primary group-hover:scale-110
- Full height flex: h-full flex flex-col items-center justify-center
- Cursor: cursor-pointer
```

**List Items (Word Cards):**
```
- Staggered animation: animate-slide-up with inline style animationDelay: `${index * 50}ms` or `${index * 100}ms`
- Layout: flex items-start gap-4 (or items-center for simpler cards)
- Content area: flex-1
- Actions column: flex flex-col gap-2
- Badge style: px-2 py-0.5 bg-sunny/20 rounded-lg text-xs
- Hover effect: hover:shadow-card hover:border-primary/50 hover:-translate-y-1
- Interactive cursor: cursor-pointer (when clickable)
```

**Dividers:**
```
Horizontal divider with text:
- Container: flex items-center gap-4
- Line: flex-1 h-0.5 bg-muted rounded-full
- Text: text-muted-foreground font-display text-sm
- Example: <div class="flex items-center gap-4">
            <div class="flex-1 h-0.5 bg-muted rounded-full"></div>
            <span class="text-muted-foreground font-display text-sm">OR</span>
            <div class="flex-1 h-0.5 bg-muted rounded-full"></div>
          </div>
```

**Form Elements (Custom Textarea):**
```
Custom textarea (not using DaisyUI input):
- Base: w-full p-4 text-lg font-body
- Background: bg-muted/30
- Border: border-2 border-muted rounded-2xl
- Focus: focus:border-primary focus:outline-none
- Height: h-48 (or as needed)
- Resize: resize-none
- Example: <textarea class="w-full h-48 p-4 text-lg font-body bg-muted/30 rounded-2xl 
           border-2 border-muted focus:border-primary focus:outline-none resize-none">
```

**Grid Layouts:**
```
Two-column equal grid:
- Container: grid grid-cols-2 gap-4
- Used for upload options (gallery + camera)
- Each item fills full height: h-full flex flex-col items-center justify-center
```

**Spacing & Rhythm:**
```
- Section spacing: space-y-6 (main areas), space-y-4 (lists)
- Card internal: p-4 (compact), p-6 (standard), p-8 (spacious/empty states)
- Gap between flex items: gap-2 (tight), gap-3 (normal), gap-4 (comfortable)
- Icon margins: mb-4 (after icon), me-2 (inline with text)
```

**Color Usage Patterns:**
```
- Backgrounds: bg-card, bg-muted/50, bg-sunny/30 (with opacity)
- Text: text-gradient (titles), text-muted-foreground (descriptions)
- Accents: bg-mint/20 (success), bg-sunny/20 (badges), bg-destructive (errors)
- Borders: border-2 border-muted (subtle definition)
```

**Animation Triggers:**
```
- Hover: hover:scale-105, hover:text-foreground, hover:-translate-y-1
- Active state: animate-pulse-glow (for recording/playing)
- List entrance: animate-slide-up with stagger (animationDelay via inline style)
- Floating: animate-float (for header icons)
- Interactive: transition-all duration-200 or duration-300
- Icon hover within group: group-hover:text-primary group-hover:scale-110
```

**Text Utilities:**
```
- Line clamping: line-clamp-1 (truncate with ellipsis)
- Text alignment: text-start (for RTL support, instead of text-left)
- Capitalize: capitalize (for dynamic content like word lists)
```

### Buttons 
```
PRIMARY BUTTON (From Implementation):
- Base classes: btn btn-primary
- Size: btn-lg for main CTAs
- Custom shadow: shadow-button (our custom value)
- Hover effect: hover:scale-105 or hover:translate-y-[-8px]
- Transitions: transition-all duration-200
- Example from app:
  <button class="btn btn-primary btn-lg shadow-button hover:scale-105 transition-all duration-200">

ICON BUTTONS (From Implementation):
- Base: btn size="icon" (if using React component API)
- DaisyUI equivalent: btn btn-square or btn btn-circle
- Rounded: rounded-xl (not default circular)
- Example: <button class="btn btn-square rounded-xl">

DESTRUCTIVE BUTTON:
- Base: btn btn-error or custom styling
- Text color: text-destructive
- Hover: hover:bg-destructive hover:text-destructive-foreground
- Example: <button class="btn text-destructive hover:bg-destructive hover:text-destructive-foreground">

BUTTON WITH GRADIENT (From Implementation):
- Cannot directly apply gradient to btn-primary
- Use custom variant names like "fun" or "cool" that map to gradient classes
- Example: <button class="btn bg-gradient-to-r from-[hsl(16_90%_60%)] to-[hsl(45_95%_60%)] text-white border-0">

SIZE VARIANTS:
- btn-xs, btn-sm, btn-md (default), btn-lg, btn-xl
- Large CTAs use btn-lg consistently
```

### Cards 
```
STANDARD CARD (From Implementation):
- Base: card (if using DaisyUI) or plain div
- Styling pattern: p-6 bg-card shadow-card border-2 border-muted rounded-3xl
- Body content: Direct children (no card-body needed if not using semantic DaisyUI card)
- Hover effect: hover:translate-y-[-2px] hover:shadow-[larger] transition-all duration-200
- Example:
  <div class="p-6 bg-card shadow-card border-2 border-muted rounded-3xl">
    <h2 class="text-xl font-display">Title</h2>
    <p class="text-muted-foreground">Content</p>
  </div>

COMPACT CARD (List Items):
- Styling: p-4 bg-card shadow-soft border-2 border-muted rounded-2xl
- Smaller padding and radius for list items
- Staggered animation: animate-slide-up with inline style animationDelay

EMPTY STATE CARD:
- Larger padding: p-8
- Centered content: text-center
- Icon container: w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4
- Clear hierarchy: icon → title → description → CTA
- Example:
  <div class="p-8 bg-card shadow-card border-2 border-muted rounded-3xl text-center">
    <div class="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg>...</svg>
    </div>
    <h2 class="text-xl font-display mb-2">Empty State Title</h2>
    <p class="text-muted-foreground mb-6">Description</p>
    <button class="btn">Call to Action</button>
  </div>

CARD WITH IMAGE (If needed):
- Add <figure> before content
- DaisyUI pattern:
  <div class="card">
    <figure><img src="..." /></figure>
    <div class="card-body">...</div>
  </div>

IMPORTANT:
- Implementation doesn't strictly use DaisyUI card structure
- Uses plain divs with consistent utility classes
- This is valid per DaisyUI rule #4: "Create custom components with Tailwind if needed"
```

### Form Inputs 
```
INPUT FIELD:
- Base: input input-bordered
- Our customization: Custom rounded, custom focus ring
- Example:
  <input type="text" placeholder="Type here" 
    class="input input-bordered rounded-xl 
    focus:outline-none focus:ring-2 focus:ring-[hsl(16_90%_60%)]" />

TEXTAREA:
- Base: textarea textarea-bordered
- Similar customization as input

SELECT:
- Base: select select-bordered
- Similar customization as input

INPUT WITH LABEL (Using label component):
- Example:
  <label class="input">
    <span class="label">Label text</span>
    <input type="text" placeholder="Type here" />
  </label>

SIZE VARIANTS:
- input-xs, input-sm, input-md (default), input-lg, input-xl
```

### Badges 
```
BADGE:
- Base: badge
- Color variants: badge-primary, badge-secondary, badge-accent
- Style variants: badge-outline, badge-ghost, badge-soft
- Size variants: badge-xs, badge-sm, badge-md (default), badge-lg, badge-xl
- Example:
  <span class="badge badge-primary">Badge</span>
```

### Modals 
```
MODAL (Using HTML dialog element - PREFERRED in v5):
- Base: modal
- Box: modal-box
- Backdrop: modal-backdrop
- Example:
  <button onclick="my_modal.showModal()">Open</button>
  <dialog id="my_modal" class="modal">
    <div class="modal-box rounded-2xl">
      <h3>Modal Title</h3>
      <p>Modal content</p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

PLACEMENT VARIANTS:
- modal-top, modal-middle, modal-bottom
- modal-start, modal-end
```

### Typography Hierarchy
```
H1 (Page titles):
- Font: font-['Fredoka_One'] (via custom utility)
- Size: text-4xl (36px)
- Color: text-base-content (uses DaisyUI theme)
- Optional gradient: Custom utility class

H2 (Section headers):
- Font: font-['Fredoka_One']
- Size: text-3xl (30px)

H3 (Subsections):
- Font: font-['Fredoka_One']
- Size: text-2xl (24px)

BODY TEXT:
- Font: font-['Nunito'] (default)
- Size: text-base (16px)
- Line height: leading-relaxed
- Color: text-base-content

MUTED TEXT:
- Color: text-base-content/60 or custom muted color
```

---

## 📸 MOCKUP ANALYSIS INSTRUCTIONS

When analyzing the provided mockups, extract and document:

1. **Layout Patterns**
   - Grid systems (how many columns?)
   - Spacing between major sections
   - Container max-widths
   - Mobile vs desktop breakpoints

2. **Component Composition**
   - Which DaisyUI components map to mockup elements?
   - How are cards structured internally?
   - Button placement patterns
   - Icon + text combinations
   - Navigation patterns (navbar, drawer, menu)

3. **Color Usage**
   - Which colors are used where?
   - How do colors map to DaisyUI semantic colors (primary, secondary, accent)?
   - Gradient placements
   - Background vs foreground color pairs

4. **Interactive States**
   - Hover effects visible in mockups
   - Active/selected states
   - Disabled states
   - Focus indicators

5. **Iconography Style**
   - Icon size relative to text
   - Stroke width
   - Rounded vs sharp icons
   - Color treatment

---

## 🎨 DESIGN PRINCIPLES

### Kid-Friendly Guidelines
- **Playful but not chaotic**: Use animations sparingly, maintain readability
- **High contrast**: Ensure text is always readable (WCAG AA minimum)
- **Generous spacing**: Don't crowd elements, give them room to breathe
- **Rounded everything**: Sharp corners feel aggressive, round is friendly
- **Soft shadows**: Deep shadows are harsh, keep them gentle and diffused
- **Bright but not harsh**: Colors are vibrant but not at 100% saturation

### What NOT to Do
- ❌ Never use pure black (#000000) - use theme colors
- ❌ Don't override DaisyUI component styles unnecessarily - customize theme instead
- ❌ Never use sharp corners - minimum rounded-lg
- ❌ Don't use thin fonts (below 400 weight) - readability is key
- ❌ Avoid small text (below 14px) - kids need larger targets and text
- ❌ Don't overuse animations - one or two per view maximum
- ❌ Never use low contrast color combinations
- ❌ Don't hallucinate DaisyUI classes - verify everything in llms.txt

---

## 📦 DELIVERABLE

Please create a comprehensive theme definition document that includes:

1. **DaisyUI 5 Theme Configuration**
   - Complete CSS plugin configuration with our custom colors in HSL format
   - Border radius configuration (--radius-selector, --radius-field, --radius-box)
   - Size configuration (--size-selector, --size-field)
   - Border width (--border)
   - Depth and noise settings (--depth, --noise)
   - Complete example theme plugin code ready to use

2. **Mockup Analysis**
   - Breakdown of the provided mockups
   - Measurements and specifications extracted from designs
   - Component inventory from mockups
   - Which verified DaisyUI components match each mockup element
   - Where custom components are needed (if DaisyUI doesn't provide)

3. **DaisyUI Integration Strategy**
   - How our design tokens map to DaisyUI semantic colors
   - Which DaisyUI components to use for each UI pattern
   - When to use DaisyUI classes vs custom Tailwind utilities
   - How to handle gradients (DaisyUI doesn't support gradient themes)
   - Shadow application strategy (custom utilities vs theme)

4. **Design System Summary**
   - Overview of the visual style and personality
   - Key design principles in plain language
   - How DaisyUI 5 fits into our design strategy
   - Custom font loading strategy (Fredoka One + Nunito)

5. **Component Library Specifications**
   - Verified DaisyUI component mappings from llms.txt
   - Detailed specs for buttons, cards, inputs, modals, etc.
   - Variants using actual DaisyUI classes (not made-up ones)
   - State definitions (default, hover, active, disabled)
   - Custom Tailwind classes needed beyond DaisyUI

6. **Usage Guidelines**
   - When to customize theme vs use utility overrides
   - How to apply custom shadows
   - How to apply custom gradients
   - Accessibility requirements
   - Responsive behavior patterns
   - Animation dos and don'ts

7. **Code Examples**
   - Complete CSS file structure with Tailwind v4 + DaisyUI 5
   - Theme configuration examples
   - Component examples with verified DaisyUI classes
   - Custom utility classes for shadows, gradients, animations
   - Before/after examples of good vs bad implementation


---

## 🖼️ MOCKUPS

[HOME_SCREEN_MOCKUP](../context/mockups/Screenshot 2025-12-04 at 20.27.07.png)
[EDIT_TEXT_SCREEN_MOCKUP](../context/mockups/Screenshot 2025-12-04 at 20.29.27.png)
[PRACTICE_TAB_SCREEN_MOCKUP](../context/mockups/Screenshot 2025-12-04 at 20.30.05.png)
[LISTEN_TAB_SCREEN_MOCKUP](../context/mockups/Screenshot 2025-12-04 at 20.51.20.png)
[FAVORITES_SCREEN_MOCKUP](../context/mockups/Screenshot 2025-12-04 at 20.31.02.png)
[SETTINGS_SCREEN_MOCKUP](../context/mockups/Screenshot 2025-12-04 at 20.31.12.png)
[WORD_MODAL_SCREEN_MOCKUP](../context/mockups/Screenshot 2025-12-04 at 20.30.43.png)


Please analyze these mockups in the context of the design tokens provided above. Extract any additional patterns, measurements, or specifications that aren't already documented.

---

## ✅ Success Criteria

The final design system should be:
- **Complete**: Every designer/developer question has an answer
- **Consistent**: All decisions align with the kid-friendly theme
- **Actionable**: Developers can implement without guesswork
- **Reusable**: Can be referenced for all future components
- **Clear**: Non-technical stakeholders can understand the vision
- **DaisyUI 5 Compliant**: Uses correct v5 syntax and APIs
- **Verified**: All DaisyUI classes exist in llms.txt (zero hallucinations)
- **Ready to Use**: Includes complete, working code examples

This design system will be the single source of truth for our application's visual identity.

---

## ⚠️ ANTI-HALLUCINATION CHECKLIST

Before finalizing your response, verify:

- [ ] Read the complete llms.txt from [llms.txt](../context/daisyui-llms.txt)
- [ ] All DaisyUI classes mentioned exist in the official llms.txt
- [ ] Component structure matches actual DaisyUI v5 patterns
- [ ] Theme configuration follows DaisyUI 5 CSS plugin API (not v4 JS config)
- [ ] Colors can be in HSL, hex, or OKLCH format (all are valid)
- [ ] No made-up DaisyUI classes (like `btn-coral`, `card-shadow`, etc.)
- [ ] Dialog element used for modals (not legacy checkbox method)
- [ ] CSS configuration uses `@plugin "daisyui"` (not JS config file)
- [ ] Separation between DaisyUI theme, DaisyUI classes, and custom Tailwind utilities is clear
- [ ] When uncertain, explicitly state "needs verification" rather than guessing

---

## 📚 REFERENCE

**Official DaisyUI 5 Documentation**: [llms.txt](../context/daisyui-llms.txt)