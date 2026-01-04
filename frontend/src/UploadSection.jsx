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
      {analysisHistory.length > 0 && (
        <div className="card max-w-4xl mx-auto animate-slide-in">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Analysis History ({analysisHistory.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {analysisHistory.slice(-5).reverse().map((record, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-all">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{record.filename}</p>
                  <p className="text-xs text-slate-400">{record.timestamp}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      record.match_percentage >= 80 ? 'text-green-400' :
                      record.match_percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{record.match_percentage}%</p>
                    <p className="text-xs text-slate-500">Match</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{record.missing_skills_count}</p>
                    <p className="text-xs text-slate-500">Missing</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card max-w-4xl mx-auto">
        <h2 className="section-header">Let's See How Your Resume Stacks Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Resume (PDF - you can upload multiple if you want to compare)
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
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                files.length > 0
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-600 hover:border-indigo-500 bg-slate-900/30 hover:bg-slate-800/50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg
                className={`w-10 h-10 mb-2 ${files.length > 0 ? 'text-green-400' : 'text-slate-400'}`}
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
              <p className={`text-sm ${files.length > 0 ? 'text-green-400 font-medium' : 'text-slate-300'}`}>
                {files.length > 0 ? `${files.length} file(s) uploaded` : 'Click to upload resume(s)'}
              </p>
              <p className="text-xs text-slate-500 mt-1">PDF (MAX. 10MB each)</p>
            </label>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-slate-300">Uploaded Files:</h4>
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedFileIndex === idx ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900/30 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="radio"
                        checked={selectedFileIndex === idx}
                        onChange={() => setSelectedFileIndex(idx)}
                        className="mr-3 accent-indigo-500"
                      />
                      <span className="text-sm text-slate-200 truncate">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="ml-2 text-red-400 hover:text-red-300 text-sm font-bold transition-colors"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            The Job You're After
          </label>
          <textarea
            className="input-field resize-none"
            rows="8"
            placeholder="Copy the full job posting here - responsibilities, requirements, everything!"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-slate-500">
            {jobDescription.length} characters (needs at least 50 - the more you add, the better the analysis)
          </p>
        </div>

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

