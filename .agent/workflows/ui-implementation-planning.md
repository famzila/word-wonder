---
description: Create a technical implementation roadmap for the UI of the learning application based on the established Design System and Mockups.
---

Optimized UI Implementation Plan Prompt

GOAL: Create a technical implementation roadmap for the UI of the learning application based on the established Design System and Mockups.

CONTEXT:

Framework: Angular 21

Styling: Tailwind CSS 4 + DaisyUI 5 (CSS-based configuration).

Icons: Lucide Angular.

I18n: ngx-translate.

TASK:

App Architecture: Define the shell or layout components (e.g., MainLayoutComponent) to handle shared UI like the Bottom Navigation and Page Headers.

Component Inventory:

Break down the mockups into a hierarchy of reusable UI components (atoms/molecules) and feature components (pages).

Identify where DaisyUI components can be used directly vs. where custom wrapper components are needed.

State & Data Flow (UI Only): Define the input and output interfaces for presentational components (e.g., a WordCardComponent should take a Word object).

Icon & Translation Strategy:

Specify the Lucide icon naming convention.

Define a structure for the en.json / fr.json translation files to ensure the UI is ready for multi-language support from day one.

CONSTRAINTS:

Respect the DRY (Don't Repeat Yourself) principle.

Follow DaisyUI 5 semantic class usage, you can learn its best practices through FILE

Respect Angular's best practices defined here FILE

DO NOT WRITE FULL CODE YET. Provide a structured plan/outline of files, folders, and component responsibilities.