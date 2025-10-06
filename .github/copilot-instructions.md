# Web2Speech Development Instructions

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

Web2Speech is a Progressive Web App (PWA) that transforms web content and documents into natural speech with a beautiful reading experience. Built with React 18, TypeScript, and Vite, it features dual TTS engines: Web Speech API for browser-native TTS and Hugging Face Kokoro-82M for high-quality AI-powered speech synthesis.

## Working Effectively

### Prerequisites and Setup
- Node.js 18+ (validated with Node.js 20.19.4)
- npm (validated with npm 10.8.2)
- Modern browser with Web Speech API support (Chrome, Edge, Safari, Firefox)
- Optional: Hugging Face API key for Kokoro-82M TTS (stored in localStorage or VITE_HUGGINGFACE_API_KEY env var)

### Bootstrap, Build, and Test Commands
**NEVER CANCEL long-running commands - all timing measurements include appropriate buffers:**

```bash
# Install dependencies - takes 20 seconds, NEVER CANCEL
npm install

# Lint the codebase - takes 1.5 seconds
npm run lint

# Build for production - takes 9 seconds, NEVER CANCEL
npm run build

# Start development server - takes 2 seconds to start
npm run dev

# Preview production build - takes 2 seconds to start  
npm run preview
```

### Running the Application
**Always run in this exact order:**

1. **Start Development**: `npm run dev`
   - Serves on http://localhost:5173/
   - Hot module replacement enabled
   - Use for development and testing changes

2. **Preview Production Build**: `npm run preview` (after `npm run build`)
   - Serves on http://localhost:4173/
   - Tests production build locally
   - Use for final validation before deployment

## Validation and Testing

### Manual Validation Requirements
**ALWAYS test these complete user scenarios after making changes:**

#### Scenario 1: URL Content Processing
1. Start development server: `npm run dev`
2. Open http://localhost:5173/
3. Select "URL" tab
4. Enter a web page URL (e.g., "https://example.com/article")
5. Click "Extract Content" 
6. Verify content extraction displays in preview
7. Select TTS engine (Web Speech or Hugging Face)
8. Choose a voice from the dropdown
9. Click "Test" button next to voice selection to verify audio
10. Select process mode: "📖 Start Reading Experience" or "🎵 Generate Audio File"
11. Click the main action button and verify functionality

#### Scenario 2: File Upload Processing
1. Switch to "File" tab
2. Upload a PDF or text file via drag-and-drop or file picker
3. Verify content extraction
4. Complete TTS configuration and testing as above
5. Verify both streaming playback and audio file generation work

#### Scenario 3: Reader Experience
1. After extracting content, select "📖 Start Reading Experience"
2. Click the main action button
3. Verify reader view opens with content
4. Test play/pause functionality
5. Verify word highlighting during playback
6. Test rate and pitch controls in settings
7. Verify skip forward/backward functionality
8. Close reader view and verify return to main interface

### Linting and Code Quality
**Always run before committing changes:**
```bash
npm run lint
```
- Uses ESLint with TypeScript support
- Configured with React hooks rules and refresh plugin
- Takes ~1.5 seconds, no timeout needed
- Must pass with zero errors for CI to succeed

### Build Validation
**Always build and test after making changes:**
```bash
npm run build  # 9 seconds - NEVER CANCEL
npm run preview  # Test production build
```
- Build creates optimized React bundle, service worker, and PWA manifest
- Generates compressed assets with gzip
- Preview serves from `dist/` directory
- Test core functionality in production build

## Codebase Navigation

### Project Structure
```
├── src/
│   ├── App.tsx                 # Main application component and routing
│   ├── main.tsx               # React app entry point
│   ├── components/            # React UI components (9 components)
│   │   ├── Header.tsx         # App header and branding
│   │   ├── InputToggle.tsx    # URL/File input mode switcher
│   │   ├── UrlInput.tsx       # Web URL input and extraction
│   │   ├── FileUpload.tsx     # File upload with drag-and-drop
│   │   ├── TTSEngineSelection.tsx  # TTS engine picker (Web Speech/Hugging Face)
│   │   ├── VoiceSelection.tsx # Voice selection and testing
│   │   ├── ProcessModeSelection.tsx # Stream vs. Generate mode
│   │   ├── ReaderView.tsx     # Full-screen reading interface
│   │   └── ErrorDisplay.tsx   # Error handling component
│   ├── services/              # External service integrations
│   │   └── huggingface.ts     # Hugging Face Kokoro-82M TTS service
│   └── store/                 # State management
│       └── useAppStore.ts     # Zustand store with complete app state
├── public/                    # Static assets and PWA icons
├── .github/workflows/         # CI/CD pipeline
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Vite build configuration with PWA
├── tailwind.config.js       # Tailwind CSS theme and plugins
├── eslint.config.js         # ESLint TypeScript configuration
└── tsconfig.json            # TypeScript compiler settings
```

