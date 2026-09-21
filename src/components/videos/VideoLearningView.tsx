import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlayCircle,
  Clock,
  Award,
  CheckCircle2,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  Download,
  Share2
} from 'lucide-react';
import { SubjectCategory, EducationalVideo } from '../../types';

export const VideoLearningView: React.FC = () => {
  const {
    videos,
    selectedVideoId,
    setSelectedVideoId,
    selectedSubject,
    setSelectedSubject,
    completeVideo,
    currentStudent,
    navigateTo,
    addToast,
  } = useApp();

  const [activeVideoId, setActiveVideoId] = useState<string>(selectedVideoId || videos[0].id);
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'concepts' | 'notes' | 'timestamps'>('concepts');

  const activeVideo = videos.find((v) => v.id === activeVideoId) || videos[0];
  const isCompleted = currentStudent.completedVideos.includes(activeVideo.id);

  const handleMarkComplete = () => {
    completeVideo(activeVideo.id, activeVideo.xpReward);
  };

  const handleDownloadNotes = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `STEMLearn Palghar - Concept Study Notes\n` +
      `========================================\n` +
      `Topic: ${activeVideo.title}\n` +
      `Subject: ${activeVideo.subject.toUpperCase()}\n` +
      `Duration: ${activeVideo.duration}\n\n` +
      `KEY CONCEPTS:\n${activeVideo.keyConcepts.map((c) => `- ${c}`).join('\n')}\n\n` +
      `LEARNING OBJECTIVES:\n${activeVideo.learningObjectives.map((o) => `- ${o}`).join('\n')}\n\n` +
      `STUDENT'S PERSONAL NOTES:\n${studentNotes || 'No notes typed yet.'}\n\n` +
      `Source: Community Engagement Project: STEM Education Support Using Free Digital Tools\n` +
      `Department of IT, SDES College, Palghar.\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeVideo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    addToast({
      id: Date.now().toString(),
      type: 'info',
      title: 'Notes Exported',
      message: 'Summary notes saved as plain text document.',
    });
  };

  const filteredVideos = videos.filter((v) => {
    if (selectedSubject && selectedSubject !== 'all' && v.subject !== selectedSubject) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              Visual STEM Library
            </span>
            <span className="text-xs text-slate-300 font-medium">Free Digital Curricula</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Curated Educational Video Lessons
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            High-definition visual explanations, real laboratory experiments, and intuitive concept breakdowns with live notes and self-check quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
          <div className="p-2.5 bg-blue-500 rounded-xl text-white font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-300 block font-medium">Completed Lessons</span>
            <span className="text-lg font-black text-white">
              {currentStudent.completedVideos.length} / {videos.length}
            </span>
          </div>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedSubject(undefined)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            !selectedSubject || selectedSubject === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Subjects ({videos.length})
        </button>
        {(['science', 'mathematics', 'technology', 'engineering'] as SubjectCategory[]).map((subj) => {
          const count = videos.filter((v) => v.subject === subj).length;
          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {subj} ({count})
            </button>
          );
        })}
      </div>

      {/* Main Video Viewer & Content Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Video Player & Companion Panels */}
        <div className="lg:col-span-2 space-y-4">
          {/* Responsive Embedded Video Frame */}
          <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-800">
            <iframe
              src={activeVideo.videoUrl}
              title={activeVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Title & Quick Actions */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="capitalize text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {activeVideo.subject}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeVideo.duration}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    +{activeVideo.xpReward} XP
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  {activeVideo.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Topic: <strong className="text-slate-700">{activeVideo.topic}</strong> • Creator/Source: <span className="text-indigo-600 font-medium">{activeVideo.author}</span>
                </p>
              </div>

              {/* Complete & Earn Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadNotes}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                  title="Download concept summary sheet"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={isCompleted}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCompleted ? 'Completed (+XP Claimed)' : 'Mark Lesson Complete'}
                </button>
              </div>
            </div>

            {/* Sub-tab navigation for Notes, Objectives, Timestamps */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <button
                  onClick={() => setActiveTab('concepts')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeTab === 'concepts'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Key Concepts & Objectives
                </button>
                <button
                  onClick={() => setActiveTab('timestamps')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeTab === 'timestamps'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Chapters ({(activeVideo.timestamps || []).length})
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeTab === 'notes'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Interactive Notebook
                </button>
              </div>

              {/* Tab Content */}
              <div className="pt-3">
                {activeTab === 'concepts' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" /> Core Concepts Highlighted:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeVideo.keyConcepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-lg font-medium"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-600" /> Learning Outcomes:
                      </span>
                      <ul className="space-y-1 text-slate-600 list-disc pl-4">
                        {activeVideo.learningObjectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'timestamps' && (
                  <div className="space-y-2">
                    {(activeVideo.timestamps || []).map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs transition"
                      >
                        <span className="font-medium text-slate-800">{t.title}</span>
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {t.time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-2">
                    <textarea
                      value={studentNotes}
                      onChange={(e) => setStudentNotes(e.target.value)}
                      placeholder="Type your personal observations, formulas, or questions here. Click 'Download' above to save..."
                      rows={4}
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-400">
                      Notes are kept locally in your session and included in exported study cards.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Simulation & Quiz Quick Links */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              {activeVideo.relatedQuizId && (
                <button
                  onClick={() => navigateTo('quizzes', activeVideo.relatedQuizId, activeVideo.subject)}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <HelpCircle className="w-4 h-4" /> Take Related Quiz (+50 XP)
                </button>
              )}
              {activeVideo.relatedSimulationId && (
                <button
                  onClick={() => navigateTo('simulations', activeVideo.relatedSimulationId, activeVideo.subject)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-4 h-4" /> Open Simulation Lab (+35 XP)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Video Playlist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Lesson Playlist ({filteredVideos.length})
            </h3>
            <span className="text-xs text-slate-400">Click to load</span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredVideos.map((vid) => {
              const isCurrent = vid.id === activeVideoId;
              const hasCompleted = currentStudent.completedVideos.includes(vid.id);

              return (
                <button
                  key={vid.id}
                  onClick={() => {
                    setActiveVideoId(vid.id);
                    setSelectedVideoId(vid.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="relative w-20 h-14 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-white">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <PlayCircle className="w-6 h-6 absolute text-white/90 drop-shadow" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {vid.subject}
                      </span>
                      {hasCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                      {vid.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>{vid.duration}</span>
                      <span className="text-indigo-600 font-semibold">+{vid.xpReward} XP</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
