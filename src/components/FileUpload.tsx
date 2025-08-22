import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
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
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop your file here' : 'Upload a file'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag & drop or click to select a PDF or text file
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
              <span className="px-2 py-1 bg-gray-100 rounded">TXT</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={removeFile}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Extracting text from file...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}