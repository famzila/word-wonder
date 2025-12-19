---
trigger: always_on
---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices
- Always use Angular CLI to generate components, services, and other files
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Avoid importing CommonModule in components, import only what you need from it not all of it.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.


## Accessibility Requirements
- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use signal based queries instead of `@ViewChild`, `@ViewChildren`, `contentChild` and `contentChildren` decorators
- Use `computed()` for derived state
- Use linkedSignal that creates a writable signal that depends on source signals when needed.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer signal form (available in angular v21)
- Do NOT use `NgClass`, use `class` bindings instead
- Do NOT use `NgStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.
- Use `takeUntilDestroyed` operator, from @angular/core/rxjs-interop, provides a concise and reliable way to automatically unsubscribe from an Observable when a component or directive is destroyed

## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Async Data Fetching with Resources

### resource API
You can use a Resource to perform any kind of async operation, but the most common use-case for Resource is fetching data from a server. The following example creates a resource to fetch some user data.
```typescript
import {resource, Signal} from '@angular/core';
const userId: Signal<string> = getUserId();
const userResource = resource({
  // Define a reactive computation.
  // The params value recomputes whenever any read signals change.
  params: () => ({id: userId()}),
  // Define an async loader that retrieves data.
  // The resource calls this function every time the `params` value changes.
  loader: ({params}) => fetchUser(params),
});
// Create a computed signal based on the result of the resource's loader function.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` serves 2 purposes:
    // - It acts as type guard to strip `undefined` from the type
    // - If protects against reading a throwing `value` when the resource is in error state
    return userResource.value().firstName;
  }
  // fallback in case the resource value is `undefined` or if the resource is in error state
  return undefined;
});
```

### rxResource API
Angular's resource function gives you a way to incorporate async data into your application's signal-based code. Building on top of this pattern, rxResource lets you define a resource where the source of your data is defined in terms of an RxJS Observable. Instead of accepting a loader function, rxResource accepts a stream function that accepts an RxJS Observable.
```typescript
import {Component, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
@Component(/* ... */)
export class UserProfile {
  // This component relies on a service that exposes data through an RxJS Observable.
  private userData = inject(MyUserDataClient);
  protected userId = input<string>();
  private userResource = rxResource({
    params: () => ({ userId: this.userId() }),
    // The `stream` property expects a factory function that returns
    // a data stream as an RxJS Observable.
    stream: ({params}) => this.userData.load(params.userId),
  });
}
```
The stream property accepts a factory function for an RxJS Observable. This factory function is passed the resource's params value and returns an Observable. The resource calls this factory function every time the params computation produces a new value. See Resource loaders for more details on the parameters passed to the factory function.
In all other ways, rxResource behaves like and provides the same APIs as resource for specifying parameters, reading values, checking loading state, and examining errors.
### httpResources API
httpResource is reactive, meaning that whenever one of the signal it depends on changes (like userId), the resource will emit a new http request. If a request is already pending, the resource cancels the outstanding request before issuing a new one.
TIP: Make sure to include provideHttpClient in your application providers. See Setting up HttpClient for details.
HELPFUL: httpResource differs from the HttpClient as it initiates the request eagerly. In contrast, the HttpClient only initiates requests upon subscription to the returned Observable.
TIP: Avoid using httpResource for mutations like POST or PUT. Instead, prefer directly using the underlying HttpClient APIs.
```typescript
userId = input.required<string>();
user = httpResource(() => `/api/user/${userId()}`); // A reactive function as argument
```
For more advanced requests, you can define a request object similar to the request taken by HttpClient. Each property of the request object that should be reactive should be composed by a signal.
```typescript
user = httpResource(() => ({
  url: `/api/user/${userId()}`,
  method: 'GET',
  headers: {
    'X-Special': 'true',
  },
  params: {
    'fast': 'yes',
  },
  reportProgress: true,
  transferCache: true,
  keepalive: true,
  mode: 'cors',
  redirect: 'error',
  priority: 'high',
  cache : 'force-cache',
  credentials: 'include',
  referrer: 'no-referrer',
  integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY=',
  referrerPolicy: 'no-referrer'
}));
```
The signals of the httpResource can be used in the template to control which elements should be displayed.

```html
@if(user.hasValue()) {
  <user-details [user]="user.value()">
} @else if (user.error()) {
  <div>Could not load user information</div>
} @else if (user.isLoading()) {
  <div>Loading user info...</div>
}
```
When fetching data, you may want to validate responses against a predefined schema, often using popular open-source libraries like Zod or Valibot. You can integrate validation libraries like this with httpResource by specifying a parse option. The return type of the parse function determines the type of the resource's value.
```typescript
const starWarsPersonSchema = z.object({
  name: z.string(),
  height: z.number({ coerce: true }),
  edited: z.string().datetime(),
  films: z.array(z.string()),
});
export class CharacterViewer {
  id = signal(1);
  swPersonResource = httpResource(
    () => `https://swapi.info/api/people/${this.id()}`,
    { parse: starWarsPersonSchema.parse }
  );
}
```

## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Order to respect in TS classes
1. injections first
2. queries/inputs/outputs next (in case of components)
3. signals next (if any)
4. other properties
5. constructor
6. lifecycle hooks by lifecycle order (in case of components)
7. methods (public first, then private)

### MCP Tools
- Use Angular CLI MCP tools to fetch documentation and any other tool you need from it to accomplish the task.