### Key Components to Understand

#### State Management (`src/store/useAppStore.ts`)
- **Zustand-based centralized store** - all app state in one place
- Input modes: URL vs. file upload
- TTS configuration: engine, voice, API keys
- Audio state: playback, current utterance/audio
- UI state: loading, errors, reader view
- **Always import useAppStore for state access**

#### TTS Integration (`src/services/huggingface.ts`)
- **HuggingFaceTTSService class** for Kokoro-82M integration
- Requires API key from localStorage or environment
- Supports chunked audio generation for long texts
- Returns blob URLs for audio playback
- **Test connection method available for validation**

#### Reader Experience (`src/components/ReaderView.tsx`)
- **Full-screen reading interface** with word highlighting
- Dual TTS engine support (Web Speech API + Hugging Face)
- Real-time word tracking and synchronization
- Audio controls: play/pause, skip, rate/pitch adjustment
- **Always test complete reading scenarios**

### Common Development Tasks

#### Adding New TTS Engines
1. Update `TTSEngine` type in `src/store/useAppStore.ts`
2. Create service class in `src/services/` (follow `huggingface.ts` pattern)
3. Add engine option to `src/components/TTSEngineSelection.tsx`
4. Update voice handling in `src/components/VoiceSelection.tsx`
5. Integrate playback in `src/components/ReaderView.tsx`

#### Modifying UI Components
1. **Always maintain accessibility** - components use headless UI patterns
2. **Follow Tailwind CSS classes** - custom theme in `tailwind.config.js`
3. **Update store interactions** - use `useAppStore` for state
4. **Test responsive design** - components are mobile-first
5. **Verify PWA functionality** - test installation and offline behavior

#### Adding File Processing Features
1. Update file handling in `src/components/FileUpload.tsx`
2. Add new MIME type support and validation
3. Integrate processing logic (PDF.js ready, Readability.js ready)
4. Test drag-and-drop functionality
5. Verify content extraction and display

### Environment Configuration

#### Development Environment Variables
```bash
# Optional: Hugging Face API key for Kokoro-82M TTS
VITE_HUGGINGFACE_API_KEY=your_api_key_here
```

#### Build Configuration (`vite.config.ts`)
- **PWA plugin configured** - generates service worker and manifest
- **Workbox caching strategies** - fonts cached for 365 days
- **React plugin** - JSX and hot reload support
- **Production optimizations** - code splitting and compression

#### PWA Features
- **Service worker** - auto-generated by Vite PWA plugin
- **App manifest** - installable on mobile devices
- **Offline caching** - static assets cached for offline use
- **Theme colors** - matches app design (primary blue #3b82f6)

## Troubleshooting

### Common Issues and Solutions

#### Build Failures
- **TypeScript errors**: Run `npm run lint` to identify issues
- **Module not found**: Ensure all imports use correct relative paths
- **PWA generation**: Check `vite.config.ts` and ensure `public/` assets exist

#### Development Server Issues
- **Port conflicts**: Default port 5173, check for conflicts
- **Hot reload not working**: Clear browser cache and restart server
- **API cors errors**: Use environment variables for external APIs

#### TTS Integration Problems
- **Web Speech API**: Requires HTTPS in production, works on localhost
- **Hugging Face API**: Requires valid API key and internet connection
- **Voice loading**: Browser may need time to load available voices

### Performance Considerations
- **Large text processing**: Content is automatically chunked for TTS
- **Audio file generation**: Can take time for long content, show loading states
- **Memory management**: Audio URLs are cleaned up after use
- **PWA caching**: Service worker caches static assets for performance

## Quick Reference

### Frequently Used Commands
```bash
npm run dev          # Development server (2s startup)
npm run build        # Production build (9s - NEVER CANCEL)  
npm run lint         # Code quality check (1.5s)
npm run preview      # Test production build (2s startup)
```

### Key File Locations
- **Main App**: `src/App.tsx`
- **State Store**: `src/store/useAppStore.ts` 
- **TTS Service**: `src/services/huggingface.ts`
- **Reader View**: `src/components/ReaderView.tsx`
- **Build Config**: `vite.config.ts`
- **Styles**: `tailwind.config.js`

### Testing Checklist
- [ ] Install dependencies: `npm install` (20s)
- [ ] Lint passes: `npm run lint` (1.5s)
- [ ] Build succeeds: `npm run build` (9s)
- [ ] Dev server starts: `npm run dev` 
- [ ] URL processing works end-to-end
- [ ] File upload works end-to-end
- [ ] Reader experience functions properly
- [ ] Both TTS engines work with voice testing
- [ ] PWA installs correctly in browser

**Remember: Always validate complete user scenarios, not just individual components. Test the full workflow from content input to speech output.**