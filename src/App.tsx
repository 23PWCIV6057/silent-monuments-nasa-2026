import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Database,
  Award,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ExternalLink,
  CheckCircle2,
  Unlock,
  Sparkles,
  BookOpen,
  Radio,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  MapPin,
  FileText,
  Play,
  Copy,
  Check,
  Compass
} from 'lucide-react';
import { CHAPTERS, NSSDCA_ARTIFACTS, ArtifactItem } from './data/nasaEquipmentData';
import { MiniGameContainer } from './components/MiniGames';
import { sound } from './utils/soundEngine';

type StoryBeat = 'story' | 'experiment' | 'reflection';

export function App() {
  const [activeTab, setActiveTab] = useState<'quest' | 'catalog' | 'judge'>('quest');
  const [showPrologue, setShowPrologue] = useState<boolean>(true);
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [storyBeat, setStoryBeat] = useState<StoryBeat>('story');
  const [dialogueStep, setDialogueStep] = useState<number>(0);
  const [showFieldNotes, setShowFieldNotes] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const [completedGames, setCompletedGames] = useState<number[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<Record<number, number>>({});

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

  const selectChapter = (chapterId: number) => {
    sound.playBeep(440 + chapterId * 50, 0.05);
    setShowPrologue(false);
    setShowCertificateModal(false);
    setActiveChapterId(chapterId);
    setStoryBeat('story');
    setDialogueStep(0);
    setShowFieldNotes(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    setShowPrologue(false);
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

  const chapterShortNames: Record<number, string> = {
    1: 'The Moon',
    2: 'Mars Rovers',
    3: 'Mars Interior',
    4: 'Ingenuity',
    5: 'Deep Space'
  };

  const isLastDialogueLine = dialogueStep >= currentChapter.dialogueIntro.length - 1;
  const isCurrentGameDone = completedGames.includes(currentChapter.id);
  const isCurrentQuizDone = completedQuizzes.includes(currentChapter.id);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] story-backdrop transition-colors duration-200">
      {/* Minimal, Calm Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Title */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('quest');
              setShowPrologue(true);
              setShowCertificateModal(false);
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25 transition">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-bold tracking-wide text-sm text-[var(--color-foreground)] block leading-none">
                Silent Monuments
              </span>
              <span className="text-[11px] text-[var(--color-muted-foreground)] block mt-1">
                NASA Space Apps 2026
              </span>
            </div>
          </button>

          {/* Center Chapter Timeline Pill (only visible in Story mode after Prologue) */}
          {activeTab === 'quest' && !showPrologue && !showCertificateModal && (
            <nav
              aria-label="Story Chapters"
              className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              {CHAPTERS.map((chap) => {
                const isSelected = activeChapterId === chap.id;
                const isDone =
                  completedGames.includes(chap.id) && completedQuizzes.includes(chap.id);
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => selectChapter(chap.id)}
                    className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                        : isDone
                        ? 'text-emerald-400 hover:bg-[var(--color-muted)]'
                        : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]'
                    }`}
                  >
                    <span>{chap.id}. {chapterShortNames[chap.id]}</span>
                    {isDone && (
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-zinc-950' : 'text-emerald-400'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Quiet Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sound.playBeep(520, 0.04);
                setActiveTab('quest');
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'quest'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Story</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playBeep(580, 0.04);
                setActiveTab('catalog');
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Archive (13)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playBeep(640, 0.04);
                setActiveTab('judge');
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'judge'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">7-Slide Deck</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              className="min-w-[38px] min-h-[38px] p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] flex items-center justify-center transition cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setLightMode((m) => !m)}
              aria-label={lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="min-w-[38px] min-h-[38px] p-2 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)] flex items-center justify-center transition cursor-pointer"
            >
              {lightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ===================================================================
            VIEW 1: CALM, FOCUSED STORYTELLING FLOW (ONE SCENE AT A TIME)
        =================================================================== */}
        {activeTab === 'quest' && (
          <div className="max-w-3xl mx-auto">
            {/* SCENE A: PROLOGUE / OPENING COVER */}
            {showPrologue && !showCertificateModal && (
              <section className="story-beat-enter py-6 sm:py-10 text-center space-y-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-tech">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>An Interactive Story of NASA’s Left-Behind Pioneers</span>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                  <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    They Are Not Space Junk.{' '}
                    <span className="text-amber-400 block sm:inline">They Are Monuments.</span>
                  </h1>
                  <p className="text-base sm:text-lg text-[var(--color-muted-foreground)] leading-relaxed">
                    Across the dusty plains of the Moon, the rust-red valleys of Mars, and the dark void between worlds, thirteen NASA spacecraft rest where their fuel or sunlight finally ran out.
                  </p>
                  <p className="text-base sm:text-lg text-[var(--color-foreground)]/90 leading-relaxed">
                    Step into the boots of <strong>Junior Archivist Maya</strong>. Tune into five quiet worlds, listen to each machine tell its story in its own words, and wake its scientific instruments one last time.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => selectChapter(1)}
                    className="min-h-[52px] px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-base flex items-center gap-2.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    <span>Begin Chapter 1: The Moon</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={unlockAllForJudges}
                    className="min-h-[52px] px-5 py-3.5 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] border border-[var(--color-border)] text-xs font-mono-tech text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center gap-2 transition cursor-pointer"
                  >
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    <span>Judge Fast-Track (Unlock All 5 Chapters)</span>
                  </button>
                </div>

                {/* Subtle 5-Chapter Preview Strip */}
                <div className="pt-8 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-4">
                    Or jump directly to any of the 5 chapters in the journey:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-left">
                    {CHAPTERS.map((chap) => (
                      <button
                        key={chap.id}
                        type="button"
                        onClick={() => selectChapter(chap.id)}
                        className="p-3 rounded-xl bg-[var(--color-surface)]/70 hover:bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-amber-500/40 transition cursor-pointer"
                      >
                        <span className="text-[11px] font-mono-tech text-amber-400 block">
                          Chapter {chap.id}
                        </span>
                        <span className="text-xs font-semibold text-[var(--color-foreground)] mt-0.5 block">
                          {chapterShortNames[chap.id]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* SCENE B: ACTIVE CHAPTER — GUIDED 3-BEAT FLOW */}
            {!showPrologue && !showCertificateModal && (
              <div className="space-y-8 story-beat-enter" key={`${activeChapterId}-${storyBeat}`}>
                {/* Mobile Chapter Switcher */}
                <div className="flex md:hidden items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
                  <span className="text-xs font-mono-tech text-amber-400">
                    Chapter {currentChapter.id} of 5
                  </span>
                  <div className="flex gap-1">
                    {CHAPTERS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectChapter(c.id)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer ${
                          activeChapterId === c.id
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-[var(--color-surface)] text-[var(--color-muted-foreground)]'
                        }`}
                      >
                        {c.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapter Header */}
                <div className="text-center space-y-2">
                  <div className="text-xs font-mono-tech text-amber-400">
                    Chapter {currentChapter.id} of 5 • {currentChapter.celestialBody} ({currentChapter.yearRange})
                  </div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {currentChapter.title.replace(/^Chapter \d+:\s*/, '')}
                  </h1>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {currentChapter.subtitle}
                  </p>
                </div>

                {/* 3-Beat Story Flow Stepper */}
                <div
                  role="tablist"
                  aria-label="Chapter story steps"
                  className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={storyBeat === 'story'}
                    onClick={() => setStoryBeat('story')}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                      storyBeat === 'story'
                        ? 'bg-[var(--color-card)] text-amber-400 shadow-sm border border-amber-500/30 font-semibold'
                        : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    <span>1. The Story</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={storyBeat === 'experiment'}
                    onClick={() => setStoryBeat('experiment')}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                      storyBeat === 'experiment'
                        ? 'bg-[var(--color-card)] text-amber-400 shadow-sm border border-amber-500/30 font-semibold'
                        : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    <span>2. The Instrument</span>
                    {isCurrentGameDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={storyBeat === 'reflection'}
                    onClick={() => setStoryBeat('reflection')}
                    className={`min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                      storyBeat === 'reflection'
                        ? 'bg-[var(--color-card)] text-amber-400 shadow-sm border border-amber-500/30 font-semibold'
                        : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    <span>3. Reflection</span>
                    {isCurrentQuizDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                </div>

                {/* =========================================================
                    BEAT 1: THE STORY (FIRST-PERSON VOICE + OPTIONAL NOTES)
                ========================================================= */}
                {storyBeat === 'story' && (
                  <div className="space-y-6 story-beat-enter">
                    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-10 shadow-xl space-y-6">
                      {/* Speaker Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-xs sm:text-sm font-mono-tech text-amber-400 font-semibold">
                            {currentChapter.characterName}
                          </span>
                        </div>
                        <span className="text-xs font-mono-tech text-[var(--color-muted-foreground)]">
                          Part {dialogueStep + 1} of {currentChapter.dialogueIntro.length}
                        </span>
                      </div>

                      {/* Main Story Text — Spacious, Easy to Read */}
                      <blockquote
                        key={dialogueStep}
                        className="story-beat-enter text-lg sm:text-xl leading-relaxed text-[var(--color-foreground)] font-normal min-h-[120px] flex items-center"
                      >
                        “{currentChapter.dialogueIntro[dialogueStep]}”
                      </blockquote>

                      {/* Story Pacing Controls */}
                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
                        <button
                          type="button"
                          disabled={dialogueStep === 0}
                          onClick={() => {
                            sound.playBeep(420, 0.04);
                            setDialogueStep((s) => Math.max(0, s - 1));
                          }}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] disabled:opacity-30 text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        {/* Page Dots */}
                        <div className="flex gap-2">
                          {currentChapter.dialogueIntro.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              aria-label={`Go to story part ${idx + 1}`}
                              onClick={() => setDialogueStep(idx)}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                idx === dialogueStep
                                  ? 'w-6 bg-amber-400'
                                  : 'w-2 bg-[var(--color-muted-foreground)]/40'
                              }`}
                            />
                          ))}
                        </div>

                        {!isLastDialogueLine ? (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playBeep(560, 0.04);
                              setDialogueStep((s) => s + 1);
                            }}
                            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition"
                          >
                            <span>Continue Story</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playBeep(640, 0.06);
                              setStoryBeat('experiment');
                            }}
                            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer transition"
                          >
                            <span>Wake Up the Instrument</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Optional Collapsible Historical Field Notes (Closed by default to prevent visual clutter) */}
                    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowFieldNotes((v) => !v)}
                        aria-expanded={showFieldNotes}
                        className="w-full min-h-[48px] px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <BookOpen className="w-4 h-4 text-amber-400" />
                          <span>
                            Want the deeper history? Read NASA Field Notes & {chapterArtifacts.length} NSSDCA Records
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            showFieldNotes ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {showFieldNotes && (
                        <div className="px-5 pb-5 pt-2 border-t border-[var(--color-border)] space-y-4 text-sm leading-relaxed story-beat-enter">
                          <p className="text-[var(--color-foreground)]/90">
                            {currentChapter.scientificContext}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {chapterArtifacts.map((art) => (
                              <div
                                key={art.id}
                                className="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-xs text-amber-400">
                                    {art.name}
                                  </span>
                                  <span className="text-[11px] font-mono-tech text-[var(--color-muted-foreground)]">
                                    {art.nssdcaId}
                                  </span>
                                </div>
                                <p className="text-xs text-[var(--color-muted-foreground)]">
                                  {art.whyLeftBehind}
                                </p>
                                <div className="flex items-center justify-between pt-1 text-[11px]">
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
                                    NASA Page <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* =========================================================
                    BEAT 2: THE INSTRUMENT (FOCUSED INTERACTIVE SIMULATION)
                ========================================================= */}
                {storyBeat === 'experiment' && (
                  <div className="space-y-6 story-beat-enter">
                    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-8 shadow-xl space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-mono-tech text-amber-400">
                            Hands-On Telemetry Reconstruction
                          </span>
                          <h2 className="font-display text-lg sm:text-xl font-bold mt-0.5">
                            {currentChapter.miniGameTitle}
                          </h2>
                        </div>
                        {isCurrentGameDone && (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Telemetry Restored
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                        {currentChapter.miniGameInstruction}
                      </p>

                      <MiniGameContainer
                        chapterId={currentChapter.id}
                        isCompleted={isCurrentGameDone}
                        onComplete={() => handleCompleteMiniGame(currentChapter.id)}
                      />

                      <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                        <strong className="text-[var(--color-foreground)]">Real NASA Science: </strong>
                        {currentChapter.miniGameScienceNote}
                      </div>

                      {/* Navigation Footer */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-[var(--color-border)]">
                        <button
                          type="button"
                          onClick={() => setStoryBeat('story')}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Story</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            sound.playBeep(660, 0.05);
                            setStoryBeat('reflection');
                          }}
                          className={`min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition ${
                            isCurrentGameDone
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20'
                              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                          }`}
                        >
                          <span>Continue to Reflection</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================
                    BEAT 3: REFLECTION & NEXT DESTINATION
                ========================================================= */}
                {storyBeat === 'reflection' && (
                  <div className="space-y-6 story-beat-enter">
                    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-10 shadow-xl space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-mono-tech text-amber-400">
                          Archivist Memory Log • Chapter {currentChapter.id}
                        </span>
                        <h2 className="text-lg sm:text-xl font-semibold leading-snug">
                          {currentChapter.quiz.question}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {currentChapter.quiz.options.map((opt, idx) => {
                          const chosen = selectedQuizOption[currentChapter.id] === idx;
                          const isCorrect = idx === currentChapter.quiz.correctIndex;
                          let btnStyle =
                            'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-muted)]';
                          if (chosen && isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-200';
                          } else if (chosen && !isCorrect) {
                            btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-200';
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
                              className={`w-full min-h-[52px] p-4 rounded-2xl border text-left text-sm sm:text-base transition cursor-pointer flex items-start gap-3 ${btnStyle}`}
                            >
                              <span className="font-mono-tech font-bold text-amber-400 shrink-0 mt-0.5">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {selectedQuizOption[currentChapter.id] !== undefined && (
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed border story-beat-enter ${
                            selectedQuizOption[currentChapter.id] === currentChapter.quiz.correctIndex
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          }`}
                        >
                          <strong>
                            {selectedQuizOption[currentChapter.id] === currentChapter.quiz.correctIndex
                              ? 'Memory Verified — '
                              : 'Not quite — '}
                          </strong>
                          {currentChapter.quiz.explanation}
                        </div>
                      )}

                      {/* Footer Navigation to Next Chapter */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
                        <button
                          type="button"
                          onClick={() => setStoryBeat('experiment')}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Instrument</span>
                        </button>

                        {activeChapterId < 5 ? (
                          <button
                            type="button"
                            onClick={() => selectChapter(activeChapterId + 1)}
                            className="min-h-[48px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition"
                          >
                            <span>
                              Travel to Chapter {activeChapterId + 1}: {chapterShortNames[activeChapterId + 1]}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              sound.playSuccessChord();
                              setShowCertificateModal(true);
                            }}
                            className="min-h-[48px] px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Complete Journey & View Certificate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENE C: EPILOGUE & ARCHIVIST CERTIFICATE */}
            {showCertificateModal && (
              <section className="story-beat-enter rounded-3xl border border-amber-400/50 bg-[var(--color-card)] p-6 sm:p-10 text-center space-y-6 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono-tech">
                  <Sparkles className="w-4 h-4" />
                  <span>Epilogue • All 5 Frontiers Remembered ({totalProgress}% Verified)</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">
                  Deep Space Heritage Archivist Certificate
                </h2>

                <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] max-w-xl mx-auto leading-relaxed">
                  From Eagle’s Descent Stage on the Moon to Opportunity, InSight, Ingenuity on Mars, and Pioneer 10 drifting toward the stars, their voices and scientific legacy now live on through you.
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
                    placeholder="Enter your name"
                    className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-mono-tech text-center text-amber-300"
                  />
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono-tech shrink-0 cursor-pointer transition"
                  >
                    Print Certificate
                  </button>
                </div>

                <div className="max-w-xl mx-auto p-6 rounded-2xl bg-zinc-950/90 border border-amber-500/30 font-mono-tech text-xs space-y-2 text-zinc-300">
                  <div className="text-amber-400 font-bold text-sm">
                    JUNIOR DEEP SPACE ARCHIVIST: {explorerName.toUpperCase()}
                  </div>
                  <div>
                    MISSIONS RESTORED: Apollo 11/15 • Surveyor 3 • Viking 1/2 • Sojourner • Spirit & Opportunity • Phoenix & InSight • Ingenuity • NEAR Shoemaker • Dawn • Kepler • Pioneer 10/11
                  </div>
                  <div className="text-emerald-400">
                    2026 NASA INTERNATIONAL SPACE APPS CHALLENGE • ABANDONED BUT NOT FORGOTTEN
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => selectChapter(1)}
                    className="text-xs font-mono-tech text-[var(--color-muted-foreground)] hover:text-amber-400 underline cursor-pointer"
                  >
                    Return to Chapter 1
                  </button>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ===================================================================
            VIEW 2: COMPLETE NSSDCA 13-HARDWARE INTERACTIVE ENCYCLOPEDIA
        =================================================================== */}
        {activeTab === 'catalog' && (
          <div className="max-w-6xl mx-auto space-y-6 story-beat-enter">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-extrabold text-amber-400">
                  NASA NSSDCA Discarded Hardware Archive (13 Suites)
                </h1>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Explore every historical spacecraft, lander, rover, helicopter, and probe from the official challenge brief.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Moon', 'Mars', 'Asteroid / Dwarf Planet', 'Deep Space / Heliocentric'].map(
                  (body) => (
                    <button
                      key={body}
                      type="button"
                      onClick={() => {
                        sound.playBeep(500, 0.04);
                        setBodyFilter(body);
                      }}
                      className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        bodyFilter === body
                          ? 'bg-amber-500 text-zinc-950 font-semibold'
                          : 'bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border border-[var(--color-border)]'
                      }`}
                    >
                      {body}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10'
                          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tech">
                          <span className="text-amber-400">{item.nssdcaId}</span>
                          <span className="text-cyan-400">{item.celestialBody}</span>
                        </div>
                        <h3 className="font-display font-bold text-sm leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-2">
                          {item.tagline}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono-tech pt-2 border-t border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                        <span className="text-emerald-400">{item.status}</span>
                        <span>{item.massKg} kg</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-5">
                {selectedArtifact && (
                  <div className="sticky top-24 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-4 shadow-xl">
                    <div className="border-b border-[var(--color-border)] pb-3">
                      <span className="text-xs font-mono-tech text-amber-400">
                        NSSDCA {selectedArtifact.nssdcaId} • Launched {selectedArtifact.launchYear}
                      </span>
                      <h2 className="font-display text-lg font-extrabold mt-0.5">
                        {selectedArtifact.name}
                      </h2>
                      <p className="text-xs text-cyan-400 font-mono-tech mt-0.5">
                        {selectedArtifact.locationName} ({selectedArtifact.coordinates})
                      </p>
                    </div>

                    <blockquote className="p-4 rounded-2xl bg-[var(--color-surface)] border-l-4 border-amber-400 text-sm italic text-[var(--color-foreground)]/90">
                      “{selectedArtifact.firstPersonVoice}”
                    </blockquote>

                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <h4 className="font-semibold text-amber-400 text-xs">
                        Why It Was Left Behind
                      </h4>
                      <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                        {selectedArtifact.whyLeftBehind}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <h4 className="font-semibold text-emerald-400 text-xs">
                        Scientific Legacy
                      </h4>
                      <ul className="space-y-1 list-disc list-inside text-[var(--color-muted-foreground)]">
                        {selectedArtifact.scienceBreakthroughs.map((b, i) => (
                          <li key={i} className="leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <a
                        href={selectedArtifact.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-h-[42px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <span>Official NASA Archive</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          selectChapter(selectedArtifact.chapterId);
                          setActiveTab('quest');
                        }}
                        className="min-h-[42px] px-4 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-xs font-medium cursor-pointer transition"
                      >
                        Visit in Chapter {selectedArtifact.chapterId}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 3: SUBMISSION KIT & 7-SLIDE DECK
        =================================================================== */}
        {activeTab === 'judge' && (
          <div className="max-w-5xl mx-auto space-y-8 story-beat-enter">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <span className="text-xs font-mono-tech text-amber-400">
                  2026 NASA Space Apps Challenge Submission Kit
                </span>
                <h1 className="font-display text-2xl font-extrabold">
                  7-Slide Presentation Deck & Ready-to-Paste Copy
                </h1>
                <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)]">
                  Solo participant note: Register under a <strong>Local Event</strong> (1–6 team members allowed) so you qualify for Global Judging.
                </p>
              </div>
              <a
                href="/slides.html"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4" />
                <span>Open Fullscreen 7-Slide Deck</span>
              </a>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-amber-400">
                    High-Level Summary (Copy for Submission Form)
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        'summary',
                        'Silent Monuments is an interactive story quest and NSSDCA archive that brings NASA’s discarded off-world hardware back to life for school-age and casual learners. Stepping into the boots of Junior Archivist Maya, players journey across 5 chapters on the Moon, Mars, Asteroids, and Deep Space—hearing first-person stories from Apollo’s Moon Buggy, Opportunity, InSight, Ingenuity, and Pioneer 10, and operating each instrument in hands-on 2D simulations grounded in real NASA data.'
                      )
                    }
                    className="min-h-[34px] px-3 py-1 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedSection === 'summary' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  Silent Monuments is an interactive story quest and NSSDCA archive that brings NASA’s discarded off-world hardware back to life for school-age and casual learners. Stepping into the boots of Junior Archivist Maya, players journey across 5 chapters on the Moon, Mars, Asteroids, and Deep Space—hearing first-person stories from Apollo’s Moon Buggy, Opportunity, InSight, Ingenuity, and Pioneer 10, and operating each instrument in hands-on 2D simulations grounded in real NASA data.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-emerald-400">
                    Mandatory Super Intelligence (SI / AI) Disclosure
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        'si',
                        'In accordance with the 2026 NASA Space Apps Challenge guidelines, Super Intelligence (SI) tools were used to assist with structuring the 5-chapter interactive story flow, scaffolding the React/TypeScript UI and HTML5 2D Canvas instrument simulations, and synthesizing procedural Web Audio API sound effects. All spacecraft IDs, landing coordinates, dates, mass specifications, and scientific discoveries were verified directly against official NASA NSSDCA (nssdc.gsfc.nasa.gov) and NASA Science Mission Directorate documentation.'
                      )
                    }
                    className="min-h-[34px] px-3 py-1 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedSection === 'si' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                  In accordance with the 2026 NASA Space Apps Challenge guidelines, Super Intelligence (SI) tools were used to assist with structuring the 5-chapter interactive story flow, scaffolding the React/TypeScript UI and HTML5 2D Canvas instrument simulations, and synthesizing procedural Web Audio API sound effects. All spacecraft IDs, landing coordinates, dates, mass specifications, and scientific discoveries were verified directly against official NASA NSSDCA and NASA Science documentation.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
export default App;
