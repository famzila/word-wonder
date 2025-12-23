---
description: Comprehensive systematic checklist for reviewing Angular applications before production deployment.
---

## 📋 **1. CODE QUALITY & STANDARDS**

### 1.1 TypeScript Configuration
- [ ] `strict: true` enabled in `tsconfig.json`
- [ ] No `any` types (use `unknown` when type is uncertain)
- [ ] All unused imports removed
- [ ] All unused variables removed
- [ ] Type inference used where obvious
- [ ] Proper typing for all function parameters and return types

### 1.2 Angular Best Practices
- [ ] Components use `ChangeDetectionStrategy.OnPush`
- [ ] No `standalone: true` explicitly set (Angular v20+ default)
- [ ] Avoid importing entire `CommonModule` (import specific utilities)
- [ ] Use `input()` and `output()` functions instead of decorators
- [ ] Signal-based queries used (`viewChild()`, `contentChild()`) instead of decorators
- [ ] No `@HostBinding`/`@HostListener` (use `host` object in decorator)
- [ ] `NgOptimizedImage` used for static images (not base64)
- [ ] No `NgClass` (use `class` bindings)
- [ ] No `NgStyle` (use `style` bindings)
- [ ] Native control flow (`@if`, `@for`, `@switch`) instead of structural directives
- [ ] No arrow functions in templates
- [ ] No assumption of globals like `new Date()` in templates

### 1.3 Class Organization
Proper order maintained in all TypeScript classes:
1. [ ] Injections first
2. [ ] Queries/inputs/outputs next
3. [ ] Signals next
4. [ ] Other properties
5. [ ] Constructor
6. [ ] Lifecycle hooks (in lifecycle order)
7. [ ] Methods (public first, then private)

### 1.4 File Cleanup
- [ ] Empty CSS files removed
- [ ] Empty `styles` arrays removed from components
- [ ] Empty `imports` arrays removed from components
- [ ] Unused HTML template files removed (if using inline templates)

---

## 🚀 **2. PERFORMANCE OPTIMIZATION**

### 2.1 Bundle Size
- [ ] Tree-shaking enabled and verified
- [ ] Import only needed dependencies (e.g., `TranslatePipe` instead of `TranslateModule`)
- [ ] Lucide icons: only imported icons used (not full library)
- [ ] Lazy loading implemented for feature routes
- [ ] Bundle analysis performed (`ng build --stats-json` + webpack-bundle-analyzer)
- [ ] No circular dependencies

### 2.2 State Management
- [ ] Signals used for local component state
- [ ] `computed()` used for derived state
- [ ] State transformations are pure and predictable
- [ ] `update()` or `set()` used instead of `mutate()` on signals
- [ ] `takeUntilDestroyed` operator used for Observable cleanup
- [ ] No memory leaks (proper cleanup in `ngOnDestroy`)

### 2.3 Data Fetching
- [ ] `httpResource`, `rxResource`, or `resource` API used for reactive data fetching
- [ ] Proper error handling in all HTTP requests
- [ ] Loading states managed appropriately
- [ ] Race conditions handled (e.g., `switchMap` for latest request)
- [ ] Response caching implemented where appropriate

### 2.4 Change Detection
- [ ] OnPush strategy used throughout
- [ ] Signals used to minimize change detection cycles
- [ ] Large lists use `trackBy` functions
- [ ] No expensive computations in templates
- [ ] No subscriptions in templates without `async` pipe

---

## 🔒 **3. SECURITY**

### 3.1 Storage & Data Handling
- [ ] **CRITICAL**: No `localStorage` or `sessionStorage` in artifacts (use in-memory state)
- [ ] Sensitive data not stored in browser storage
- [ ] XSS prevention: all user input sanitized
- [ ] CSRF tokens implemented for state-changing operations
- [ ] Content Security Policy (CSP) headers configured

### 3.2 Dependencies
- [ ] All dependencies up to date
- [ ] No known security vulnerabilities (`npm audit` or `pnpm audit`)
- [ ] Only trusted packages from verified sources
- [ ] No deprecated packages

