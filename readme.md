# Smart Task Management System

A modern task management system built using **Next.js, TypeScript, and MongoDB**, following **OOP principles** and **Agile SDLC**.

---

## 📁 Project Structure

- `/src` - Application source code  
- `/db` - Database connection and configuration  
- `/diagrams` - ER, class, use case, and sequence diagrams  
- `/docs` - SDLC documentation  

---

## 📊 Architecture Diagrams

- [`diagrams/er_diagram.png`](./diagrams/er_diagram.png) - Entity Relationship Diagram
- [`diagrams/class_diagram.md`](./diagrams/class_diagram.md) - Class Diagram
- [`diagrams/use_case_diagram.md`](./diagrams/use_case_diagram.md) - Use Case Diagram
- [`diagrams/sequence_diagram.md`](./diagrams/sequence_diagram.md) - Sequence Diagram

---

## 🧠 System Design

### OOP Concepts

- **Encapsulation** - Structured data using interfaces (`ITask`, `IProject`)  
- **Abstraction** - Interfaces hide implementation details  
- **Polymorphism** - Tasks handled differently based on status or priority  
- **Inheritance** - Not implemented (can be extended in future)  

---

### Relationships

- **Project → Tasks** (One-to-Many using `projectId`)  

---

## 🧩 Design Pattern

- **Singleton Pattern** - Used for database connection to ensure a single instance throughout the application  

---

## 🗄️ Database

- MongoDB with Mongoose  
- Tasks reference Project using `projectId` (ObjectId)  
- Supports optional relationship (tasks can exist independently)  

---

## 🔄 SDLC

- Follows **Agile methodology**  
- Iterative development with phases:
  - Planning  
  - Design  
  - Implementation  
  - Testing  
  - Deployment  
  - Maintenance  

---

## 🚀 Setup

1. Create `.env.local` file  
2. Add your MongoDB connection string:MONGODB_URI=your_connection_string
3. Install dependencies:npm install
4. Run the development server:npm run dev



---

## 📌 Summary

> This system is built using Next.js with MongoDB, follows Agile SDLC, applies OOP principles, and implements a one-to-many relationship between projects and tasks using referencing.