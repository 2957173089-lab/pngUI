# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PixelMuse AI is a React-based web application that uses AI (Qwen-VL model from Alibaba Cloud) to generate UI code from reference images and text prompts. The application allows users to upload reference images, describe their requirements, and receive generated HTML/CSS code in multiple frameworks (HTML+Tailwind, Vue 3, React, Uni-app).

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
- Requires Node.js with npm
- API keys for Alibaba Cloud DashScope (Qwen-VL model) for AI functionality
- Vercel account recommended for deployment with built-in proxy API

## Project Architecture

### Frontend Structure
- **React + TypeScript + Vite**: Modern frontend stack with Tailwind CSS
- **Zustand**: Lightweight state management for global app state
- **Component Architecture**: Modular design with clear separation of concerns

### Key Components
- `src/App.tsx`: Root component with conditional rendering based on authentication
- `src/pages/LoginPage.tsx`: Mock authentication page with demo login
- `src/pages/WorkspacePage.tsx`: Main application interface
- `src/components/InputPanel.tsx`: Left panel for image upload and prompt input
- `src/components/PreviewPanel.tsx`: Right panel for code preview and iframe display
- `src/components/Navbar.tsx`: Top navigation with settings and history access
- `src/components/HistoryDrawer.tsx`: Side panel for project history and favorites
- `src/components/SettingsModal.tsx`: Configuration modal for API settings

### State Management
- **Zustand Store** (`src/store/useStore.ts`): Centralized state management
- Persistent settings via localStorage (API keys, endpoints, model selection)
- Real-time state updates for streaming code generation

### Data Flow
1. User uploads image and enters prompt in InputPanel
2. Settings are retrieved from Zustand store (API config)
3. API call made to either:
   - Vercel proxy endpoint (`/api/generate`)
   - Direct DashScope API (if configured)
   - Mock AI service (fallback)
4. Streaming response updates PreviewPanel in real-time
5. Generated project saved to Zustand store and displayed in HistoryDrawer

## API Integration

### Proxy Architecture
- **Vercel Edge Function**: `api/generate.js` handles CORS and API key security
- **CloudFlare Workers**: Alternative proxy option (`docs/cloudflare-worker.js`)
- **Direct API**: Configurable for development/testing

### AI Service
- **Primary**: Alibaba Cloud DashScope Qwen-VL-Max model
- **Features**: Multi-modal (image + text), streaming responses, OpenAI-compatible API
- **Fallback**: Mock AI service for development without API keys

## Configuration

### Environment Variables (Vercel Deployment)
- `DASHSCOPE_API_KEY`: Alibaba Cloud API key for secure server-side usage

### Client-side Settings
- Stored in localStorage with keys: `pm_api_key`, `pm_api_endpoint`, `pm_model_name`
- Configurable via SettingsModal component
- Supports multiple deployment endpoints (Vercel, CloudFlare, direct)

## Key File Patterns

### Component Structure
- Components follow React functional component pattern with TypeScript
- Props interfaces defined in `src/types.ts`
- Consistent styling with Tailwind CSS and glass-morphism effects

### Utility Functions
- `src/utils/api.ts`: Centralized API communication with streaming support
- `src/utils/mockAI.ts`: Fallback mock service for development
- `src/utils/cn.ts`: Tailwind class name merging utility

### Type Definitions
- `src/types.ts`: Centralized TypeScript interfaces
- Framework enum: `html`, `vue3`, `react`, `uniapp`
- Project interface with metadata (userId, timestamps, favorites)

## Deployment Options

### Vercel (Recommended)
1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Set `DASHSCOPE_API_KEY` environment variable
4. Deploy with automatic `/api/generate` endpoint

### Alternative Deployments
- **CloudFlare Workers**: Use `docs/cloudflare-worker.js` for proxy
- **UniCloud**: Full-stack option with database integration
- **Static Hosting**: Build and deploy `dist/` folder to any CDN

## Security Considerations

- API keys should be stored server-side when possible (Vercel environment variables)
- Client-side API key storage is supported but less secure
- CORS protection via proxy layer prevents direct browser-to-API communication
- Input validation and error handling throughout the application

## Extension Points

### Adding New Frameworks
1. Extend `Framework` type in `src/types.ts`
2. Add framework label and icon mappings
3. Update `buildUserMessage` function in `src/utils/api.ts`
4. Modify InputPanel component to include new option

### Custom AI Models
1. Update model selection in SettingsModal
2. Add model-specific prompts in `SYSTEM_PROMPT`
3. Configure appropriate API endpoints

### Additional Features
- Project export functionality (already includes download options)
- Collaborative features via backend integration
- Advanced image processing and optimization

## Common Development Tasks

### Testing API Integration
1. Configure API settings via SettingsModal
2. Use "Test Connection" feature
3. Generate sample UI with reference image
4. Verify streaming response and final output

### Adding New Components
1. Follow existing component patterns
2. Use Zustand for state management
3. Implement TypeScript interfaces
4. Apply consistent styling with glass-morphism effects

### Debugging Streaming
1. Check browser console for SSE connection errors
2. Verify API endpoint configuration
3. Monitor network tab for streaming responses
4. Test with mock service as fallback

## Performance Considerations

- Streaming responses provide real-time user feedback
- Lazy loading of components where appropriate
- Efficient state updates with Zustand selectors
- Optimized builds with Vite and single-file output

This architecture provides a solid foundation for an AI-powered UI generation tool with flexibility for different deployment scenarios and extensibility for future enhancements.