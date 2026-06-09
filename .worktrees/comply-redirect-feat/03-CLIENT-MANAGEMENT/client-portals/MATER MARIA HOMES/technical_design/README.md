# Technical Design Folder

## Purpose
This folder contains all technical architecture documents, source code, and implementation details for the Mater Maria Homes project.

## Contents
- **Source Code** - The complete Next.js application for the investor portal
- **Technical Architecture Documents** - System design, API specifications, and database schemas
- **Configuration Files** - Environment setup, build configurations, and deployment scripts
- **API Documentation** - Endpoints, request/response formats, and authentication details
- **Database Schema** - Data models and relationships
- **Component Library** - Reusable UI components and design system documentation

## Substructure
```
technical_design/
├── mater-maria/                 # Main Next.js application
│   ├── src/                     # Source code
│   │   ├── app/                 # Next.js app router (pages, layouts)
│   │   ├── components/          # Reusable React components
│   │   ├── lib/                 # Utility functions, constants, services
│   │   ├── hooks/               # Custom React hooks
│   │   └── styles/              # CSS and styling files
│   ├── public/                  # Static assets (images, videos, icons)
│   │   ├── images/              # Property photos, gallery, etc.
│   │   ├── videos/              # Property tours and promotional videos
│   │   └── screenshots/         # Marketing screenshots
│   ├── .next/                   # Build output (auto-generated)
│   ├── node_modules/            # Dependencies
│   ├── package.json             # Project dependencies and scripts
│   ├── next.config.ts           # Next.js configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── README.md                # Project-specific documentation
└── assets/                      # Additional design assets and references
    └── screenshots/             # Marketing screenshots moved from downloads
```

## Technology Stack
- **Framework**: Next.js 14 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + SWR
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay integration
- **Analytics**: PostHog, Google Analytics
- **AI/Chatbot**: Google Gemini API
- **Deployment**: Vercel
- **Version Control**: Git

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Related Folders
- **`product_management/`** - Requirements that this implementation fulfills
- **`quality_assurance/`** - Test plans and validation criteria
- **`deployment/`** - Deployment scripts and environment-specific configs
- **`strategic_documents/`** - High-level technical vision and architecture decisions