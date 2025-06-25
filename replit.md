# 3D Modeling Studio

## Overview

This is an advanced 3D modeling application built as a web-based CAD/3D modeling studio with photogrammetry capabilities. The application allows users to create, manipulate, and export 3D models while providing professional-grade modeling tools and a photo-to-3D conversion feature.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **3D Rendering**: Three.js with React Three Fiber (@react-three/fiber) and Drei (@react-three/drei)
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: Zustand for client-side state management
- **Build Tool**: Vite with custom configuration for 3D assets

### Backend Architecture
- **Runtime**: Node.js with TypeScript (TSX for development)
- **Framework**: Express.js with custom middleware
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)

### Development Setup
- **Monorepo Structure**: Client and server code in separate directories with shared schema
- **Hot Reload**: Vite development server with HMR for frontend, TSX for backend
- **Type Safety**: Shared TypeScript types and Zod schemas for validation

## Key Components

### 3D Modeling Engine
- **Primitive Creation**: Support for box, sphere, cylinder, cone, plane, and torus primitives
- **Geometry Operations**: Boolean operations (union, difference, intersection) using CSG techniques
- **Material System**: Standard, physical, and PBR material support with metalness/roughness workflow
- **Scene Management**: Hierarchical scene graph with object selection, transformation, and grouping
- **Export Formats**: STL, OBJ, GLTF, PLY, and FBX export capabilities

### Photogrammetry System
- **Photo Processing**: Multi-photo upload with EXIF data extraction
- **3D Reconstruction**: Structure from Motion (SfM) and dense reconstruction algorithms
- **Mesh Generation**: Point cloud to mesh conversion with texture mapping
- **Quality Control**: Configurable processing parameters and confidence metrics

### User Interface
- **Tool Panel**: Comprehensive modeling tools with keyboard shortcuts
- **Properties Panel**: Real-time object property editing
- **Scene Hierarchy**: Tree view of scene objects with visibility and lock controls
- **File Manager**: Project management, photo upload, and export functionality
- **Viewport**: 3D scene rendering with camera controls and grid overlay

### Audio System
- **Background Music**: Ambient audio for enhanced user experience
- **Sound Effects**: Hit and success sound feedback
- **Mute Controls**: User-configurable audio settings

## Data Flow

1. **Scene Management**: Objects are stored in Zustand store and synchronized with Three.js scene
2. **Tool Interaction**: User selects tools → Updates active tool state → Renders appropriate UI controls
3. **Object Manipulation**: Transform operations update object properties → Triggers re-render
4. **Photogrammetry Pipeline**: Photos uploaded → Processed through reconstruction → Added to scene
5. **Export Process**: Scene objects serialized → Converted to target format → Downloaded

## External Dependencies

### Core 3D Libraries
- **Three.js Ecosystem**: @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **GLSL Support**: vite-plugin-glsl for custom shader development

### UI Framework
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Lucide Icons**: Modern icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design system

### Development Tools
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development server
- **Drizzle Kit**: Database schema management and migrations

### Database & Storage
- **Neon Database**: Serverless PostgreSQL for user data and project storage
- **Drizzle ORM**: Type-safe database queries and schema management

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized bundle with code splitting
- **Backend**: ESBuild creates single executable with external dependencies
- **Assets**: 3D models, textures, and audio files included in build

### Hosting Configuration
- **Platform**: Replit with auto-scaling deployment
- **Port Configuration**: Express server on port 5000, proxied to port 80
- **Static Assets**: Served from dist/public directory
- **Environment**: NODE_ENV=production for optimized builds

### Database Setup
- **Connection**: DATABASE_URL environment variable required
- **Migrations**: Drizzle Kit handles schema migrations
- **Session Storage**: PostgreSQL-backed session store for user authentication

## Changelog
- June 25, 2025. Initial setup
- June 25, 2025. Completed advanced 3D modeling application with photogrammetry features
  - Implemented comprehensive 3D modeling tools (primitives, transforms, materials)
  - Added sophisticated photo-to-3D conversion system
  - Built professional UI with tool panels, scene hierarchy, and properties editor
  - Integrated export functionality for multiple 3D formats
  - Added boolean operations and advanced material editing
  - Application successfully deployed and tested

## User Preferences

Preferred communication style: Simple, everyday language.
Project built for friend - focus on professional, feature-complete 3D modeling capabilities.