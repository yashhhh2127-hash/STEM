import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronRight,
  Flame
} from 'lucide-react';
import { SubjectCategory, Quiz } from '../../types';

export const QuizView: React.FC = () => {
  const {
    quizzes,
    selectedQuizId,
    setSelectedQuizId,
    selectedSubject,
    setSelectedSubject,
    completeQuiz,
    currentStudent,
    navigateTo,
  } = useApp();

  const [activeQuizId, setActiveQuizId] = useState<string>(selectedQuizId || quizzes[0].id);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const activeQuiz: Quiz = quizzes.find((q) => q.id === activeQuizId) || quizzes[0];
  const question = activeQuiz.questions[currentQuestionIdx];
  const totalQuestions = activeQuiz.questions.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => [...prev, selectedOption]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate score
      const finalAnswers = [...userAnswers];
      let correctCount = 0;
      activeQuiz.questions.forEach((q, idx) => {
        if (finalAnswers[idx] === q.correctAnswer) {
          correctCount++;
        }
      });
      const scorePercent = Math.round((correctCount / totalQuestions) * 100);
      completeQuiz(activeQuiz.id, correctCount, totalQuestions, activeQuiz.xpReward || 50);
      setQuizFinished(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (selectedSubject && selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  const correctCount = userAnswers.reduce((acc, ans, idx) => {
    return ans === activeQuiz.questions[idx]?.correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Clean Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
              Adaptive Assessments
            </span>
            <span className="text-xs text-slate-500 font-medium">Instant Feedback & Concept Mastery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            STEM Knowledge Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Assess conceptual depth across Science, Math, Coding, and Electronics with instant diagnostic explanations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-shrink-0">
          <div className="p-2 bg-purple-600 rounded-lg text-white font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Quizzes Completed</span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              {Object.keys(currentStudent.quizScores).length} / {quizzes.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSubject(undefined)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              !selectedSubject || selectedSubject === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Subjects
          </button>
          {(['science', 'mathematics', 'technology', 'engineering'] as SubjectCategory[]).map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedSubject === subj
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
          <span className="text-slate-400 px-2 font-medium">Level:</span>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition ${
                difficultyFilter === diff
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Active Quiz Card or Quiz Finished Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quiz Viewport */}
        <div className="lg:col-span-2">
          {!quizFinished ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Progress & Meta Header */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50">
                      {activeQuiz.subject}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {activeQuiz.topic}
                    </span>
                  </div>
                  <span className="font-bold">
                    Question {currentQuestionIdx + 1} of {totalQuestions}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {question.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === question.correctAnswer;
                  const isWrongSelected = isAnswerSubmitted && isSelected && !isCorrect;

                  let style = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50';
                  if (isSelected && !isAnswerSubmitted) {
                    style = 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20';
                  } else if (isAnswerSubmitted) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-medium';
                    } else if (isWrongSelected) {
                      style = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20';
                    } else {
                      style = 'opacity-50 border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-slate-800">{option}</span>
                      </div>

                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {isWrongSelected && (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box on Submit */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1.5 animate-fade-in ${
                    selectedOption === question.correctAnswer
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOption === question.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct! Outstanding work!
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" /> Concept Check & Diagnostic:
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed text-slate-700">{question.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {activeQuiz.difficulty.toUpperCase()} • +{activeQuiz.xpReward} XP upon completion
                </span>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-200"
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
                  >
                    <span>{currentQuestionIdx < totalQuestions - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Scorecard & Results Review */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
                  Quiz Completed
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {activeQuiz.title}
                </h3>
              </div>

              {/* Score breakdown metrics */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-xs text-slate-500 block font-medium">Score</span>
                  <span className="text-2xl font-black text-indigo-600">
                    {Math.round((correctCount / totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-xs text-slate-500 block font-medium">Correct</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {correctCount} / {totalQuestions}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-xs text-slate-500 block font-medium">Earned XP</span>
                  <span className="text-2xl font-black text-amber-500">
                    +{activeQuiz.xpReward}
                  </span>
                </div>
              </div>

              {/* Review summary cards */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-100 max-h-72 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detailed Answer Key:
                </h4>
                {activeQuiz.questions.map((q, idx) => {
                  const userChoice = userAnswers[idx];
                  const isRight = userChoice === q.correctAnswer;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isRight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">{idx + 1}. {q.question}</span>
                        {isRight ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600">
                        <strong>Correct Answer:</strong>{' '}
                        {typeof q.correctAnswer === 'number'
                          ? q.options[q.correctAnswer]
                          : String(q.correctAnswer)}
                      </p>
                      <p className="text-slate-500 italic text-[11px]">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>

              {/* Next Actions */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRetake}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
                {activeQuiz.relatedSimulationId && (
                  <button
                    onClick={() => navigateTo('simulations', activeQuiz.relatedSimulationId, activeQuiz.subject)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <span>Test in Simulation Lab</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quiz Library Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Quiz Library ({filteredQuizzes.length})
            </h3>
            <span className="text-xs text-slate-400">Select to take</span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredQuizzes.map((quiz) => {
              const isCurrent = quiz.id === activeQuizId;
              const prevScore = currentStudent.quizScores[quiz.id];

              return (
                <button
                  key={quiz.id}
                  onClick={() => {
                    setActiveQuizId(quiz.id);
                    setSelectedQuizId(quiz.id);
                    handleRetake();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-purple-50/80 border-purple-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg flex-shrink-0 mt-0.5">
                    <CheckSquare className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {quiz.subject}
                      </span>
                      {prevScore !== undefined && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          {prevScore}% Score
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                      {quiz.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{quiz.questions.length} Questions</span>
                      <span className="capitalize text-indigo-600 font-semibold">{quiz.difficulty}</span>
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
