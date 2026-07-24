# Frontend Layout Architecture

> Version: 1.0
> Project: Research Promotion Policy Management System (RPMS)

## Purpose

This document defines the frontend architecture of RPMS. The structure described here is intended to remain stable throughout development. New features should integrate into the existing architecture instead of introducing new structural patterns.

The objective is to keep the codebase modular, scalable, and easy to maintain as the project grows from a frontend prototype into a full-stack enterprise application.

---

# Root Directory

```
src/

├── app/
├── assets/
├── components/
├── constants/
├── features/
├── hooks/
├── layouts/
├── lib/
├── services/
├── store/
├── styles/
└── utils/
```

Each directory has a single responsibility.

---

# app/

Responsible for application initialization.

Contains global providers, routing configuration and application entry configuration.

```
app/

router/
providers/
```

### router/

Contains every application route.

Responsibilities:

- Protected Routes
- Public Routes
- Role Based Routing
- Route Configuration

Example

```
router/

AppRouter.jsx

ProtectedRoute.jsx

PublicRoute.jsx
```

---

### providers/

Contains global providers.

Examples

```
AuthProvider

ThemeProvider

QueryProvider
```

This keeps `main.jsx` clean and prevents provider nesting.

---

# assets/

Contains static resources.

```
assets/

icons/

images/

logos/

illustrations/

fonts/
```

No business logic should exist here.

---

# components/

Contains reusable UI components.

A component belongs here only if it can be reused across multiple features.

Example

```
components/

ui/

Button

Input

Card

Badge

Avatar

Modal

Loader

navigation/

Sidebar

Header

Breadcrumb

feedback/

EmptyState

Skeleton

ErrorState
```

Components inside this folder should never contain feature-specific business logic.

---

# features/

The core of the application.

Every business module lives here.

```
features/

auth/

dashboard/

faculty/

student/

hod/

director/

rpc/

finance/

accounts/

admin/
```

Each feature remains isolated.

Example

```
faculty/

components/

pages/

hooks/

services/

constants/

utils/
```

Everything related to Faculty stays inside this module.

No cross-feature dependencies unless absolutely necessary.

---

# layouts/

Contains reusable page layouts.

Example

```
layouts/

AppLayout.jsx

AuthLayout.jsx

DashboardLayout.jsx
```

Layouts define structure only.

They should not contain business logic.

Responsibilities:

- Sidebar

- Header

- Footer

- Main Content Container

---

# hooks/

Contains reusable custom hooks.

Examples

```
useAuth()

useSidebar()

useDebounce()

useLocalStorage()

useTheme()
```

Hooks should encapsulate reusable behaviour rather than UI.

---

# services/

Contains API communication.

Examples

```
authService.js

dashboardService.js

claimService.js
```

Components should never communicate directly with APIs.

Every request passes through the service layer.

This allows backend implementation to change without affecting the UI.

---

# store/

Contains global state.

Initially

```
Auth Context

Theme Context
```

Future

```
React Query

Permission Context

Notification Context
```

Business state should remain outside components.

---

# constants/

Application constants.

Examples

```
roles.js

routes.js

sidebarConfig.js

claimStatus.js
```

Avoid hardcoded strings inside components.

---

# styles/

Global styling.

Contains

```
globals.css

tailwind.css

variables.css
```

Only global styles belong here.

Component styling should remain local whenever possible.

---

# utils/

Reusable helper functions.

Examples

```
formatDate()

formatCurrency()

calculatePercentage()

truncateText()
```

Utilities should remain pure functions without side effects.

---

# Dashboard Structure

Each role owns an independent dashboard.

```
Faculty

Dashboard

↓

My Claims

↓

Payments

↓

Research Score

↓

Profile
```

```
HOD

Dashboard

↓

Approval Queue

↓

Department Analytics

↓

Faculty Progress
```

```
RPC

Dashboard

↓

Verification Queue

↓

Policy Validation

↓

Research Analytics
```

Every dashboard shares the same layout while rendering different modules.

---

# Component Hierarchy

```
App

↓

Router

↓

Layout

↓

Sidebar

↓

Header

↓

Page

↓

Section

↓

Card

↓

Reusable Component
```

Business logic flows downward.

Reusable components never depend on feature modules.

---

# Design Rules

The following architectural decisions apply throughout the project.

- Layouts define page structure only.
- Business logic belongs inside features.
- Reusable UI belongs inside components.
- API calls belong inside services.
- Shared behaviour belongs inside hooks.
- Constants remain centralized.
- Feature modules should remain isolated.
- New functionality should extend existing modules instead of creating new architectural patterns.

Following these rules ensures the project can scale without requiring major restructuring as backend integration and additional modules are introduced.
