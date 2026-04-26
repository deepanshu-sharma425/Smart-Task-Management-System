# Smart Task Management System

A modern, robust, and scalable task management system built using **Next.js, TypeScript, and MongoDB**. This project strictly follows **SOLID principles**, implements the **Service-Repository Pattern**, and incorporates secure authentication practices.

---

## 🌟 Key Features

- **MongoDB Backend**: Fully integrated MongoDB database utilizing Mongoose for object modeling.
- **Secure Authentication**: JWT-based stateless authentication with `bcryptjs` for secure password hashing.
- **SOLID Architecture**:
  - **Single Responsibility Principle**: Separated routes, services, repositories, and models.
  - **Open/Closed Principle**: Extended functionality via abstract classes like `BaseService` and `BaseRepository`.
  - **Dependency Inversion**: High-level modules depend on abstractions (interfaces like `IRepository`, `ITaskService`) rather than concrete implementations.
- **Robust Testing**: Configured with Jest and React Testing Library.
- **Modern Next.js**: Built using the Next.js App Router for server-side rendering and API routes.

---

## 📁 Project Structure

```text
/src
 ├── /app          # Next.js App Router pages and API routes
 └── middleware.ts # Edge middleware for JWT route protection

/db
 ├── /abstracts    # Abstract base classes (BaseService, BaseRepository)
 ├── /interfaces   # TypeScript interfaces for models, services, repositories
 ├── /models       # Mongoose schemas (TaskSchema, etc.)
 ├── /repositories # Concrete repository implementations
 └── /services     # Business logic layer

/tests             # Jest test suites
/diagrams          # Architecture, ER, class, data flow, and sequence diagrams
/docs              # Project overview, architecture docs, and SDLC
```

---

## 📖 Documentation & Diagrams

Detailed documentation and system diagrams are available in the repository:

- **[Project Overview](docs/PROJECT_OVERVIEW.md)**: Comprehensive description of features, tech stack, and architecture.
- **[Architecture Diagram](diagrams/ArchitectureDiagram.md)**: Visual representation of the layered architecture.
- **[Class Diagram](diagrams/ClassDiagram.md)**: Detailed OOP structure of entities, services, and repositories.
- **[ER Diagram](diagrams/ERDiagram.md)**: Database schema and entity relationships.
- **[Data Flow Diagram](diagrams/DataFlowDiagram.md)**: Visualization of data movement through the system.
- **[Sequence Diagrams](diagrams/SequenceDiagram.md)**: Step-by-step flows for auth and task management.

---

## 🧠 System Design & Patterns

### Design Patterns
- **Repository Pattern**: Abstracts database operations away from business logic.
- **Service Pattern**: Encapsulates business logic, making it reusable across API endpoints.
- **Singleton Pattern**: Used for Service and Repository instances to manage resources efficiently and ensure a single database connection through `dbConnect()`.

### Object-Oriented Principles (OOP)
- **Abstraction**: Base classes and interfaces hide database implementation details.
- **Encapsulation**: Strict type checking via interfaces (`ITask`, `IProject`).
- **Polymorphism**: Inherited services and repositories can override base methods as needed.

---

## 🗄️ Database Schema

- **MongoDB with Mongoose**
- Tasks reference Projects using a one-to-many relationship (`projectId` as `ObjectId`).
- Users and Tasks maintain a one-to-many relationship (`assignedTo`).

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection URI

### 2. Installation
```bash
# Clone the repository
# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-system
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Running the App
```bash
# Start the development server
npm run dev

# Build for production
npm run build
npm start
```

### 5. Running Tests
```bash
# Run the Jest test suite
npm run test
```

---

## 🔄 SDLC Methodology

This project was developed following **Agile methodology**, with iterative phases of Planning, Design, Implementation, Testing, and Deployment, ensuring maintainability and scalability.