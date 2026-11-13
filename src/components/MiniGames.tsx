import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  Shield,
  Activity,
  Crosshair,
  Flame
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface MiniGameProps {
  chapterId: number;
  onComplete: () => void;
  isCompleted: boolean;
}

// ============================================================================
// CHAPTER 1: 1/6-G LUNAR ROVER PHYSICS, METEORITE DODGE & TIMED LASER BOUNCE
// ============================================================================
const MoonMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'rover' | 'laser' | 'won'>('rover');
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [hull, setHull] = useState(100);
  const [laserHits, setLaserHits] = useState(0);
  const [mirrorAngle, setMirrorAngle] = useState(45);

  const keysRef = useRef<Record<string, boolean>>({});
  const stateRef = useRef({
    x: 85,
    y: 140,
    vx: 0,
    vy: 0,
    carryingId: null as number | null,
    hull: 100,
    delivered: 0,
    cores: [
      { id: 1, x: 265, y: 65, status: 'field' as 'field' | 'carried' | 'delivered', label: 'SEIS' },
      { id: 2, x: 495, y: 215, status: 'field' as 'field' | 'carried' | 'delivered', label: 'SOLAR' },
      { id: 3, x: 525, y: 75, status: 'field' as 'field' | 'carried' | 'delivered', label: 'LASER' }
    ],
    meteors: [
      { x: 310, y: 120, timer: 45, maxTimer: 95, r: 28 },
      { x: 420, y: 185, timer: 80, maxTimer: 95, r: 30 }
    ],
    // Laser phase state
    earthY: 130,
    earthDir: 1,
    turbulenceY: 140,
    turbDir: 1,
    pulseActive: false,
    pulseX: 90,
    pulseY: 130,
    pulseVx: 0,
    pulseVy: 0,
    reflected: false,
    hits: 0
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', ' '].includes(e.key)) {
        e.preventDefault();
        keysRef.current[e.key.toLowerCase()] = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const nudgeRover = (ax: number, ay: number) => {
    stateRef.current.vx += ax;
    stateRef.current.vy += ay;
  };

  const fireLaserPulse = () => {
    const s = stateRef.current;
    if (s.pulseActive) return;
    sound.playLaserPing();
    s.pulseActive = true;
    s.reflected = false;
    s.pulseX = 95;
    s.pulseY = s.earthY;
    s.pulseVx = 9.5;
    s.pulseVy = (140 - s.earthY) * 0.022;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const craters = [
      { x: 205, y: 175, r: 26 },
      { x: 355, y: 115, r: 30 },
      { x: 415, y: 215, r: 24 }
    ];

    let animId = 0;
    const loop = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, 600, 270);

      if (phase === 'rover') {
        // 1/6-g Acceleration & Low-Friction Drift
        const k = keysRef.current;
        if (k['arrowup'] || k['w']) s.vy -= 0.22;
        if (k['arrowdown'] || k['s']) s.vy += 0.22;
        if (k['arrowleft'] || k['a']) s.vx -= 0.22;
        if (k['arrowright'] || k['d']) s.vx += 0.22;

        // Low lunar friction ( rover slides on regolith!)
        s.vx *= 0.965;
        s.vy *= 0.965;
        s.x = Math.max(24, Math.min(576, s.x + s.vx));
        s.y = Math.max(24, Math.min(246, s.y + s.vy));

        // Crater bounce & damage
        craters.forEach((c) => {
          const dist = Math.hypot(s.x - c.x, s.y - c.y);
          if (dist < c.r + 12) {
            const angle = Math.atan2(s.y - c.y, s.x - c.x);
            s.vx = Math.cos(angle) * 3.2;
            s.vy = Math.sin(angle) * 3.2;
            s.hull = Math.max(10, s.hull - 4);
            setHull(Math.round(s.hull));
            sound.playAlert();
          }
        });

        // Micrometeorite Strikes
        s.meteors.forEach((m) => {
          m.timer -= 1;
          if (m.timer <= 0) {
            // Strike!
            if (Math.hypot(s.x - m.x, s.y - m.y) < m.r + 10) {
              s.hull = Math.max(10, s.hull - 15);
              setHull(Math.round(s.hull));
              s.vx += (s.x - m.x) * 0.25;
              s.vy += (s.y - m.y) * 0.25;
              sound.playAlert();
            }
            m.x = 170 + Math.random() * 380;
            m.y = 40 + Math.random() * 190;
            m.timer = m.maxTimer;
          }
        });

        // Pick up core (one at a time!)
        if (s.carryingId === null) {
          s.cores.forEach((core) => {
            if (core.status === 'field' && Math.hypot(s.x - core.x, s.y - core.y) < 24) {
              core.status = 'carried';
              s.carryingId = core.id;
              sound.playCollect();
            }
          });
        } else {
          // Deliver to Eagle Base on left (x < 115, y between 95 and 185)
          if (Math.hypot(s.x - 75, s.y - 140) < 42) {
            const carried = s.cores.find((c) => c.id === s.carryingId);
            if (carried) carried.status = 'delivered';
            s.carryingId = null;
            s.delivered += 1;
            setDeliveredCount(s.delivered);
            sound.playSuccessChord();
            if (s.delivered >= 3) {
              setPhase('laser');
            }
          }
        }

        // Draw Lunar Regolith
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(0, 0, 600, 270);

        // Draw Eagle Base Dropoff Zone
        ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(75, 140, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 10px "Space Mono", monospace';
        ctx.fillText('EAGLE DROP ZONE', 28, 94);

        // Draw Craters
        craters.forEach((c) => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fillStyle = '#0F172A';
          ctx.fill();
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Draw Incoming Meteorite Target Reticles
        s.meteors.forEach((m) => {
          const progress = 1 - m.timer / m.maxTimer;
          ctx.strokeStyle = `rgba(244, 63, 94, ${0.35 + progress * 0.65})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(244, 63, 94, ${0.18 * progress})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * progress, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw ALSEP Cores
        s.cores.forEach((core) => {
          if (core.status !== 'field') return;
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(core.x, core.y, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = '#E0F2FE';
          ctx.font = 'bold 10px "Space Mono", monospace';
          ctx.fillText(core.label, core.x - 16, core.y - 15);
        });

        // Draw LRV-1 Rover
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.fillStyle = s.carryingId ? '#38BDF8' : '#F59E0B';
        ctx.fillRect(-14, -9, 28, 18);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(-16, -12, 7, 5);
        ctx.fillRect(9, -12, 7, 5);
        ctx.fillRect(-16, 7, 7, 5);
        ctx.fillRect(9, 7, 7, 5);
        ctx.restore();
      } else {
        // PHASE 2: TIMED MOVING LASER BOUNCE
        ctx.fillStyle = '#050811';
        ctx.fillRect(0, 0, 600, 270);

        // Move Earth Receiver & Atmospheric Window
        s.earthY += s.earthDir * 1.35;
        if (s.earthY > 215 || s.earthY < 55) s.earthDir *= -1;

        s.turbulenceY += s.turbDir * 1.9;
        if (s.turbulenceY > 210 || s.turbulenceY < 60) s.turbDir *= -1;

        // Draw Earth Observatory on Left
        ctx.fillStyle = '#2563EB';
        ctx.beginPath();
        ctx.arc(65, s.earthY, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#60A5FA';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#E0F2FE';
        ctx.font = '10px "Space Mono", monospace';
        ctx.fillText('EARTH RX', 42, s.earthY + 4);

        // Draw Atmospheric Window in Center (x = 290)
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3;
        ctx.strokeRect(282, s.turbulenceY - 34, 16, 68);

        // Draw Lunar Corner-Cube Mirror on Right (x = 520, y = 135)
        ctx.save();
        ctx.translate(520, 135);
        ctx.rotate(((mirrorAngle - 45) * Math.PI) / 180);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(-6, -34, 12, 68);
        ctx.restore();

        // Update Laser Pulse if active
        if (s.pulseActive) {
          s.pulseX += s.pulseVx;
          s.pulseY += s.pulseVy;

          // Check atmospheric window at x ~ 290
          if (!s.reflected && Math.abs(s.pulseX - 290) < 8) {
            if (Math.abs(s.pulseY - s.turbulenceY) > 36) {
              // Blocked by turbulence!
              s.pulseActive = false;
              sound.playAlert();
            }
          }

          // Check Mirror Reflection at x >= 512
          if (!s.reflected && s.pulseX >= 512) {
            if (Math.abs(s.pulseY - 135) < 38) {
              s.reflected = true;
              s.pulseVx = -9.5;
              const angleOffset = (mirrorAngle - 45) * 0.14;
              s.pulseVy = -s.pulseVy + angleOffset;
              sound.playBeep(880, 0.05);
            } else {
              s.pulseActive = false;
            }
          }

          // Check Return to Moving Earth Receiver at x <= 90
          if (s.reflected && s.pulseX <= 90) {
            s.pulseActive = false;
            if (Math.abs(s.pulseY - s.earthY) <= 30) {
              s.hits += 1;
              setLaserHits(s.hits);
              sound.playSuccessChord();
              if (s.hits >= 2) {
                setPhase('won');
                onWin();
              }
            } else {
              sound.playAlert();
            }
          }

          if (s.pulseX < 0 || s.pulseX > 600 || s.pulseY < 0 || s.pulseY > 270) {
            s.pulseActive = false;
          }

          // Draw Photon Pulse
          ctx.fillStyle = s.reflected ? '#10B981' : '#38BDF8';
          ctx.beginPath();
          ctx.arc(s.pulseX, s.pulseY, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phase, mirrorAngle, onWin]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-mono-tech">
        <span className="text-amber-400 font-bold">
          {phase === 'rover'
            ? `CARRY 3 ALSEP CORES TO BASE (${deliveredCount}/3)`
            : `BOUNCE LASER THROUGH WINDOW TO EARTH (${laserHits}/2)`}
        </span>
        <span className="text-cyan-400">HULL: {hull}%</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-zinc-950">
        <canvas ref={canvasRef} width={600} height={270} className="w-full h-auto block" />
      </div>

      {phase === 'rover' && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => nudgeRover(-2.4, 0)}
            aria-label="Thrust Rover Left"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => nudgeRover(0, -2.4)}
              aria-label="Thrust Rover Up"
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => nudgeRover(0, 2.4)}
              aria-label="Thrust Rover Down"
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => nudgeRover(2.4, 0)}
            aria-label="Thrust Rover Right"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {phase !== 'rover' && (
        <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-cyan-500/30 flex flex-wrap items-center gap-4">
          <label htmlFor="mirror-angle-slider" className="text-xs font-mono-tech text-cyan-300 font-bold shrink-0">
            Mirror: {mirrorAngle}°
          </label>
          <input
            id="mirror-angle-slider"
            type="range"
            min={25}
            max={65}
            value={mirrorAngle}
            onChange={(e) => setMirrorAngle(Number(e.target.value))}
            className="flex-1 accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
          <button
            type="button"
            onClick={fireLaserPulse}
            className="min-h-[42px] px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono-tech transition cursor-pointer flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Fire Laser Pulse
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CHAPTER 2: OPPORTUNITY DUST DEVIL SURVIVAL, HIBERNATION & RAT ROCK DRILL
// ============================================================================
const MarsRoverMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drilledCount, setDrilledCount] = useState(0);
  const [battery, setBattery] = useState(88);
  const [hibernating, setHibernating] = useState(false);
  const [drillingActive, setDrillingActive] = useState(false);

  const keysRef = useRef<Record<string, boolean>>({});
  const stateRef = useRef({
    x: 75,
    y: 135,
    battery: 88,
    dust: 20,
    stormTimer: 0,
    stormWaveActive: false,
    hibernating: false,
    drilling: false,
    drilledCount: 0,
    sites: [
      { id: 1, x: 185, y: 65, progress: 0, done: false },
      { id: 2, x: 315, y: 205, progress: 0, done: false },
      { id: 3, x: 445, y: 80, progress: 0, done: false },
      { id: 4, x: 525, y: 195, progress: 0, done: false }
    ],
    devils: [
      { x: 250, y: 120, vx: 1.4, vy: 1.1, r: 24, good: false },
      { x: 420, y: 150, vx: -1.5, vy: 1.2, r: 24, good: false },
      { x: 330, y: 90, vx: 1.2, vy: -1.3, r: 22, good: true } // Cyan cleaning whirlwind!
    ]
  });

  useEffect(() => {
    stateRef.current.hibernating = hibernating;
  }, [hibernating]);

  useEffect(() => {
    stateRef.current.drilling = drillingActive;
  }, [drillingActive]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
        keysRef.current[e.key.toLowerCase()] = true;
        if (e.key === ' ') setDrillingActive(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      if (e.key === ' ') setDrillingActive(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const stepDir = (dx: number, dy: number) => {
    if (stateRef.current.hibernating) return;
    stateRef.current.x = Math.max(25, Math.min(575, stateRef.current.x + dx));
    stateRef.current.y = Math.max(25, Math.min(245, stateRef.current.y + dy));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const loop = () => {
      const s = stateRef.current;
      const k = keysRef.current;

      // Global Dust Squall cycle every ~360 frames
      s.stormTimer = (s.stormTimer + 1) % 360;
      s.stormWaveActive = s.stormTimer > 250;

      if (!s.hibernating) {
        if (k['arrowup'] || k['w']) s.y = Math.max(24, s.y - 2.3);
        if (k['arrowdown'] || k['s']) s.y = Math.min(246, s.y + 2.3);
        if (k['arrowleft'] || k['a']) s.x = Math.max(24, s.x - 2.3);
        if (k['arrowright'] || k['d']) s.x = Math.min(576, s.x + 2.3);
      }

      // Update Dust Devils & Cleaning Gusts
      s.devils.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 30 || d.x > 570) d.vx *= -1;
        if (d.y < 30 || d.y > 240) d.vy *= -1;

        if (Math.hypot(s.x - d.x, s.y - d.y) < d.r + 14) {
          if (d.good) {
            // Clean solar panels & recharge!
            s.battery = Math.min(100, s.battery + 0.45);
          } else if (!s.hibernating) {
            // Dust devil drains battery unless hibernating!
            s.battery = Math.max(5, s.battery - 0.55);
          }
        }
      });

      // Global storm wave penalty if not hibernating
      if (s.stormWaveActive && !s.hibernating) {
        s.battery = Math.max(5, s.battery - 0.18);
      } else if (!s.stormWaveActive && !s.hibernating) {
        s.battery = Math.min(100, s.battery + 0.04);
      }
      setBattery(Math.round(s.battery));

      // Check RAT Drilling on nearby Hematite outcrop
      const nearSite = s.sites.find((site) => !site.done && Math.hypot(s.x - site.x, s.y - site.y) < 30);
      if (nearSite && (s.drilling || k[' ']) && !s.hibernating && s.battery > 10) {
        nearSite.progress += 1.6;
        s.battery = Math.max(5, s.battery - 0.12);
        if (nearSite.progress >= 100) {
          nearSite.done = true;
          s.drilledCount += 1;
          setDrilledCount(s.drilledCount);
          sound.playCollect();
          if (s.drilledCount >= 4) {
            sound.playSuccessChord();
            onWin();
          }
        }
      }

      // Render Mars Surface
      ctx.fillStyle = '#431407';
      ctx.fillRect(0, 0, 600, 270);

      // Draw Hematite Drill Outcrops
      s.sites.forEach((site) => {
        ctx.beginPath();
        ctx.arc(site.x, site.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = site.done ? '#10B981' : '#3B82F6';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Drill progress ring
        if (!site.done && site.progress > 0) {
          ctx.strokeStyle = '#FBBF24';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(site.x, site.y, 19, -Math.PI / 2, -Math.PI / 2 + (site.progress / 100) * Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw Dust Devils (Red) & Wind Cleaning Gusts (Cyan)
      s.devils.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.good ? 'rgba(34, 211, 238, 0.22)' : 'rgba(244, 63, 94, 0.25)';
        ctx.fill();
        ctx.strokeStyle = d.good ? '#22D3EE' : '#F43F5E';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = d.good ? '#67E8F9' : '#FDA4AF';
        ctx.font = 'bold 9px "Space Mono", monospace';
        ctx.fillText(d.good ? 'CLEAN GUST' : 'DUST DEVIL', d.x - 28, d.y + 3);
      });

      // Draw Opportunity Rover
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.fillStyle = s.hibernating ? '#64748B' : '#2563EB';
      ctx.fillRect(-16, -10, 32, 20);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-5, -14, 10, 8);
      if (s.hibernating) {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Storm Wave Overlay
      if (s.stormWaveActive) {
        ctx.fillStyle = 'rgba(124, 45, 18, 0.48)';
        ctx.fillRect(0, 0, 600, 270);
        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 12px "Space Mono", monospace';
        ctx.fillText('GLOBAL DUST SQUALL (τ = 10.8) — ACTIVATE HIBERNATE SHIELD!', 95, 28);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [onWin]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-mono-tech">
        <span className="text-amber-400 font-bold">
          HEMATITE CORES DRILLED: {drilledCount}/4
        </span>
        <span className={battery < 30 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
          SOLAR BATTERY: {battery}%
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500/40 bg-zinc-950">
        <canvas ref={canvasRef} width={600} height={270} className="w-full h-auto block" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => stepDir(-22, 0)}
            aria-label="Drive Left"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => stepDir(0, -22)}
            aria-label="Drive Up"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => stepDir(0, 22)}
            aria-label="Drive Down"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => stepDir(22, 0)}
            aria-label="Drive Right"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={() => setDrillingActive(true)}
            onMouseUp={() => setDrillingActive(false)}
            onTouchStart={() => setDrillingActive(true)}
            onTouchEnd={() => setDrillingActive(false)}
            className={`min-h-[44px] px-4 py-2 rounded-xl font-mono-tech text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              drillingActive
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            Hold to Drill Rock (Space)
          </button>

          <button
            type="button"
            onClick={() => setHibernating((h) => !h)}
            className={`min-h-[44px] px-4 py-2 rounded-xl font-mono-tech text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              hibernating
                ? 'bg-cyan-500 text-zinc-950'
                : 'bg-zinc-800 hover:bg-zinc-700 text-cyan-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            {hibernating ? 'Wake Rover' : 'Hibernate Shield'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CHAPTER 3: INSIGHT REAL-TIME P-WAVE / S-WAVE TIMING & CORE TRIANGULATION
// ============================================================================
const InSightMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [layersUnlocked, setLayersUnlocked] = useState(0);
  const [stagePrompt, setStagePrompt] = useState('Wait for P-Wave spike to cross the gold reticle!');

  const stateRef = useRef({
    pWaveX: 360,
    sWaveX: 490,
    pLocked: false,
    sLocked: false,
    layers: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const loop = () => {
      const s = stateRef.current;
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, 600, 260);

      // Scroll P-wave and S-wave packets from right (360) to left (20) across seismogram
      s.pWaveX -= 2.1;
      s.sWaveX -= 2.1;

      if (s.sWaveX < 15) {
        // Reset wave packet if missed
        s.pWaveX = 365;
        s.sWaveX = 485;
        s.pLocked = false;
        s.sLocked = false;
        setStagePrompt('Wave passed! Catch the next P-Wave at the gold reticle.');
      }

      // Draw Target Reticle Zone at x = 110
      ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
      ctx.fillRect(92, 20, 36, 220);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(110, 20);
      ctx.lineTo(110, 240);
      ctx.stroke();

      // Draw Live Seismogram Trace
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 20; x < 365; x++) {
        const distP = Math.abs(x - s.pWaveX);
        const distS = Math.abs(x - s.sWaveX);
        const pAmp = distP < 24 ? Math.cos((distP / 24) * (Math.PI / 2)) * 42 : 0;
        const sAmp = distS < 30 ? Math.cos((distS / 30) * (Math.PI / 2)) * 75 : 0;
        const y = 130 + Math.sin(x * 0.45) * (4 + pAmp + sAmp);
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Labels for P and S packets
      if (s.pWaveX > 25 && s.pWaveX < 355) {
        ctx.fillStyle = s.pLocked ? '#10B981' : '#38BDF8';
        ctx.font = 'bold 10px "Space Mono", monospace';
        ctx.fillText(s.pLocked ? 'P-WAVE OK' : 'P-WAVE', s.pWaveX - 22, 58);
      }
      if (s.sWaveX > 25 && s.sWaveX < 355) {
        ctx.fillStyle = s.sLocked ? '#10B981' : '#F43F5E';
        ctx.font = 'bold 10px "Space Mono", monospace';
        ctx.fillText(s.sLocked ? 'S-WAVE OK' : 'S-WAVE', s.sWaveX - 22, 42);
      }

      // Right Side: Mars Interior Cross-Section
      const cx = 485;
      const cy = 130;
      // Crust
      ctx.beginPath();
      ctx.arc(cx, cy, 82, 0, Math.PI * 2);
      ctx.fillStyle = s.layers >= 1 ? '#9A3412' : '#1E293B';
      ctx.fill();
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Mantle
      ctx.beginPath();
      ctx.arc(cx, cy, 58, 0, Math.PI * 2);
      ctx.fillStyle = s.layers >= 2 ? '#D97706' : '#0F172A';
      ctx.fill();

      // Liquid Core
      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fillStyle = s.layers >= 3 ? '#FDE047' : '#020617';
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleCaptureWave = () => {
    const s = stateRef.current;
    if (!s.pLocked && Math.abs(s.pWaveX - 110) <= 32) {
      s.pLocked = true;
      sound.playCollect();
      setStagePrompt('P-Wave locked! Now capture the trailing S-Wave at the gold line!');
      return;
    }
    if (s.pLocked && !s.sLocked && Math.abs(s.sWaveX - 110) <= 36) {
      s.sLocked = true;
      s.layers += 1;
      setLayersUnlocked(s.layers);
      sound.playQuakeRumble();
      sound.playSuccessChord();
      if (s.layers >= 3) {
        setStagePrompt('All 3 Martian Interior Layers Triangulated!');
        onWin();
      } else {
        setStagePrompt(`Layer ${s.layers}/3 Mapped! Prepare for next Marsquake wave.`);
        s.pWaveX = 365;
        s.sWaveX = 485;
        s.pLocked = false;
        s.sLocked = false;
      }
      return;
    }
    sound.playAlert();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-mono-tech">
        <span className="text-cyan-400 font-bold">{stagePrompt}</span>
        <span className="text-amber-400 font-bold">MARS LAYERS: {layersUnlocked}/3</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-zinc-950">
        <canvas ref={canvasRef} width={600} height={260} className="w-full h-auto block" />
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleCaptureWave}
          className="min-h-[46px] px-8 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs sm:text-sm font-mono-tech transition cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Activity className="w-4 h-4" />
          Capture Wave Arrival at Gold Line
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CHAPTER 4: INGENUITY 60FPS PHYSICS FLIGHT SIMULATOR (GRAVITY, WIND & LANDING)
// ============================================================================
const IngenuityMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scannedCount, setScannedCount] = useState(0);
  const [windText, setWindText] = useState('Wind: Calm');
  const [statusMsg, setStatusMsg] = useState('Hover inside all 3 orange zones, then land gently');

  const keysRef = useRef<Record<string, boolean>>({});
  const thrustRef = useRef(false);

  const stateRef = useRef({
    x: 65,
    y: 175,
    vx: 0,
    vy: 0,
    windX: 0.03,
    windTimer: 0,
    landed: false,
    zones: [
      { id: 1, x: 185, y: 85, dwell: 0, done: false },
      { id: 2, x: 335, y: 70, dwell: 0, done: false },
      { id: 3, x: 465, y: 105, dwell: 0, done: false }
    ]
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
        keysRef.current[e.key.toLowerCase()] = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const nudgeHeli = (ax: number, ay: number) => {
    stateRef.current.vx += ax;
    stateRef.current.vy += ay;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const loop = () => {
      const s = stateRef.current;
      const k = keysRef.current;

      if (!s.landed) {
        // Martian crosswind shifts every 180 frames
        s.windTimer += 1;
        if (s.windTimer % 180 === 0) {
          s.windX = (Math.random() - 0.5) * 0.11;
          setWindText(s.windX > 0.02 ? 'Wind: East Gust →' : s.windX < -0.02 ? 'Wind: ← West Gust' : 'Wind: Calm');
        }

        // Gravity & Rotor Lift
        const climbing = k['arrowup'] || k['w'] || k[' '] || thrustRef.current;
        s.vy += climbing ? -0.22 : 0.12;
        if (k['arrowleft'] || k['a']) s.vx -= 0.16;
        if (k['arrowright'] || k['d']) s.vx += 0.16;
        if (k['arrowdown'] || k['s']) s.vy += 0.12;

        // Apply crosswind & air drag
        s.vx = (s.vx + s.windX) * 0.96;
        s.vy = Math.max(-3.2, Math.min(3.4, s.vy * 0.96));

        s.x = Math.max(28, Math.min(572, s.x + s.vx));
        s.y = Math.max(26, Math.min(206, s.y + s.vy));

        // Dwell inside Recon Zones to focus camera
        s.zones.forEach((z) => {
          if (!z.done && Math.hypot(s.x - z.x, s.y - z.y) < 30) {
            z.dwell += 2.2;
            if (z.dwell >= 100) {
              z.done = true;
              const count = s.zones.filter((item) => item.done).length;
              setScannedCount(count);
              sound.playCollect();
            }
          }
        });

        // Check Airfield Chi Landing Pad on right (x: 500..570, y >= 198)
        const allDone = s.zones.every((z) => z.done);
        if (allDone && s.x > 495 && s.y >= 196) {
          if (Math.abs(s.vy) < 2.3) {
            s.landed = true;
            setStatusMsg('Soft touchdown at Airfield Chi complete!');
            sound.playSuccessChord();
            onWin();
          } else {
            // Hard bounce!
            s.vy = -2.2;
            setStatusMsg('Too fast! Descend gently onto Airfield Chi.');
            sound.playAlert();
          }
        }
      }

      // Render Jezero Sky & Terrain
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(0, 0, 600, 260);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, 212, 600, 48);

      // Landing Pad on Right
      const allDone = s.zones.every((z) => z.done);
      ctx.fillStyle = allDone ? '#10B981' : '#52525B';
      ctx.fillRect(500, 206, 68, 8);
      ctx.fillStyle = '#FAFAFA';
      ctx.font = 'bold 10px "Space Mono", monospace';
      ctx.fillText('AIRFIELD CHI', 498, 200);

      // Draw Recon Zones with Camera Focus Progress Ring
      s.zones.forEach((z) => {
        ctx.beginPath();
        ctx.arc(z.x, z.y, 24, 0, Math.PI * 2);
        ctx.fillStyle = z.done ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.15)';
        ctx.fill();
        ctx.strokeStyle = z.done ? '#10B981' : '#F59E0B';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (!z.done && z.dwell > 0) {
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(z.x, z.y, 28, -Math.PI / 2, -Math.PI / 2 + (z.dwell / 100) * Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw Ingenuity Helicopter with pitch tilt
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.vx * 0.08);
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-22, -12);
      ctx.lineTo(22, -12);
      ctx.stroke();
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-7, -6, 14, 12);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [onWin]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-mono-tech">
        <span className="text-emerald-400 font-bold">
          PHOTOS FOCUSED: {scannedCount}/3 • {statusMsg}
        </span>
        <span className="text-amber-400">{windText}</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-950">
        <canvas ref={canvasRef} width={600} height={260} className="w-full h-auto block" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => nudgeHeli(-1.4, 0)}
          aria-label="Tilt Left"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onMouseDown={() => {
            thrustRef.current = true;
          }}
          onMouseUp={() => {
            thrustRef.current = false;
          }}
          onTouchStart={() => {
            thrustRef.current = true;
          }}
          onTouchEnd={() => {
            thrustRef.current = false;
          }}
          onClick={() => nudgeHeli(0, -2.2)}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono-tech font-bold text-xs cursor-pointer transition flex items-center gap-1.5"
        >
          <ArrowUp className="w-4 h-4" />
          Spin Rotors / Lift (W / Space)
        </button>

        <button
          type="button"
          onClick={() => nudgeHeli(1.4, 0)}
          aria-label="Tilt Right"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CHAPTER 5: ORBITAL GRAVITY-ASSIST SLINGSHOT & XENON ION THRUSTER PUZZLE
// ============================================================================
const DeepSpaceMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [launchAngle, setLaunchAngle] = useState(28);
  const [visitedCount, setVisitedCount] = useState(0);
  const [xenonFuel, setXenonFuel] = useState(100);

  const stateRef = useRef({
    active: false,
    x: 55,
    y: 215,
    vx: 0,
    vy: 0,
    fuel: 100,
    beacons: [
      { id: 'near', name: '433 Eros', x: 195, y: 80, hit: false },
      { id: 'dawn', name: 'Ceres', x: 355, y: 195, hit: false },
      { id: 'pioneer', name: 'Pioneer Gate', x: 535, y: 70, hit: false }
    ],
    gravityWells: [
      { name: 'Mars Gravity', x: 215, y: 155, mass: 190, r: 18, color: '#EA580C' },
      { name: 'Jupiter Gravity', x: 415, y: 105, mass: 260, r: 24, color: '#F59E0B' }
    ]
  });

  const launchProbe = () => {
    const s = stateRef.current;
    const rad = (-launchAngle * Math.PI) / 180;
    s.x = 55;
    s.y = 215;
    s.vx = Math.cos(rad) * 4.4;
    s.vy = Math.sin(rad) * 4.4;
    s.active = true;
    sound.playLaserPing();
  };

  const fireIonBurn = (dvx: number, dvy: number) => {
    const s = stateRef.current;
    if (!s.active || s.fuel <= 0) return;
    s.vx += dvx;
    s.vy += dvy;
    s.fuel = Math.max(0, s.fuel - 10);
    setXenonFuel(s.fuel);
    sound.playBeep(540, 0.03);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const loop = () => {
      const s = stateRef.current;
      ctx.fillStyle = '#05070E';
      ctx.fillRect(0, 0, 600, 260);

      if (s.active) {
        // Apply inverse-square gravitational pull from Mars & Jupiter
        s.gravityWells.forEach((g) => {
          const dx = g.x - s.x;
          const dy = g.y - s.y;
          const distSq = Math.max(400, dx * dx + dy * dy);
          const dist = Math.sqrt(distSq);
          const force = g.mass / distSq;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;

          // Crash into planet well
          if (dist < g.r + 5) {
            s.active = false;
            sound.playAlert();
          }
        });

        s.x += s.vx;
        s.y += s.vy;

        // Check Beacon Flybys
        s.beacons.forEach((b) => {
          if (!b.hit && Math.hypot(s.x - b.x, s.y - b.y) < 28) {
            b.hit = true;
            const total = s.beacons.filter((item) => item.hit).length;
            setVisitedCount(total);
            sound.playCollect();
            if (total >= 3) {
              s.active = false;
              sound.playSuccessChord();
              onWin();
            }
          }
        });

        if (s.x < 0 || s.x > 600 || s.y < 0 || s.y > 260) {
          s.active = false;
        }
      }

      // Draw Gravity Wells
      s.gravityWells.forEach((g) => {
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r * 2.1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = g.color;
        ctx.fill();
        ctx.fillStyle = '#FAFAFA';
        ctx.font = '10px "Space Mono", monospace';
        ctx.fillText(g.name, g.x - 32, g.y + g.r + 14);
      });

      // Draw Target Beacons
      s.beacons.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = b.hit ? 'rgba(16, 185, 129, 0.25)' : 'rgba(168, 85, 247, 0.2)';
        ctx.fill();
        ctx.strokeStyle = b.hit ? '#10B981' : '#A855F7';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#FAFAFA';
        ctx.font = 'bold 10px "Space Mono", monospace';
        ctx.fillText(b.name, b.x - 26, b.y - 22);
      });

      // Draw Aim Vector at Earth Launchpad
      const rad = (-launchAngle * Math.PI) / 180;
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(55, 215);
      ctx.lineTo(55 + Math.cos(rad) * 48, 215 + Math.sin(rad) * 48);
      ctx.stroke();

      // Draw Probe
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [launchAngle, onWin]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-mono-tech">
        <span className="text-purple-400 font-bold">
          GRAVITY SLINGSHOT FLYBY BEACONS: {visitedCount}/3
        </span>
        <span className="text-cyan-400 font-bold">XENON ION FUEL: {xenonFuel}%</span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-zinc-950">
        <canvas ref={canvasRef} width={600} height={260} className="w-full h-auto block" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3.5 rounded-xl border border-purple-500/30">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <label htmlFor="slingshot-angle" className="text-xs font-mono-tech text-purple-300 font-bold shrink-0">
            Angle: {launchAngle}°
          </label>
          <input
            id="slingshot-angle"
            type="range"
            min={5}
            max={75}
            value={launchAngle}
            onChange={(e) => setLaunchAngle(Number(e.target.value))}
            className="flex-1 accent-purple-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
          <button
            type="button"
            onClick={launchProbe}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold text-xs font-mono-tech cursor-pointer transition flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4" />
            Launch Probe
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono-tech text-cyan-300 mr-1">Ion Burn:</span>
          <button
            type="button"
            onClick={() => fireIonBurn(0, -0.9)}
            aria-label="Ion Burn Up"
            className="min-w-[38px] min-h-[38px] p-2 rounded-lg bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 cursor-pointer flex items-center justify-center"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => fireIonBurn(0, 0.9)}
            aria-label="Ion Burn Down"
            className="min-w-[38px] min-h-[38px] p-2 rounded-lg bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 cursor-pointer flex items-center justify-center"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => fireIonBurn(0.9, 0)}
            aria-label="Ion Burn Forward"
            className="min-w-[38px] min-h-[38px] p-2 rounded-lg bg-zinc-800 hover:bg-cyan-500 hover:text-zinc-950 cursor-pointer flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// WRAPPER COMPONENT
// ============================================================================
export const MiniGameContainer: React.FC<MiniGameProps> = ({
  chapterId,
  onComplete,
  isCompleted
}) => {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-3" key={key}>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="min-h-[34px] px-3 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        {!isCompleted && (
          <button
            type="button"
            onClick={() => {
              sound.playSuccessChord();
              onComplete();
            }}
            className="min-h-[34px] px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Skip
          </button>
        )}
      </div>

      {chapterId === 1 && <MoonMiniGame onWin={onComplete} />}
      {chapterId === 2 && <MarsRoverMiniGame onWin={onComplete} />}
      {chapterId === 3 && <InSightMiniGame onWin={onComplete} />}
      {chapterId === 4 && <IngenuityMiniGame onWin={onComplete} />}
      {chapterId === 5 && <DeepSpaceMiniGame onWin={onComplete} />}
    </div>
  );
};
