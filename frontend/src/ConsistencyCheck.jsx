import React, { useState } from 'react';
import axios from 'axios';

const ConsistencyCheck = ({ resumeText }) => {
  const [interviewAnswers, setInterviewAnswers] = useState([
    { question: '', answer: '' }
  ]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addAnswer = () => {
    setInterviewAnswers([...interviewAnswers, { question: '', answer: '' }]);
  };

  const removeAnswer = (index) => {
    setInterviewAnswers(interviewAnswers.filter((_, i) => i !== index));
  };

  const updateAnswer = (index, field, value) => {
    const updated = [...interviewAnswers];
    updated[index][field] = value;
    setInterviewAnswers(updated);
  };

  const checkConsistency = async () => {
    const validAnswers = interviewAnswers.filter(a => a.question.trim() && a.answer.trim());
    if (validAnswers.length === 0) {
      alert('Please add at least one interview Q&A');
      return;
    }

    // Use provided resume text or a placeholder if not available
    const resumeToCheck = resumeText || "No resume analyzed yet. Using interview answers only for consistency check.";

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/consistency-check', {
        resume_text: resumeToCheck,
        interview_answers: validAnswers
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to check consistency. Make sure the backend is running.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getConsistencyColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity) => {
    if (severity === 'High') return 'bg-red-500/10 text-red-300 border-red-500/30';
    if (severity === 'Medium') return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
    return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <h2 className="section-header">🔍 Resume-Interview Consistency Check</h2>
        <p className="text-slate-400 mb-4">Compare your resume with interview answers to detect contradictions</p>
        
        {!resumeText && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              💡 <strong>Tip:</strong> For best results, analyze a resume first in the "Resume Analysis" tab. You can still check consistency between answers without a resume.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {interviewAnswers.map((qa, index) => (
            <div key={index} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-indigo-500/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-200">Q&A #{index + 1}</h3>
                {interviewAnswers.length > 1 && (
                  <button
                    onClick={() => removeAnswer(index)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Interview question..."
                value={qa.question}
                onChange={(e) => updateAnswer(index, 'question', e.target.value)}
                className="input-field mb-3"
              />
              <textarea
                placeholder="Your answer..."
                value={qa.answer}
                onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
                rows="3"
                className="input-field resize-none"
              />
            </div>
          ))}

          <div className="flex gap-4">
            <button
              onClick={addAnswer}
              className="btn-outline"
            >
              + Add Another Q&A
            </button>

            <button
              onClick={checkConsistency}
              disabled={isLoading || !resumeText}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Checking...' : 'Check Consistency'}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="text-center p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border-2 border-indigo-500/30">
              <p className="text-sm text-slate-400 mb-2">Overall Consistency Score</p>
              <p className={`text-6xl font-bold ${getConsistencyColor(analysis.overall_consistency)}`}>
                {analysis.overall_consistency}%
              </p>
            </div>

            {analysis.contradictions.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span>Contradictions Found</span>
                </h3>
                <div className="space-y-3">
                  {analysis.contradictions.map((item, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 ${getSeverityColor(item.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold">{item.severity} Severity</span>
                      </div>
                      <p className="text-sm mb-2"><strong>Resume:</strong> {item.claim}</p>
                      <p className="text-sm"><strong>Interview:</strong> {item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.weak_claims.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>Weak or Unsubstantiated Claims</span>
                </h3>
                <div className="space-y-3">
                  {analysis.weak_claims.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-yellow-500/20 rounded-lg p-4">
                      <p className="font-medium text-slate-200 mb-1">{item.claim}</p>
                      <p className="text-sm text-slate-400">{item.issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.areas_to_clarify.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💭</span>
                  <span>Areas Recruiters May Question</span>
                </h3>
                <div className="space-y-2">
                  {analysis.areas_to_clarify.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      <p className="text-slate-300">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.red_flags.length > 0 && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚩</span>
                  <span>Red Flags</span>
                </h3>
                <div className="space-y-2">
                  {analysis.red_flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-slate-300">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.overall_consistency >= 80 && analysis.contradictions.length === 0 && (
              <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-green-300">Strong Consistency!</h4>
                    <p className="text-green-400">Your resume and interview answers align well. Recruiters will find your story credible.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsistencyCheck;
