# TaskForge — Project Overview & Architecture Documentation

## 1. Project Overview

**TaskForge** is a modern, production-ready task management system built for teams. It enables administrators to create projects, add team members, assign tasks with priorities and deadlines, and track progress in real-time. Team members can view their assigned tasks, update statuses, and receive notifications. The system enforces strict role-based access control with JWT-based authentication and an admin approval workflow for new member signups.

### Key Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Stateless auth with bcrypt password hashing (12 rounds) and HTTP-only cookies |
| **Role-Based Access Control** | 5 distinct roles (Admin, Project Manager, Developer, UI/UX Designer, Member) with edge middleware-enforced route protection |
| **Task Management** | Create, assign, track, and complete tasks with priorities and deadlines |
| **Project Organization** | Group tasks and team members into named projects with global uniqueness |
| **Team Management** | Admin can add members, approve/reject signups, and invite to projects |
| **Notifications** | Real-time notification system for task assignments and completions |
| **Invitations** | Project invitation system with accept/decline workflow |
| **Member Approval** | New member signups require explicit admin approval before login |
| **Dark Mode** | Full dark/light theme support with system preference detection |
| **Task Uniqueness** | Tasks are unique per admin user and per project (compound constraints) |

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 16 (App Router) with React 19 | SSR, file-based routing, API routes |
| **Language** | TypeScript 5 (strict mode) | Static typing, interfaces, generics |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with dark mode |
| **Animation** | Framer Motion 12 | Page transitions, scroll animations, micro-interactions |
| **Icons** | Lucide React | SVG icon library |
| **Database** | MongoDB with Mongoose 9 | NoSQL document database with schema validation |
| **Authentication** | JWT (jsonwebtoken + jose) with bcryptjs | Stateless token-based auth |
| **Date Utilities** | date-fns | Date formatting, deadline calculations |
| **Edge Runtime** | Next.js Middleware (jose) | JWT verification at the edge for route protection |

---

## 3. Architecture — Service-Repository Pattern

TaskForge uses a **Layered Architecture** with the **Service-Repository Pattern**, separating concerns into distinct layers:

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│         (React Components, Pages, Layouts)           │
├─────────────────────────────────────────────────────┤
│                    API Layer                         │
│           (Next.js API Route Handlers)               │
├─────────────────────────────────────────────────────┤
│                  Service Layer                       │
│      (Business Logic — AuthService, TaskService,     │
│       ProjectService, UserService,                   │
│       InvitationService, NotificationService)        │
├─────────────────────────────────────────────────────┤
│                Repository Layer                      │
│     (Data Access — UserRepository, TaskRepository,   │
│      ProjectRepository, InvitationRepository,        │
│      NotificationRepository)                         │
├─────────────────────────────────────────────────────┤
│                  Data Layer                          │
│         (MongoDB via Mongoose Schemas)                │
└─────────────────────────────────────────────────────┘
```

### Layer Responsibilities

- **Presentation Layer**: React components handle UI rendering, user interaction, and state management. Pages use the App Router for routing. Context providers (AuthProvider, ThemeProvider) manage global state.
- **API Layer**: Next.js API route handlers receive HTTP requests, validate input, delegate to services, and return responses. Includes auth, tasks, projects, users, invitations, and notifications endpoints.
- **Service Layer**: Encapsulates business logic. Services validate data, enforce business rules (uniqueness, authorization), and orchestrate operations across multiple repositories. All services extend BaseService for consistent error handling.
- **Repository Layer**: Abstracts database operations. Each repository provides CRUD operations and domain-specific queries for a single entity. All repositories extend BaseRepository with generic type safety.
- **Data Layer**: Mongoose schemas define the MongoDB document structure, constraints, indexes, and automatic timestamps.

---

## 4. SOLID Principles Applied

### S — Single Responsibility Principle (SRP)

Each class has exactly one reason to change:

| Class | Responsibility |
|-------|---------------|
| `BaseEntity` | ID generation and timestamps only |
| `BaseRepository` | Generic CRUD database operations only |
| `BaseService` | Cross-cutting concerns (error handling, logging, validation) only |
| `AuthService` | Authentication logic only (login, signup, JWT) |
| `UserService` | User management only (CRUD, approval, password hashing) |
| `TaskService` | Task business logic only (creation, assignment, validation) |
| `ProjectService` | Project management only (CRUD, member management) |
| `InvitationService` | Invitation workflow only |
| `NotificationService` | Notification management only |

**Example**: `AuthService` handles ONLY authentication. When we needed user CRUD operations, we created a separate `UserService` rather than bloating `AuthService`.

### O — Open/Closed Principle (OCP)

Classes are open for extension but closed for modification:

- `BaseEntity` provides an abstract `validate()` method. Each entity extends it with its own validation rules WITHOUT modifying `BaseEntity`.
- `BaseRepository` provides common CRUD. `TaskRepository` extends it with task-specific queries (`findByAdminAndTitle`, `findByAssignee`) without modifying the base.
- `BaseService` provides `execute()` for error handling. Concrete services extend with domain logic without changing the base.

### L — Liskov Substitution Principle (LSP)

Any subtype can replace its base type without breaking the system:

- `User`, `Task`, `Project`, `Notification`, `Invitation` all extend `BaseEntity` and can be used anywhere `IEntity` is expected.
- `TaskRepository`, `UserRepository`, etc. all extend `BaseRepository<T>` and implement `IRepository<T>`. Any repository can be substituted where `IRepository<T>` is expected.
- All services extend `BaseService` and use the same `execute()` and `validateRequired()` patterns.

### I — Interface Segregation Principle (ISP)

Interfaces are small and focused. Consumers only depend on what they need:

- `IReadable<T>` — findById(), findAll()
- `IWritable<T>` — create(), update()
- `IDeletable` — delete()
- `IRepository<T>` — composes all three + findByFilter()

A read-only reporting service could depend on just `IReadable<ITask>`, not the full `IRepository`.

### D — Dependency Inversion Principle (DIP)

High-level modules depend on abstractions, not concrete implementations:

- API route handlers depend on service interfaces (`ITaskService`, `IAuthService`, `IUserService`) accessed via singleton `getInstance()` methods.
- Services depend on repository abstractions (`IRepository<T>`) rather than directly on MongoDB or Mongoose.
- Middleware uses `jose` for JWT verification, decoupled from `jsonwebtoken` used in the service layer.

**Fix applied**: The users API routes previously bypassed the service layer and called `UserRepository` directly — a DIP violation. We created `UserService` so API routes now depend on the service abstraction.

---

## 5. Data Flow

### Task Creation Flow

```
User fills form → React state → POST /api/tasks
  → TaskService.createTask()
    → Validates required fields
    → Checks uniqueness per admin (findByAdminAndTitle)
    → Checks uniqueness per project (findByProjectAndTitle)
    → TaskRepository.create() → MongoDB insert
  → NotificationService.createNotification()
    → NotificationRepository.create() → MongoDB insert
  → JSON response → React state update → UI re-render
