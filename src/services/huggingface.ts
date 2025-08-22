/**
 * Hugging Face TTS Service using Kokoro-82M model
 * https://huggingface.co/hexgrad/Kokoro-82M
 */

export interface HuggingFaceTTSConfig {
  apiKey?: string;
  model: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface AudioGenerationOptions {
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export interface AudioGenerationResult {
  audioUrl: string;
  audioBlob: Blob;
  duration: number;
}

export class HuggingFaceTTSService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api-inference.huggingface.co/models/';

  constructor(config: HuggingFaceTTSConfig) {
    this.apiKey = config.apiKey || '';
    this.model = config.model || 'hexgrad/Kokoro-82M';
  }

  /**
   * Generate audio from text using Kokoro-82M model
   */
  async generateAudio(options: AudioGenerationOptions): Promise<AudioGenerationResult> {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key is required. Please set REACT_APP_HUGGINGFACE_API_KEY environment variable.');
    }

    const response = await fetch(`${this.baseUrl}${this.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: options.text,
        parameters: {
          voice: options.voice || 'default',
          speed: options.speed || 1.0,
          pitch: options.pitch || 1.0,
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${error}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Estimate duration based on text length (rough approximation)
    const wordCount = options.text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60; // 150 words per minute

    return {
      audioUrl,
      audioBlob,
      duration: estimatedDuration
    };
  }

  /**
   * Get available voices for Kokoro-82M model
   */
  getAvailableVoices(): Array<{ id: string; name: string; language: string; }> {
    // Kokoro-82M typically supports these voices
    return [
      { id: 'kokoro-female-1', name: 'Kokoro Female 1', language: 'en-US' },
      { id: 'kokoro-female-2', name: 'Kokoro Female 2', language: 'en-US' },
      { id: 'kokoro-male-1', name: 'Kokoro Male 1', language: 'en-US' },
      { id: 'kokoro-neutral', name: 'Kokoro Neutral', language: 'en-US' },
    ];
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const testResult = await this.generateAudio({ 
        text: 'Hello, this is a test of the Kokoro TTS model.' 
      });
      // Cleanup test audio
      URL.revokeObjectURL(testResult.audioUrl);
      return true;
    } catch (error) {
      console.error('Hugging Face API test failed:', error);
      return false;
    }
  }

  /**
   * Generate audio with streaming support for long texts
   */
  async generateAudioWithChunks(
    text: string, 
    options: Omit<AudioGenerationOptions, 'text'> = {},
    onChunkReady?: (chunk: AudioGenerationResult, index: number) => void
  ): Promise<AudioGenerationResult[]> {
    // Split long text into chunks (Kokoro-82M may have text length limits)
    const maxChunkLength = 1000; // Adjust based on model limits
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks: string[] = [];
    
    let currentChunk = '';
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    const results: AudioGenerationResult[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      try {
        const result = await this.generateAudio({
          ...options,
          text: chunks[i]
        });
        results.push(result);
        
        if (onChunkReady) {
          onChunkReady(result, i);
        }
      } catch (error) {
        console.error(`Failed to generate audio for chunk ${i}:`, error);
        throw error;
      }
    }

    return results;
  }
}

export default HuggingFaceTTSService;