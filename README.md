# Angular Frontend Setup Guide

## Prerequisites
- Node.js 18.x or later
- npm or yarn
- Git

## Setup Commands

### 1. Clone Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/' // Your backend URL
};
```

### 4. Development Server
```bash
ng serve
```

### 5. Build for Production
```bash
ng build --prod
```

## Available Scripts

### Development
```bash
npm start          # Start dev server
ng serve --open    # Start and open browser
ng serve --port 4300  # Custom port
```

### Build
```bash
ng build           # Development build
ng build --prod    # Production build
ng build --watch   # Build with file watching
```

### Testing
```bash
ng test            # Run unit tests
ng e2e             # Run end-to-end tests
```

### Code Generation
```bash
ng generate component <name>    # Create component
ng generate service <name>      # Create service
ng generate module <name>       # Create module
```

## Verification
- Development: `http://localhost:4200`
- Production build: `dist/` folder


## API Integration
Backend should be running on `https://localhost:5001` before starting frontend.

## Default Ports
- Development: `http://localhost:4200`
- Backend API: `https://localhost:5001`