```

### Authentication Flow

```
User submits login form → POST /api/auth/login
  → AuthService.login()
    → UserRepository.findByEmail() → MongoDB query
    → Check isApproved status (members must be approved)
    → bcrypt.compare() password verification
    → jwt.sign() generates JWT token
  → Set HTTP-only cookie (taskforge-token)
  → JSON response with user + session
  → AuthProvider stores in React context + localStorage
  → Middleware validates JWT on subsequent requests
```

### Middleware Protection Flow

```
Browser request → Next.js Edge Middleware
  → Extract JWT from cookie
  → Verify with jose/jwtVerify
  → Check role-based route access
    → Admin: /dashboard/* allowed
    → Member: /member/* allowed
    → Redirect if role mismatch
  → NextResponse.next() or redirect
```

### Member Approval Flow

```
New member signs up → AuthService.signup()
  → User created with isApproved = false
  → Member sees "pending approval" on login attempt
  → Admin sees pending members on dashboard
  → Approve: UserService.approveUser() → isApproved = true
  → Reject: UserService.rejectUser() → user deleted
```

### Invitation Flow

```
Admin invites member → POST /api/invitations
  → InvitationService.createInvitation()
    → Check for duplicate pending invitation
    → InvitationRepository.create() → MongoDB insert
  → Member sees invitation on their page
  → Accept → updateInvitationStatus('accepted')
    → ProjectService.addMember() → $addToSet in MongoDB
  → Decline → updateInvitationStatus('declined')
```

---

## 6. Database Schema

### Entity Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Project | One-to-Many | A user owns multiple projects (via ownerId) |
| User ↔ Project | Many-to-Many | Users are members of projects (via memberIds array) |
| Project → Task | One-to-Many | A project contains multiple tasks (via projectId) |
| User → Task | One-to-Many | Tasks assigned to and assigned by users |
| User → Notification | One-to-Many | A user receives multiple notifications |
| Task → Notification | One-to-Many | Notifications reference a related task |
| User → Invitation | One-to-Many | Users send/receive invitations |
| Project → Invitation | One-to-Many | Invitations belong to a project |

### Collections & Constraints

| Collection | Key Fields | Uniqueness Constraints |
|-----------|-----------|----------------------|
| Users | name, email, password, role, isApproved | email: globally unique |
| Tasks | title, description, status, priority, deadline, assignedTo, assignedBy, projectId | Compound: title + assignedBy |
| Projects | name, description, ownerId, memberIds | name: globally unique |
| Invitations | projectId, adminId, memberId, status | Application-level duplicate check |
| Notifications | userId, type, message, read, relatedTaskId | — |

---

## 7. Design Patterns

| Pattern | Usage |
|---------|-------|
| **Repository Pattern** | Abstracts database operations behind `IRepository<T>` interface |
| **Service Pattern** | Encapsulates business logic in dedicated service classes |
| **Singleton Pattern** | All repositories and services use `getInstance()` for resource efficiency |
| **Template Method** | `BaseEntity.validate()` defines the validation contract; subclasses implement |
| **Strategy Pattern** | Navbar dynamically selects link sets based on user role (Admin/Project Manager/Developer/UI_UX/Member/Guest) |
| **Observer Pattern** | Notification system reacts to task events (assigned, completed) |
| **Provider Pattern** | React Context providers for Auth and Theme state management |
| **Factory Method** | `BaseEntity.generateId()` encapsulates ID creation logic |

---

## 8. Security

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Tokens**: 7-day expiry, signed with secret key, containing userId, email, role
- **HTTP-Only Cookies**: Prevents XSS attacks on JWT tokens
- **Edge Middleware**: Verifies JWT on every protected route request using jose
- **Role-Based Routing**: Admins restricted to /dashboard, members to /member
- **Member Approval**: New signups require admin approval before login
- **Password Exclusion**: UserSchema toJSON transform strips passwords from all API responses

---

## 9. API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/auth/login | Authenticate user, return JWT session |
| POST | /api/auth/signup | Register new user with hashed password |
| POST | /api/auth/logout | Clear authentication cookie |
| GET | /api/tasks | Get tasks (supports ?assignedTo, ?projectId filters) |
| POST | /api/tasks | Create task with uniqueness validation + notification |
| PATCH | /api/tasks/:id | Update task fields or status |
| DELETE | /api/tasks/:id | Delete a task |
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project with unique name validation |
| GET | /api/users | Get all users (password excluded) |
| POST | /api/users | Create user with password hashing |
| PUT | /api/users/:id | Update/approve user |
| DELETE | /api/users/:id | Reject/delete user |
| GET | /api/invitations | Get invitations (?memberId filter) |
| POST | /api/invitations | Create invitation with duplicate check |
| PATCH | /api/invitations/:id | Accept/decline invitation |
| GET | /api/notifications | Get notifications (?userId filter) |
| POST | /api/notifications | Create notification |
| PATCH | /api/notifications | Mark all as read (?userId) |

---

## 10. Frontend Architecture

### Component Hierarchy

```
RootLayout (layout.tsx)
├── ThemeProvider — dark/light mode via React Context
├── AuthProvider — user session, login/signup/logout
├── BackgroundShapes — animated decorative shapes
├── Navbar — responsive, glassmorphism, role-based navigation
└── Pages
    ├── Home (/) — Hero, Stats, Features, Testimonials, CTA
    ├── Login (/login) — Email/password form
    ├── Signup (/signup) — Registration with role selection
    ├── Dashboard (/dashboard) — Admin: tasks, team, projects
    └── Member (/member) — Member: tasks, notifications, invitations
```

### Reusable Components

| Component | Purpose |
|-----------|---------|
| AnimatedCard | Scroll-triggered fade-in animation wrapper |
| ParallaxSection | Parallax scroll effect wrapper |
| FormInput | Reusable form input with validation styling |
| StatsCard | Animated counter statistics card |
| TaskCard | Task display with status, priority, deadline indicators |
| TeamMemberCard | Team member with approve/reject actions |
| BackgroundShapes | Floating animated gradient shapes |

### UI/UX Features

- **Glassmorphism Navbar**: Transparent with backdrop blur, gains opacity on scroll
- **Dark/Light Theme**: System preference detection + manual toggle, persisted in localStorage
- **Framer Motion Animations**: Scroll-triggered reveals, hover effects, parallax, card transitions
- **Responsive Design**: Mobile-first with collapsible menu and adaptive grids
- **Deadline Indicators**: Color-coded badges (green/amber/red) with pulse for overdue
- **Priority Badges**: Visual indicators with icons for critical, high, medium, low
