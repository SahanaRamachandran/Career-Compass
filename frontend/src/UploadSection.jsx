import React, { useState } from 'react';

const UploadSection = ({ onAnalyze, isLoading, analysisHistory = [] }) => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(f => f.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      alert('Only PDF files allowed. Non-PDF files were filtered out.');
    }
    
    if (pdfFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    if (selectedFileIndex >= files.length - 1) {
      setSelectedFileIndex(Math.max(0, files.length - 2));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      alert('Please upload at least one resume');
      return;
    }
    
    if (!jobDescription.trim() || jobDescription.length < 50) {
      alert('Please enter a job description (at least 50 characters)');
      return;
    }
    
    const fileToAnalyze = files[selectedFileIndex];
    onAnalyze(fileToAnalyze, jobDescription, fileToAnalyze.name);
  };

  return (
    <div className="space-y-6">
      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="card max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analysis History ({analysisHistory.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {analysisHistory.slice(-5).reverse().map((record, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{record.filename}</p>
                  <p className="text-xs text-gray-500">{record.timestamp}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      record.match_percentage >= 80 ? 'text-green-600' :
                      record.match_percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{record.match_percentage}%</p>
                    <p className="text-xs text-gray-500">Match</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{record.missing_skills_count}</p>
                    <p className="text-xs text-gray-500">Missing</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Resume & Job Description</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume(s) (PDF) - Multiple files supported
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
              disabled={isLoading}
              multiple
            />
            <label
              htmlFor="resume-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                files.length > 0
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg
                className={`w-10 h-10 mb-2 ${files.length > 0 ? 'text-green-500' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className={`text-sm ${files.length > 0 ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                {files.length > 0 ? `${files.length} file(s) uploaded` : 'Click to upload resume(s)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PDF (MAX. 10MB each)</p>
            </label>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Uploaded Files:</h4>
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded border ${
                      selectedFileIndex === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="radio"
                        checked={selectedFileIndex === idx}
                        onChange={() => setSelectedFileIndex(idx)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 truncate">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm font-bold"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            className="input-field resize-none text-gray-900"
            rows="8"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            {jobDescription.length} characters (minimum 50 required)
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="btn-primary flex-1 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              files.length > 1 ? `Analyze Selected (${selectedFileIndex + 1}/${files.length})` : 'Analyze Resume'
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default UploadSection;
