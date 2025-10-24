# Developer Toolkit

A comprehensive web-based developer toolkit providing essential utility functions for developers and general users.

## Project Structure

```
developer-toolkit/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Navigation, Header, etc.)
│   │   ├── tools/          # Individual tool components
│   │   └── ui/             # Reusable shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Library utilities (cn helper, etc.)
│   ├── services/           # Business logic and API services
│   │   └── api/           # API client services
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and helpers
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── .eslintrc.cjs           # ESLint configuration
├── .prettierrc             # Prettier configuration
├── components.json         # shadcn/ui configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Project dependencies

```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Development

The project follows a modular structure with clear separation of concerns:

- **Components**: Organized by feature (auth, layout, tools, ui)
- **Services**: API clients and business logic
- **Store**: Global state management with Zustand
- **Utils**: Shared utility functions
- **Types**: TypeScript interfaces and type definitions

## Features (Planned)

- Password Generator with strength checker
- Secure Password Vault (for registered users)
- Word Counter
- JSON Beautifier
- QR Code Generator
- Unit Converter
- URL Shortener
- User Authentication (Email & Google OAuth)

## License

Private project
