# Web2Speech Copilot Instructions

You are an expert developer working on Web2Speech, a modern React-based text-to-speech Progressive Web App that transforms any content into beautiful, synchronized speech experiences.

## Project Overview

Web2Speech is a sophisticated TTS application that:
- Converts URLs and uploaded files (PDF, text) into speech
- Supports multiple TTS engines (Web Speech API, Hugging Face Kokoro-82M)
- Provides real-time word tracking and synchronized reading
- Offers both streaming playback and downloadable audio generation
- Built as a PWA with offline capabilities and installable experience

## Architecture & Tech Stack

### Core Technologies
- **React 19** with TypeScript for type safety and modern React features
- **Vite** for lightning-fast development and optimized builds
- **Zustand** for lightweight, performant state management
- **Tailwind CSS** for utility-first styling and design consistency
- **Headless UI** for accessible, unstyled UI components

### Key Libraries
- **Lucide React** for consistent iconography
- **React Dropzone** for drag-and-drop file uploads
- **PDF.js** for PDF text extraction
- **Readability.js** for web content cleaning
- **Vite PWA Plugin** for service worker and offline functionality

### TTS Integration
- **Web Speech API** for native browser TTS (streaming)
- **Hugging Face Kokoro-82M** for high-quality AI TTS (generation + streaming)
- Custom audio processing and word synchronization

## Development Guidelines

### Component Architecture
- Use functional components with TypeScript interfaces
- Implement proper error boundaries and loading states
- Follow compound component patterns for complex UI elements
- Ensure accessibility with ARIA labels and semantic HTML
- Use Headless UI for interactive components (dialogs, selects, switches)

### State Management with Zustand
- Keep store slices focused and minimal
- Use derived state for computed values
- Implement proper TypeScript interfaces for state shapes
- Follow the existing patterns in `src/store/useAppStore.ts`

```typescript
// Example Zustand store pattern
interface StoreState {
  value: string
  setValue: (value: string) => void
  computedValue: string // derived state
}

const useStore = create<StoreState>((set, get) => ({
  value: '',
  setValue: (value) => set({ value }),
  get computedValue() {
    return get().value.toUpperCase()
  }
}))
```

### Component Patterns

#### Standard Component Structure
```tsx
import { FC } from 'react'
import { useAppStore } from '../store/useAppStore'

interface ComponentProps {
  // Always define explicit prop interfaces
}

const Component: FC<ComponentProps> = ({ prop }) => {
  const { state, setState } = useAppStore()
  
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      {/* Component content */}
    </div>
  )
}

export default Component
```

#### Glass Morphism Design Pattern
- Use `bg-white/90 backdrop-blur-md` for glass effect containers
- Combine with `border border-gray-200 shadow-lg` for depth
- Use `rounded-2xl` for consistent border radius
- Apply gradient backgrounds: `bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50`

### TTS Engine Integration

#### Web Speech API Pattern
```typescript
const speak = (text: string, voice: SpeechSynthesisVoice) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = voice
  utterance.rate = rate
  utterance.pitch = pitch
  speechSynthesis.speak(utterance)
}
```

#### Hugging Face API Pattern
```typescript
const service = new HuggingFaceTTSService({ apiKey })
const result = await service.generateAudio({
  text: content,
  voice: selectedVoice.id
})
// Handle audio URL and cleanup
```

### Styling Guidelines

#### Tailwind CSS Conventions
- Use semantic color classes: `text-primary-600`, `bg-primary-50`
- Implement responsive design: `sm:px-6 lg:px-8`
- Apply consistent spacing: `space-y-8`, `space-x-4`
- Use backdrop effects: `backdrop-blur-md`
- Implement hover states: `hover:bg-primary-700`

#### Color System
```css
primary: {
  50: '#eff6ff',   100: '#dbeafe',  200: '#bfdbfe',
  300: '#93c5fd',  400: '#60a5fa',  500: '#3b82f6',
  600: '#2563eb',  700: '#1d4ed8',  800: '#1e40af',
  900: '#1e3a8a'
}
```

