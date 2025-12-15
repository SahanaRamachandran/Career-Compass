import React, { useState } from 'react';
import axios from 'axios';

const MockInterview = ({ resumeText, jobDescription }) => {
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const generateQuestions = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please analyze a resume first in the "Resume Analysis" tab before generating mock interview questions');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/mock-interview', {
        resume_text: resumeText,
        job_description: jobDescription
      });
      console.log('Mock interview response:', response.data);
      setQuestions(response.data.questions || []);
      if (!response.data.questions || response.data.questions.length === 0) {
        alert('No questions generated. Please try again.');
      }
    } catch (error) {
      console.error('Error generating mock interview:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to generate mock interview questions. Please ensure you have analyzed a resume first.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestion = (idx) => {
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Resume-Based Mock Interview
      </h2>

      {!questions && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Generate personalized interview questions based on your resume experience
          </p>
          <button
            onClick={generateQuestions}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Generating Questions...' : 'Start Mock Interview'}
          </button>
        </div>
      )}

      {questions && questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleQuestion(idx)}
                className="w-full text-left p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-1 bg-pink-100 text-pink-700 rounded">
                        {q.category || 'Technical'}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        q.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                        q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {q.difficulty || 'Medium'}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">{q.question}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 ml-2 transition-transform ${
                      expandedQuestion === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedQuestion === idx && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  {q.why_asked && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-1">💡 Why this question?</p>
                      <p className="text-sm text-gray-600">{q.why_asked}</p>
                    </div>
                  )}

                  {q.key_points && q.key_points.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">✅ Key Points to Cover:</p>
                      <ul className="space-y-1">
                        {q.key_points.map((point, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {q.sample_answer && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-1">💬 Sample Answer Approach:</p>
                      <p className="text-sm text-gray-600 italic">{q.sample_answer}</p>
                    </div>
                  )}

                  {q.red_flags && q.red_flags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">🚩 Red Flags to Avoid:</p>
                      <ul className="space-y-1">
                        {q.red_flags.map((flag, i) => (
                          <li key={i} className="text-sm text-red-600 flex items-start">
                            <span className="mr-2">×</span>
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">📝 Interview Tips:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
              <li>Quantify your achievements with specific metrics when possible</li>
              <li>Relate your answers back to the job requirements</li>
              <li>Practice out loud to improve your delivery and confidence</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;

