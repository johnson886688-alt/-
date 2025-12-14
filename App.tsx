import React, { useState, useEffect } from 'react';
import { AppMode, Step, Scenario, SCENARIO_BG, SimulationState } from './types';
import { STEPS_INFO, MAX_SCORE, EXAM_QUESTIONS, EXAM_TIME_LIMIT } from './constants';
import { getSmartHint } from './services/geminiService';
import MarkerPlacement from './components/MarkerPlacement';
import { 
  Play, Monitor, Radio, HelpCircle, Check, ArrowRight, Menu, Zap, Target, FastForward, Film,
  Clock, CheckCircle, XCircle, Square, Video, ChevronDown, List, Database, Globe
} from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [state, setState] = useState<SimulationState>({
    mode: AppMode.MENU,
    currentStep: Step.SETUP_SUIT,
    scenario: Scenario.STADIUM,
    score: MAX_SCORE,
    hintsUsed: 0,
    mistakes: 0,
    history: [],
    isRecording: false,
    hasRecorded: false,
    isCalibrated: false,
    skeletonCreated: false,
    examAnswers: {},
    examTimeLeft: EXAM_TIME_LIMIT,
    examCurrentQuestion: 0,
  });

  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  
  // Specific internal states
  const [viewMode, setViewMode] = useState<'video' | 'practice'>('video'); 
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  // --- Exam Timer ---
  useEffect(() => {
    let timer: number;
    if (state.mode === AppMode.EXAM && state.examTimeLeft > 0) {
      timer = window.setInterval(() => {
        setState(prev => {
          if (prev.examTimeLeft <= 1) {
             clearInterval(timer);
             let correctCount = 0;
             EXAM_QUESTIONS.forEach(q => {
               if (prev.examAnswers[q.id] === q.correctAnswer) {
                 correctCount++;
               }
             });
             return { 
                 ...prev, 
                 mode: AppMode.RESULTS, 
                 score: correctCount * 10, 
                 history: [...prev.history, "考核超时"] 
             };
          }
          return { ...prev, examTimeLeft: prev.examTimeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.mode, state.examTimeLeft]);

  // --- Handlers ---

  const startGame = (mode: AppMode, scenario: Scenario) => {
    setState({
      mode,
      scenario,
      currentStep: Step.SETUP_SUIT,
      score: MAX_SCORE,
      hintsUsed: 0,
      mistakes: 0,
      history: [`开始 ${mode} 模式，场景: ${scenario}`],
      isRecording: false,
      hasRecorded: false,
      isCalibrated: false,
      skeletonCreated: false,
      examAnswers: {},
      examTimeLeft: EXAM_TIME_LIMIT,
      examCurrentQuestion: 0,
    });
    setCalibrationProgress(0);
    setCurrentHint(null);
    setViewMode(mode === AppMode.LEARNING ? 'video' : 'practice');
  };

  const nextStep = () => {
    setState(prev => {
      const next = prev.currentStep + 1;
      return {
        ...prev,
        currentStep: next,
        history: [...prev.history, `进入步骤 ${next}`]
      };
    });
    setCurrentHint(null);
    setViewMode('practice'); 
  };

  const useHint = async () => {
    if (loadingHint) return;
    setLoadingHint(true);
    const hint = await getSmartHint(state.currentStep, state.scenario, state.history);
    setCurrentHint(hint);
    setLoadingHint(false);
  };

  const handleExamAnswer = (questionId: number, optionIndex: number) => {
    setState(prev => ({
      ...prev,
      examAnswers: { ...prev.examAnswers, [questionId]: optionIndex }
    }));
  };

  const handleExamSubmit = () => {
    let correctCount = 0;
    EXAM_QUESTIONS.forEach(q => {
      if (state.examAnswers[q.id] === q.correctAnswer) { correctCount++; }
    });
    const finalScore = correctCount * 10;
    setState(prev => ({
      ...prev,
      score: finalScore,
      mode: AppMode.RESULTS,
      history: [...prev.history, "提交试卷"]
    }));
  };

  const handleExamNav = (index: number) => {
    setState(prev => ({ ...prev, examCurrentQuestion: index }));
  };

  const handleMarkerComplete = () => {
    setState(prev => ({ ...prev, history: [...prev.history, "完成贴点"] }));
  };

  const handleCalibration = () => {
    if (state.currentStep !== Step.CALIBRATION_WAND) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCalibrationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setState(prev => ({ ...prev, isCalibrated: true, history: [...prev.history, '完成手柄校准'] }));
      }
    }, 100);
  };

  const handleRecordToggle = () => {
    if (!state.isRecording) {
      setState(prev => ({ ...prev, isRecording: true }));
    } else {
      setState(prev => ({ ...prev, isRecording: false, hasRecorded: true, history: [...prev.history, "完成数据录制"] }));
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDER: MENU (Dark & Beautiful) ---
  if (state.mode === AppMode.MENU) {
    return (
      <div className="h-screen w-screen bg-slate-950 relative flex items-center justify-center p-6 text-white overflow-hidden font-sans">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-5xl bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden min-h-[550px] flex relative z-10">
          
          {/* Left: Brand & Hero */}
          <div className="w-5/12 p-10 flex flex-col justify-between border-r border-white/5 bg-slate-900/40 relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
             
             <div>
                <div className="flex items-center gap-2 text-blue-400 text-xs font-mono mb-6 tracking-widest">
                   <Globe size={14}/> VIRTUAL SIMULATION SYSTEM
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                  青瞳视觉<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">动捕教学系统</span>
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  基于 Web 的高保真光学动作捕捉全流程仿真平台。支持设备校准、数据录制及实时驱动教学。
                </p>
             </div>
             
             <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-500 text-xs py-2 px-3 bg-slate-950/50 rounded border border-white/5">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <span>System Online v2.4.0</span>
                </div>
             </div>
          </div>

          {/* Right: Actions */}
          <div className="w-7/12 p-10 flex flex-col justify-center bg-slate-800/20">
             <div className="max-w-md mx-auto w-full space-y-8">
                
                <div className="space-y-3">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                     <Database size={12}/> 选择训练场景 (Scenario)
                   </label>
                   <div className="relative group">
                      <select 
                        className="w-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700 hover:border-blue-500/50 rounded-xl py-4 pl-5 pr-12 text-white font-bold focus:ring-2 focus:ring-blue-500/50 focus:outline-none appearance-none transition-all cursor-pointer shadow-lg"
                        onChange={(e) => setState(prev => ({...prev, scenario: e.target.value as Scenario}))}
                        value={state.scenario}
                      >
                        {Object.values(Scenario).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-4.5 text-slate-500 group-hover:text-blue-400 transition-colors pointer-events-none" size={20} />
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <button 
                    onClick={() => startGame(AppMode.LEARNING, state.scenario)}
                    className="group relative w-full py-4 px-6 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98] border border-blue-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    
                    <div className="relative flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg"><Zap size={20}/></div>
                          <div className="text-left">
                             <div className="text-sm opacity-80 font-medium">Start Training</div>
                             <div className="text-lg leading-none">进入学习模式</div>
                          </div>
                       </div>
                       <ArrowRight size={20} className="text-blue-200 group-hover:translate-x-1 transition-transform"/>
                    </div>
                  </button>

                  <button 
                    onClick={() => startGame(AppMode.EXAM, state.scenario)}
                    className="group relative w-full py-4 px-6 rounded-xl font-bold text-slate-300 overflow-hidden transition-all hover:bg-slate-800 hover:text-white border border-slate-700 hover:border-slate-600"
                  >
                    <div className="relative flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors"><Target size={20}/></div>
                          <div className="text-left">
                             <div className="text-sm opacity-60 font-medium">Assessment</div>
                             <div className="text-lg leading-none">进入考核模式</div>
                          </div>
                       </div>
                    </div>
                  </button>
                </div>
             </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-4 text-slate-600 text-xs font-mono">
           © 2025 CHINGMU VISUAL MOTION CAPTURE. All Rights Reserved.
        </div>
      </div>
    );
  }

  // --- RENDER: RESULTS ---
  if (state.mode === AppMode.RESULTS) {
      const isPass = state.score >= 60;
      const incorrectQuestions = EXAM_QUESTIONS.filter(q => state.examAnswers[q.id] !== q.correctAnswer);

      return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 text-white relative">
              <div className="absolute inset-0 grid-bg opacity-20"></div>
              <div className="w-full max-w-3xl bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-2 ${isPass ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  
                  {/* Score Header */}
                  <div className="p-8 text-center border-b border-slate-800 shrink-0 bg-slate-900/50">
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border-4 ${isPass ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
                         {isPass ? <CheckCircle size={32}/> : <XCircle size={32}/>}
                      </div>
                      <h2 className="text-2xl font-bold mb-1">{state.history.includes("考核超时") ? "考核超时" : (isPass ? "考核通过" : "考核未通过")}</h2>
                      <div className="text-5xl font-black tracking-tighter text-white mb-2">
                          {state.score} <span className="text-lg text-slate-500 font-normal">/ {MAX_SCORE}</span>
                      </div>
                  </div>

                  {/* Incorrect Answers List */}
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/30">
                      {incorrectQuestions.length > 0 ? (
                          <div>
                              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                  <List size={14}/> 错题回顾 ({incorrectQuestions.length})
                              </h3>
                              <div className="space-y-4">
                                  {incorrectQuestions.map((q, index) => {
                                      const userAnswerIdx = state.examAnswers[q.id];
                                      const userAnswerText = userAnswerIdx !== undefined ? q.options[userAnswerIdx] : "未作答";
                                      const correctAnswerText = q.options[q.correctAnswer];
                                      
                                      return (
                                          <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                                              <div className="flex gap-3">
                                                  <div className="text-red-500 font-mono font-bold text-lg opacity-50">#{q.id}</div>
                                                  <div className="flex-1">
                                                      <div className="font-medium text-slate-200 mb-3 text-sm md:text-base">{q.question}</div>
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                          <div className="bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 text-sm flex flex-col">
                                                              <span className="text-[10px] text-red-400 uppercase font-bold mb-0.5">您的答案</span>
                                                              <span className="text-red-300">{userAnswerText}</span>
                                                          </div>
                                                          <div className="bg-green-500/5 border border-green-500/10 rounded-lg px-3 py-2 text-sm flex flex-col">
                                                              <span className="text-[10px] text-green-400 uppercase font-bold mb-0.5">正确答案</span>
                                                              <span className="text-green-300">{correctAnswerText}</span>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </div>
                      ) : (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                              <CheckCircle size={48} className="mb-4 text-green-500"/>
                              <p>太棒了！您答对了所有题目。</p>
                          </div>
                      )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0 flex gap-3">
                      <button 
                          onClick={() => setState(prev => ({ ...prev, mode: AppMode.MENU }))}
                          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition border border-slate-700 flex items-center justify-center gap-2"
                      >
                          <Menu size={18}/> 返回主菜单
                      </button>
                      <button 
                          onClick={() => startGame(AppMode.EXAM, state.scenario)}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                      >
                          <Target size={18}/> 重新考核
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // --- RENDER: MAIN APP (Learning & Exam) ---
  const isExam = state.mode === AppMode.EXAM;
  const currentStepInfo = STEPS_INFO[state.currentStep] || { title: "Complete", description: "", hint: "" };
  
  // Dynamic Backgrounds for Immersion
  const mainBgClass = isExam 
      ? 'bg-slate-950' // Exam is strict dark
      : SCENARIO_BG[state.scenario] || 'bg-slate-900'; // Learning adapts to scenario

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar - Consistent Dark Theme */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col relative z-20 shadow-xl">
        <div className="h-16 flex items-center px-5 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg shadow-inner ${isExam ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {isExam ? <Target size={20}/> : <Zap size={20}/>}
                </div>
                <div>
                   <div className="font-bold text-white text-base leading-none">{isExam ? '理论考核' : '学习模式'}</div>
                   <div className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Mode: {isExam ? 'EXAM' : 'LEARN'}</div>
                </div>
             </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          {isExam ? (
            <div className="space-y-1 px-3">
            {EXAM_QUESTIONS.map((q, idx) => {
              const isCurrent = state.examCurrentQuestion === idx;
              const isAnswered = state.examAnswers[q.id] !== undefined;
              return (
                <button key={q.id} onClick={() => handleExamNav(idx)} 
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-200 border ${isCurrent ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' : (isAnswered ? 'bg-slate-800/50 text-slate-300 border-slate-700/50' : 'text-slate-500 border-transparent hover:bg-slate-800 hover:text-slate-200')}`}>
                  <span className="text-sm font-medium">Question {idx + 1}</span>
                  {isAnswered && !isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                </button>
              );
            })}
            </div>
          ) : (
            <div className="relative px-5">
               {/* Timeline Line */}
               <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-800"></div>
               
               <div className="space-y-6 relative">
                 {Object.values(Step).filter(s => typeof s === 'number' && s < Step.COMPLETE).map((stepVal) => {
                     const s = stepVal as Step;
                     const isActive = state.currentStep === s;
                     const isPast = state.currentStep > s;
                     return (
                       <div key={s} className="relative pl-8 group cursor-default">
                          <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 ${isActive ? 'border-blue-400 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-110' : (isPast ? 'border-blue-500/30 bg-blue-500/20' : 'border-slate-700 bg-slate-900')}`}>
                             {isPast && <div className="w-full h-full flex items-center justify-center"><Check size={8} className="text-blue-400"/></div>}
                          </div>
                          <div className={`text-sm transition-all duration-300 ${isActive ? 'text-white font-bold translate-x-1' : (isPast ? 'text-slate-400' : 'text-slate-600')}`}>
                              {STEPS_INFO[s].title.split('(')[0]}
                          </div>
                       </div>
                     );
                   })
                 }
               </div>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur">
           {isExam ? (
             <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                 <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1"><Clock size={12}/> TIME REMAINING</span>
                    <span className={`font-mono text-lg font-bold ${state.examTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{formatTime(state.examTimeLeft)}</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 ease-linear" style={{ width: `${(state.examTimeLeft / EXAM_TIME_LIMIT) * 100}%` }}></div>
                 </div>
             </div>
           ) : null}
           <button onClick={() => setState(prev => ({ ...prev, mode: AppMode.MENU }))} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition font-medium text-sm group">
               <Menu size={16} className="group-hover:-translate-x-1 transition-transform"/> 返回主菜单
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col relative transition-colors duration-700 ${mainBgClass}`}>
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>
        
        {/* Top Header Bar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/60 backdrop-blur-md z-30 sticky top-0 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  {isExam ? (
                    <span className="flex items-center gap-2"><div className="w-2 h-6 bg-orange-500 rounded-sm"></div> 理论考核 - 第 {state.examCurrentQuestion + 1} 题</span>
                  ) : (
                    <span className="flex items-center gap-2"><div className="w-2 h-6 bg-blue-500 rounded-sm"></div> {currentStepInfo.title}</span>
                  )}
              </h2>
            </div>

            <div className="flex items-center gap-3">
                 {!isExam && (
                    <div className="px-3 py-1 rounded bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono flex items-center gap-2 mr-4">
                       <Database size={12}/> SCENARIO: {state.scenario}
                    </div>
                 )}
                 
                 {!isExam && state.currentStep < Step.COMPLETE && (
                     <button onClick={nextStep} className="flex items-center gap-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95">
                        下一步 <ArrowRight size={16}/>
                     </button>
                 )}
                 {!isExam && (
                   <button onClick={useHint} className="flex items-center gap-2 text-sm font-bold text-yellow-400 hover:text-yellow-300 px-4 py-2 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/10 transition-colors">
                      <HelpCircle size={16} className={loadingHint ? 'animate-spin' : ''}/> {loadingHint ? '思考中...' : '智能提示'}
                   </button>
                 )}
            </div>
        </div>

        {/* Content Workspace */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
           {isExam ? (
             // EXAM CONTENT
             <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
                <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-700/50 rounded-2xl p-10 shadow-2xl backdrop-blur-sm relative z-10">
                    <div className="mb-8">
                       <span className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-2 block">Question {state.examCurrentQuestion + 1} / 10</span>
                       <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                           {EXAM_QUESTIONS[state.examCurrentQuestion].question}
                       </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {EXAM_QUESTIONS[state.examCurrentQuestion].options.map((opt, idx) => {
                            const isSelected = state.examAnswers[EXAM_QUESTIONS[state.examCurrentQuestion].id] === idx;
                            const letter = String.fromCharCode(65 + idx);
                            return (
                                <button 
                                    key={idx} 
                                    onClick={() => handleExamAnswer(EXAM_QUESTIONS[state.examCurrentQuestion].id, idx)} 
                                    className={`group flex items-center p-5 rounded-xl text-left transition-all border-2 relative overflow-hidden ${isSelected ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/60'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold mr-5 transition-colors shrink-0 ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-white'}`}>
                                        {letter}
                                    </div>
                                    <span className={`text-lg font-medium ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{opt}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex justify-between pt-6 border-t border-slate-800">
                        <button 
                             onClick={() => handleExamNav(Math.max(0, state.examCurrentQuestion - 1))}
                             disabled={state.examCurrentQuestion === 0}
                             className="text-slate-500 hover:text-white disabled:opacity-30 font-medium px-4 py-2"
                        >
                            <span className="flex items-center gap-2"><ArrowRight className="rotate-180" size={16}/> 上一题</span>
                        </button>

                        {state.examCurrentQuestion === EXAM_QUESTIONS.length - 1 ? (
                             <button onClick={handleExamSubmit} className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-bold text-white flex items-center gap-2 shadow-lg transition-all hover:scale-105">
                                 提交试卷 <CheckCircle size={18}/>
                             </button>
                        ) : (
                             <button 
                                 onClick={() => handleExamNav(Math.min(EXAM_QUESTIONS.length - 1, state.examCurrentQuestion + 1))}
                                 className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                             >
                                 下一题 <ArrowRight size={18}/>
                             </button>
                        )}
                    </div>
                </div>
             </div>
           ) : (
             // LEARNING CONTENT
             <div className="h-full w-full relative flex flex-col">
                {/* Step 0: Setup Suit */}
                {state.currentStep === Step.SETUP_SUIT && (
                  <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex-1 relative flex items-center justify-center p-4">
                          {viewMode === 'video' ? (
                             <div className="w-full max-w-5xl h-[80%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><Film size={16}/></div>
                                   <div>
                                     <div className="text-white font-bold text-sm">标准操作演示</div>
                                     <div className="text-slate-400 text-xs">动作捕捉标记点粘贴规范</div>
                                   </div>
                                </div>
                                <div className="w-full h-full relative">
                                    <iframe 
                                        src="//player.bilibili.com/player.html?isOutside=true&aid=339914133&bvid=BV1AR4y1c7ib&cid=555089977&p=1&autoplay=0" 
                                        scrolling="no" 
                                        frameBorder="0" 
                                        allowFullScreen={true} 
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                             </div>
                          ) : (
                             <MarkerPlacement onComplete={handleMarkerComplete} isExamMode={false} />
                          )}
                      </div>
                      
                      {/* Control Bar */}
                      <div className="h-20 bg-slate-900/80 backdrop-blur-md border-t border-white/10 flex items-center justify-center shrink-0">
                           {viewMode === 'video' ? (
                               <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
                                     <Zap size={18}/> 
                                     <span className="font-bold">观看视频学习正确操作</span>
                                  </div>
                                  <button onClick={() => setViewMode('practice')} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/30">
                                     开始练习 <ArrowRight size={16}/>
                                  </button>
                               </div>
                           ) : (
                               <div className="flex items-center gap-4">
                                  <button onClick={() => setViewMode('video')} className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold border border-slate-600 transition flex items-center gap-2">
                                     <Film size={16}/> 重看视频
                                  </button>
                                  <div className="h-8 w-px bg-slate-700"></div>
                                  <span className="text-green-400 text-sm font-bold flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                                     <Target size={16}/> 交互练习进行中
                                  </span>
                               </div>
                           )}
                      </div>
                  </div>
                )}

                {/* Other Steps */}
                {state.currentStep !== Step.SETUP_SUIT && (
                   <div className="h-full w-full flex items-center justify-center p-8">
                       {state.currentStep === Step.CALIBRATION_WAND && (
                           <div className="w-full h-full flex flex-col items-center justify-center p-4">
                               <div className="w-full max-w-5xl h-[80%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><Film size={16}/></div>
                                        <div>
                                            <div className="text-white font-bold text-sm">教学视频</div>
                                            <div className="text-slate-400 text-xs">动捕相机校准 (Camera Calibration)</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-full relative">
                                        <iframe 
                                            src="//player.bilibili.com/player.html?isOutside=true&aid=443421404&bvid=BV1dL41187HR&cid=1123705255&p=1&autoplay=0" 
                                            scrolling="no" 
                                            frameBorder="0" 
                                            allowFullScreen={true} 
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                               </div>
                               <div className="mt-6 text-slate-400 text-sm flex items-center gap-2 animate-pulse">
                                  <Zap size={16} className="text-yellow-400"/>
                                  <span>观看视频了解校准流程，随后点击右上角“下一步”继续。</span>
                               </div>
                           </div>
                       )}

                       {state.currentStep === Step.CALIBRATION_GROUND && (
                           <div className="w-full h-full flex flex-col items-center justify-center p-4">
                               <div className="w-full max-w-5xl h-[80%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><Film size={16}/></div>
                                        <div>
                                            <div className="text-white font-bold text-sm">教学视频</div>
                                            <div className="text-slate-400 text-xs">手套校准 (Glove Calibration)</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-full relative">
                                        <iframe 
                                            src="//player.bilibili.com/player.html?isOutside=true&aid=115696470072577&bvid=BV1i8m8BcEvv&cid=34646983842&p=1" 
                                            scrolling="no" 
                                            frameBorder="0" 
                                            allowFullScreen={true} 
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                               </div>
                               <div className="mt-6 text-slate-400 text-sm flex items-center gap-2 animate-pulse">
                                  <Zap size={16} className="text-yellow-400"/>
                                  <span>观看视频了解手套校准流程，随后点击右上角“下一步”继续。</span>
                               </div>
                           </div>
                       )}

                       {state.currentStep === Step.SKELETON_CREATE && (
                           <div className="w-full h-full flex flex-col items-center justify-center p-4">
                               <div className="w-full max-w-5xl h-[80%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><Film size={16}/></div>
                                        <div>
                                            <div className="text-white font-bold text-sm">教学视频</div>
                                            <div className="text-slate-400 text-xs">创建骨骼 (Skeleton Creation)</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-full relative">
                                        <iframe 
                                            src="//player.bilibili.com/player.html?isOutside=true&aid=115696453294819&bvid=BV1ihm8B8EGG&cid=34646983102&p=1" 
                                            scrolling="no" 
                                            frameBorder="0" 
                                            allowFullScreen={true} 
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                               </div>
                               <div className="mt-6 text-slate-400 text-sm flex items-center gap-2 animate-pulse">
                                  <Zap size={16} className="text-yellow-400"/>
                                  <span>观看视频了解创建骨骼流程，随后点击右上角“下一步”继续。</span>
                               </div>
                           </div>
                       )}

                       {state.currentStep === Step.DATA_RECORDING && (
                           <div className="w-full h-full flex flex-col items-center justify-center p-4">
                               <div className="w-full max-w-5xl h-[80%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative group">
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><Film size={16}/></div>
                                        <div>
                                            <div className="text-white font-bold text-sm">教学视频</div>
                                            <div className="text-slate-400 text-xs">数据录制 (Data Recording)</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-full relative">
                                        <iframe 
                                            src="//player.bilibili.com/player.html?isOutside=true&aid=115716585953912&bvid=BV1cSmvBXED2&cid=34730478842&p=1" 
                                            scrolling="no" 
                                            frameBorder="0" 
                                            allowFullScreen={true} 
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                               </div>
                               <div className="mt-6 text-slate-400 text-sm flex items-center gap-2 animate-pulse">
                                  <Zap size={16} className="text-yellow-400"/>
                                  <span>观看视频了解数据录制流程，随后点击右上角“下一步”继续。</span>
                               </div>
                           </div>
                       )}
                       
                       {/* Default Fallback for Complete or other steps */}
                       {![Step.SETUP_SUIT, Step.CALIBRATION_WAND, Step.CALIBRATION_GROUND, Step.SKELETON_CREATE, Step.DATA_RECORDING].includes(state.currentStep) && (
                          <div className="text-center w-full h-full flex flex-col items-center justify-center">
                              {state.currentStep === Step.COMPLETE ? (
                                <div className="max-w-xl text-center">
                                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/30">
                                       <CheckCircle size={48} className="text-green-500"/>
                                    </div>
                                    <h3 className="text-4xl font-black text-white mb-4">Training Complete</h3>
                                    <p className="text-slate-400 text-lg mb-8">
                                       恭喜！您已完成所有动作捕捉流程的学习任务。现在您可以返回主菜单，选择其他场景进行训练，或者进入考核模式检验您的学习成果。
                                    </p>
                                    <button 
                                      onClick={() => setState(prev => ({ ...prev, mode: AppMode.MENU }))}
                                      className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 mx-auto"
                                    >
                                       <Menu size={20}/> 返回主菜单
                                    </button>
                                </div>
                              ) : (
                                <div className="max-w-2xl">
                                    <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 rotate-3">
                                       <Database size={40}/>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">{currentStepInfo.title}</h3>
                                    <p className="text-slate-400 text-lg mb-10 leading-relaxed">{currentStepInfo.description}</p>
                                </div>
                              )}
                          </div>
                       )}
                   </div>
                )}
             </div>
           )}

           {/* Hint Overlay */}
           {currentHint && !isExam && (
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-slate-900/95 border border-yellow-500/50 text-yellow-50 p-5 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.2)] backdrop-blur-xl flex items-start gap-5 animate-in slide-in-from-bottom-10 fade-in z-50">
                   <div className="p-3 bg-yellow-500/20 rounded-xl shrink-0 border border-yellow-500/30">
                      <Zap className="text-yellow-400" size={24}/>
                   </div>
                   <div className="flex-1 pt-1">
                       <h4 className="font-bold text-yellow-400 text-sm mb-2 flex items-center gap-2 uppercase tracking-wide">
                          AI 助教提示 <span className="px-2 py-0.5 bg-yellow-500/20 text-[10px] rounded text-yellow-200">GEMINI POWERED</span>
                       </h4>
                       <p className="text-base leading-relaxed text-slate-200">{currentHint}</p>
                   </div>
                   <button onClick={() => setCurrentHint(null)} className="text-slate-500 hover:text-white transition-colors p-1">
                      <XCircle size={24}/>
                   </button>
               </div>
           )}
        </div>
        
      </div>
    </div>
  );
};

export default App;