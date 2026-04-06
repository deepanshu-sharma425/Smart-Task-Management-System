# ER Diagram

```mermaid
erDiagram
    USER ||--o{ PROJECT : manages
    PROJECT ||--o{ TASK : contains
    USER {
        string id PK
        string name
        string email
    }
    PROJECT {
        string id PK
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }
    TASK {
        string id PK
        string title
        string description
        string status
        datetime createdAt
        datetime updatedAt
    }
```

## Entities and Relationships

- **USER**: Represents a system user. One user can manage multiple projects.
- **PROJECT**: Represents a task project. One project contains multiple tasks.
- **TASK**: Represents an individual task within a project.
