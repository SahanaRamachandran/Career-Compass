import React, { useState } from 'react';
import { generateBulletPoints } from './api';

const BulletPointGenerator = () => {
  const [experience, setExperience] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bulletPoints, setBulletPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!experience.trim() || experience.length < 20) {
      alert('Please describe your experience (at least 20 characters)');
      return;
    }
    
    if (!jobTitle.trim()) {
      alert('Please enter the target job title');
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await generateBulletPoints(experience, jobTitle);
      setBulletPoints(data.bullet_points);
    } catch (error) {
      console.error('Error generating bullet points:', error);
      alert('Failed to generate bullet points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resume Bullet Point Generator</h2>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Experience
          </label>
          <textarea
            className="input-field resize-none text-gray-900"
            rows="4"
            placeholder="Describe what you did in this role..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Job Title
          </label>
          <input
            type="text"
            className="input-field text-gray-900"
            placeholder="e.g., Software Engineer, Data Analyst"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Bullet Points'}
        </button>
      </form>

      {bulletPoints.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              ✨ Generated {bulletPoints.length} Professional Bullet Points
            </h3>
            <button
              onClick={() => {
                const allPoints = bulletPoints.map(p => `• ${p}`).join('\n');
                copyToClipboard(allPoints);
              }}
              className="btn-primary text-sm"
            >
              Copy All
            </button>
          </div>
          
          <div className="space-y-3">
            {bulletPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-shadow border border-gray-200"
              >
                <span className="text-blue-600 font-bold text-lg mt-1">•</span>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed">{point}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(point)}
                  className="ml-3 px-3 py-1 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletPointGenerator;
