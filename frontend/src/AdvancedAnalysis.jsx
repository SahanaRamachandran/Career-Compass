import React from 'react';

const AdvancedAnalysis = ({ results }) => {
  if (!results) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Match Explanation */}
      {results.match_explanation && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why This Score?
          </h3>
          <p className="text-gray-700">{results.match_explanation}</p>
        </div>
      )}

      {/* Role Suitability */}
      {results.role_suitability && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Role Suitability Analysis
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-800">Level: {results.role_suitability.level}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                results.role_suitability.confidence === 'High' ? 'bg-green-100 text-green-700' :
                results.role_suitability.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {results.role_suitability.confidence} Confidence
              </span>
            </div>
            <p className="text-gray-700 text-sm">{results.role_suitability.reasoning}</p>
          </div>
        </div>
      )}

      {/* Keyword Analysis */}
      {(results.keywords_found?.length > 0 || results.keywords_missing?.length > 0) && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Keyword Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">✓ Keywords Found:</p>
              <div className="flex flex-wrap gap-2">
                {results.keywords_found?.slice(0, 10).map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">✗ Missing Keywords:</p>
              <div className="flex flex-wrap gap-2">
                {results.keywords_missing?.slice(0, 10).map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {results.keyword_density_score !== undefined && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Keyword Density Score:</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    results.keyword_density_score >= 75 ? 'bg-green-500' :
                    results.keyword_density_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${results.keyword_density_score}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{results.keyword_density_score}% of important keywords present</p>
            </div>
          )}
        </div>
      )}

      {/* Resume Sections Analysis */}
      {results.resume_sections_analysis && Object.keys(results.resume_sections_analysis).length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume Sections Impact
          </h3>
          <div className="space-y-3">
            {Object.entries(results.resume_sections_analysis).map(([section, data]) => (
              <div key={section} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800 capitalize">{section}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      data.impact === 'High' ? 'bg-red-100 text-red-700' :
                      data.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {data.impact} Impact
                    </span>
                    <span className="text-lg font-bold text-blue-600">{data.score}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{data.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bullet Point Analysis */}
      {results.bullet_point_analysis && results.bullet_point_analysis.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Bullet Point Quality
          </h3>
          <ul className="space-y-2">
            {results.bullet_point_analysis.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Consistency Issues */}
      {results.consistency_issues && results.consistency_issues.length > 0 && (
        <div className="card bg-yellow-50 border-yellow-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Consistency Issues
          </h3>
          <ul className="space-y-2">
            {results.consistency_issues.map((issue, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                <span className="text-gray-700">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Career Gaps */}
      {results.career_gaps && results.career_gaps.length > 0 && (
        <div className="card bg-orange-50 border-orange-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Career Timeline Gaps
          </h3>
          <ul className="space-y-2">
            {results.career_gaps.map((gap, index) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-600 mr-2">📅</span>
                <span className="text-gray-700">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalysis;
