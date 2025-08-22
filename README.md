# Web2Speech 🎵

A beautiful, mobile-friendly Progressive Web App that transforms web content and documents into natural speech with an elegant reader experience.

![Web2Speech Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue)
![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-purple)

## ✨ Features

### 🔄 Flexible Input Methods
- **URL Input**: Paste any website URL to extract and read content
- **File Upload**: Upload PDF files or text documents
- **Easy Toggle**: Switch between input methods with a single click

### 🎯 Processing Modes
- **Generate Mode**: Create downloadable MP3 audio files for offline listening
- **Stream Mode**: Beautiful reader view with synchronized audio playback

### 📖 Beautiful Reader Experience
- **Word Highlighting**: Real-time word-by-word highlighting during playback
- **Progress Tracking**: Visual progress bar and completion percentage
- **Playback Controls**: Play, pause, skip forward/backward controls
- **Customizable Settings**: Adjust speech rate and pitch
- **Reading Statistics**: Word count and estimated reading time

### 🎙️ Advanced Voice Features
- **Multiple Voices**: Choose from all available system TTS voices
- **Language Support**: Automatic language detection with flag indicators
- **Voice Testing**: Test voices before starting playback
- **Local/Cloud Voices**: Clear indicators for voice types

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for all screen sizes
- **PWA Ready**: Install on home screen for app-like experience
- **Touch Friendly**: Large touch targets and smooth interactions
- **Offline Capable**: Service worker for offline functionality

## 🚀 Technology Stack

### Frontend Framework
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and building
- **Zustand** for lightweight state management

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **Headless UI** for accessible components
- **Lucide React** for beautiful icons
- **Custom gradients** for modern visual appeal

### PWA & Performance
- **Vite PWA Plugin** for service worker generation
- **Workbox** for advanced caching strategies
- **Web App Manifest** for installation support
- **Responsive images** with SVG icons

### File Processing
- **React Dropzone** for drag-and-drop file uploads
- **PDF.js** integration ready for PDF text extraction
- **Readability.js** ready for web content extraction

### Speech Technology
- **Web Speech API** for native browser TTS
- **Real-time word tracking** during playback
- **Extensible architecture** for external TTS services

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Modern browser with Web Speech API support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web2speech

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3b82f6 to #2563eb)
- **Background**: Gradient from blue to purple tones
- **Glass Effect**: Semi-transparent white overlays
- **Interactive States**: Smooth transitions and hover effects

### Typography
- **Font**: Inter (Google Fonts)
- **Responsive Sizes**: Mobile-optimized text scaling
- **Reading Experience**: Optimized for extended reading

### Components
- **Modular Architecture**: Reusable React components
- **Accessibility First**: ARIA labels and keyboard navigation
- **Loading States**: Beautiful loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### PWA Configuration
The app is configured as a Progressive Web App with:
- Service worker for offline functionality
- App manifest for installation
- Caching strategies for optimal performance

### Tailwind Configuration
Custom Tailwind setup with:
- Extended color palette
- Typography plugin
- Responsive breakpoints
- Custom utilities

## 🚀 Deployment

### Build Process
```bash
npm run build
```

The build creates:
- Optimized React bundle
- Service worker for PWA functionality
- Web app manifest
- Compressed assets with gzip

### Hosting Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting with PWA support
- **GitHub Pages**: Free hosting for open source
- **Any static hosting**: Compatible with any CDN

## 📱 PWA Installation

Users can install the app on their devices:

1. **Chrome/Edge**: Click install button in address bar
2. **Safari**: Share → Add to Home Screen
3. **Mobile**: Add to Home Screen from browser menu

## 🔄 Future Enhancements

### Planned Features
- **External TTS Services**: ElevenLabs, Azure, Google Cloud integration
- **Real PDF Processing**: Advanced PDF text extraction
- **Web Scraping**: Live content extraction from URLs
- **Voice Cloning**: Custom voice training capabilities
- **Bookmarks**: Save and organize favorite content
- **Themes**: Light/dark mode and custom themes

### Technical Improvements
- **Better Word Tracking**: More accurate speech synchronization
- **Offline Content**: Cache extracted content for offline reading
- **Performance**: Code splitting and lazy loading
- **Accessibility**: Enhanced screen reader support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Headless UI** for accessible components
- **Web Speech API** for native browser TTS
- **All contributors** who make this project better

---

**Built with ❤️ for accessibility and beautiful reading experiences**

*Powered by modern web technologies: React, TypeScript, Tailwind CSS, Web Speech API*
