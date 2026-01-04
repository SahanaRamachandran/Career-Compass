import React, { useState, useRef } from 'react';
import axios from 'axios';

const VoiceInterview = ({ resumeText, jobDescription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const recognitionRef = useRef(null);

  const sampleQuestions = [
    "Tell me about your most challenging project and how you handled it.",
    "Describe a time when you had to work with a difficult team member.",
    "What interests you most about this role and our company?",
    "How do you stay current with industry trends and technologies?",
    "Walk me through your approach to solving complex technical problems."
  ];

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Try Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      
      setTranscript(prev => prev + final);
    };

    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const analyzeAnswer = async () => {
    if (!transcript.trim()) {
      alert('Please record an answer first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/voice-interview', {
        transcript: transcript,
        question: currentQuestion || sampleQuestions[questionIndex],
        job_description: jobDescription,
        resume_text: resumeText
      });
      setFeedback(response.data);
    } catch (error) {
      console.error('Error analyzing answer:', error);
      alert('Failed to analyze answer');
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    setQuestionIndex((questionIndex + 1) % sampleQuestions.length);
    setCurrentQuestion(sampleQuestions[(questionIndex + 1) % sampleQuestions.length]);
    setTranscript('');
    setFeedback(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <h2 className="section-header">🎤 Voice Interview Simulator</h2>
        <p className="text-slate-400 mb-6">Practice answering interview questions with real-time feedback</p>

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-slate-200 mb-3">Current Question:</h3>
          <p className="text-lg text-slate-100">{currentQuestion || sampleQuestions[questionIndex]}</p>
        </div>

        <div className="flex gap-4 mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </button>
          )}

          <button
            onClick={analyzeAnswer}
            disabled={!transcript || isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Answer'}
          </button>

          <button
            onClick={nextQuestion}
            className="btn-outline"
          >
            Next Question
          </button>
        </div>

        {transcript && (
          <div className="mb-6">
            <h3 className="font-semibold text-slate-200 mb-2">Your Answer:</h3>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="input-field resize-none min-h-[120px]"
              placeholder="Your answer will appear here... or type manually if voice isn't working"
            />
          </div>
        )}

        {!transcript && (
          <div className="mb-6">
            <h3 className="font-semibold text-slate-200 mb-2">Or Type Your Answer:</h3>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="input-field resize-none min-h-[120px]"
              placeholder="Type your answer here if voice recording isn't working..."
            />
          </div>
        )}

        {feedback && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="stat-card text-center">
                <p className="text-sm text-slate-400 mb-1">Relevance</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedback.relevance_score)}`}>
                  {feedback.relevance_score}
                </p>
              </div>
              <div className="stat-card text-center">
                <p className="text-sm text-slate-400 mb-1">Clarity</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedback.clarity_score)}`}>
                  {feedback.clarity_score}
                </p>
              </div>
              <div className="stat-card text-center">
                <p className="text-sm text-slate-400 mb-1">Skill Alignment</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedback.skill_alignment_score)}`}>
                  {feedback.skill_alignment_score}
                </p>
              </div>
              <div className="stat-card text-center">
                <p className="text-sm text-slate-400 mb-1">Overall</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedback.overall_score)}`}>
                  {feedback.overall_score}
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-slate-200 mb-2">💡 Feedback</h3>
              <ul className="space-y-1">
                {feedback.feedback.map((item, idx) => (
                  <li key={idx} className="text-slate-300">• {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-slate-200 mb-2">✨ Improved Answer</h3>
              <p className="text-slate-300">{feedback.improved_answer}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-slate-200 mb-2">✓ Points Covered</h3>
                <ul className="space-y-1">
                  {feedback.key_points_covered.map((point, idx) => (
                    <li key={idx} className="text-slate-300 text-sm">• {point}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-slate-200 mb-2">✗ Missing Points</h3>
                <ul className="space-y-1">
                  {feedback.missing_points.map((point, idx) => (
                    <li key={idx} className="text-slate-300 text-sm">• {point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-slate-200 mb-2">❓ Follow-up Questions</h3>
              <ul className="space-y-1">
                {feedback.follow_up_questions.map((q, idx) => (
                  <li key={idx} className="text-slate-300">{idx + 1}. {q}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInterview;
