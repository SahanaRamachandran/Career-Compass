import React from 'react';

const ResultsSection = ({ results }) => {
  if (!results) return null;

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgGradient = (score) => {
    if (score >= 75) return 'from-green-500/20 to-emerald-500/20';
    if (score >= 50) return 'from-yellow-500/20 to-orange-500/20';
    return 'from-red-500/20 to-rose-500/20';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 75) return 'border-green-500/30';
    if (score >= 50) return 'border-yellow-500/30';
    return 'border-red-500/30';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-slide-in">
      
      <div className="card">
        <div className="text-center">
          <h2 className="section-header text-center">Match Score</h2>
          <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br ${getScoreBgGradient(results.match_percentage)} border-4 ${getScoreBorderColor(results.match_percentage)} shadow-2xl`}>
            <span className={`text-6xl font-bold ${getScoreColor(results.match_percentage)}`}>
              {results.match_percentage}%
            </span>
          </div>
          <p className="mt-6 text-slate-300 text-lg">{results.summary}</p>
        </div>
      </div>

      
      {results.strengths && results.strengths.length > 0 && (
        <div className="card border-green-500/20">
          <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your Strengths
          </h3>
          <ul className="space-y-3">
            {results.strengths.map((strength, index) => (
              <li key={index} className="flex items-start p-3 bg-green-500/5 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all">
                <span className="text-green-400 mr-3 text-xl">✓</span>
                <span className="text-slate-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      
      {results.missing_skills && results.missing_skills.length > 0 && (
        <div className="card border-red-500/20">
          <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {results.missing_skills.map((skill, index) => (
              <span
                key={index}
                className="badge-error hover:scale-105 transition-transform cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      
      {results.weak_areas && results.weak_areas.length > 0 && (
        <div className="card border-yellow-500/20">
          <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Areas to Improve
          </h3>
          <ul className="space-y-3">
            {results.weak_areas.map((area, index) => (
              <li key={index} className="flex items-start p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                <span className="text-yellow-400 mr-3 text-xl">→</span>
                <span className="text-slate-300">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      
      {results.ats_suggestions && results.ats_suggestions.length > 0 && (
        <div className="card bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30">
          <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            ATS Optimization Tips
          </h3>
          <ul className="space-y-3">
            {results.ats_suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start p-3 bg-slate-900/30 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all">
                <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-lg">
                  {index + 1}
                </span>
                <span className="text-slate-300">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;

