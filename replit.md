# ShareWave - Secure P2P File Sharing Application

## Overview

ShareWave is a secure, peer-to-peer file sharing web application that enables direct browser-to-browser file transfers without server storage. The application uses WebRTC for encrypted file transfers and Firebase Realtime Database for signaling coordination. Built with React frontend, Express backend, and modern UI components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with TanStack Query for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **File Structure**: Modular design with separate routes and storage layers
- **Development**: Hot reloading with Vite middleware integration

### Data Flow
1. **File Upload**: User selects files through drag-and-drop or file picker
2. **Room Creation**: Firebase generates unique room ID for signaling
3. **Link Generation**: Share URL created with room ID for receivers
4. **WebRTC Signaling**: Firebase coordinates SDP offers/answers and ICE candidates
5. **P2P Connection**: Direct encrypted connection established between browsers
6. **File Transfer**: Chunked file transfer over WebRTC data channels
7. **Auto Cleanup**: Connections and signaling data automatically cleaned up

## Key Components

### Core Libraries
- **WebRTC**: Native browser APIs for peer-to-peer communication
- **Firebase**: Realtime Database for signaling coordination only
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect (configured but minimal usage)
- **Zod**: Schema validation for signaling data and file metadata

### UI Components
- **Shadcn/ui**: Complete component library with consistent design
- **Radix UI**: Accessible primitive components
- **Font Awesome**: Icon library for comprehensive iconography
- **Google Fonts**: Inter font family for modern typography

### File Handling
- **Chunked Transfer**: 16KB chunks for memory-efficient large file handling
- **Progress Tracking**: Real-time transfer progress for both sender and receiver
- **File Metadata**: Type-safe file information with validation

### Security Features
- **End-to-End Encryption**: WebRTC built-in encryption
- **No Server Storage**: Files never touch servers, direct device transfer
- **Temporary Signaling**: Auto-cleanup of coordination data
- **Secure Connections**: STUN servers for NAT traversal

## Data Storage Solutions

### Primary Storage
- **Firebase Realtime Database**: Minimal signaling data only
  - Session coordination (offers/answers/ICE candidates)
  - No file content or metadata storage
  - Automatic cleanup after transfers

### Local Storage
- **In-Memory**: File handling during transfers
- **Temporary**: No persistent local storage of shared files

### Database Schema
- **Drizzle Configuration**: PostgreSQL setup (minimal current usage)
- **Signaling Schema**: Zod validation for WebRTC coordination data
- **File Metadata Schema**: Type-safe file information structure

## External Dependencies

### Core Services
- **Firebase**: Real-time database for signaling coordination
- **Google AdSense**: Revenue generation through strategic ad placement
- **STUN Servers**: Google's public STUN servers for NAT traversal

### Development Tools
- **Replit Integration**: Development environment compatibility
- **Error Overlay**: Runtime error reporting in development
- **Cartographer**: Replit-specific development tooling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Assets**: Static files served from built frontend

### Environment Configuration
- **Development**: Local with hot reloading and error overlays
- **Production**: Optimized builds with external package handling
- **Environment Variables**: Firebase configuration and feature flags

### Hosting Considerations
- **Static Hosting**: Frontend can be served from CDN
- **Server Hosting**: Minimal backend for serving static files
- **WebRTC Requirements**: HTTPS required for WebRTC functionality
- **Domain Configuration**: Multi-domain support for Replit deployments

### Performance Optimizations
- **Code Splitting**: Vite handles automatic code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Automatic asset optimization in production
- **Chunked Loading**: Progressive loading of application features

## Security Architecture

### Data Protection
- **Zero Server Storage**: Files never stored on servers
- **Encrypted Transit**: WebRTC provides built-in encryption
- **Temporary Coordination**: Signaling data auto-expires
- **No User Authentication**: Eliminates user data collection risks

### Privacy Features
- **No File Inspection**: Server cannot access file contents
- **Minimal Metadata**: Only coordination data temporarily stored
- **Connection Isolation**: Each transfer uses unique room ID
- **Automatic Cleanup**: All coordination data auto-deleted