### 3.3 API & Network
- [ ] HTTPS enforced for all API calls
- [ ] API keys/secrets not exposed in client-side code
- [ ] Environment variables used for configuration
- [ ] CORS properly configured
- [ ] Rate limiting considered for API calls

---

## ♿ **4. ACCESSIBILITY (WCAG AA COMPLIANCE)**

### 4.1 ARIA & Semantic HTML
- [ ] All AXE accessibility checks pass
- [ ] Proper ARIA labels on interactive elements
- [ ] `role` attributes used correctly
- [ ] Semantic HTML elements used (`nav`, `main`, `article`, etc.)
- [ ] Form inputs have associated labels
- [ ] Error messages properly associated with form fields

### 4.2 Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] Focus visible on all interactive elements
- [ ] Focus management for modals/dialogs
- [ ] Skip navigation links provided
- [ ] No keyboard traps

### 4.3 Visual & Color
- [ ] Color contrast meets WCAG AA minimum (4.5:1 for text)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators visible (3:1 contrast ratio)
- [ ] Text resizable up to 200% without loss of content
- [ ] No content flashing more than 3 times per second

### 4.4 Screen Readers
- [ ] All images have `alt` text (or `alt=""` for decorative)
- [ ] Icon-only buttons have `aria-label`
- [ ] Live regions (`aria-live`) used for dynamic content updates
- [ ] `aria-describedby` used for additional context
- [ ] Hidden content properly hidden from screen readers (`aria-hidden="true"`)

### 4.5 Forms
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages announced to screen readers
- [ ] Form validation clear and accessible
- [ ] Placeholder text not used as labels

---

## 🎨 **5. UI/UX & DaisyUI SPECIFIC**

### 5.1 DaisyUI Usage
- [ ] Tailwind CSS 4 configured correctly
- [ ] DaisyUI plugin added to CSS (`@plugin "daisyui";`)
- [ ] Only existing daisyUI class names or Tailwind utilities used
- [ ] No custom CSS written (using daisyUI/Tailwind classes)
- [ ] Responsive design using Tailwind's responsive prefixes
- [ ] Theme configuration properly set if using custom themes
- [ ] Color contrast verified for all themes

### 5.2 Icons (Lucide Angular)
- [ ] Only used icons imported (not entire library)
- [ ] Proper selector used (`<i-lucide>`, `<lucide-icon>`, etc.)
- [ ] Accessible labels on icon-only buttons (`aria-label`)
- [ ] Icons have proper size/color props
- [ ] Decorative icons hidden from screen readers

### 5.3 Responsive Design
- [ ] Mobile-first approach followed
- [ ] Breakpoints tested (sm, md, lg, xl, 2xl)
- [ ] Touch targets at least 44×44 pixels
- [ ] Horizontal scrolling avoided
- [ ] Images responsive and optimized

---

## 🌍 **6. INTERNATIONALIZATION (i18n)**

### 6.1 ngx-translate Configuration
- [ ] `provideHttpClient()` included in app config
- [ ] `provideTranslateService()` properly configured
- [ ] Translation files organized and complete
- [ ] Only `TranslatePipe` imported (not entire `TranslateModule`)
- [ ] Default language set
- [ ] Fallback language configured
- [ ] Missing translation handler implemented

### 6.2 Translation Quality
- [ ] All user-facing text uses translation keys
- [ ] Translation keys are namespaced and descriptive
- [ ] Pluralization handled correctly
- [ ] Date/time formatting localized
- [ ] Number formatting localized
- [ ] RTL support if needed

---

## 🧪 **7. TESTING**

### 7.1 Unit Tests
- [ ] All components have unit tests
- [ ] All services have unit tests
- [ ] All pipes have unit tests
- [ ] Test coverage >80%
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Mock dependencies properly

### 7.2 Integration Tests
- [ ] Critical user flows tested end-to-end
- [ ] API integration tested
- [ ] State management tested
- [ ] Navigation tested

