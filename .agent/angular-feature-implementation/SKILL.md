---
name: angular-feature-from-mockup
description: This skill should be used when users provide mockups and feature specifications for implementing Angular features. It guides systematic analysis, planning, and step-by-step implementation of UI features based on visual designs and requirements.
---

# Angular Feature Implementation from Mockup

Implement Angular features systematically from mockups and specifications by analyzing requirements, identifying technical decisions, and creating detailed implementation plans.

## When to Use This Skill

Use this skill when:
- User provides mockups or wireframes for a new Angular feature
- User describes feature requirements with visual references
- User requests implementation of UI components based on designs
- User needs a structured plan before implementing complex features

## Implementation Workflow

### Phase 1: Requirements Analysis

Extract and clarify feature requirements from mockups and specifications.

#### Existing Code Audit (CRITICAL FIRST STEP)

Before analyzing new requirements, audit the existing codebase to prevent duplication and ensure integration:

**1. Component Audit:**
- Search for similar UI patterns already implemented
- Identify shared components that could be reused or extended
- Check if "new" components are actually variations of existing ones
- Example: Don't create a new modal component if one exists; extend it
- Example: Don't create a new button variant if the design system has one

**2. Styling Audit:**
- Review existing CSS/SCSS patterns and naming conventions
- Identify design tokens (colors, spacing, typography) already in use
- Check for utility classes or mixins that apply to this feature
- Ensure new styles integrate with existing design system
- Example: Use existing color variables, don't hardcode new colors
- Example: Follow established spacing patterns (e.g., 8px grid)

**3. Service & State Audit:**
- List existing services that might handle similar concerns
- Check if state management patterns exist for similar features
- Identify utility functions or helpers that could be reused
- Review existing API integration patterns
- Example: Don't create a new HTTP wrapper if one exists
- Example: Extend existing state store instead of creating new one

**4. Pattern Audit:**
- Review how similar features are implemented in the project
- Identify architectural patterns to follow (component structure, data flow)
- Check naming conventions for files, classes, and methods
- Review error handling and loading state patterns
- Example: If other features use a specific modal pattern, follow it
- Example: If loading states use a specific component, reuse it

**Action Items from Audit:**
- **List components to reuse** (with file paths)
- **List components to extend/refactor** (what needs to change)
- **List styles/tokens to use** (variables, classes, mixins)
- **List services to leverage** (existing functionality)
- **List patterns to follow** (architectural decisions)
- **Identify gaps** (what genuinely needs to be created new)

This audit prevents:
- ❌ Creating duplicate components
- ❌ Inconsistent styling and design patterns
- ❌ Recreating existing service logic
- ❌ Feature feeling "bolted on" rather than integrated
- ❌ Breaking existing conventions and patterns

#### UI Component Analysis
From the mockup, identify:
- Visual components (buttons, inputs, cards, modals, etc.)
- Layout structure (grids, flex, positioning)
- Interactive elements (clicks, hovers, animations)
- State-dependent UI (loading, error, success states)
- Navigation patterns (tabs, routes, conditional rendering)

**Cross-reference with audit:** For each identified component, note if it should reuse, extend, or create new.

#### Functional Requirements Analysis
From the specifications, identify:
- User interactions and their expected outcomes
- Data flow (input → processing → output)
- Integration points (services, APIs, browser APIs)
- Real-time behavior (streaming, polling, events)
- Persistence requirements (state, localStorage, backend)

#### Technical Questions to Ask

Before creating the implementation plan, clarify:

1. **Component Architecture:**
   - Single component with internal state or multiple components?
   - Routed components or nested child components?
   - How should state be shared between related components?
   - What's the parent-child component hierarchy?
   - **Which existing components can be reused or extended?**
   - **What refactoring is needed to make existing components more flexible?**

2. **State Management:**
   - What state needs to be managed (local, shared, global)?
   - Should Signal Store be used for this feature?
   - What state persists between sessions or navigation?
   - What state is ephemeral (UI-only)?
   - **Can this feature extend an existing state store?**
   - **What existing state patterns should be followed?**

