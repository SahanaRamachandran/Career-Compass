import React, { useState } from 'react';
import axios from 'axios';

const LearningRoadmap = ({ missingSkills, currentLevel, targetRole }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateRoadmap = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/learning-roadmap', {
        missing_skills: missingSkills,
        current_level: currentLevel || 'Mid-Level',
        target_role: targetRole || 'Software Engineer'
      });
      console.log('Learning roadmap response:', response.data);
      setRoadmap(response.data);
      if (!response.data || Object.keys(response.data).length === 0) {
        alert('No roadmap generated. Please try again.');
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to generate learning roadmap. Please analyze a resume first to identify missing skills.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!missingSkills || missingSkills.length === 0) {
    return null;
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-7 h-7 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Personalized Learning Roadmap
      </h2>

      {!roadmap && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Generate a customized 30-60-90 day plan to acquire missing skills
          </p>
          <button
            onClick={generateRoadmap}
            disabled={isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate My Roadmap'}
          </button>
        </div>
      )}

      {roadmap && (
        <div className="space-y-6">
          
          {roadmap.days_0_30 && (
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">🌱 Days 0-30: {roadmap.days_0_30.focus}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Skills to Learn:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {roadmap.days_0_30.skills?.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Resources:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_0_30.resources?.map((resource, idx) => (
                      <li key={idx}>{resource}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Project Ideas:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_0_30.projects?.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">✓ Milestones:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_0_30.milestones?.map((milestone, idx) => (
                      <li key={idx}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          
          {roadmap.days_31_60 && (
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">🚀 Days 31-60: {roadmap.days_31_60.focus}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Skills to Learn:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {roadmap.days_31_60.skills?.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Resources:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_31_60.resources?.map((resource, idx) => (
                      <li key={idx}>{resource}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Project Ideas:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_31_60.projects?.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">✓ Milestones:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_31_60.milestones?.map((milestone, idx) => (
                      <li key={idx}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          
          {roadmap.days_61_90 && (
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">🎯 Days 61-90: {roadmap.days_61_90.focus}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Skills to Learn:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {roadmap.days_61_90.skills?.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Resources:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_61_90.resources?.map((resource, idx) => (
                      <li key={idx}>{resource}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Project Ideas:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_61_90.projects?.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">✓ Milestones:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {roadmap.days_61_90.milestones?.map((milestone, idx) => (
                      <li key={idx}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">📊 Summary</p>
            <div className="text-sm text-gray-600 space-y-1">
              {roadmap.weekly_time_commitment && (
                <p><strong>Time Commitment:</strong> {roadmap.weekly_time_commitment} per week</p>
              )}
              {roadmap.success_metrics && roadmap.success_metrics.length > 0 && (
                <div>
                  <strong>Success Metrics:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {roadmap.success_metrics.map((metric, idx) => (
                      <li key={idx}>{metric}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningRoadmap;

