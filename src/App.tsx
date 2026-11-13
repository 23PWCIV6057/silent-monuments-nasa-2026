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
  ChevronRight,
  ChevronLeft,
  Play,
  Copy,
  Check,
  Compass
} from 'lucide-react';
import { CHAPTERS, NSSDCA_ARTIFACTS, ArtifactItem } from './data/nasaEquipmentData';
import { MiniGameContainer } from './components/MiniGames';
import { StoryStage } from './components/StoryStage';
import { sound } from './utils/soundEngine';

type StoryBeat = 'story' | 'experiment' | 'reflection';

export function App() {
  const [activeTab, setActiveTab] = useState<'quest' | 'catalog' | 'judge'>('quest');
  const [showPrologue, setShowPrologue] = useState<boolean>(true);
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [storyBeat, setStoryBeat] = useState<StoryBeat>('story');
  const [dialogueStep, setDialogueStep] = useState<number>(0);
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
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
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
            <span className="font-display font-bold tracking-wide text-sm text-[var(--color-foreground)]">
              Silent Monuments
            </span>
          </button>

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
                    <span>
                      {chap.id}. {chapterShortNames[chap.id]}
                    </span>
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
              <span>Archive</span>
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
              <span className="hidden sm:inline">Deck</span>
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

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {activeTab === 'quest' && (
          <div className="max-w-3xl mx-auto">
            {/* PROLOGUE */}
            {showPrologue && !showCertificateModal && (
              <section className="story-beat-enter py-6 sm:py-10 text-center space-y-6">
                <StoryStage
                  chapterId={1}
                  dialogueStep={0}
                  characterName="Eagle Descent Stage & LRV-1"
                />

                <div className="space-y-3 max-w-2xl mx-auto pt-2">
                  <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    They Are Not Space Junk.{' '}
                    <span className="text-amber-400 block sm:inline">They Are Monuments.</span>
                  </h1>
                  <p className="text-base sm:text-lg text-[var(--color-muted-foreground)] leading-relaxed max-w-xl mx-auto">
                    Five worlds. Thirteen silent NASA pioneers. Hear their voices and wake their instruments one last time.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => selectChapter(1)}
                    className="min-h-[52px] px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-base flex items-center gap-2.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    <span>Begin Story</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={unlockAllForJudges}
                    className="min-h-[52px] px-5 py-3.5 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] border border-[var(--color-border)] text-xs font-mono-tech text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center gap-2 transition cursor-pointer"
                  >
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    <span>Unlock All</span>
                  </button>
                </div>
              </section>
            )}

            {/* ACTIVE CHAPTER */}
            {!showPrologue && !showCertificateModal && (
              <div className="space-y-6 story-beat-enter" key={`${activeChapterId}-${storyBeat}`}>
                {/* Mobile Chapter Switcher */}
                <div className="flex md:hidden items-center justify-center gap-1.5">
                  {CHAPTERS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectChapter(c.id)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold cursor-pointer ${
                        activeChapterId === c.id
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-[var(--color-surface)] text-[var(--color-muted-foreground)]'
                      }`}
                    >
                      {c.id}
                    </button>
                  ))}
                </div>

                {/* Clean Chapter Heading (Zero Subtext) */}
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center">
                  {currentChapter.title}
                </h1>

                {/* 3-Beat Stepper */}
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
                    <span>1. Story</span>
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
                    <span>2. Instrument</span>
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
                    <span>3. Quiz</span>
                    {isCurrentQuizDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                </div>

                {/* BEAT 1: STORY WITH 2D ANIMATED CHARACTER DIORAMA */}
                {storyBeat === 'story' && (
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-7 shadow-xl space-y-5 story-beat-enter">
                    {/* 2D Animated Character Stage (Maya + NASA Hardware Character) */}
                    <StoryStage
                      chapterId={currentChapter.id}
                      dialogueStep={dialogueStep}
                      characterName={currentChapter.characterName}
                    />

                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
                      <span className="text-xs sm:text-sm font-mono-tech text-amber-400 font-semibold">
                        {currentChapter.characterName}
                      </span>
                      <span className="text-xs font-mono-tech text-[var(--color-muted-foreground)]">
                        {dialogueStep + 1} / {currentChapter.dialogueIntro.length}
                      </span>
                    </div>

                    <blockquote
                      key={dialogueStep}
                      className="story-beat-enter text-base sm:text-lg leading-relaxed text-[var(--color-foreground)] font-normal min-h-[88px] flex items-center"
                    >
                      “{currentChapter.dialogueIntro[dialogueStep]}”
                    </blockquote>

                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-[var(--color-border)]">
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
                        <span>Back</span>
                      </button>

                      <div className="flex gap-2">
                        {currentChapter.dialogueIntro.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            aria-label={`Story part ${idx + 1}`}
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
                          <span>Next</span>
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
                          <span>Launch Instrument</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* BEAT 2: INSTRUMENT (CLEAN CANVAS, ZERO EXPLANATION CLUTTER) */}
                {storyBeat === 'experiment' && (
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-8 shadow-xl space-y-5 story-beat-enter">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-display text-lg sm:text-xl font-bold">
                        {currentChapter.miniGameTitle}
                      </h2>
                      {isCurrentGameDone && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Complete
                        </span>
                      )}
                    </div>

                    <MiniGameContainer
                      chapterId={currentChapter.id}
                      isCompleted={isCurrentGameDone}
                      onComplete={() => handleCompleteMiniGame(currentChapter.id)}
                    />

                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => setStoryBeat('story')}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Story</span>
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
                        <span>Next: Quick Quiz</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* BEAT 3: QUICK QUIZ & NEXT CHAPTER */}
                {storyBeat === 'reflection' && (
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-10 shadow-xl space-y-6 story-beat-enter">
                    <h2 className="text-lg sm:text-xl font-semibold leading-snug">
                      {currentChapter.quiz.question}
                    </h2>

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
                            className={`w-full min-h-[52px] p-4 rounded-2xl border text-left text-sm sm:text-base transition cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="font-mono-tech font-bold text-amber-400 shrink-0">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              <span>{opt}</span>
                            </div>
                            {chosen && (
                              <span className="text-xs font-mono-tech font-bold shrink-0">
                                {isCorrect ? '✓ Correct' : '✕ Try again'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => setStoryBeat('experiment')}
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-muted)] text-xs sm:text-sm font-medium flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Instrument</span>
                      </button>

                      {activeChapterId < 5 ? (
                        <button
                          type="button"
                          onClick={() => selectChapter(activeChapterId + 1)}
                          className="min-h-[48px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition"
                        >
                          <span>
                            Chapter {activeChapterId + 1}: {chapterShortNames[activeChapterId + 1]}
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
                          <span>Claim Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EPILOGUE CERTIFICATE */}
            {showCertificateModal && (
              <section className="story-beat-enter rounded-3xl border border-amber-400/50 bg-[var(--color-card)] p-6 sm:p-10 text-center space-y-6 shadow-2xl">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">
                  Deep Space Heritage Archivist Certificate
                </h2>

                <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2">
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
                    Print
                  </button>
                </div>

                <div className="max-w-xl mx-auto p-6 rounded-2xl bg-zinc-950/90 border border-amber-500/30 font-mono-tech text-xs space-y-2 text-zinc-300">
                  <div className="text-amber-400 font-bold text-sm">
                    ARCHIVIST: {explorerName.toUpperCase()}
                  </div>
                  <div className="text-emerald-400">
                    ALL 5 SOLAR SYSTEM CHAPTERS COMPLETED • NASA SPACE APPS 2026
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => selectChapter(1)}
                  className="text-xs font-mono-tech text-[var(--color-muted-foreground)] hover:text-amber-400 underline cursor-pointer"
                >
                  Restart Story
                </button>
              </section>
            )}
          </div>
        )}

        {/* ARCHIVE TAB */}
        {activeTab === 'catalog' && (
          <div className="max-w-6xl mx-auto space-y-6 story-beat-enter">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-2xl font-extrabold text-amber-400">
                NASA NSSDCA Hardware Archive (13)
              </h1>

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
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tech">
                          <span className="text-amber-400">{item.nssdcaId}</span>
                          <span className="text-cyan-400">{item.celestialBody}</span>
                        </div>
                        <h3 className="font-display font-bold text-sm leading-snug">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono-tech pt-2 border-t border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                        <span className="text-emerald-400">{item.locationName}</span>
                        <span>{item.launchYear}</span>
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
                        NSSDCA {selectedArtifact.nssdcaId}
                      </span>
                      <h2 className="font-display text-lg font-extrabold mt-0.5">
                        {selectedArtifact.name}
                      </h2>
                    </div>

                    <blockquote className="p-4 rounded-2xl bg-[var(--color-surface)] border-l-4 border-amber-400 text-sm italic text-[var(--color-foreground)]/90">
                      “{selectedArtifact.firstPersonVoice}”
                    </blockquote>

                    <p className="text-xs sm:text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                      {selectedArtifact.whyLeftBehind}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <a
                        href={selectedArtifact.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 min-h-[42px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <span>NASA Record</span>
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
                        Chapter {selectedArtifact.chapterId}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DECK & SUBMISSION TAB */}
        {activeTab === 'judge' && (
          <div className="max-w-4xl mx-auto space-y-6 story-beat-enter">
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-display text-xl sm:text-2xl font-extrabold">
                7-Slide Deck & Submission Copy
              </h1>
              <a
                href="/slides.html"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4" />
                <span>Open 7-Slide Deck</span>
              </a>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-amber-400">Summary</h3>
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
                  Silent Monuments is an interactive story quest and NSSDCA archive that brings NASA’s discarded off-world hardware back to life for school-age and casual learners.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-emerald-400">SI / AI Disclosure</h3>
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
                  Super Intelligence (SI) tools assisted with story structure, React/Canvas simulations, and Web Audio synthesis, verified against NASA NSSDCA records.
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
