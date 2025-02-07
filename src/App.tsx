import { AlertCircle, CheckCircle2, FileDown, Loader2, Upload } from 'lucide-react';
import React, { useRef } from 'react';
import { useEpubProcessor } from './hooks/useEpubProcessor';
import { formatFileSize } from './services/epubService';

function App() {
  const {
    file,
    fileInfo,
    isProcessing,
    error,
    success,
    handleFileSelect,
    processFile
  } = useEpubProcessor();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0] || null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">EPUB Furigana Remover</h1>
            <p className="text-gray-600">Remove furigana annotations from your EPUB files while preserving the original text</p>
          </div>

          <div className="space-y-6">
            {/* File Input Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".epub"
                onChange={onFileInputChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="w-5 h-5 mr-2" />
                Select EPUB File
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Maximum file size: 100MB
              </p>
            </div>

            {/* File Info */}
            {fileInfo && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Selected File</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Name: {fileInfo.name}</p>
                  <p>Size: {formatFileSize(fileInfo.size)}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center bg-red-50 rounded-lg p-4 text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center bg-green-50 rounded-lg p-4 text-green-800">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <div>
                  <p>Successfully processed: {success.name}</p>
                  <p className="text-sm">Size reduction: {success.reduction}%</p>
                </div>
              </div>
            )}

            {/* Process Button */}
            <div className="text-center">
              <button
                onClick={processFile}
                disabled={!file || isProcessing}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white 
                  ${!file || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5 mr-2" />
                    Process EPUB
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;