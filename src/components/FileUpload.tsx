import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Loader2, Sparkles, File } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function FileUpload() {
  const { 
    selectedFile, 
    setSelectedFile, 
    setExtractedContent, 
    setIsLoading, 
    setError, 
    isLoading 
  } = useAppStore()
  
  const extractTextFromFile = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (file.type === 'text/plain') {
        const text = await file.text()
        setExtractedContent(text)
      } else if (file.type === 'application/pdf') {
        // In a real app, you'd use PDF.js to extract text
        // For now, we'll simulate PDF text extraction
        setTimeout(() => {
          setExtractedContent(`
            This is simulated text extracted from the PDF file: ${file.name}
            
            In a production app, this would use PDF.js or a similar library to:
            
            - Parse PDF documents
            - Extract text content from all pages
            - Handle different PDF formats and encodings
            - Preserve text structure and formatting where possible
            
            The extracted text would then be processed for optimal text-to-speech conversion, including proper handling of headings, paragraphs, and special characters.
          `)
          setIsLoading(false)
        }, 2000)
        return
      } else {
        throw new Error('Unsupported file type')
      }
      
      setIsLoading(false)
    } catch {
      setError('Failed to extract text from file. Please try a different file.')
      setIsLoading(false)
    }
  }, [setIsLoading, setError, setExtractedContent])
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      extractTextFromFile(file)
    }
  }, [setSelectedFile, extractTextFromFile])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  })
  
  const removeFile = () => {
    setSelectedFile(null)
    setExtractedContent('')
  }
  
  return (
    <div className="glass-morphism-strong rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg">
          <File className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">File Upload</h3>
          <p className="text-gray-300 text-sm">Upload PDFs and text documents</p>
        </div>
      </div>

      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group overflow-hidden ${
            isDragActive
              ? 'border-accent-400/50 bg-accent-500/10 scale-[1.02]'
              : 'border-white/30 hover:border-accent-400/50 hover:bg-accent-500/5 hover:scale-[1.01]'
          }`}
        >
          <input {...getInputProps()} />
          
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/0 via-accent-400/5 to-accent-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-accent-400 to-accent-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                {isDragActive ? 'Drop your file here' : 'Upload Your Document'}
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
                Drag & drop or click to select a PDF or text file for AI-powered speech conversion
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-accent-500/20 rounded-full border border-accent-400/30">
                  <FileText className="w-4 h-4 text-accent-400" />
                  <span className="text-accent-200 font-medium">PDF</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-accent-500/20 rounded-full border border-accent-400/30">
                  <FileText className="w-4 h-4 text-accent-400" />
                  <span className="text-accent-200 font-medium">TXT</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-6 text-sm text-gray-400">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span>AI-powered content extraction</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-morphism rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{selectedFile.name}</p>
                  <p className="text-gray-300">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isLoading && (
                <button
                  onClick={removeFile}
                  className="p-3 text-gray-400 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center py-8 space-x-4">
              <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
              <div className="text-center">
                <p className="text-white font-semibold text-lg">Extracting content...</p>
                <p className="text-gray-400">AI is processing your document</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}