---
description: Comprehensive pre-commit code review checklist for Angular, DaisyUI, and Accessibility
---

# Pre-Commit Code Review Workflow

Use this workflow before every commit to ensure high quality, scalable, and maintainable code.

## 1. Angular Best Practices
Refer to `@[.agent/rules/angular-rules.md]` for the complete list.

## 2. DaisyUI/Tailwindcss Best Practices
Refer to `@[.agent/daisyui-llms.txt` if project uses DaisyUI.

## 3. State Management (SignalStore)
Refer to `@[/signal-store-core]`.


## 4. Accessibility (WCAG AA)
**CRITICAL**: All interactive features must be accessible.

- [ ] **Interactive Elements**:
    - [ ] Buttons receiving focus must have `aria-label` if they contain only icons.
    - [ ] Clickable non-button elements (e.g., `span`, `div`) must have:
        - `role="button"`
        - `tabindex="0"`
        - Keyboard handlers: `(keydown.enter)`, `(keydown.space)`
- [ ] **Forms**: Inputs (including ranges) must have a visual label, `aria-label`, or `aria-labelledby`.
- [ ] **Modals**: Dialogs must have `aria-labelledby` pointing to the title ID.
- [ ] **Focus Management**: Ensure focus trapped correctly in modals (using `<dialog>` native behavior handles this mostly).

## 5. Lucide Icons
Refer to `@[/angular-lucide-icons]`.

- [ ] **Importing**: Import specific icons in the component (e.g., `readonly MyIcon = MyIcon;`).
- [ ] **Usage**: Use `<lucide-angular [img]="MyIcon"></lucide-angular>`.
- [ ] **Accessibility**: Ensure icons meant to be interactive are wrapped in buttons with ARIA labels.

## 6. Code Quality & Clean-up

- [ ] **No Console Logs**: Remove `console.log`, `console.warn` (use a logger service if needed).
- [ ] **Magic Numbers**: Extract numbers/strings to `private readonly` constants.
- [ ] **Memoization**: If using expensive calculations in templates or methods, implement simple memoization or use `computed`.
- [ ] **Unused Files**: Delete empty CSS/HTML files if using inline styles/templates.
- [ ] Delete empty imports or styles arrays in components

## 7. Automated Check (Mental)
Before confirming, ask:
*   "Did I introduce any memory leaks?" (Check subscriptions/listeners)
*   "Can a screen reader user use this?" (Check ARIA)
*   "Will this break in Dark Mode?" (Check colors)
*   "Is this Performant?" (Check OnPush)
*   "Is code scalabale and maintainable?"
*   "Are edge cases handled?"