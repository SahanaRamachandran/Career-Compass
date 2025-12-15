import React from 'react';

const Visualizations = ({ results, analysisHistory = [] }) => {
  if (!results) return null;

  const downloadReport = (format) => {
    if (format === 'csv') {
      const csvContent = `Career Compass Analysis Report
Generated: ${new Date().toLocaleString()}

Match Score: ${results.match_percentage}%
Resume Sections Analysis:
${Object.entries(results.resume_sections_analysis || {}).map(([section, data]) => 
  `${section}: ${data.score}/100 - ${data.feedback}`).join('\n')}

Strengths:
${results.strengths?.map(s => `- ${s}`).join('\n')}

Missing Skills:
${results.missing_skills?.map(s => `- ${s}`).join('\n')}

ATS Suggestions:
${results.ats_suggestions?.map(s => `- ${s}`).join('\n')}

Keywords Found: ${results.keywords_found?.join(', ')}
Keywords Missing: ${results.keywords_missing?.join(', ')}
`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `career-compass-report-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      alert('PDF export requires backend integration. CSV export available now!');
    }
  };

  const matchColor = results.match_percentage >= 80 ? 'green' :
                     results.match_percentage >= 60 ? 'yellow' : 'red';

  return (
    <div className="card max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg className="w-7 h-7 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Visual Analysis & Reports
        </h2>
        <div className="flex gap-2">
          <button onClick={() => downloadReport('csv')} className="btn-secondary text-sm">
            📊 Export CSV
          </button>
          <button onClick={() => downloadReport('pdf')} className="btn-secondary text-sm">
            📄 Export PDF
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Overall Match Score</h3>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={matchColor === 'green' ? '#10b981' : matchColor === 'yellow' ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56 * results.match_percentage / 100} ${2 * Math.PI * 56}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${
                matchColor === 'green' ? 'text-green-600' :
                matchColor === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`}>{results.match_percentage}%</span>
            </div>
          </div>
        </div>

        
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">Strengths</p>
            <p className="text-3xl font-bold text-green-600">{results.strengths?.length || 0}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">Missing Skills</p>
            <p className="text-3xl font-bold text-red-600">{results.missing_skills?.length || 0}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">Keywords Found</p>
            <p className="text-3xl font-bold text-blue-600">{results.keywords_found?.length || 0}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700 font-medium">Keyword Density</p>
            <p className="text-3xl font-bold text-purple-600">{results.keyword_density_score}%</p>
          </div>
        </div>
      </div>

      
      {results.resume_sections_analysis && Object.keys(results.resume_sections_analysis).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume Section Scores</h3>
          <div className="space-y-4">
            {Object.entries(results.resume_sections_analysis).map(([section, data]) => (
              <div key={section}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{section}</span>
                  <span className="text-sm font-bold text-gray-800">{data.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      data.score >= 80 ? 'bg-green-500' :
                      data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${data.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{data.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {analysisHistory.length > 1 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Trends</h3>
          <div className="relative h-48">
            <svg className="w-full h-full">
              
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={192 - (y * 1.92)}
                  x2="100%"
                  y2={192 - (y * 1.92)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              
              
              {analysisHistory.length > 1 && (
                <polyline
                  points={analysisHistory.slice(-10).map((record, idx) => {
                    const x = (idx / Math.max(analysisHistory.slice(-10).length - 1, 1)) * 100;
                    const y = 192 - (record.match_percentage * 1.92);
                    return `${x}%,${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              
              
              {analysisHistory.slice(-10).map((record, idx) => {
                const x = (idx / Math.max(analysisHistory.slice(-10).length - 1, 1)) * 100;
                const y = 192 - (record.match_percentage * 1.92);
                return (
                  <circle
                    key={idx}
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="#8b5cf6"
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
              {analysisHistory.slice(-10).map((_, idx) => (
                <span key={idx}>#{idx + 1}</span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {analysisHistory[analysisHistory.length - 1].match_percentage > analysisHistory[analysisHistory.length - 2].match_percentage ? (
              <span className="text-green-600 font-medium">📈 Improvement detected! Keep optimizing.</span>
            ) : (
              <span className="text-yellow-600 font-medium">💡 Try implementing the ATS suggestions.</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Visualizations;

