---
description: Complete UI/UX Audit Workflow for Web Applications
---

# Complete UI/UX Audit Workflow

This workflow provides a systematic approach to auditing web applications for consistency, accessibility, and best practices.

## Pre-Audit Setup

1. **Identify Tech Stack**
   - Framework (Angular, React, Vue)
   - CSS Framework (DaisyUI, Tailwind, Bootstrap)
   - Component library version

2. **Gather Documentation**
   - Read design system docs
   - Check if any llm-txt exist for the used tech stack (in .agent folder or in global IDE agent rules)
   - Review style guide
   - Check theme configuration
   - Identify custom utilities

## Audit Phases

### Phase 1: Component Usage Audit

**Search Command Example:**
```bash
grep -r "class=" src/app --include="*.html" --include="*.ts" | grep -E "(btn|card|modal|badge|navbar|tabs)"
```

**Check:**
- [ ] Components use framework classes
- [ ] No custom implementations
- [ ] Proper component structure
- [ ] Semantic modifiers used

### Phase 2: Button Standardization

**Search Commands Example:**
```bash
grep -r "btn\|button" src/app --include="*.html" --include="*.ts" -n
grep -r "class=.*btn.*text-(orange|teal|cyan|gray)" src/app
grep -r "hover:bg-\|hover:text-" src/app | grep btn
```

**Check:**
- [ ] Semantic colors (`btn-primary`, `btn-secondary`)
- [ ] Standard sizes (`btn-xs`, `btn-sm`, `btn-lg`)
- [ ] No custom hover states
- [ ] Consistent sizing

### Phase 3: Typography Audit

**Search Commands Example:**
```bash
grep -r "text-(xs|sm|base|lg|xl|2xl|3xl)" src/app -n
grep -r "font-(thin|light|normal|medium|bold|black)" src/app -n
grep -r "text-(orange|teal|cyan|gray)-[0-9]" src/app -n
grep -r 'text-\[.*px\]' src/app -n
```

**Check:**
- [ ] Semantic text colors
- [ ] Standard font sizes (no arbitrary)
- [ ] Consistent heading hierarchy
- [ ] Proper opacity patterns

### Phase 4: Icon & Image Audit

**Search Commands Example:**
```bash
grep -r "lucide-angular\|fa-\|material-icons" src/app -n
grep -r "object-(cover|contain)" src/app -n
```

**Check:**
- [ ] Icons use semantic colors
- [ ] Consistent icon sizing
- [ ] `object-contain` for illustrations
- [ ] `object-cover` for photos

### Phase 5: Accessibility Audit

**Search Commands Example:**
```bash
grep -r "btn btn-circle" src/app | grep -v "aria-label"
grep -r "<img" src/app | grep -v "alt="
grep -r "modal" src/app | grep -v "aria-labelledby"
```

**Check:**
- [ ] Icon buttons have ARIA labels
- [ ] Images have alt text
- [ ] Modals have ARIA attributes
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA

## Execution Steps

1. **Run Search Commands** - Save results to files
2. **Analyze Results** - Document issues by priority
3. **Create Implementation Plan** - Group changes by phase
4. **Implement & Test** - Small batches with testing
5. **Document** - Update style guide

## Common Patterns

### Tailwind → Semantic Colors
```html
<!-- Before -->
<div class="bg-orange-100 text-orange-500">
<!-- After -->
<div class="bg-primary/10 text-primary">
```

### Arbitrary → Standard Sizes
```html
<!-- Before -->
<span class="text-[11px]">
<!-- After -->
<span class="text-xs">
```

### Inline → Utility Gradients
```html
<!-- Before -->
<h1 class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
<!-- After -->
<h1 class="gradient-text-primary">
```

### Custom → Framework Hover
```html
<!-- Before -->
<button class="btn hover:bg-orange-500">
<!-- After -->
<button class="btn btn-primary">
```

## Success Criteria

- ✅ 100% framework component usage
- ✅ 0 Tailwind color classes (except utilities)
- ✅ 0 arbitrary font sizes
- ✅ WCAG AA compliance
- ✅ Consistent visual hierarchy

## Tools

- **AXE DevTools** - Accessibility testing
- **WAVE** - Web accessibility
- **Lighthouse** - Performance & a11y

## Reference

See full workflow: `ui-ux-audit-workflow.md` in artifacts