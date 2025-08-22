# Web2Speech 🎵

A beautiful, sleek, and mobile-first web application that transforms URLs, PDFs, and direct text into natural speech using cutting-edge AI text-to-speech models from Hugging Face. Designed with accessibility, convenience, and user experience in mind.

## ✨ Features

### 🎯 **Core Functionality**
- **URL to Speech**: Extract content from web pages and convert to natural speech
- **PDF to Speech**: Upload PDF documents and convert their text to audio
- **Direct Text**: Enter text directly for immediate speech generation
- **Multiple Voice Options**: Choose from various AI-powered voices with different characteristics
- **Adjustable Speed**: Control playback speed from 0.5x to 2.0x

### 📱 **Mobile-First Design**
- **Responsive Layout**: Optimized for mobile, tablet, and desktop devices
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Progressive Web App (PWA)**: Install as a native app with offline capabilities
- **Accessibility**: Full WCAG 2.1 compliance with screen reader support
- **Modern UI**: Beautiful gradient design with smooth animations

### 🚀 **Advanced Features**
- **Drag & Drop**: Easy PDF upload with visual feedback
- **Keyboard Shortcuts**: Power user shortcuts (Ctrl+Enter to generate)
- **Offline Support**: Service worker for offline functionality
- **Audio Controls**: Download and share generated audio files
- **Real-time Processing**: Live progress updates during generation
- **Theme Support**: Dark/light mode toggle (coming soon)

## 🏗️ **Architecture**

### **Frontend**
- **HTML5**: Semantic, accessible markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: Zero dependencies, lightweight and fast
- **PWA**: Service worker, manifest, and offline capabilities

### **Backend**
- **Python Flask**: Lightweight, scalable web framework  
- **Hugging Face Integration**: State-of-the-art TTS models
- **Content Extraction**: Support for web scraping and PDF parsing
- **API Architecture**: RESTful endpoints for all functionality

## 🚀 **Quick Start**

### **Development Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/lesmartiepants/web2speech.git
   cd web2speech
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   export HUGGINGFACE_API_KEY=your_api_key_here
   export FLASK_ENV=development
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

### **Production Deployment**

#### **Docker Deployment**
```bash
docker build -t web2speech .
docker run -p 5000:5000 -e HUGGINGFACE_API_KEY=your_key web2speech
```

#### **Docker Compose**
```bash
docker-compose up -d
```

## 📱 **Progressive Web App**

Install Web2Speech as a native app on your device:

1. **Mobile (Android/iOS)**:
   - Open in browser → Add to Home Screen
   
2. **Desktop (Chrome/Edge)**:
   - Click the install button in the address bar
   - Or: Settings → Install Web2Speech

## 🎨 **User Interface**

### **Desktop View**
![Desktop Screenshot](screenshots/desktop-view.png)

### **Mobile View**  
![Mobile Screenshot](screenshots/mobile-view.png)

### **Features Demo**
![Features Demo](screenshots/features-demo.png)

## 🔧 **Configuration**

### **Environment Variables**
```bash
HUGGINGFACE_API_KEY=your_huggingface_api_key
FLASK_ENV=production|development
SECRET_KEY=your_secret_key
PORT=5000
```

### **Voice Models**
The application supports multiple TTS models:
- `microsoft/speecht5_tts` (Default)
- `espnet/kan-bayashi_ljspeech_vits`
- `facebook/mms-tts-eng`

## 📚 **API Documentation**

### **Generate Speech**
```http
POST /api/speech/generate
Content-Type: application/json

{
  "type": "text|url|pdf",
  "content": "text content or URL",
  "voice": "model_name",
  "speed": 1.0
}
```

### **Extract Content**
```http
POST /api/content/extract
Content-Type: multipart/form-data

file: PDF file or JSON with URL
```

### **Health Check**
```http
GET /api/health
```

## 🛠️ **Development**

### **Project Structure**
```
web2speech/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── package.json          # Frontend build tools
├── index.html            # Main HTML file
├── static/
│   ├── css/
│   │   └── styles.css    # Responsive CSS
│   ├── js/
│   │   └── app.js        # Frontend JavaScript
│   └── icons/            # PWA icons
├── routes/               # API route modules
├── Dockerfile           # Container configuration
├── docker-compose.yml   # Multi-service setup
└── service-worker.js    # PWA service worker
```

### **Available Scripts**
```bash
npm run dev        # Start development server
npm run start      # Start production server  
npm run build      # Build for production
npm run test       # Run tests
```

## 🎯 **Accessibility**

Web2Speech is designed with accessibility as a core principle:

- **WCAG 2.1 AA Compliance**: Full accessibility standards compliance
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Complete keyboard-only operation
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Clear focus indicators and logical tab order

## 🌟 **Browser Support**

### **Modern Browsers**
- Chrome 80+ ✅
- Firefox 75+ ✅  
- Safari 13+ ✅
- Edge 80+ ✅

### **PWA Features**
- Service Worker support ✅
- App installation ✅
- Offline functionality ✅
- Push notifications ✅

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Hugging Face**: For providing state-of-the-art TTS models
- **Flask Community**: For the excellent web framework
- **Open Source Community**: For the amazing libraries and tools

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/lesmartiepants/web2speech/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lesmartiepants/web2speech/discussions)
- **Documentation**: [Wiki](https://github.com/lesmartiepants/web2speech/wiki)

---

**Built with ❤️ for accessibility and user experience**
