# TaskForge — Project Overview & Architecture Documentation

## 1. Project Overview

**TaskForge** is a modern, production-ready task management system built for teams. It enables admins to create projects, add team members, assign tasks with priorities and deadlines, and track progress in real-time. Team members can view their assigned tasks, update statuses, and receive notifications.

### Key Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Stateless auth with bcrypt password hashing and HTTP-only cookies |
| **Role-Based Access** | Admin and Member roles with middleware-enforced route protection |
| **Task Management** | Create, assign, track, and complete tasks with priorities and deadlines |
| **Project Organization** | Group tasks and team members into projects |
| **Team Management** | Admin can add members, approve/reject signups, and invite to projects |
| **Notifications** | Real-time notification system for task assignments and completions |
| **Invitations** | Project invitation system with accept/decline workflow |
| **Dark Mode** | Full dark/light theme support with system preference detection |

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | Next.js 16 (App Router) with React 19 |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Database** | MongoDB with Mongoose 9 |
| **Authentication** | JWT (jsonwebtoken + jose) with bcryptjs |
| **Date Utilities** | date-fns |

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
│       ProjectService, UserService, etc.)             │
├─────────────────────────────────────────────────────┤
│                Repository Layer                      │
│     (Data Access — UserRepository, TaskRepository,   │
│      ProjectRepository, etc.)                        │
├─────────────────────────────────────────────────────┤
│                  Data Layer                          │
│         (MongoDB via Mongoose Schemas)                │
└─────────────────────────────────────────────────────┘
```

### Layer Responsibilities

- **Presentation Layer**: React components handle UI rendering, user interaction, and state management. Pages use the App Router for routing.
- **API Layer**: Next.js API route handlers receive HTTP requests, validate input, delegate to services, and return responses.
- **Service Layer**: Encapsulates business logic. Services validate data, enforce business rules (uniqueness, authorization), and orchestrate operations across multiple repositories.
- **Repository Layer**: Abstracts database operations. Each repository provides CRUD operations and domain-specific queries for a single entity.
- **Data Layer**: Mongoose schemas define the MongoDB document structure and constraints.

---

## 4. SOLID Principles Applied

### S — Single Responsibility Principle (SRP)

Each class has exactly one reason to change:

| Class | Responsibility |
|-------|---------------|
| `UserRepository` | Database operations for User documents |
| `AuthService` | Authentication logic (login, signup, JWT) |
| `UserService` | User management logic (CRUD, approval) |
| `TaskService` | Task business logic (creation, assignment, validation) |
| `BaseEntity` | ID generation and timestamps |

**Example**: `AuthService` handles ONLY authentication. When we needed user CRUD operations, we created a separate `UserService` rather than bloating `AuthService`.

```typescript
// AuthService — only auth concerns
export class AuthService extends BaseService implements IAuthService {
  async login(credentials: ILoginCredentials) { /* auth only */ }
  async signup(data: ISignupData) { /* auth only */ }
}

// UserService — only user management concerns
export class UserService extends BaseService implements IUserService {
  async createUser(data) { /* user CRUD only */ }
  async approveUser(userId) { /* user management only */ }
}
```

### O — Open/Closed Principle (OCP)

Classes are open for extension but closed for modification:

**Example**: `BaseEntity` provides an abstract `validate()` method. Each entity extends it with its own validation rules WITHOUT modifying `BaseEntity`:

```typescript
// BaseEntity is CLOSED for modification
export abstract class BaseEntity implements IEntity {
  public abstract validate(): string[];  // Extension point
}

// User EXTENDS with its own validation — BaseEntity unchanged
export class User extends BaseEntity implements IUser {
  public validate(): string[] {
    const errors: string[] = [];
    if (!this.name.trim()) errors.push('Name is required.');
    if (!this.email.trim()) errors.push('Email is required.');
    return errors;
  }
}
```

**Example**: `BaseRepository` provides common CRUD. `TaskRepository` extends it with task-specific queries without modifying the base:

```typescript
export class TaskRepository extends BaseRepository<ITask> {
  // Extension — new method, BaseRepository unchanged
  public async findByAdminAndTitle(assignedBy: string, title: string) { ... }
}
```

### L — Liskov Substitution Principle (LSP)

Any subtype can replace its base type without breaking the system:

- `User`, `Task`, `Project`, `Notification`, `Invitation` all extend `BaseEntity` and can be used anywhere `IEntity` is expected.
- `TaskRepository`, `UserRepository`, etc. all extend `BaseRepository<T>` and implement `IRepository<T>`. Any repository can be substituted where `IRepository<T>` is expected.
- All services extend `BaseService` and use the same `execute()` and `validateRequired()` patterns.

### I — Interface Segregation Principle (ISP)

Interfaces are small and focused. Consumers only depend on what they need:

```typescript
// Instead of one bloated ICrudRepository:
export interface IReadable<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export interface IWritable<T> {
  create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
}

export interface IDeletable {
  delete(id: string): Promise<boolean>;
}

// Composite only when you need everything:
export interface IRepository<T> extends IReadable<T>, IWritable<T>, IDeletable { }
```

**Example**: A read-only reporting service could depend on just `IReadable<ITask>`, not the full `IRepository`.

### D — Dependency Inversion Principle (DIP)

High-level modules depend on abstractions, not concrete implementations:

```typescript
// Service interface (abstraction)
export interface ITaskService {
  createTask(data: ICreateTaskData): Promise<ITask>;
  getAllTasks(): Promise<ITask[]>;
}