3. **Service Integration:**
   - What existing services should be leveraged?
   - What new services need to be created?
   - What external APIs or browser APIs are required?
   - How should errors and loading states be handled?
   - **Can existing service methods be extended rather than duplicated?**
   - **What existing error handling patterns should be followed?**

4. **Styling & Design Integration:**
   - **What design tokens (colors, spacing, typography) should be used?**
   - **What CSS/SCSS patterns exist that apply to this feature?**
   - **Are there utility classes or mixins to leverage?**
   - **How does this feature fit into the existing design system?**
   - **What responsive patterns are established in the project?**
   - **Should any existing styles be refactored for reusability?**

4. **Data Synchronization:**
   - How should real-time updates be handled?
   - What triggers state changes?
   - How should async operations be coordinated?
   - What race conditions or timing issues might occur?

5. **User Feedback:**
   - What visual feedback is needed for user actions?
   - How should loading states be displayed?
   - How should errors be communicated?
   - What success confirmations are needed?

6. **Edge Cases:**
   - What happens when services fail?
   - How to handle missing permissions (camera, microphone)?
   - What if data is malformed or unavailable?
   - How to handle network issues or timeouts?

### Phase 2: Implementation Planning

Create a detailed, dependency-ordered implementation plan.

#### Plan Structure

For each implementation step, provide:

1. **Step Number & Title**
   - Clear, action-oriented title
   - Example: "Step 3: Implement Audio Playback with Word Highlighting"

2. **Priority Level**
   - **Critical**: Core functionality, blocks other steps
   - **High**: Important features, minimal dependencies
   - **Medium**: Enhanced functionality, depends on core features
   - **Low**: Polish, optimizations, nice-to-haves

3. **Dependencies**
   - List which steps must be completed first
   - Example: "Depends on: Step 1 (Service Setup), Step 2 (Component Structure)"

4. **Complexity Estimate**
   - **Simple**: Straightforward implementation, < 2 hours
   - **Medium**: Moderate complexity, 2-4 hours
   - **Complex**: Significant complexity, > 4 hours

5. **Implementation Prompt**
   A self-contained prompt that includes:
   - **Task Description**: What needs to be implemented
   - **Required Context**: What code/files to reference
   - **Expected Outputs**: What files/code to produce
   - **Patterns to Follow**: Project-specific patterns to use
   - **Testing Approach**: How to verify the implementation
   - **Integration Points**: How this connects to existing code

6. **Acceptance Criteria**
   - Specific, testable criteria to verify completion
   - Example: "User can click Play button and hear text-to-speech audio"
   - Example: "Speed slider changes playback rate without restarting"

#### Step Ordering Principles

Order steps by:
1. **Audit & Refactoring**: Evaluate and refactor existing code first
2. **Foundation First**: Services, models, core utilities
3. **Component Structure**: Layout, routing, basic UI
4. **Core Functionality**: Primary user interactions
5. **Enhanced Features**: Secondary functionality
6. **Polish**: Animations, error handling, edge cases

**Refactoring steps should come first:**
- Generalize existing components to support new use cases
- Extract shared logic from duplicated code
- Update design tokens or styling patterns if needed
- Ensure backward compatibility with existing features

Group related tasks when appropriate:
- UI components that work together
- Service methods that share logic
- Related state management updates
- Styling updates that affect multiple components

#### Leveraging Existing Code

**Before creating anything new, always:**

1. **Search for existing implementations** of similar patterns
2. **Evaluate if existing code can be refactored** to support the new feature
3. **Identify shared abstractions** that can be extracted from existing code
4. **Follow established conventions** rather than inventing new ones

