# Web2Speech - GitHub Copilot Instructions

Web2Speech is a Progressive Web App (PWA) that converts web pages and text files into beautiful speech experiences using Web Speech API and Hugging Face Kokoro-82M TTS engine. Built with React 18, TypeScript, Vite, Tailwind CSS, and Zustand.

**ALWAYS follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Quick Start & Bootstrap

### Prerequisites
- Node.js 18+ and npm (verified working with Node.js v20.19.4, npm 10.8.2)
- Modern browser with Web Speech API support for testing

### Bootstrap the Development Environment
```bash
# Install dependencies - takes ~20 seconds. NEVER CANCEL.
npm install

# Run linting - takes ~1.5 seconds
npm run lint

# Build the application - takes ~9 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
npm run build

# Start development server - starts in ~0.2 seconds
npm run dev
# Access at: http://localhost:5173/

# Preview production build - starts in ~0.2 seconds  
npm run preview
# Access at: http://localhost:4173/
```

## Development Workflow

### Essential Commands
- `npm install` - Install dependencies (20s duration)
- `npm run dev` - Start development server (instant startup, runs on http://localhost:5173/)
- `npm run build` - Build for production (9s duration, NEVER CANCEL, timeout 30s+)
- `npm run preview` - Preview production build (instant startup, runs on http://localhost:4173/)
- `npm run lint` - Run ESLint (1.5s duration)

### Validation Requirements
**ALWAYS run these validation steps after making changes:**

1. **Lint your code**: `npm run lint` - Must pass before committing
2. **Build successfully**: `npm run build` - Must complete without errors
3. **Test core functionality**: Start dev server and verify:
   - Application loads at http://localhost:5173/
   - Can toggle between URL and File input modes
   - URL input enables "Extract Content" button when valid URL entered
   - File upload shows drag-and-drop interface when toggled
   - Both TTS engines (Web Speech API and Hugging Face) are selectable

### Manual Testing Scenarios
**CRITICAL**: After making changes, ALWAYS test these user scenarios:

#### Basic Functionality Test
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:5173/
3. Verify main heading: "Transform any content into beautiful speech"
4. Test URL input:
   - Enter a URL (e.g., "https://example.com")
   - Verify "Extract Content" button becomes enabled
5. Test file upload toggle:
   - Click the toggle switch to switch to "File" mode
   - Verify drag-and-drop interface appears
   - Verify "PDF" and "TXT" file type indicators show

#### TTS Engine Testing
1. Extract some content (URL or file)
2. Verify TTS engine selection appears
3. Test voice selection interface
4. Test both process modes: "generate" and "stream"

## Project Structure & Key Files

### Root Directory
```
├── .github/workflows/preview.yml    # UI screenshot generation workflow
├── README.md                        # Project documentation
├── package.json                     # Dependencies and scripts
├── vite.config.ts                   # Vite and PWA configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── eslint.config.js                # ESLint configuration
├── index.html                       # Main HTML template
└── scripts/generate-screenshot.js   # Playwright screenshot script
```

### Source Code Structure
```
src/
├── App.tsx                          # Main application component
├── main.tsx                         # Application entry point
├── index.css                        # Global styles with Tailwind
├── components/                      # React components
│   ├── Header.tsx                   # Application header
│   ├── InputToggle.tsx             # URL/File toggle switch
│   ├── UrlInput.tsx                # URL input component
│   ├── FileUpload.tsx              # File upload with drag-and-drop
│   ├── TTSEngineSelection.tsx      # TTS engine picker
│   ├── VoiceSelection.tsx          # Voice selection interface
│   ├── ProcessModeSelection.tsx    # Generate/Stream mode selector
│   ├── ReaderView.tsx              # Main reading interface with audio controls
│   └── ErrorDisplay.tsx            # Error handling display
├── store/
│   └── useAppStore.ts              # Zustand state management
└── services/
    └── huggingface.ts              # Hugging Face Kokoro-82M TTS integration
```

### Key State Management
- **Store**: `src/store/useAppStore.ts` - Central Zustand store managing all application state
- **State includes**: input mode, content, voices, TTS engine, audio playback, reader view
- **TTS Engines**: Web Speech API (browser native) and Hugging Face Kokoro-82M

## Build System & Configuration

### Vite Configuration (`vite.config.ts`)
- **PWA Plugin**: Generates service worker and web app manifest
- **React Plugin**: Enables React fast refresh
- **Build Output**: Creates `dist/` directory with optimized bundles

### ESLint Configuration (`eslint.config.js`)
- **TypeScript**: Strict TypeScript linting enabled
- **React**: React hooks and refresh linting
- **Globals**: Browser environment configured

### Styling System
- **Tailwind CSS**: Utility-first CSS framework
- **Custom gradients**: Primary color scheme with purple/blue gradients
- **Responsive**: Mobile-first responsive design
- **PWA styling**: Backdrop blur effects and modern UI patterns

## Troubleshooting & Common Issues

### Build Issues
- **Error: "Module not found"**: Run `npm install` to ensure dependencies are current
- **TypeScript errors**: Check `tsconfig.json` and ensure all imports have correct paths
- **Vite build fails**: Clear `dist/` directory and run `npm run build` again

### Development Server Issues
- **Port 5173 in use**: Vite will automatically try alternative ports
- **Hot reload not working**: Check browser console for connection errors
- **CORS issues**: Use the development server, not file:// protocol

### Playwright Issues (Screenshot Generation)
- **Playwright install fails**: This is expected in some environments - document as known limitation
- **Screenshot script fails**: Ensure dev server is running on http://localhost:5173/ first
- **Browser download issues**: May fail due to network restrictions in sandboxed environments

### TTS Issues
- **Web Speech API not working**: Requires HTTPS or localhost, verify browser compatibility
- **Hugging Face API fails**: Requires valid API key and internet connectivity
- **Audio not playing**: Check browser audio permissions and autoplay policies

## Testing & CI

### No Test Suite
- **Current state**: No automated tests exist in the project
- **Manual testing**: Use the validation scenarios above
- **CI Pipeline**: GitHub workflow generates UI screenshots only

### GitHub Workflow (`.github/workflows/preview.yml`)
- **Trigger**: Pushes to main branch
- **Process**: Install deps → Install Playwright → Start dev server → Generate screenshot
- **Artifacts**: UI preview screenshots saved as GitHub artifacts
- **Duration**: ~2-3 minutes total including Playwright installation

## Performance & Optimization

### Build Performance
- **Fast builds**: ~9 seconds for production build
- **Vite HMR**: Near-instant hot module replacement in development
- **Bundle size**: ~407KB main bundle (gzipped: ~127KB)

### Runtime Performance
- **PWA**: Service worker caching for offline functionality
- **Responsive**: Optimized for mobile and desktop
- **TTS streaming**: Supports both file generation and real-time streaming

## Architecture Notes

### Component Patterns
- **Functional components**: All components use React hooks
- **State management**: Centralized Zustand store with selective subscriptions
- **Error boundaries**: Global error display component

### TTS Architecture
- **Dual engine support**: Web Speech API (native) and Hugging Face (AI)
- **Voice management**: Dynamic voice loading and selection
- **Audio controls**: Play/pause, skip, progress tracking with word synchronization

### PWA Features
- **Installable**: Web app manifest enables device installation
- **Offline capable**: Service worker provides offline functionality
- **Responsive**: Optimized for mobile and desktop experiences

## External Dependencies & Services

### Hugging Face Integration
- **Model**: Kokoro-82M high-quality TTS model
- **API**: Uses Hugging Face Inference API
- **Requirements**: API key needed for external TTS functionality
- **Fallback**: Web Speech API works without external dependencies

### File Processing
- **Supported formats**: PDF and TXT files
- **Current implementation**: Simulated PDF extraction (ready for PDF.js integration)
- **Future**: Real PDF processing and web scraping capabilities planned

Remember: **ALWAYS validate your changes** by running the build, linting, and manually testing the core functionality scenarios listed above.