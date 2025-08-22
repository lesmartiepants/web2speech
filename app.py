"""
Web2Speech - AI-Powered Text-to-Speech Web Application
A Flask-based backend for converting URLs, PDFs, and text to speech using Hugging Face models
"""

from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import os
import logging
import asyncio
from datetime import datetime
import tempfile
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for frontend integration

# Configuration
app.config.update({
    'MAX_CONTENT_LENGTH': 16 * 1024 * 1024,  # 16MB max file size
    'UPLOAD_FOLDER': tempfile.gettempdir(),
    'SECRET_KEY': os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production'),
    'HUGGINGFACE_API_KEY': os.environ.get('HUGGINGFACE_API_KEY', ''),
    'DEFAULT_VOICE': 'microsoft/speecht5_tts',
    'SUPPORTED_VOICES': [
        'microsoft/speecht5_tts',
        'espnet/kan-bayashi_ljspeech_vits',
        'facebook/mms-tts-eng'
    ]
})

# Import route modules (we'll create these)
try:
    from routes.speech import speech_bp
    from routes.content import content_bp
    from routes.health import health_bp
    
    app.register_blueprint(speech_bp, url_prefix='/api')
    app.register_blueprint(content_bp, url_prefix='/api') 
    app.register_blueprint(health_bp, url_prefix='/api')
    
except ImportError as e:
    logger.warning(f"Could not import route modules: {e}")
    logger.info("Route modules will be created separately")

# Serve the main HTML file
@app.route('/')
def index():
    """Serve the main application page"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return render_template_string("""
        <!DOCTYPE html>
        <html>
        <head><title>Web2Speech - Setup in Progress</title></head>
        <body>
            <h1>Web2Speech Backend is Running!</h1>
            <p>The frontend files are being set up. Please check back in a moment.</p>
            <p>API Status: <span style="color: green;">✓ Active</span></p>
            <p>Available endpoints:</p>
            <ul>
                <li><code>GET /api/health</code> - Health check</li>
                <li><code>POST /api/speech/generate</code> - Generate speech</li>
                <li><code>POST /api/content/extract</code> - Extract content</li>
            </ul>
        </body>
        </html>
        """)

# Serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files (CSS, JS, icons, etc.)"""
    return send_from_directory('static', filename)

# Serve manifest.json
@app.route('/manifest.json')
def manifest():
    """Serve PWA manifest"""
    return send_from_directory('.', 'manifest.json')

# Serve service worker
@app.route('/service-worker.js')
def service_worker():
    """Serve service worker"""
    return send_from_directory('.', 'service-worker.js')

# Basic API endpoints (until separate route files are created)
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'features': {
            'text_to_speech': True,
            'url_extraction': True,
            'pdf_processing': True,
            'multiple_voices': True
        }
    })

@app.route('/api/speech/generate', methods=['POST'])
def generate_speech_placeholder():
    """Placeholder for speech generation - will be moved to separate route file"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        content_type = data.get('type')
        content = data.get('content')
        voice = data.get('voice', app.config['DEFAULT_VOICE'])
        speed = data.get('speed', 1.0)
        
        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        # For now, return a mock response
        # In production, this would integrate with Hugging Face TTS models
        session_id = str(uuid.uuid4())
        
        logger.info(f"Speech generation request - Type: {content_type}, Voice: {voice}, Speed: {speed}")
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'status': 'processing',
            'estimated_duration': 30,  # seconds
            'message': 'Speech generation started. Use the session_id to check status.',
            'polling_url': f'/api/speech/status/{session_id}'
        })
        
    except Exception as e:
        logger.error(f"Speech generation error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/speech/status/<session_id>', methods=['GET'])
def get_speech_status_placeholder(session_id):
    """Placeholder for speech status check"""
    # Mock response - in production this would check actual generation status
    return jsonify({
        'session_id': session_id,
        'status': 'completed',  # processing, completed, failed
        'progress': 100,
        'audio_url': f'/api/speech/download/{session_id}',
        'duration': 45.5,  # seconds
        'format': 'mp3',
        'file_size': 1024 * 1024  # bytes
    })

@app.route('/api/content/extract', methods=['POST'])
def extract_content_placeholder():
    """Placeholder for content extraction - will be moved to separate route file"""
    try:
        content_type = request.content_type
        
        if 'multipart/form-data' in content_type:
            # Handle file upload (PDF)
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if not file.filename.lower().endswith('.pdf'):
                return jsonify({'error': 'Only PDF files are supported'}), 400
            
            # Mock PDF processing
            logger.info(f"Processing PDF: {file.filename}")
            
            return jsonify({
                'success': True,
                'extracted_text': "This is a mock extracted text from the PDF. In production, this would use a PDF parsing library like PyPDF2 or pdfplumber to extract actual text content.",
                'page_count': 5,
                'word_count': 156,
                'language': 'en'
            })
            
        else:
            # Handle JSON data (URL or text)
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            
            url = data.get('url')
            if url:
                # Mock URL content extraction
                logger.info(f"Extracting content from URL: {url}")
                
                return jsonify({
                    'success': True,
                    'url': url,
                    'title': 'Example Article Title',
                    'extracted_text': "This is mock extracted content from the URL. In production, this would use libraries like requests, BeautifulSoup, or newspaper3k to extract actual article content.",
                    'word_count': 89,
                    'language': 'en',
                    'author': 'Example Author',
                    'publish_date': '2024-01-15'
                })
            
            return jsonify({'error': 'No URL provided'}), 400
            
    except Exception as e:
        logger.error(f"Content extraction error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    if request.path.startswith('/api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    else:
        # Serve the main app for client-side routing
        return index()

@app.errorhandler(413)
def file_too_large(error):
    """Handle file too large errors"""
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

# Development server configuration
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Web2Speech server on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug,
        threaded=True
    )