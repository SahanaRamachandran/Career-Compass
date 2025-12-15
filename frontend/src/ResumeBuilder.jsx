import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: ''
    },
    experience: [
      { company: '', position: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' }
    ],
    education: [
      { institution: '', degree: '', field: '', location: '', graduationDate: '', gpa: '' }
    ],
    skills: {
      technical: '',
      soft: '',
      languages: '',
      tools: ''
    },
    projects: [
      { name: '', technologies: '', description: '', link: '' }
    ],
    certifications: [
      { name: '', issuer: '', date: '' }
    ]
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [template, setTemplate] = useState('modern');

  const updateField = (section, index, field, value) => {
    if (section === 'personalInfo' || section === 'skills') {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      const updated = [...formData[section]];
      updated[index][field] = value;
      setFormData(prev => ({ ...prev, [section]: updated }));
    }
  };

  const addSection = (section) => {
    const templates = {
      experience: { company: '', position: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' },
      education: { institution: '', degree: '', field: '', location: '', graduationDate: '', gpa: '' },
      projects: { name: '', technologies: '', description: '', link: '' },
      certifications: { name: '', issuer: '', date: '' }
    };
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  const removeSection = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(formData.personalInfo.fullName || 'Your Name', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [
      formData.personalInfo.email,
      formData.personalInfo.phone,
      formData.personalInfo.location
    ].filter(Boolean).join(' | ');
    doc.text(contactInfo, margin, yPos);
    yPos += lineHeight;

    if (formData.personalInfo.linkedin || formData.personalInfo.portfolio) {
      const links = [formData.personalInfo.linkedin, formData.personalInfo.portfolio].filter(Boolean).join(' | ');
      doc.text(links, margin, yPos);
      yPos += lineHeight;
    }

    if (formData.personalInfo.summary) {
      yPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PROFESSIONAL SUMMARY', margin, yPos);
      yPos += lineHeight;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(formData.personalInfo.summary, pageWidth - 2 * margin);
      doc.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * lineHeight + 5;
    }

    if (formData.experience.some(exp => exp.company)) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EXPERIENCE', margin, yPos);
      yPos += lineHeight;

      formData.experience.forEach(exp => {
        if (exp.company) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(exp.position || 'Position', margin, yPos);
          doc.setFont('helvetica', 'normal');
          const dateRange = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`;
          doc.text(dateRange, pageWidth - margin - 50, yPos);
          yPos += lineHeight;

          doc.setFontSize(10);
          doc.text(`${exp.company}${exp.location ? ', ' + exp.location : ''}`, margin, yPos);
          yPos += lineHeight;

          if (exp.responsibilities) {
            const respLines = doc.splitTextToSize(exp.responsibilities, pageWidth - 2 * margin - 5);
            respLines.forEach(line => {
              if (yPos > 270) {
                doc.addPage();
                yPos = 20;
              }
              doc.text('• ' + line, margin + 5, yPos);
              yPos += lineHeight;
            });
          }
          yPos += 3;
        }
      });
    }

    if (formData.education.some(edu => edu.institution)) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EDUCATION', margin, yPos);
      yPos += lineHeight;

      formData.education.forEach(edu => {
        if (edu.institution) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(edu.institution, margin, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(edu.graduationDate || '', pageWidth - margin - 30, yPos);
          yPos += lineHeight;

          doc.setFontSize(10);
          const degreeText = `${edu.degree || ''}${edu.field ? ' in ' + edu.field : ''}${edu.gpa ? ' - GPA: ' + edu.gpa : ''}`;
          doc.text(degreeText, margin, yPos);
          yPos += lineHeight + 3;
        }
      });
    }

    const skillsText = [
      formData.skills.technical && `Technical: ${formData.skills.technical}`,
      formData.skills.tools && `Tools: ${formData.skills.tools}`,
      formData.skills.soft && `Soft Skills: ${formData.skills.soft}`,
      formData.skills.languages && `Languages: ${formData.skills.languages}`
    ].filter(Boolean);

    if (skillsText.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('SKILLS', margin, yPos);
      yPos += lineHeight;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      skillsText.forEach(skill => {
        const lines = doc.splitTextToSize(skill, pageWidth - 2 * margin);
        lines.forEach(line => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, margin, yPos);
          yPos += lineHeight;
        });
      });
    }

    if (formData.projects.some(proj => proj.name)) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PROJECTS', margin, yPos);
      yPos += lineHeight;

      formData.projects.forEach(proj => {
        if (proj.name) {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(proj.name, margin, yPos);
          yPos += lineHeight;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          if (proj.technologies) {
            doc.text(`Technologies: ${proj.technologies}`, margin, yPos);
            yPos += lineHeight;
          }
          if (proj.description) {
            const descLines = doc.splitTextToSize(proj.description, pageWidth - 2 * margin);
            doc.text(descLines, margin, yPos);
            yPos += descLines.length * lineHeight;
          }
          yPos += 3;
        }
      });
    }

    if (formData.certifications.some(cert => cert.name)) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('CERTIFICATIONS', margin, yPos);
      yPos += lineHeight;

      formData.certifications.forEach(cert => {
        if (cert.name) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(`${cert.name} - ${cert.issuer || 'Issuer'}${cert.date ? ' (' + cert.date + ')' : ''}`, margin, yPos);
          yPos += lineHeight;
        }
      });
    }

    doc.save(`${formData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">📄 Resume Builder</h2>
            <p className="text-gray-600">Create a professional resume in minutes</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={exportToPDF}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        {!previewMode ? (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => updateField('personalInfo', null, 'fullName', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.personalInfo.email}
                  onChange={(e) => updateField('personalInfo', null, 'email', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.personalInfo.phone}
                  onChange={(e) => updateField('personalInfo', null, 'phone', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Location (City, State)"
                  value={formData.personalInfo.location}
                  onChange={(e) => updateField('personalInfo', null, 'location', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={formData.personalInfo.linkedin}
                  onChange={(e) => updateField('personalInfo', null, 'linkedin', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Portfolio/Website"
                  value={formData.personalInfo.portfolio}
                  onChange={(e) => updateField('personalInfo', null, 'portfolio', e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Professional Summary (2-3 sentences about your experience and goals)"
                  value={formData.personalInfo.summary}
                  onChange={(e) => updateField('personalInfo', null, 'summary', e.target.value)}
                  rows="4"
                  className="col-span-2 px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <button
                  onClick={() => addSection('experience')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + Add Experience
                </button>
              </div>
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 mb-4 border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Experience #{idx + 1}</h4>
                    {formData.experience.length > 1 && (
                      <button
                        onClick={() => removeSection('experience', idx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Company Name *"
                      value={exp.company}
                      onChange={(e) => updateField('experience', idx, 'company', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Position/Title *"
                      value={exp.position}
                      onChange={(e) => updateField('experience', idx, 'position', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => updateField('experience', idx, 'location', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="month"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateField('experience', idx, 'startDate', e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm flex-1"
                      />
                      <input
                        type="month"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateField('experience', idx, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="px-3 py-2 border rounded-lg text-sm flex-1"
                      />
                    </div>
                    <label className="flex items-center gap-2 col-span-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateField('experience', idx, 'current', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Currently working here</span>
                    </label>
                    <textarea
                      placeholder="Key responsibilities and achievements (use bullet points)"
                      value={exp.responsibilities}
                      onChange={(e) => updateField('experience', idx, 'responsibilities', e.target.value)}
                      rows="4"
                      className="col-span-2 px-3 py-2 border rounded-lg resize-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                <button
                  onClick={() => addSection('education')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  + Add Education
                </button>
              </div>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 mb-4 border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Education #{idx + 1}</h4>
                    {formData.education.length > 1 && (
                      <button
                        onClick={() => removeSection('education', idx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Institution/University *"
                      value={edu.institution}
                      onChange={(e) => updateField('education', idx, 'institution', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Degree (e.g., Bachelor's, Master's)"
                      value={edu.degree}
                      onChange={(e) => updateField('education', idx, 'degree', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateField('education', idx, 'field', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => updateField('education', idx, 'location', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="month"
                      placeholder="Graduation Date"
                      value={edu.graduationDate}
                      onChange={(e) => updateField('education', idx, 'graduationDate', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="GPA (optional)"
                      value={edu.gpa}
                      onChange={(e) => updateField('education', idx, 'gpa', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="space-y-3">
                <textarea
                  placeholder="Technical Skills (e.g., Python, JavaScript, SQL, Machine Learning)"
                  value={formData.skills.technical}
                  onChange={(e) => updateField('skills', null, 'technical', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg resize-none text-sm"
                />
                <textarea
                  placeholder="Tools & Technologies (e.g., Git, Docker, AWS, TensorFlow)"
                  value={formData.skills.tools}
                  onChange={(e) => updateField('skills', null, 'tools', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg resize-none text-sm"
                />
                <textarea
                  placeholder="Soft Skills (e.g., Leadership, Communication, Problem-solving)"
                  value={formData.skills.soft}
                  onChange={(e) => updateField('skills', null, 'soft', e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg resize-none text-sm"
                />
                <input
                  type="text"
                  placeholder="Languages (e.g., English (Native), Spanish (Fluent))"
                  value={formData.skills.languages}
                  onChange={(e) => updateField('skills', null, 'languages', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                <button
                  onClick={() => addSection('projects')}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  + Add Project
                </button>
              </div>
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 mb-4 border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Project #{idx + 1}</h4>
                    {formData.projects.length > 1 && (
                      <button
                        onClick={() => removeSection('projects', idx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Project Name *"
                      value={proj.name}
                      onChange={(e) => updateField('projects', idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Technologies Used"
                      value={proj.technologies}
                      onChange={(e) => updateField('projects', idx, 'technologies', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <textarea
                      placeholder="Project Description and Key Features"
                      value={proj.description}
                      onChange={(e) => updateField('projects', idx, 'description', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border rounded-lg resize-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Project Link (GitHub, Live Demo, etc.)"
                      value={proj.link}
                      onChange={(e) => updateField('projects', idx, 'link', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                <button
                  onClick={() => addSection('certifications')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  + Add Certification
                </button>
              </div>
              {formData.certifications.map((cert, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 mb-4 border">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Certification #{idx + 1}</h4>
                    {formData.certifications.length > 1 && (
                      <button
                        onClick={() => removeSection('certifications', idx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Certification Name *"
                      value={cert.name}
                      onChange={(e) => updateField('certifications', idx, 'name', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => updateField('certifications', idx, 'issuer', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="month"
                      placeholder="Date Obtained"
                      value={cert.date}
                      onChange={(e) => updateField('certifications', idx, 'date', e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-12" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{formData.personalInfo.fullName || 'Your Name'}</h1>
              <p className="text-sm text-gray-600 mt-2">
                {[formData.personalInfo.email, formData.personalInfo.phone, formData.personalInfo.location].filter(Boolean).join(' | ')}
              </p>
              {(formData.personalInfo.linkedin || formData.personalInfo.portfolio) && (
                <p className="text-sm text-blue-600 mt-1">
                  {[formData.personalInfo.linkedin, formData.personalInfo.portfolio].filter(Boolean).join(' | ')}
                </p>
              )}
            </div>

            {formData.personalInfo.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
                <p className="text-sm text-gray-700">{formData.personalInfo.summary}</p>
              </div>
            )}

            {formData.experience.some(exp => exp.company) && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">EXPERIENCE</h2>
                {formData.experience.map((exp, idx) => exp.company && (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-sm text-gray-600">
                        {exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{exp.company}{exp.location && `, ${exp.location}`}</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{exp.responsibilities}</p>
                  </div>
                ))}
              </div>
            )}

            {formData.education.some(edu => edu.institution) && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">EDUCATION</h2>
                {formData.education.map((edu, idx) => edu.institution && (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                      <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {edu.degree}{edu.field && ` in ${edu.field}`}{edu.gpa && ` - GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {(formData.skills.technical || formData.skills.tools || formData.skills.soft || formData.skills.languages) && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">SKILLS</h2>
                <div className="space-y-1 text-sm text-gray-700">
                  {formData.skills.technical && <p><strong>Technical:</strong> {formData.skills.technical}</p>}
                  {formData.skills.tools && <p><strong>Tools:</strong> {formData.skills.tools}</p>}
                  {formData.skills.soft && <p><strong>Soft Skills:</strong> {formData.skills.soft}</p>}
                  {formData.skills.languages && <p><strong>Languages:</strong> {formData.skills.languages}</p>}
                </div>
              </div>
            )}

            {formData.projects.some(proj => proj.name) && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">PROJECTS</h2>
                {formData.projects.map((proj, idx) => proj.name && (
                  <div key={idx} className="mb-3">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.technologies && <p className="text-sm text-gray-600 italic">Technologies: {proj.technologies}</p>}
                    <p className="text-sm text-gray-700">{proj.description}</p>
                    {proj.link && <p className="text-sm text-blue-600">{proj.link}</p>}
                  </div>
                ))}
              </div>
            )}

            {formData.certifications.some(cert => cert.name) && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-1 mb-3">CERTIFICATIONS</h2>
                {formData.certifications.map((cert, idx) => cert.name && (
                  <p key={idx} className="text-sm text-gray-700 mb-1">
                    {cert.name} - {cert.issuer || 'Issuer'}{cert.date && ` (${cert.date})`}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
