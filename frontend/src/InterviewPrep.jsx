import React, { useState } from 'react';
import { getInterviewQuestions } from './api';

const InterviewPrep = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!jobDescription.trim() || jobDescription.length < 50) {
      alert('Please enter a job description (at least 50 characters)');
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await getInterviewQuestions(jobDescription);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate interview questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">Interview Preparation</h2>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Job Description
          </label>
          <textarea
            className="input-field resize-none"
            rows="6"
            placeholder="Paste the job description to get relevant interview questions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Interview Questions'}
        </button>
      </form>

      {questions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-200">Prepare for These Questions:</h3>
          {questions.map((question, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30"
            >
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {index + 1}
                </span>
                <p className="text-slate-300 flex-1 pt-1">{question}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;