#### Interactive Elements
- Buttons: `bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800`
- Focus states: `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
- Transitions: `transition-all duration-300`

### Accessibility Standards

#### Required Practices
- Use semantic HTML elements (`<main>`, `<section>`, `<article>`)
- Implement ARIA labels for screen readers
- Ensure keyboard navigation support
- Provide proper contrast ratios
- Include loading and error states
- Support reduced motion preferences

#### Screen Reader Support
```tsx
<button
  aria-label="Start reading content"
  aria-describedby="reading-description"
>
  Start Reading
</button>
<div id="reading-description" className="sr-only">
  Begins text-to-speech playback of the extracted content
</div>
```

### Error Handling

#### Standard Error Pattern
```typescript
try {
  await operation()
} catch (error) {
  const message = error instanceof Error ? error.message : 'Operation failed'
  setError(message)
}
```

#### User-Friendly Messages
- Provide specific, actionable error messages
- Include recovery suggestions when possible
- Use consistent error display components
- Handle network failures gracefully

### Performance Optimization

#### Code Splitting
- Use dynamic imports for heavy components
- Implement lazy loading for routes
- Split TTS engines into separate chunks

#### PWA Optimization
- Implement proper caching strategies
- Use service worker for offline functionality
- Optimize bundle sizes with Vite
- Preload critical resources

### File Processing Guidelines

#### PDF Handling
```typescript
const extractTextFromPDF = async (file: File): Promise<string> => {
  // Use PDF.js for text extraction
  // Handle multi-page documents
  // Preserve text structure and formatting
}
```

#### URL Content Extraction
```typescript
const extractFromURL = async (url: string): Promise<string> => {
  // Use Readability.js for content cleaning
  // Handle different content types
  // Extract main article content
}
```

### Testing Patterns

#### Component Testing
- Test accessibility features
- Verify TTS engine integration
- Test file upload and processing
- Validate PWA functionality

#### Integration Testing
- Test complete user workflows
- Verify audio generation and playback
- Test offline functionality
- Validate cross-browser compatibility

## Code Quality Rules

### TypeScript Standards
- Use strict TypeScript configuration
- Define explicit interfaces for all props and state
- Avoid `any` types - use proper type definitions
- Implement proper error types

### ESLint Configuration
- Follow the existing ESLint rules in `eslint.config.js`
- Use React Hooks rules for proper hook usage
- Implement consistent import ordering
- Enforce accessibility rules

### Performance Rules
- Minimize bundle sizes
- Implement proper memoization
- Use efficient state updates
- Optimize audio processing

## API Integration Guidelines

### Hugging Face Integration
- Store API keys securely (not in code)
- Implement proper error handling for API failures
- Handle rate limiting gracefully
- Provide fallback to Web Speech API

### External Services
- Always implement graceful degradation
- Provide offline functionality where possible
- Handle network errors appropriately
- Implement retry logic for transient failures

## Security Best Practices

### API Key Management
- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement proper key validation
- Provide clear setup instructions

### Content Processing
- Sanitize extracted content
- Validate file types and sizes
- Implement proper CORS handling
- Protect against XSS attacks

## Documentation Standards

- Include JSDoc comments for complex functions
- Document TTS engine integration patterns
- Provide setup instructions for new features
- Maintain README with current tech stack

## Common Patterns to Follow

1. **Glass Morphism UI**: Consistent semi-transparent containers with backdrop blur
2. **Progressive Enhancement**: Web Speech API as base, Hugging Face as enhancement
3. **Responsive Design**: Mobile-first approach with smooth desktop scaling
4. **Accessible Components**: ARIA labels, keyboard navigation, screen reader support
5. **Error Recovery**: Graceful fallbacks and clear error messages
6. **Loading States**: Beautiful loading indicators with progress feedback
7. **PWA Standards**: Offline-first approach with service worker integration

Remember: This is a user-facing application focused on accessibility and beautiful experiences. Every feature should work seamlessly across devices and assistive technologies.