### 7.3 SignalStore Testing
- [ ] `TestBed` used for instantiation
- [ ] Dependencies mocked appropriately
- [ ] `unprotected()` used for testing protected state
- [ ] Async operations tested with `fakeAsync`/`tick`
- [ ] `rxMethod` race conditions tested
- [ ] Custom features tested in isolation

---

## 📊 **8. STATE MANAGEMENT (@ngrx/signals)**

### 8.1 SignalStore Configuration
- [ ] `providedIn` set correctly (root or component level)
- [ ] State protection appropriate (`protectedState` setting)
- [ ] Initial state properly defined
- [ ] Private members use `_` prefix
- [ ] Lifecycle hooks defined at store level where needed

### 8.2 State Updates
- [ ] `patchState` used for updates (not direct mutation)
- [ ] State updaters are pure functions
- [ ] No side effects in reducers
- [ ] Computed signals used for derived state
- [ ] `linkedSignal` used for dependent state

### 8.3 Side Effects
- [ ] Effects properly managed with `withEffects`
- [ ] `rxMethod` used for reactive side effects
- [ ] Error handling in all effects
- [ ] Race conditions handled (switchMap, exhaustMap, etc.)
- [ ] Proper cleanup (`takeUntilDestroyed`)

### 8.4 Entity Management
- [ ] `withEntities` used for collections
- [ ] Entity updaters used correctly
- [ ] Custom ID selectors defined if needed
- [ ] Named collections for multiple entity types
- [ ] Private collections use `_` prefix

---

## 🔧 **9. BUILD & DEPLOYMENT**

### 9.1 Build Configuration
- [ ] Production build tested (`ng build --configuration production`)
- [ ] AOT compilation enabled
- [ ] Source maps disabled in production
- [ ] Build optimization enabled
- [ ] Environment-specific configurations set
- [ ] Service worker configured (if using PWA)

### 9.2 Performance Metrics
- [ ] Lighthouse score >90 (Performance, Accessibility, Best Practices, SEO)
- [ ] First Contentful Paint (FCP) <1.8s
- [ ] Largest Contentful Paint (LCP) <2.5s
- [ ] Cumulative Layout Shift (CLS) <0.1
- [ ] First Input Delay (FID) <100ms
- [ ] Time to Interactive (TTI) <3.8s

### 9.3 Error Handling
- [ ] Global error handler implemented
- [ ] 404 page configured
- [ ] Error boundaries for components
- [ ] Logging/monitoring configured (e.g., Sentry)
- [ ] User-friendly error messages

---

## 📝 **10. DOCUMENTATION & MAINTENANCE**

### 10.1 Code Documentation
- [ ] README with setup instructions
- [ ] API documentation
- [ ] Complex logic commented
- [ ] Type definitions documented
- [ ] Custom features documented

### 10.2 Development Practices
- [ ] Consistent code formatting (Prettier/ESLint)
- [ ] Git commit messages follow convention
- [ ] No commented-out code
- [ ] No console.log in production code
- [ ] TODO comments tracked

---

## ✅ **11. FINAL CHECKS**

- [ ] All environment variables configured for production
- [ ] Analytics/monitoring tools integrated
- [ ] SEO meta tags configured
- [ ] Favicon and app icons set
- [ ] robots.txt configured
- [ ] sitemap.xml generated
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing completed
- [ ] Performance profiling completed
- [ ] Security audit completed
- [ ] Stakeholder sign-off obtained

---

## 🎯 **Priority Levels**

**🔴 CRITICAL** - Must be fixed before production
- Security vulnerabilities
- Accessibility blockers
- Data loss risks
- Memory leaks
- localStorage/sessionStorage in artifacts

**🟡 HIGH** - Should be addressed before production
- Performance issues
- Major accessibility issues
- Missing error handling
- Incomplete testing

**🟢 MEDIUM** - Nice to have, can be addressed post-launch
- Code organization
- Documentation gaps
- Minor UX improvements

---

## 📚 **Additional Resources**

- [Angular Style Guide](https://angular.dev/style-guide)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)
- [NgRx Signals Documentation](https://ngrx.io/guide/signals)
- [DaisyUI Documentation](https://daisyui.com)
