import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Code,
  Play,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Terminal,
  FileCode,
  Sparkles,
  ArrowRight,
  Lightbulb,
  FileText,
  ChevronDown
} from 'lucide-react';
import { CodingProblem } from '../../types';

export const CodingLabView: React.FC = () => {
  const {
    codingProblems,
    selectedCodingId,
    setSelectedCodingId,
    completeCodingProblem,
    currentStudent,
    addToast,
  } = useApp();

  const [activeProblemId, setActiveProblemId] = useState<string>(selectedCodingId || codingProblems[0].id);
  const activeProblem = codingProblems.find((p) => p.id === activeProblemId) || codingProblems[0];

  const getCodeString = (code: string | Record<string, string>): string => {
    if (typeof code === 'string') return code;
    return code['javascript'] || code['python'] || Object.values(code)[0] || '';
  };

  const [userCode, setUserCode] = useState<string>(() => getCodeString(activeProblem.starterCode));
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Array<{ input: string; expected: string; actual: string; passed: boolean }>>([]);
  const [revealedHintCount, setRevealedHintCount] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'problem' | 'output'>('editor');

  const problemHints = activeProblem.hints || (activeProblem.hint ? [activeProblem.hint] : ['Review the function arguments and return types carefully.']);

  // Sync code when switching problems
  const handleSelectProblem = (prob: CodingProblem) => {
    setActiveProblemId(prob.id);
    setSelectedCodingId(prob.id);
    setUserCode(getCodeString(prob.starterCode));
    setConsoleOutput([]);
    setTestResults([]);
    setRevealedHintCount(0);
  };

  const handleResetCode = () => {
    setUserCode(getCodeString(activeProblem.starterCode));
    setConsoleOutput([]);
    setTestResults([]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    const logs: string[] = [];
    const results: Array<{ input: string; expected: string; actual: string; passed: boolean }> = [];

    try {
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
      };

      const starterStr = getCodeString(activeProblem.starterCode);
      const fnNameMatch = (typeof userCode === 'string' ? userCode : starterStr).match(/function\s+([a-zA-Z0-9_]+)/);
      const fnName = fnNameMatch ? fnNameMatch[1] : null;

      const evalContext = new Function('console', `${userCode}\nreturn typeof ${fnName || 'solution'} !== 'undefined' ? ${fnName || 'solution'} : null;`);
      const userFn = evalContext(customConsole);

      if (typeof userFn === 'function') {
        let allPassed = true;
        for (const tc of activeProblem.testCases) {
          let inputArg: any;
          try {
            inputArg = JSON.parse(`[${tc.input}]`);
          } catch {
            inputArg = [tc.input];
          }

          let actual: any;
          try {
            actual = userFn(...inputArg);
          } catch (e: any) {
            actual = `Error: ${e.message}`;
          }

          const actualStr = typeof actual === 'object' ? JSON.stringify(actual) : String(actual);
          const expectedStr = String(tc.expectedOutput).trim();
          const passed = actualStr === expectedStr;
          if (!passed) allPassed = false;

          results.push({
            input: tc.input,
            expected: expectedStr,
            actual: actualStr,
            passed,
          });
        }

        setTestResults(results);
        setConsoleOutput(logs);

        // Auto-switch to output tab on mobile so learners see results immediately
        setMobileTab('output');

        if (allPassed && !currentStudent.completedCoding.includes(activeProblem.id)) {
          addToast({
            type: 'success',
            title: 'Challenge Solved! 🎉',
            message: `All test cases passed! Earned +${activeProblem.xpReward} XP.`,
          });
          completeCodingProblem(activeProblem.id, activeProblem.xpReward);
        }
      } else {
        setTestResults([]);
        setConsoleOutput(['Function not found or invalid syntax. Check function definition.']);
        setMobileTab('output');
      }
    } catch (err: any) {
      logs.push(`Runtime Syntax / Execution Error: ${err.message}`);
      setConsoleOutput(logs);
      setTestResults([]);
      setMobileTab('output');
    } finally {
      setIsRunning(false);
    }
  };

  const isCompleted = currentStudent.completedCoding.includes(activeProblem.id);
  const passedTestsCount = testResults.filter((t) => t.passed).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Clean Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-100">
              Interactive Code Sandbox
            </span>
            <span className="text-xs text-slate-500 font-medium">Algorithmic Thinking & Logic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            STEM Coding Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Write real JavaScript code, execute unit tests, and master loop structures and mathematical logic.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex-shrink-0">
          <div className="p-2 bg-amber-500 rounded-lg text-white font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Solved Challenges</span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              {currentStudent.completedCoding.length} / {codingProblems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Challenge Selector Strip */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
        {codingProblems.map((prob) => {
          const isCurrent = prob.id === activeProblemId;
          const isSolved = currentStudent.completedCoding.includes(prob.id);

          return (
            <button
              key={prob.id}
              onClick={() => handleSelectProblem(prob)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition flex-shrink-0 active:scale-95 ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
              <span>{prob.title}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Segmented Control (< lg) */}
      <div className="lg:hidden flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold text-slate-600 gap-1">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
            mobileTab === 'editor' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-amber-500" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setMobileTab('problem')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
            mobileTab === 'problem' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-500" />
          <span>Problem</span>
        </button>

        <button
          onClick={() => setMobileTab('output')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition relative ${
            mobileTab === 'output' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>Results</span>
          {testResults.length > 0 && (
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Main Coding IDE Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Problem Statement & Hints (4 Cols) */}
        <div className={`lg:col-span-4 space-y-4 ${mobileTab === 'problem' ? 'block' : 'hidden lg:block'}`}>
          <div className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="capitalize text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {activeProblem.difficulty}
              </span>
              <span className="text-xs font-bold text-indigo-600">
                +{activeProblem.xpReward} XP
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {activeProblem.title}
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeProblem.description}
            </p>

            {/* Test Case Expectations */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Sample Test Cases:
              </span>
              <div className="space-y-1.5 text-[11px]">
                {activeProblem.testCases.map((tc, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-700">
                    <div>Input: <span className="text-indigo-600">{tc.input}</span></div>
                    <div>Expected: <span className="text-emerald-600 font-bold">{tc.expectedOutput}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progressive Hint Drawer */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Need a Hint?
                </span>
                {revealedHintCount < problemHints.length && (
                  <button
                    onClick={() => setRevealedHintCount((c) => c + 1)}
                    className="text-[11px] text-indigo-600 font-bold hover:underline"
                  >
                    Reveal Hint {revealedHintCount + 1} of {problemHints.length}
                  </button>
                )}
              </div>

              {problemHints.slice(0, revealedHintCount).map((hint, idx) => (
                <div key={idx} className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block text-[10px] uppercase text-amber-700">Hint {idx + 1}:</span>
                  {hint}
                </div>
              ))}
            </div>

            {/* Quick Switch Button on Mobile to return to code */}
            <div className="pt-2 lg:hidden">
              <button
                onClick={() => setMobileTab('editor')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Write Solution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Console Output (8 Cols) */}
        <div className={`lg:col-span-8 space-y-4 ${mobileTab === 'editor' || mobileTab === 'output' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md flex flex-col">
            {/* Editor Toolbar */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  solution.js
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 sm:px-2 py-0.5 rounded font-mono">
                  JavaScript
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition text-xs flex items-center gap-1"
                  title="Reset code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-3 sm:px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Run Tests</span>
                </button>
              </div>
            </div>

            {/* Code Textarea Area - hidden on mobile when viewing output tab */}
            <div className={`p-3 sm:p-4 bg-slate-950 font-mono text-xs sm:text-sm text-slate-200 min-h-[220px] sm:min-h-[260px] flex ${mobileTab === 'output' ? 'hidden lg:flex' : 'flex'}`}>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-56 sm:h-64 bg-transparent resize-none focus:outline-none font-mono text-xs sm:text-sm leading-relaxed text-amber-100 selection:bg-indigo-500 selection:text-white"
                spellCheck={false}
              />
            </div>

            {/* Output Terminal & Test Case Results */}
            <div className={`bg-slate-900 border-t border-slate-800 p-3 sm:p-4 space-y-3 ${mobileTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold font-mono text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" /> Terminal & Test Results
                </span>
                {testResults.length > 0 && (
                  <span className="font-semibold text-slate-300">
                    {passedTestsCount} of {testResults.length} Passed
                  </span>
                )}
              </div>

              {/* Console Logs */}
              {consoleOutput.length > 0 && (
                <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-xs text-slate-300 space-y-0.5 border border-slate-800">
                  {consoleOutput.map((line, idx) => (
                    <div key={idx} className="text-slate-400">
                      <span className="text-indigo-400">&gt;</span> {line}
                    </div>
                  ))}
                </div>
              )}

              {/* Unit Test Results Cards */}
              {testResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs font-mono flex items-start justify-between ${
                        tr.passed
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-800 text-rose-300'
                      }`}
                    >
                      <div>
                        <div>Input: {tr.input}</div>
                        <div>Output: {tr.actual}</div>
                        <div className="text-[10px] opacity-75">Expected: {tr.expected}</div>
                      </div>
                      {tr.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Switch back to Editor on Mobile */}
              <div className="pt-1 lg:hidden">
                <button
                  onClick={() => setMobileTab('editor')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>Back to Code Editor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