// API route depends on the INTERFACE, not the concrete class
// (accessed via getInstance() which returns ITaskService)
const taskService = TaskService.getInstance();
```

**Fix applied**: The users API routes previously bypassed the service layer and called `UserRepository` directly — a DIP violation. We created `UserService` so API routes now depend on the service abstraction.

---

## 5. Data Flow

### Task Creation Flow

```
User fills form → React state → POST /api/tasks
  → TaskService.createTask()
    → Validates required fields
    → Checks uniqueness (per admin + per project)
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

---

## 6. Folder Structure

```
Smart-Task-Management-System/
├── db/                          # Database layer (backend)
│   ├── abstracts/               # Abstract base classes
│   │   ├── BaseEntity.ts        #   ID generation, timestamps, validate()
│   │   ├── BaseRepository.ts    #   Generic CRUD operations
│   │   └── BaseService.ts       #   Error handling, logging, validation
│   ├── interfaces/              # TypeScript interfaces (contracts)
│   │   ├── types.ts             #   Enums, union types, utility types
│   │   ├── models.ts            #   Entity interfaces (IUser, ITask, ...)
│   │   ├── repositories.ts      #   IReadable, IWritable, IDeletable, IRepository
│   │   └── services.ts          #   IAuthService, ITaskService, IUserService, ...
│   ├── models/                  # Domain models + Mongoose schemas
│   │   ├── User.ts              #   User entity class
│   │   ├── UserSchema.ts        #   Mongoose schema for User
│   │   ├── Task.ts              #   Task entity class
│   │   ├── TaskSchema.ts        #   Mongoose schema with unique indexes
│   │   ├── Project.ts           #   Project entity class
│   │   ├── ProjectSchema.ts     #   Mongoose schema (unique name)
│   │   ├── Invitation.ts        #   Invitation entity class
│   │   ├── InvitationSchema.ts  #   Mongoose schema for Invitation
│   │   ├── Notification.ts      #   Notification entity class
│   │   └── NotificationSchema.ts #  Mongoose schema for Notification
│   ├── repositories/            # Concrete repository implementations
│   │   ├── UserRepository.ts    #   findByEmail, findByRole, getTeamMembers
│   │   ├── TaskRepository.ts    #   findByAssignee, findByAdminAndTitle
│   │   ├── ProjectRepository.ts #   findByOwner, findByName, addMember
│   │   ├── InvitationRepository.ts
│   │   └── NotificationRepository.ts
│   ├── services/                # Business logic layer
│   │   ├── AuthService.ts       #   Login, signup, JWT management
│   │   ├── UserService.ts       #   User CRUD, approval, password hashing
│   │   ├── TaskService.ts       #   Task CRUD, uniqueness validation
│   │   ├── ProjectService.ts    #   Project CRUD, member management
│   │   ├── InvitationService.ts #   Invitation workflow
│   │   └── NotificationService.ts # Notification management
│   └── mongodb.ts               # Database connection (singleton with caching)
│
├── src/                         # Frontend layer
│   ├── middleware.ts             # Edge middleware (JWT verification, role routing)
│   └── app/                     # Next.js App Router
│       ├── layout.tsx           #   Root layout (Navbar, ThemeProvider, AuthProvider)
│       ├── page.tsx             #   Home page (hero, features, testimonials, CTA)
│       ├── globals.css          #   Global styles, animations, design tokens
│       ├── login/page.tsx       #   Login form
│       ├── signup/page.tsx      #   Signup form with role selection
│       ├── dashboard/page.tsx   #   Admin dashboard (tasks, team, projects)
│       ├── member/page.tsx      #   Member task view with notifications
│       ├── components/          #   Reusable React components
│       │   ├── Navbar.tsx       #     Responsive navbar with glassmorphism
│       │   ├── AuthProvider.tsx #     Auth context (login, signup, logout)
│       │   ├── ThemeProvider.tsx #    Theme context (dark/light toggle)
│       │   ├── BackgroundShapes.tsx # Animated background decorations
│       │   ├── AnimatedCard.tsx #     Scroll-triggered card animation
│       │   ├── ParallaxSection.tsx #  Parallax scroll effect wrapper
│       │   ├── FormInput.tsx    #     Reusable form input component
│       │   ├── StatsCard.tsx    #     Animated counter stats card
│       │   ├── TaskCard.tsx     #     Task display with status/priority/deadline
│       │   └── TeamMemberCard.tsx #   Team member with approve/reject actions
│       └── api/                 # API route handlers
│           ├── auth/            #   login/, signup/, logout/
│           ├── tasks/           #   CRUD + status updates
│           ├── projects/        #   CRUD + member management
│           ├── users/           #   CRUD + approval workflow
│           ├── invitations/     #   Create + accept/decline
│           └── notifications/   #   CRUD + mark-as-read
│
├── diagrams/                    # System diagrams (Mermaid + PNG)
├── docs/                        # Documentation
├── scripts/                     # Utility scripts (seed.ts)
└── package.json                 # Dependencies and scripts
```

---

## 7. Design Patterns

| Pattern | Usage |
|---------|-------|
| **Repository Pattern** | Abstracts database operations behind `IRepository<T>` interface |
| **Service Pattern** | Encapsulates business logic in dedicated service classes |
| **Singleton Pattern** | All repositories and services use `getInstance()` for resource efficiency |
| **Template Method** | `BaseEntity.validate()` defines the validation contract; subclasses implement |
| **Strategy Pattern** | Navbar dynamically selects link sets based on user role (admin/member/guest) |
| **Observer Pattern** | Notification system reacts to task events (assigned, completed) |
| **Provider Pattern** | React Context providers for Auth and Theme state management |
