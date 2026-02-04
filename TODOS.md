# Task Management App - Development Tasks

## Overview
Build a mini Task Management Application as a client-side web application with LocalStorage persistence.

---

## Phase 1: Project Setup & Foundation

- [ ] Initialize project with Vite/React (or framework of choice)
- [ ] Install dependencies (routing, state management if needed)
- [ ] Set up project folder structure
- [ ] Configure fonts (Playfair Display, IBM Plex Sans)
- [ ] Create base CSS/styling system

---

## Phase 2: Data Layer & Persistence

- [ ] Create `sample-data.json` (from provided file)
- [ ] Implement LocalStorage service:
  - [ ] Load initial data from sample-data.json if LocalStorage empty
  - [ ] Save data to LocalStorage
  - [ ] Load data from LocalStorage
- [ ] Create data models/types (Project, Task)
- [ ] Implement CRUD operations (create, read, update, delete)

---

## Phase 3: Components - Projects List Page (`/projects`)

- [ ] Create Projects List page component
- [ ] Implement project card component:
  - [ ] Project title display
  - [ ] Task count indicator
  - [ ] Progress indicator (completed/total)
- [ ] Implement 3-column grid layout
- [ ] Add navigation to Project Detail page on card click
- [ ] Style according to Figma design

---

## Phase 4: Components - Project Detail Page (`/projects/:id`)

- [ ] Create Project Detail page component
- [ ] Implement project header:
  - [ ] Project title
  - [ ] Description
  - [ ] Back button navigation
- [ ] Implement task tree/list component:
  - [ ] Hierarchical tree structure (max 2 levels nesting)
  - [ ] Tree connector lines (vertical/horizontal)
  - [ ] Level 0 (root) - no indent, no connector
  - [ ] Level 1 (child) - indented with connector
  - [ ] Level 2 (grandchild) - further indented
  - [ ] Branch connectors (├──) for intermediate children
  - [ ] Corner connectors (└──) for last child
- [ ] Add "Add Task" button
- [ ] Implement task selection (single selection only)
- [ ] Style according to Figma design

---

## Phase 5: Components - Create/Edit Task Modal

- [ ] Create Modal overlay component
- [ ] Implement task form:
  - [ ] Task Title (required input)
  - [ ] Description (textarea)
  - [ ] Status dropdown (Todo, In Progress, Done)
  - [ ] Priority dropdown (Low, Medium, High)
  - [ ] Parent Task dropdown (for subtasks)
- [ ] Add Save/Cancel buttons
- [ ] Implement click-outside to close
- [ ] Handle create and edit modes
- [ ] Style according to Figma design

---

## Phase 6: Routing & State Management

- [ ] Set up client-side routing:
  - [ ] `/projects` - Projects List
  - [ ] `/projects/:id` - Project Detail
- [ ] Implement application state management:
  - [ ] Projects state
  - [ ] Tasks state
  - [ ] Selection state
- [ ] Connect state to LocalStorage persistence

---

## Phase 7: Interactions & Polish

- [ ] Implement hover states for all interactive elements
- [ ] Implement active/selected states
- [ ] Implement focus states for form inputs
- [ ] Add appropriate animations/transitions:
  - [ ] Modal fade in/out
  - [ ] Task item hover effects
  - [ ] Page transitions if appropriate
- [ ] Add motion effects based on Figma design

---

## Phase 8: Testing & Refinement

- [ ] Test all CRUD operations
- [ ] Test LocalStorage persistence (refresh page)
- [ ] Test navigation between pages
- [ ] Verify tree connector rendering
- [ ] Test responsive behavior (if required)
- [ ] Fix any visual discrepancies from Figma design

---

## Phase 9: Documentation & Submission

- [ ] Create README.md with:
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Run instructions
  - [ ] Features list
- [ ] Deploy to live URL (Vercel/Netlify/GitHub Pages)
- [ ] Push to Git repository
- [ ] Verify live demo works

---

## External Resources

- **Figma Design**: https://www.figma.com/design/qI9MvLnmsr53USRGvYth8O/Assignment?node-id=0-1&t=zSHp0xnfB6LcSeUd-1
- **Sample Data**: sample-data.json (attachment)
- **Fonts**:
  - Playfair Display: https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap
  - IBM Plex Sans: https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap

---

## Data Structure Reference

```
Project {
  id: string
  title: string
  description: string
  taskCount: number
  completedCount: number
}

Task {
  id: string
  projectId: string
  parentId: string | null
  title: string
  description: string
  status: 'Todo' | 'In Progress' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
}
```

## Submission Requirements

- [ ] Git repository URL
- [ ] Live demo URL (optional but appreciated)
- [ ] README.md with setup instructions