Identify opportunities to:
- **Reuse existing shared components** (modals, buttons, cards, forms, etc.)
- **Extend existing services** rather than creating new ones
- **Follow established styling patterns** (colors, spacing, typography, layouts)
- **Use existing state management structures** (extend stores, follow patterns)
- **Leverage utility functions and helpers** already in the codebase
- **Apply existing animation and transition patterns**
- **Follow naming conventions** for files, classes, methods, and variables

**Integration Strategy:**

For each new requirement, determine:
- ✅ **Reuse as-is**: Existing code works perfectly for this use case
- 🔧 **Refactor & extend**: Existing code needs minor adjustments to support new use case
- 🎯 **Extract & generalize**: Similar code exists in multiple places; extract shared abstraction
- ➕ **Create new**: Genuinely new functionality with no existing equivalent

**Anti-patterns to avoid:**
- ❌ Creating a new button component when one exists (extend the existing one)
- ❌ Duplicating modal logic (refactor existing modal to be more flexible)
- ❌ Hardcoding colors/spacing (use design tokens)
- ❌ Copying service methods (extract shared logic)
- ❌ Creating inconsistent component APIs (follow existing patterns)
- ❌ Inventing new state patterns (follow established ones)

Reference project patterns from:
- `references/tts-service-example.md` for service structure
- `references/stt-service-example.md` for async browser API integration
- Other reference files for component and state patterns

Note: you can use the reference files as a starting point, but you should not copy them verbatim. You should use them as a guide to understand the patterns and best practices used in the project.

**Document refactoring needs:**
When the audit reveals components/services that should be refactored:
- List them as separate implementation steps
- Prioritize refactoring before building on top
- Ensure refactoring maintains backward compatibility
- Test existing features after refactoring

### Phase 3: Prompt Generation

Generate high-quality, context-rich prompts for each implementation step.

#### Prompt Template Structure

```markdown
## [Step Title]

**Objective**: [Clear statement of what to build]

**Context**:
- Current state: [What exists now]
- This step builds on: [Previous steps or existing code]
- Integration points: [Services, components, state to connect with]

**Requirements**:
[Detailed list of functional and technical requirements]

**Implementation Details**:
- Component/Service to modify or create: [File paths]
- **Existing code to refactor**: [What needs to be generalized/extended]
- **Existing components/services to leverage**: [File paths and usage]
- **Design tokens to use**: [Colors, spacing, typography variables]
- Key methods/functions to implement: [List with signatures]
- State management: [How to manage state for this feature]
- Error handling: [Expected error scenarios and handling]

**Patterns to Follow**:
[Reference to project-specific patterns from references/ directory]

**Expected Output**:
- [ ] [Specific file or code artifact]
- [ ] [Another deliverable]
- [ ] [Testing approach]

**Acceptance Criteria**:
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]

**Reference Materials**:
- See `references/[relevant-file].md` for [pattern name]
- Example: [Code snippet or file reference]
```

#### Prompt Quality Guidelines

High-quality prompts should:
- Be self-contained (include all necessary context)
- Reference specific files and code patterns
- Provide concrete examples when helpful
- Specify expected outputs clearly
- Include error handling considerations
- Address edge cases explicitly
- Follow project conventions consistently

### Phase 4: Plan Review & Iteration

Before implementation begins:

1. **Present the complete plan** for user review
2. **Highlight critical decisions** that need confirmation
3. **Identify risks or unknowns** that may require research
4. **Request feedback** on step ordering and priorities
5. **Iterate based on feedback** before starting implementation


## Success Criteria

A complete implementation plan should:
- ✅ Be implementable step-by-step without backtracking
- ✅ Have clear boundaries and dependencies between steps
- ✅ Reuse existing patterns and components where possible
- ✅ Consider edge cases and error states
- ✅ Result in maintainable, testable code
- ✅ Follow project conventions consistently
- ✅ Take into account agent rules
- ✅ Include proper user feedback for all interactions
- ✅ Handle loading and error states appropriately


**Output:**
Comprehensive implementation plan with prioritized steps, each containing a self-contained prompt ready for execution.