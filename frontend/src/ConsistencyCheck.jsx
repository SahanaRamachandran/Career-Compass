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
    if (!resumeText) {
      alert('Please analyze a resume first');
      return;
    }

    const validAnswers = interviewAnswers.filter(a => a.question.trim() && a.answer.trim());
    if (validAnswers.length === 0) {
      alert('Please add at least one interview Q&A');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/consistency-check', {
        resume_text: resumeText,
        interview_answers: validAnswers
      });
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to check consistency');
    } finally {
      setIsLoading(false);
    }
  };

  const getConsistencyColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    if (severity === 'High') return 'bg-red-100 text-red-800 border-red-300';
    if (severity === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Resume-Interview Consistency Check</h2>
        <p className="text-gray-600 mb-6">Compare your resume with interview answers to detect contradictions</p>

        <div className="space-y-4 mb-6">
          {interviewAnswers.map((qa, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Q&A #{index + 1}</h3>
                {interviewAnswers.length > 1 && (
                  <button
                    onClick={() => removeAnswer(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Your answer..."
                value={qa.answer}
                onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex gap-4">
            <button
              onClick={addAnswer}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Overall Consistency Score</p>
              <p className={`text-6xl font-bold ${getConsistencyColor(analysis.overall_consistency)}`}>
                {analysis.overall_consistency}%
              </p>
            </div>

            {analysis.contradictions.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span>Weak or Unsubstantiated Claims</span>
                </h3>
                <div className="space-y-3">
                  {analysis.weak_claims.map((item, idx) => (
                    <div key={idx} className="bg-white border border-yellow-300 rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-1">{item.claim}</p>
                      <p className="text-sm text-gray-600">{item.issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.areas_to_clarify.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💭</span>
                  <span>Areas Recruiters May Question</span>
                </h3>
                <div className="space-y-2">
                  {analysis.areas_to_clarify.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700">{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.red_flags.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚩</span>
                  <span>Red Flags</span>
                </h3>
                <div className="space-y-2">
                  {analysis.red_flags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-700">{flag}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.overall_consistency >= 80 && analysis.contradictions.length === 0 && (
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-bold text-green-800">Strong Consistency!</h4>
                    <p className="text-green-700">Your resume and interview answers align well. Recruiters will find your story credible.</p>
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
