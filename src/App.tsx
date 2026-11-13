import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Compass,
  Database,
  Award,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ExternalLink,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  BookOpen,
  Radio,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Cpu,
  FileText,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { CHAPTERS, NSSDCA_ARTIFACTS, ArtifactItem } from './data/nasaEquipmentData';
import { MiniGameContainer } from './components/MiniGames';
import { sound } from './utils/soundEngine';

export function App() {
  const [activeTab, setActiveTab] = useState<'quest' | 'catalog' | 'judge'>('quest');
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [completedGames, setCompletedGames] = useState<number[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<Record<number, number>>({});
  const [dialogueStep, setDialogueStep] = useState<number>(0);
  const [bodyFilter, setBodyFilter] = useState<string>('All');
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactItem | null>(NSSDCA_ARTIFACTS[0]);
  const [muted, setMuted] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<boolean>(false);
  const [explorerName, setExplorerName] = useState<string>('Maya Lin');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const currentChapter = CHAPTERS.find((c) => c.id === activeChapterId) || CHAPTERS[0];
  const chapterArtifacts = NSSDCA_ARTIFACTS.filter((a) => a.chapterId === activeChapterId);

  useEffect(() => {
    const html = document.documentElement;
    if (lightMode) {
      html.classList.add('light');
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
      html.classList.remove('light');
    }
  }, [lightMode]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sound.muted = next;
    if (!next) sound.playBeep(660, 0.08);
  };

  const handleCompleteMiniGame = (chapterId: number) => {
    setCompletedGames((prev) => (prev.includes(chapterId) ? prev : [...prev, chapterId]));
  };

  const handleSelectQuiz = (chapterId: number, optionIdx: number, correctIdx: number) => {
    setSelectedQuizOption((prev) => ({ ...prev, [chapterId]: optionIdx }));
    if (optionIdx === correctIdx) {
      sound.playSuccessChord();
      setCompletedQuizzes((prev) => (prev.includes(chapterId) ? prev : [...prev, chapterId]));
    } else {
      sound.playAlert();
    }
  };

  const unlockAllForJudges = () => {
    sound.playSuccessChord();
    setCompletedGames([1, 2, 3, 4, 5]);
    setCompletedQuizzes([1, 2, 3, 4, 5]);
    setSelectedQuizOption({
      1: CHAPTERS[0].quiz.correctIndex,
      2: CHAPTERS[1].quiz.correctIndex,
      3: CHAPTERS[2].quiz.correctIndex,
      4: CHAPTERS[3].quiz.correctIndex,
      5: CHAPTERS[4].quiz.correctIndex
    });
  };

  const totalProgress = Math.round(
    ((completedGames.length + completedQuizzes.length) / (CHAPTERS.length * 2)) * 100
  );

  const filteredArtifacts =
    bodyFilter === 'All'
      ? NSSDCA_ARTIFACTS
      : NSSDCA_ARTIFACTS.filter((a) => a.celestialBody === bodyFilter);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    sound.playCollect();
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-200">
      {/* Top Telemetry Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold tracking-wider text-sm sm:text-base text-amber-400">
                  SILENT MONUMENTS
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-tech uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full">
                  NASA Space Apps 2026
                </span>
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)] font-mono-tech">
                Abandoned but not Forgotten: Moon, Mars & Deep Space Archive Quest
              </p>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav className="flex items-center gap-1.5" aria-label="Main Navigation">
            <button
              type="button"
              onClick={() => {
                sound.playBeep(520, 0.05);
                setActiveTab('quest');
              }}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-mono-tech font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'quest'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Story Quest ({totalProgress}%)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playBeep(580, 0.05);
                setActiveTab('catalog');
              }}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-mono-tech font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>NSSDCA Catalog (13)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playBeep(640, 0.05);
                setActiveTab('judge');
              }}
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-mono-tech font-bold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'judge'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span className="hidden md:inline">Submission & 7-Slide Deck</span>
              <span className="md:hidden">Deck</span>
            </button>
          </nav>

          {/* Utility Controls (Sound + Theme + Judge Unlock) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={unlockAllForJudges}
              title="Unlock all 5 chapters and certificate immediately for Judge evaluation"
              className="min-h-[44px] px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-1.5 transition cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span className="hidden lg:inline">Judge Unlock All</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute telemetry audio' : 'Mute telemetry audio'}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center transition cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => setLightMode((m) => !m)}
              aria-label={lightMode ? 'Switch to Dark Space Mode' : 'Switch to High-Contrast Light Mode'}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center transition cursor-pointer"
            >
              {lightMode ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ===================================================================
            TAB 1: INTERACTIVE 5-CHAPTER STORY QUEST (ZUMORRODA-X BLUEPRINT)
        =================================================================== */}
        {activeTab === 'quest' && (
          <div className="space-y-6">
            {/* Hero Story Banner */}
            <section className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-indigo-950/80 p-5 sm:p-7 text-white shadow-lg">
              <div className="max-w-3xl space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono-tech">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>DEEP SPACE NETWORK ARCHIVE QUEST • 5 PLAYABLE MISSIONS</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Bring NASA’s Silent Off-World Monuments Back to Life
                </h1>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Since the 1960s, NASA has left heroic landers, electric moon buggies, rovers, helicopters, and deep-space probes across the Solar System. Step into the boots of <strong>Junior Archivist Maya</strong>: travel across 5 celestial frontiers, hear each machine’s first-person story, and run hands-on instrument simulations powered by real <strong>NASA NSSDCA</strong> records.
                </p>
              </div>
            </section>

            {/* Chapter Selector Stepper */}
            <section aria-label="Mission Chapters" className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {CHAPTERS.map((chap) => {
                const gameDone = completedGames.includes(chap.id);
                const quizDone = completedQuizzes.includes(chap.id);
                const fullyDone = gameDone && quizDone;
                const isSelected = activeChapterId === chap.id;

                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => {
                      sound.playBeep(440 + chap.id * 60, 0.05);
                      setActiveChapterId(chap.id);
                      setDialogueStep(0);
                    }}
                    className={`min-h-[76px] p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/30'
                        : fullyDone
                        ? 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15'
                        : 'border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono-tech uppercase font-bold text-amber-400">
                        CH {chap.id} • {chap.celestialBody}
                      </span>
                      {fullyDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] font-mono-tech text-zinc-400">
                          {(gameDone ? 1 : 0) + (quizDone ? 1 : 0)}/2
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-xs line-clamp-2 mt-1">
                      {chap.title.replace(/^Chapter \d+:\s*/, '')}
                    </div>
                  </button>
                );
              })}
            </section>

            {/* Active Chapter Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): First-Person Dialogue + 2D Mini-Game */}
              <div className="lg:col-span-7 space-y-6">
                {/* First-Person Hardware Transmission Box */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
                    <div>
                      <span className="text-xs font-mono-tech text-amber-400 uppercase font-bold">
                        {currentChapter.nssdcaRef} • {currentChapter.yearRange}
                      </span>
                      <h2 className="font-display text-lg sm:text-xl font-bold mt-0.5">
                        {currentChapter.title}
                      </h2>
                    </div>
                    <a
                      href={currentChapter.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[38px] px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech flex items-center gap-1.5 transition"
                    >
                      <span>Official NASA Archive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Interactive Dialogue Console */}
                  <div className="rounded-xl bg-zinc-950 border border-amber-500/30 p-4 space-y-3 text-zinc-100">
                    <div className="flex items-center justify-between text-xs font-mono-tech text-amber-400">
                      <span className="flex items-center gap-2 font-bold">
                        <Radio className="w-4 h-4" />
                        SPEAKING: {currentChapter.characterName}
                      </span>
                      <span>
                        LOG {dialogueStep + 1} / {currentChapter.dialogueIntro.length}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base font-mono-tech leading-relaxed text-amber-100 min-h-[68px]">
                      {currentChapter.dialogueIntro[dialogueStep]}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        disabled={dialogueStep === 0}
                        onClick={() => {
                          sound.playBeep(420, 0.04);
                          setDialogueStep((s) => Math.max(0, s - 1));
                        }}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-mono-tech flex items-center gap-1 cursor-pointer transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev Transmission
                      </button>

                      <div className="flex gap-1.5">
                        {currentChapter.dialogueIntro.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              idx === dialogueStep ? 'bg-amber-400' : 'bg-zinc-700'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={dialogueStep === currentChapter.dialogueIntro.length - 1}
                        onClick={() => {
                          sound.playBeep(560, 0.04);
                          setDialogueStep((s) =>
                            Math.min(currentChapter.dialogueIntro.length - 1, s + 1)
                          );
                        }}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold text-xs font-mono-tech flex items-center gap-1 cursor-pointer transition"
                      >
                        Next Transmission
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive 2D Canvas Simulator */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm sm:text-base text-amber-400">
                        {currentChapter.miniGameTitle}
                      </h3>
                      {completedGames.includes(currentChapter.id) && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Simulation Complete
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">
                      {currentChapter.miniGameInstruction}
                    </p>

                    <MiniGameContainer
                      chapterId={currentChapter.id}
                      isCompleted={completedGames.includes(currentChapter.id)}
                      onComplete={() => handleCompleteMiniGame(currentChapter.id)}
                    />

                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 font-mono-tech">
                      {currentChapter.miniGameScienceNote}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Scientific Context + Chapter Hardware Cards + Quiz */}
              <div className="lg:col-span-5 space-y-6">
                {/* Historical & Scientific Context Card */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-400 font-mono-tech text-xs uppercase font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>Historical & Scientific Briefing</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-foreground)]/90">
                    {currentChapter.scientificContext}
                  </p>

                  {/* Artifacts Featured in This Chapter */}
                  <div className="pt-2 space-y-2">
                    <div className="text-xs font-mono-tech uppercase text-[var(--color-muted-foreground)]">
                      NSSDCA Hardware Featured in Chapter {currentChapter.id}:
                    </div>
                    <div className="space-y-2">
                      {chapterArtifacts.map((art) => (
                        <div
                          key={art.id}
                          className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs sm:text-sm text-amber-400">
                              {art.name}
                            </span>
                            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                              {art.nssdcaId}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--color-muted-foreground)]">
                            <strong>Why Left Behind:</strong> {art.whyLeftBehind}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[11px] font-mono-tech">
                            <span className="text-cyan-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {art.locationName}
                            </span>
                            <a
                              href={art.officialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-400 hover:underline flex items-center gap-1"
                            >
                              NASA Record <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chapter Science Verification Quiz */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-tech uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Archivist Science Verification Quiz
                    </span>
                    {completedQuizzes.includes(currentChapter.id) && (
                      <span className="text-xs font-mono-tech text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Verified
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-sm">{currentChapter.quiz.question}</p>

                  <div className="space-y-2">
                    {currentChapter.quiz.options.map((opt, idx) => {
                      const chosen = selectedQuizOption[currentChapter.id] === idx;
                      const isCorrect = idx === currentChapter.quiz.correctIndex;
                      let btnStyle =
                        'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-muted)]';
                      if (chosen && isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                      } else if (chosen && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            handleSelectQuiz(
                              currentChapter.id,
                              idx,
                              currentChapter.quiz.correctIndex
                            )
                          }
                          className={`w-full min-h-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm transition cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="font-mono-tech font-bold text-amber-400 shrink-0">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedQuizOption[currentChapter.id] !== undefined && (
                    <div
                      className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                        selectedQuizOption[currentChapter.id] === currentChapter.quiz.correctIndex
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                          : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      <strong>
                        {selectedQuizOption[currentChapter.id] === currentChapter.quiz.correctIndex
                          ? 'Correct! '
                          : 'Not quite — try again! '}
                      </strong>
                      {currentChapter.quiz.explanation}
                    </div>
                  )}

                  {/* Next Chapter Button */}
                  {activeChapterId < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playBeep(660, 0.06);
                        setActiveChapterId((id) => Math.min(5, id + 1));
                        setDialogueStep(0);
                      }}
                      className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono-tech transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Chapter {activeChapterId + 1}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Grand Finale Reunion & Archivist Certificate (Unlocked at 100% or via Judge Unlock) */}
            {totalProgress === 100 && (
              <section className="rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-500/15 via-zinc-900 to-emerald-500/15 p-6 sm:p-8 text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono-tech font-bold">
                  <Sparkles className="w-4 h-4" />
                  ALL 5 SOLAR SYSTEM MONUMENT ARCHIVES RESTORED!
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">
                  Official NASA Space Apps 2026 — Deep Space Heritage Archivist Certificate
                </h2>
                <p className="text-sm text-zinc-300 max-w-2xl mx-auto">
                  Congratulations! From Eagle’s Descent Stage and ALSEP’s laser mirrors on the Moon to Opportunity, InSight, Ingenuity, Dawn, NEAR Shoemaker, Kepler, and Pioneer 10, you have preserved the science of humanity’s silent pioneers.
                </p>
                <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <label htmlFor="archivist-name-input" className="sr-only">
                    Your Archivist Name
                  </label>
                  <input
                    id="archivist-name-input"
                    type="text"
                    value={explorerName}
                    onChange={(e) => setExplorerName(e.target.value)}
                    placeholder="Enter your name for the certificate"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm font-mono-tech text-center text-amber-300"
                  />
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="min-h-[44px] px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono-tech shrink-0 cursor-pointer transition"
                  >
                    Print Certificate
                  </button>
                </div>
                <div className="max-w-xl mx-auto mt-4 p-5 rounded-xl bg-zinc-950/90 border border-amber-500/40 font-mono-tech text-xs space-y-1.5 text-zinc-300">
                  <div className="text-amber-400 font-bold text-sm">
                    CERTIFIED JUNIOR DEEP SPACE ARCHIVIST: {explorerName.toUpperCase()}
                  </div>
                  <div>
                    VERIFIED MISSIONS: Apollo 11/15 • Surveyor 3 • Viking 1/2 • Sojourner • Spirit/Opportunity • Phoenix/InSight • Ingenuity • NEAR Shoemaker • Dawn • Kepler • Pioneer 10/11
                  </div>
                  <div className="text-emerald-400">
                    STATUS: 100% TELEMETRY & SCIENTIFIC LEGACY PRESERVED
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: COMPLETE NSSDCA 13-HARDWARE INTERACTIVE ENCYCLOPEDIA
        =================================================================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-amber-400">
                  Official NSSDCA Discarded Hardware Catalog (All 13 Suites)
                </h1>
                <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">
                  Every historical spacecraft, lander, rover, helicopter, and probe listed in the official 2026 Challenge Resources tab.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Moon', 'Mars', 'Asteroid / Dwarf Planet', 'Deep Space / Heliocentric'].map(
                  (body) => (
                    <button
                      key={body}
                      type="button"
                      onClick={() => {
                        sound.playBeep(500, 0.04);
                        setBodyFilter(body);
                      }}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition cursor-pointer ${
                        bodyFilter === body
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)] border border-[var(--color-border)]'
                      }`}
                    >
                      {body}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Artifact Grid (7 cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredArtifacts.map((item) => {
                  const isSelected = selectedArtifact?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        sound.playBeep(600, 0.04);
                        setSelectedArtifact(item);
                      }}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/30'
                          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tech">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold">
                            NSSDCA: {item.nssdcaId}
                          </span>
                          <span className="text-cyan-400">{item.celestialBody}</span>
                        </div>
                        <h3 className="font-display font-bold text-sm leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2">
                          {item.tagline}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono-tech pt-2 border-t border-[var(--color-border)]">
                        <span className="text-emerald-400">{item.status}</span>
                        <span>{item.massKg} kg</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed NSSDCA Inspector Dossier (5 cols) */}
              <div className="lg:col-span-5">
                {selectedArtifact && (
                  <div className="sticky top-20 rounded-2xl border border-amber-500/40 bg-[var(--color-card)] p-5 space-y-4 shadow-lg">
                    <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-3">
                      <div>
                        <span className="text-xs font-mono-tech text-amber-400 font-bold">
                          NSSDCA ID: {selectedArtifact.nssdcaId} • Launched {selectedArtifact.launchYear}
                        </span>
                        <h2 className="font-display text-lg font-extrabold mt-0.5">
                          {selectedArtifact.name}
                        </h2>
                        <p className="text-xs text-cyan-400 font-mono-tech mt-0.5">
                          Location: {selectedArtifact.locationName} ({selectedArtifact.coordinates})
                        </p>
                      </div>
                    </div>

                    <blockquote className="p-3.5 rounded-xl bg-zinc-950 border-l-4 border-amber-400 text-xs sm:text-sm font-mono-tech italic text-amber-100">
                      "{selectedArtifact.firstPersonVoice}"
                    </blockquote>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <h4 className="font-mono-tech font-bold text-amber-400 uppercase text-xs">
                        Why It Was Left Behind & Current Status
                      </h4>
                      <p className="text-[var(--color-foreground)]/90 leading-relaxed">
                        {selectedArtifact.whyLeftBehind}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <h4 className="font-mono-tech font-bold text-emerald-400 uppercase text-xs">
                        Breakthrough Science It Made Possible
                      </h4>
                      <ul className="space-y-1.5 list-disc list-inside text-[var(--color-foreground)]/90">
                        {selectedArtifact.scienceBreakthroughs.map((b, i) => (
                          <li key={i} className="leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5 text-xs font-mono-tech">
                      <div>
                        <strong className="text-cyan-400">POWER SOURCE:</strong>{' '}
                        {selectedArtifact.engineeringSpecs.powerSource}
                      </div>
                      <div>
                        <strong className="text-cyan-400">INSTRUMENTS:</strong>{' '}
                        {selectedArtifact.engineeringSpecs.primaryInstruments}
                      </div>
                      <div>
                        <strong className="text-cyan-400">ACTIVE DURATION:</strong>{' '}
                        {selectedArtifact.engineeringSpecs.missionDuration}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={selectedArtifact.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono-tech flex items-center justify-center gap-2 transition"
                      >
                        <span>Open Official NASA / NSSDCA Page</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveChapterId(selectedArtifact.chapterId);
                          setActiveTab('quest');
                        }}
                        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-mono-tech text-xs font-bold cursor-pointer transition"
                      >
                        Play Chapter {selectedArtifact.chapterId}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: READY-TO-SUBMIT KIT (7-SLIDE DECK, 30s SCRIPT, SI DISCLOSURE)
        =================================================================== */}
        {activeTab === 'judge' && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-500/40 bg-[var(--color-card)] p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono-tech uppercase text-amber-400 font-bold">
                    2026 NASA SPACE APPS SUBMISSION KIT • READY TO COPY & PASTE
                  </span>
                  <h1 className="font-display text-2xl font-extrabold mt-0.5">
                    7-Slide Presentation Deck, 30s Video Script & Mandatory SI Disclosure
                  </h1>
                </div>
                <a
                  href="/slides.html"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono-tech flex items-center gap-2 transition"
                >
                  <Play className="w-4 h-4" />
                  <span>Open Fullscreen 7-Slide Deck (/slides.html)</span>
                </a>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">
                Important Reminder from the <strong>2026 Judging & Awards Guide</strong>: Because you are competing <strong>solo (1 person)</strong>, make sure your registration on <code>spaceappschallenge.org</code> is set to a <strong>Local Event</strong> (which allows 1–6 members) rather than the Universal Event (which requires 2–6 members) so you qualify for Global Judging!
              </p>
            </div>

            {/* 7-Slide Presentation Preview Grid */}
            <section className="space-y-3">
              <h2 className="font-display text-lg font-bold text-amber-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Official 7-Slide Presentation Outline (Strict 7-Slide Limit Compliant)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    slide: 'Slide 1 — Title & Mission Hook',
                    title: 'SILENT MONUMENTS: Echoes of Moon, Mars & Deep Space',
                    bullets: [
                      'Challenge: Abandoned but not Forgotten (2026 NASA Space Apps)',
                      'Tagline: Turning NASA’s discarded off-world hardware into an interactive 2D retro-telemetry adventure for school-age & casual learners.',
                      'Live Demo + Open-Source Repository + 13 NSSDCA Archives.'
                    ]
                  },
                  {
                    slide: 'Slide 2 — The Problem & Educational Gap',
                    title: 'Why "Space Junk" Is Actually Priceless Human Heritage',
                    bullets: [
                      'Students hear about active rovers like Perseverance, but rarely learn about the 60+ years of silent pioneers that made today’s missions possible.',
                      'Dense technical archives (NSSDCA) are hard for younger learners to explore without narrative context or interactive play.'
                    ]
                  },
                  {
                    slide: 'Slide 3 — Our Solution & Story Quest Architecture',
                    title: 'Stepping Into Junior Archivist Maya’s Boots',
                    bullets: [
                      '5 Story-Driven Chapters across the Moon, Mars, Asteroids (433 Eros & Ceres), and Deep Space.',
                      'First-person hardware transmissions ("I am Eagle’s Descent Stage...", "I am Opportunity...") connect engineering trade-offs to human emotion.'
                    ]
                  },
                  {
                    slide: 'Slide 4 — 5 Hands-On 2D Instrument Mini-Games',
                    title: 'Learning Real Space Physics Through Play',
                    bullets: [
                      'Ch 1: Apollo 15 LRV Crater Traverse + ALSEP 45° Laser Retroreflector Lock.',
                      'Ch 2: Opportunity Hematite Survey + 2018 Dust Storm (Tau Opacity) Slider.',
                      'Ch 3–5: InSight Marsquake Core Tuner, Ingenuity 2,400 RPM Flight, & 70m DSN Dish Decoder.'
                    ]
                  },
                  {
                    slide: 'Slide 5 — Grounding in Authentic NASA & NSSDCA Data',
                    title: '100% Complete Coverage of All 13 Challenge Resource Suites',
                    bullets: [
                      'Direct NSSDCA IDs, coordinates, launch/end dates, and specs for Apollo LM, LRV, ALSEP, Surveyor, Viking 1/2, Sojourner, Spirit/Oppy, Phoenix/InSight, Ingenuity, NEAR, Dawn, Kepler & Pioneer 10/11.',
                      'Interactive Encyclopedia with direct links to nssdc.gsfc.nasa.gov.'
                    ]
                  },
                  {
                    slide: 'Slide 6 — Technical Stack, Accessibility & SI Usage',
                    title: 'Zero-Budget, Browser-First, Accessible Anywhere',
                    bullets: [
                      'Built with React, TypeScript, Tailwind CSS, HTML5 2D Canvas, and a custom zero-dependency Web Audio API procedural telemetry synthesizer.',
                      'WCAG contrast compliant (Dark/Light modes), keyboard + touch controls, and transparent Super Intelligence (SI) disclosure.'
                    ]
                  },
                  {
                    slide: 'Slide 7 — Impact, Classroom Value & Future Roadmap',
                    title: 'Inspiring the Artemis Generation',
                    bullets: [
                      'Includes an instant-print Junior Deep Space Archivist Certificate for classrooms and museums.',
                      'Future expansion: WebXR 3D surface inspection of Apollo & Mars landing sites using LRO and HiRISE digital elevation models.'
                    ]
                  }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-2"
                  >
                    <div className="text-xs font-mono-tech text-amber-400 font-bold">{s.slide}</div>
                    <h3 className="font-display font-bold text-sm">{s.title}</h3>
                    <ul className="text-xs text-[var(--color-muted-foreground)] space-y-1 list-disc list-inside">
                      {s.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Copy-Paste Submission Fields */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 30-Second Video Script */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-cyan-400">
                    30-Second Demo Video Script (Strict 30s Limit)
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        'video',
                        `[0:00–0:06] Since the 1960s, NASA has left heroic machines across the Solar System—not as junk, but as monuments to discovery. Welcome to Silent Monuments!\n[0:06–0:15] As Junior Archivist Maya, students journey across 5 chapters on the Moon, Mars, and Deep Space—hearing first-person transmissions from Apollo’s Moon Buggy, Opportunity, InSight, Ingenuity, and Pioneer 10.\n[0:15–0:24] In 5 hands-on 2D mini-games grounded in NASA’s NSSDCA archive, players bounce Earth lasers off Apollo retroreflectors, survive Mars’s 2018 dust storm, tune marsquake waves, and fly Ingenuity at 2,400 RPM.\n[0:24–0:30] Complete the archive to earn your Junior Space Archivist Certificate—preserving NASA’s silent pioneers for the Artemis generation!`
                      )
                    }
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-tech text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedSection === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'video' ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-zinc-950 text-zinc-300 text-xs font-mono-tech whitespace-pre-wrap leading-relaxed">
{`[0:00–0:06] Since the 1960s, NASA has left heroic machines across the Solar System—not as junk, but as monuments to discovery. Welcome to Silent Monuments!
[0:06–0:15] As Junior Archivist Maya, students journey across 5 chapters on the Moon, Mars, and Deep Space—hearing first-person transmissions from Apollo’s Moon Buggy, Opportunity, InSight, Ingenuity, and Pioneer 10.
[0:15–0:24] In 5 hands-on 2D mini-games grounded in NASA’s NSSDCA archive, players bounce Earth lasers off Apollo retroreflectors, survive Mars’s 2018 dust storm, tune marsquake waves, and fly Ingenuity at 2,400 RPM.
[0:24–0:30] Complete the archive to earn your Junior Space Archivist Certificate—preserving NASA’s silent pioneers for the Artemis generation!`}
                </pre>
              </div>

              {/* Mandatory SI / AI Disclosure Text */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-emerald-400">
                    Mandatory Super Intelligence (SI / AI) Disclosure
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        'si',
                        `Use of Super Intelligence (SI) Tools:\nIn accordance with the 2026 NASA Space Apps Challenge rules, Super Intelligence (SI) coding and design assistants were used as supportive development tools:\n1. Architecture & Ideation: Assisted in structuring the 5-chapter interactive story flow and designing the HTML5 Canvas 2D physics/telemetry mini-games.\n2. Code Implementation & Accessibility: Assisted in writing TypeScript/React components, responsive Tailwind CSS styling, and the procedural Web Audio API sound synthesizer.\n3. Scientific Verification: All spacecraft parameters, NSSDCA IDs, coordinates, mission durations, and scientific discoveries were cross-verified directly against official NASA NSSDCA (nssdc.gsfc.nasa.gov) and NASA Science Mission Directorate archives.`
                      )
                    }
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono-tech text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedSection === 'si' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'si' ? 'Copied!' : 'Copy SI Text'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-zinc-950 text-zinc-300 text-xs font-mono-tech whitespace-pre-wrap leading-relaxed">
{`Use of Super Intelligence (SI) Tools:
In accordance with the 2026 NASA Space Apps Challenge rules, Super Intelligence (SI) coding and design assistants were used as supportive development tools:
1. Architecture & Ideation: Assisted in structuring the 5-chapter interactive story flow and designing the HTML5 Canvas 2D physics/telemetry mini-games.
2. Code Implementation & Accessibility: Assisted in writing TypeScript/React components, responsive Tailwind CSS styling, and the procedural Web Audio API sound synthesizer.
3. Scientific Verification: All spacecraft parameters, NSSDCA IDs, coordinates, mission durations, and scientific discoveries were cross-verified directly against official NASA NSSDCA (nssdc.gsfc.nasa.gov) and NASA Science Mission Directorate archives.`}
                </pre>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer with Direct NASA References */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/60 py-5 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--color-muted-foreground)] font-mono-tech">
          <div>
            <strong>SILENT MONUMENTS</strong> • Built for the 2026 NASA Space Apps Challenge (
            <em>Abandoned but not Forgotten</em>)
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://nssdc.gsfc.nasa.gov/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 underline"
            >
              NASA NSSDCA Master Archive
            </a>
            <a
              href="https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 underline"
            >
              Official 2026 Challenge Page
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
