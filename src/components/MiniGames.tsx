import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Radio,
  Sun,
  Wind,
  Activity,
  Compass,
  Zap
} from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface MiniGameProps {
  chapterId: number;
  onComplete: () => void;
  isCompleted: boolean;
}

// ============================================================================
// CHAPTER 1 MINI-GAME: LRV Crater Traverse + ALSEP Laser Retroreflector Lock
// ============================================================================
const MoonMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'rover' | 'laser' | 'done'>('rover');
  const [roverPos, setRoverPos] = useState({ x: 60, y: 150 });
  const [battery, setBattery] = useState(100);
  const [nodes, setNodes] = useState([
    { id: 1, x: 200, y: 80, deployed: false, label: 'ALSEP Seismometer' },
    { id: 2, x: 360, y: 210, deployed: false, label: 'Solar Wind Spec' },
    { id: 3, x: 500, y: 110, deployed: false, label: 'Laser Retroreflector' }
  ]);
  const [mirrorAngle, setMirrorAngle] = useState(28); // Target is 45 deg (+/- 3)
  const [laserLocked, setLaserLocked] = useState(false);

  const craters = [
    { x: 150, y: 190, r: 26 },
    { x: 280, y: 130, r: 30 },
    { x: 430, y: 90, r: 24 },
    { x: 440, y: 225, r: 22 }
  ];

  const moveRover = useCallback(
    (dx: number, dy: number) => {
      if (phase !== 'rover') return;
      sound.playBeep(240, 0.04, 'triangle', 0.05);
      setRoverPos((prev) => {
        const nx = Math.max(28, Math.min(572, prev.x + dx));
        const ny = Math.max(28, Math.min(252, prev.y + dy));

        // Check crater collision
        const hitCrater = craters.some((c) => Math.hypot(nx - c.x, ny - c.y) < c.r + 10);
        if (hitCrater) {
          sound.playAlert();
          setBattery((b) => Math.max(10, b - 6));
          return prev;
        }

        setBattery((b) => Math.max(5, +(b - 0.6).toFixed(1)));

        // Check node deployment
        setNodes((currNodes) => {
          let changed = false;
          const updated = currNodes.map((n) => {
            if (!n.deployed && Math.hypot(nx - n.x, ny - n.y) < 30) {
              changed = true;
              return { ...n, deployed: true };
            }
            return n;
          });
          if (changed) {
            sound.playCollect();
            if (updated.every((u) => u.deployed)) {
              setTimeout(() => setPhase('laser'), 450);
            }
          }
          return updated;
        });

        return { x: nx, y: ny };
      });
    },
    [phase]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (phase === 'rover') {
        if (['ArrowUp', 'w', 'W'].includes(e.key)) {
          e.preventDefault();
          moveRover(0, -18);
        } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
          e.preventDefault();
          moveRover(0, 18);
        } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
          e.preventDefault();
          moveRover(-18, 0);
        } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
          e.preventDefault();
          moveRover(18, 0);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moveRover, phase]);

  // Draw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 600, 280);

    if (phase === 'rover') {
      // Lunar regolith background
      ctx.fillStyle = '#181820';
      ctx.fillRect(0, 0, 600, 280);

      // Stars on horizon
      ctx.fillStyle = '#09090D';
      ctx.fillRect(0, 0, 600, 36);
      for (let i = 0; i < 35; i++) {
        ctx.fillStyle = i % 3 === 0 ? '#F59E0B' : '#E4E4E7';
        ctx.fillRect((i * 73) % 590, (i * 19) % 30, 2, 2);
      }

      // Apollo LM Eagle Descent Stage at start
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(16, 134, 24, 20);
      ctx.fillStyle = '#71717A';
      ctx.fillRect(12, 154, 32, 5);
      ctx.fillStyle = '#FAFAFA';
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillText('LM EAGLE', 10, 128);

      // Draw Craters
      craters.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = '#0D0D12';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3F3F46';
        ctx.stroke();
      });

      // Draw ALSEP Nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 13, 0, Math.PI * 2);
        ctx.fillStyle = n.deployed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.2)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = n.deployed ? '#10B981' : '#38BDF8';
        ctx.stroke();

        // Pixel icon inside node
        ctx.fillStyle = n.deployed ? '#10B981' : '#38BDF8';
        ctx.fillRect(n.x - 4, n.y - 4, 8, 8);
        ctx.font = '10px "Space Mono", monospace';
        ctx.fillStyle = n.deployed ? '#6EE7B7' : '#BAE6FD';
        ctx.fillText(n.deployed ? 'DEPLOYED' : n.label, n.x - 32, n.y - 18);
      });

      // Draw Pixel LRV-1 Moon Buggy
      ctx.save();
      ctx.translate(roverPos.x, roverPos.y);
      // Wheels
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-14, -11, 7, 5);
      ctx.fillRect(7, -11, 7, 5);
      ctx.fillRect(-14, 6, 7, 5);
      ctx.fillRect(7, 6, 7, 5);
      // Chassis
      ctx.fillStyle = '#E4E4E7';
      ctx.fillRect(-11, -7, 22, 14);
      // High-gain umbrella antenna
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(4, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // PHASE 2: LASER RETROREFLECTOR ALIGNMENT
      ctx.fillStyle = '#070913';
      ctx.fillRect(0, 0, 600, 280);

      // Earth Observatory on Left
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(65, 140, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10B981';
      ctx.fillRect(50, 125, 18, 22);
      ctx.fillStyle = '#FAFAFA';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.fillText('EARTH (McDonald Obs.)', 16, 90);

      // Moon & ALSEP Retroreflector on Right
      ctx.fillStyle = '#27272A';
      ctx.beginPath();
      ctx.arc(520, 140, 52, 0, Math.PI * 2);
      ctx.fill();

      // Mirror Array at (475, 140)
      ctx.save();
      ctx.translate(475, 140);
      ctx.rotate(((mirrorAngle - 45) * Math.PI) / 180);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(-5, -26, 10, 52);
      ctx.strokeStyle = '#FAFAFA';
      ctx.lineWidth = 2;
      ctx.strokeRect(-5, -26, 10, 52);
      ctx.restore();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.fillText('MOON (ALSEP LRRR)', 440, 74);

      // Incoming Green Laser Pulse (Earth -> Moon)
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(101, 140);
      ctx.lineTo(470, 140);
      ctx.stroke();

      // Reflected Laser Pulse
      const angleError = mirrorAngle - 45;
      const returnY = 140 + angleError * 4.2;
      ctx.strokeStyle = Math.abs(angleError) <= 2 ? '#10B981' : '#F43F5E';
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(470, 140);
      ctx.lineTo(101, returnY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = Math.abs(angleError) <= 2 ? '#4ADE80' : '#FB7185';
      ctx.font = '12px "Space Mono", monospace';
      ctx.fillText(
        Math.abs(angleError) <= 2
          ? 'PHOTON RETURN LOCKED! RTT: 2.5644 sec (384,400 km)'
          : `BEAM OFFSET: ${angleError > 0 ? '+' : ''}${angleError}° (Target: 45° Corner-Cube Lock)`,
        135,
        255
      );
    }
  }, [phase, roverPos, nodes, mirrorAngle]);

  const handleLockLaser = () => {
    if (Math.abs(mirrorAngle - 45) <= 2) {
      sound.playLaserPing();
      sound.playSuccessChord();
      setLaserLocked(true);
      setPhase('done');
      onWin();
    } else {
      sound.playAlert();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-mono-tech">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold">
            {phase === 'rover' ? 'STAGE 1/2: LRV-1 TRAVERSE' : 'STAGE 2/2: ALSEP LASER LOCK'}
          </span>
          <span className="text-zinc-400">
            NODES: {nodes.filter((n) => n.deployed).length}/3 DEPLOYED
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">36V Ag-Zn BATTERY: {battery}%</span>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/40 bg-zinc-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={600}
          height={280}
          className="w-full h-auto block"
          aria-label="Lunar Roving Vehicle and ALSEP Laser Retroreflector simulation canvas"
        />
      </div>

      {phase === 'rover' && (
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => moveRover(-22, 0)}
            aria-label="Drive Rover Left"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => moveRover(0, -22)}
              aria-label="Drive Rover Up"
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => moveRover(0, 22)}
              aria-label="Drive Rover Down"
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => moveRover(22, 0)}
            aria-label="Drive Rover Right"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {phase === 'laser' && (
        <div className="bg-zinc-900/80 p-4 rounded-xl border border-cyan-500/40 flex flex-wrap items-center gap-4">
          <label htmlFor="mirror-angle-slider" className="text-xs font-mono-tech text-cyan-300 font-bold shrink-0">
            Mirror Angle: {mirrorAngle}° (Target: 45°)
          </label>
          <input
            id="mirror-angle-slider"
            type="range"
            min={15}
            max={75}
            value={mirrorAngle}
            onChange={(e) => {
              setMirrorAngle(Number(e.target.value));
              sound.playBeep(520 + Number(e.target.value) * 5, 0.03, 'sine', 0.04);
            }}
            className="flex-1 accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
          />
          <button
            type="button"
            onClick={handleLockLaser}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono-tech transition cursor-pointer flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Fire Laser
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CHAPTER 2 MINI-GAME: Opportunity Hematite Survey & 2018 Dust Storm Slider
// ============================================================================
const MarsRoverMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tauOpacity, setTauOpacity] = useState(1.2); // Interactive educational dust storm slider
  const [rover, setRover] = useState({ x: 70, y: 140 });
  const [solarPower, setSolarPower] = useState(82);
  const [dustCoat, setDustCoat] = useState(28);
  const [blueberries, setBlueberries] = useState([
    { id: 1, x: 180, y: 70, scanned: false },
    { id: 2, x: 260, y: 205, scanned: false },
    { id: 3, x: 370, y: 95, scanned: false },
    { id: 4, x: 470, y: 210, scanned: false },
    { id: 5, x: 530, y: 120, scanned: false }
  ]);
  const [windGusts] = useState([
    { x: 220, y: 135, r: 28 },
    { x: 420, y: 150, r: 30 }
  ]);
  const [won, setWon] = useState(false);

  const stepRover = useCallback(
    (dx: number, dy: number) => {
      if (won) return;
      sound.playBeep(310, 0.04, 'triangle', 0.05);
      setRover((prev) => {
        const nx = Math.max(25, Math.min(575, prev.x + dx));
        const ny = Math.max(35, Math.min(250, prev.y + dy));

        // Check wind gust cleaning event
        const inWind = windGusts.some((w) => Math.hypot(nx - w.x, ny - w.y) < w.r + 12);
        if (inWind) {
          sound.playLaserPing();
          setDustCoat(5);
          setSolarPower(100);
        } else {
          setDustCoat((d) => Math.min(90, d + 4));
          setSolarPower((p) => Math.max(15, p - 3));
        }

        // Check hematite blueberry scan
        setBlueberries((curr) => {
          let hit = false;
          const next = curr.map((b) => {
            if (!b.scanned && Math.hypot(nx - b.x, ny - b.y) < 26) {
              hit = true;
              return { ...b, scanned: true };
            }
            return b;
          });
          if (hit) {
            sound.playCollect();
            if (next.every((item) => item.scanned)) {
              setWon(true);
              sound.playSuccessChord();
              onWin();
            }
          }
          return next;
        });

        return { x: nx, y: ny };
      });
    },
    [won, windGusts, onWin]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        stepRover(0, -20);
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        stepRover(0, 20);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        stepRover(-20, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        stepRover(20, 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stepRover]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Meridiani Planum Rust Terrain
    ctx.fillStyle = '#3B180E';
    ctx.fillRect(0, 0, 600, 280);

    // Martian Sky band tinted by Tau Opacity
    const skyDarkness = Math.min(0.88, tauOpacity / 12);
    ctx.fillStyle = `rgba(18, 8, 5, ${0.25 + skyDarkness * 0.7})`;
    ctx.fillRect(0, 0, 600, 280);

    // Draw Wind Gust Cleaning Zones
    windGusts.forEach((w) => {
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.fill();
      ctx.strokeStyle = '#22D3EE';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#67E8F9';
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillText('WIND CLEANING EVENT', w.x - 52, w.y - w.r - 6);
    });

    // Draw Hematite Blueberries
    blueberries.forEach((b) => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = b.scanned ? '#10B981' : '#3B82F6';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FAFAFA';
      ctx.stroke();
      ctx.fillStyle = '#FAFAFA';
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillText(b.scanned ? 'Fe2O3 OK' : 'HEMATITE', b.x - 24, b.y - 15);
    });

    // Draw Opportunity Rover
    ctx.save();
    ctx.translate(rover.x, rover.y);
    // Wing solar panels
    ctx.fillStyle = dustCoat > 60 ? '#9A3412' : '#1D4ED8';
    ctx.fillRect(-18, -10, 36, 20);
    // Mastcam head
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-4, -15, 8, 8);
    ctx.restore();
  }, [rover, blueberries, windGusts, dustCoat, tauOpacity]);

  const estimatedWattHours = Math.max(18, Math.round(720 * Math.exp(-0.34 * tauOpacity)));

  return (
    <div className="space-y-4">
      {/* Interactive Dust Storm Slider */}
      <div className="bg-zinc-900/90 border border-orange-500/30 rounded-xl p-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech">
          <span className="text-orange-400 font-bold flex items-center gap-1.5">
            <Sun className="w-4 h-4" />
            Dust Opacity (τ = {tauOpacity.toFixed(1)})
          </span>
          <span className={tauOpacity > 6 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            Solar Output: ~{estimatedWattHours} Wh/sol
          </span>
        </div>
        <input
          type="range"
          min={0.5}
          max={10.8}
          step={0.1}
          value={tauOpacity}
          onChange={(e) => setTauOpacity(Number(e.target.value))}
          aria-label="Mars Atmospheric Dust Storm Opacity Tau Slider"
          className="w-full accent-orange-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-mono-tech">
        <span className="text-amber-400 font-bold">
          Hematite Scanned: {blueberries.filter((b) => b.scanned).length}/5
        </span>
        <span className="text-cyan-400">
          Solar Power: {solarPower}%
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-orange-500/40 bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={600}
          height={280}
          className="w-full h-auto block"
          aria-label="Opportunity Mars Rover Hematite Survey and Wind Cleaning Simulation"
        />
      </div>

      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => stepRover(-24, 0)}
          aria-label="Drive Opportunity Left"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => stepRover(0, -24)}
            aria-label="Drive Opportunity Up"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => stepRover(0, 24)}
            aria-label="Drive Opportunity Down"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => stepRover(24, 0)}
          aria-label="Drive Opportunity Right"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-orange-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CHAPTER 3 MINI-GAME: InSight SEIS Marsquake Waveform Tuner & Core Mapper
// ============================================================================
const InSightMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windShield, setWindShield] = useState(40); // Target: >= 85%
  const [freqFilter, setFreqFilter] = useState(2.2); // Target for current quake
  const [quakeIndex, setQuakeIndex] = useState(0);

  const quakes = [
    {
      name: 'Event S0173a (Cerberus Fossae)',
      targetFreq: 3.5,
      depthNote: 'Crustal Boundary Detected: 39 km thickness',
      magnitude: 'Mag 3.7'
    },
    {
      name: 'Event S0976a (Far-Side Core Shadow)',
      targetFreq: 5.0,
      depthNote: 'Mantle Lithosphere Mapped: 400–600 km depth',
      magnitude: 'Mag 4.2'
    },
    {
      name: 'Event S1222a (Largest Recorded Marsquake)',
      targetFreq: 6.5,
      depthNote: 'Liquid Iron-Sulfur Core Verified: 1,830 km radius!',
      magnitude: 'Mag 4.7'
    }
  ];

  const currentQuake = quakes[Math.min(quakeIndex, quakes.length - 1)];
  const isAligned =
    windShield >= 80 && Math.abs(freqFilter - currentQuake.targetFreq) <= 0.4;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, 600, 260);

    // Left Side: Seismogram Waveform
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let y = 30; y < 240; y += 35) {
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo(360, y);
      ctx.stroke();
    }

    // Target Waveform (Cyan Ghost)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 20; x < 355; x++) {
      const env = Math.sin(((x - 20) / 335) * Math.PI);
      const y =
        130 +
        Math.sin(x * currentQuake.targetFreq * 0.04) * 52 * env +
        Math.cos(x * 0.11) * 16 * env;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Player Filtered Waveform (Amber / Emerald when aligned)
    const windNoise = (100 - windShield) * 0.35;
    ctx.strokeStyle = isAligned ? '#10B981' : '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 20; x < 355; x++) {
      const env = Math.sin(((x - 20) / 335) * Math.PI);
      const jitter = Math.sin(x * 0.9) * windNoise * 0.5;
      const y =
        130 +
        Math.sin(x * freqFilter * 0.04) * 52 * env +
        Math.cos(x * 0.11) * 16 * env +
        jitter;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Right Side: Mars Interior Cross-Section Diagram
    const cx = 480;
    const cy = 130;
    // Crust (Outer Ring)
    ctx.beginPath();
    ctx.arc(cx, cy, 85, 0, Math.PI * 2);
    ctx.fillStyle = quakeIndex >= 1 ? '#7C2D12' : '#27272A';
    ctx.fill();
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Mantle (Middle Ring)
    ctx.beginPath();
    ctx.arc(cx, cy, 62, 0, Math.PI * 2);
    ctx.fillStyle = quakeIndex >= 2 ? '#B45309' : '#18181B';
    ctx.fill();

    // Liquid Iron-Sulfur Core (Inner Circle)
    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fillStyle = quakeIndex >= 3 ? '#F59E0B' : '#09090B';
    ctx.fill();
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FAFAFA';
    ctx.font = 'bold 10px "Space Mono", monospace';
    ctx.fillText('MARS INTERIOR SCAN', 422, 26);
    ctx.fillText(`LAYERS REVEALED: ${quakeIndex}/3`, 425, 244);
  }, [windShield, freqFilter, quakeIndex, currentQuake, isAligned]);

  const handleLockQuake = () => {
    if (!isAligned) {
      sound.playAlert();
      return;
    }
    sound.playQuakeRumble();
    sound.playCollect();
    const next = quakeIndex + 1;
    setQuakeIndex(next);
    if (next >= quakes.length) {
      sound.playSuccessChord();
      onWin();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-mono-tech">
        <span className="text-cyan-400 font-bold">
          {quakeIndex < 3
            ? `SEIS TARGET (${quakeIndex + 1}/3): ${currentQuake.name} [${currentQuake.magnitude}]`
            : 'ALL 3 MARSQUAKES DECODED — LIQUID CORE MAPPED!'}
        </span>
        <span className={isAligned ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
          {isAligned ? 'SIGNAL MATCHED — READY TO RECORD!' : 'TUNE SLIDERS TO MATCH CYAN WAVE'}
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/40 bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={600}
          height={260}
          className="w-full h-auto block"
          aria-label="InSight SEIS Seismometer Waveform and Mars Core Cross-Section"
        />
      </div>

      {quakeIndex < 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
          <div className="space-y-1.5">
            <label htmlFor="wind-shield-slider" className="text-xs font-mono-tech text-zinc-200 flex justify-between">
              <span>1. WIND & THERMAL SHIELD DAMPING:</span>
              <span className={windShield >= 80 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {windShield}% (Need ≥80%)
              </span>
            </label>
            <input
              id="wind-shield-slider"
              type="range"
              min={0}
              max={100}
              value={windShield}
              onChange={(e) => setWindShield(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="freq-filter-slider" className="text-xs font-mono-tech text-zinc-200 flex justify-between">
              <span>2. SEIS P/S WAVE FILTER (Hz):</span>
              <span className={Math.abs(freqFilter - currentQuake.targetFreq) <= 0.4 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {freqFilter.toFixed(1)} Hz (Target: {currentQuake.targetFreq.toFixed(1)} Hz)
              </span>
            </label>
            <input
              id="freq-filter-slider"
              type="range"
              min={1.0}
              max={8.0}
              step={0.1}
              value={freqFilter}
              onChange={(e) => {
                setFreqFilter(Number(e.target.value));
                sound.playBeep(220 + Number(e.target.value) * 45, 0.03, 'sine', 0.04);
              }}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-1">
            <button
              type="button"
              onClick={handleLockQuake}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono-tech transition cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Activity className="w-4 h-4" />
              Lock Seismic Packet ({quakeIndex + 1}/3)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CHAPTER 4 MINI-GAME: Ingenuity 2,400 RPM Thin-Air Aerial Scout
// ============================================================================
const IngenuityMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [heli, setHeli] = useState({ x: 65, y: 120 });
  const [rpm, setRpm] = useState(2420);
  const [waypoints, setWaypoints] = useState([
    { id: 1, x: 190, y: 95, scanned: false, name: 'Ancient River Delta' },
    { id: 2, x: 335, y: 75, scanned: false, name: 'Raised Ridges Outcrop' },
    { id: 3, x: 455, y: 110, scanned: false, name: 'Valinor Hills Channel' }
  ]);
  const [landedAirfield, setLandedAirfield] = useState(false);

  const flyStep = useCallback(
    (dx: number, dy: number) => {
      if (landedAirfield) return;
      sound.playBeep(620, 0.04, 'sawtooth', 0.04);
      setRpm(dy < 0 ? 2537 : 2380);
      setHeli((prev) => {
        const nx = Math.max(30, Math.min(565, prev.x + dx));
        const ny = Math.max(35, Math.min(205, prev.y + dy));

        setWaypoints((curr) => {
          let hit = false;
          const updated = curr.map((w) => {
            if (!w.scanned && Math.hypot(nx - w.x, ny - w.y) < 32) {
              hit = true;
              return { ...w, scanned: true };
            }
            return w;
          });
          if (hit) sound.playCollect();

          // Check landing pad at (535, 190) once all 3 waypoints scanned
          if (updated.every((w) => w.scanned) && Math.hypot(nx - 535, ny - 190) < 36) {
            setLandedAirfield(true);
            sound.playSuccessChord();
            onWin();
          }
          return updated;
        });

        return { x: nx, y: ny };
      });
    },
    [landedAirfield, onWin]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W', ' '].includes(e.key)) {
        e.preventDefault();
        flyStep(0, -20);
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        flyStep(0, 20);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        flyStep(-22, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        flyStep(22, 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [flyStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Jezero Crater Sky (1% CO2 Atmosphere)
    const grad = ctx.createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, '#1E110B');
    grad.addColorStop(1, '#451A03');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 260);

    // Sand Ripples & Jezero Floor
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.moveTo(0, 215);
    ctx.lineTo(150, 205);
    ctx.lineTo(290, 220);
    ctx.lineTo(430, 200);
    ctx.lineTo(600, 215);
    ctx.lineTo(600, 260);
    ctx.lineTo(0, 260);
    ctx.fill();

    // Perseverance Rover waiting on Left
    ctx.fillStyle = '#E4E4E7';
    ctx.fillRect(28, 195, 28, 14);
    ctx.fillStyle = '#F59E0B';
    ctx.font = '9px "Space Mono", monospace';
    ctx.fillText('PERSEVERANCE', 14, 190);

    // Airfield Chi Landing Zone on Right
    const allScanned = waypoints.every((w) => w.scanned);
    ctx.fillStyle = allScanned ? '#10B981' : '#52525B';
    ctx.fillRect(505, 204, 62, 8);
    ctx.font = 'bold 10px "Space Mono", monospace';
    ctx.fillText(allScanned ? 'LAND HERE (AIRFIELD CHI)' : 'AIRFIELD CHI (SCAN 3 FIRST)', 435, 196);

    // Draw Aerial Recon Waypoints
    waypoints.forEach((w) => {
      ctx.beginPath();
      ctx.arc(w.x, w.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = w.scanned ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.2)';
      ctx.fill();
      ctx.strokeStyle = w.scanned ? '#10B981' : '#F59E0B';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#FAFAFA';
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillText(w.scanned ? 'PHOTOGRAPHED' : w.name, w.x - 42, w.y - 22);
    });

    // Draw Pixel Ingenuity Helicopter
    ctx.save();
    ctx.translate(heli.x, heli.y);
    // Coaxial counter-rotating 1.2m blades
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-22, -12);
    ctx.lineTo(22, -12);
    ctx.moveTo(-18, -8);
    ctx.lineTo(18, -8);
    ctx.stroke();
    // Tissue-box fuselage
    ctx.fillStyle = '#E4E4E7';
    ctx.fillRect(-7, -6, 14, 12);
    // Carbon-fiber landing legs
    ctx.strokeStyle = '#A1A1AA';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-6, 6);
    ctx.lineTo(-14, 15);
    ctx.moveTo(6, 6);
    ctx.lineTo(14, 15);
    ctx.stroke();
    ctx.restore();
  }, [heli, waypoints]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-mono-tech">
        <span className="text-emerald-400 font-bold">
          ROTOR SPEED: {rpm} RPM (1% CO₂ Atmosphere Lift Active)
        </span>
        <span className="text-amber-400">
          RECON PHOTOS: {waypoints.filter((w) => w.scanned).length}/3 •{' '}
          {landedAirfield ? 'LANDED AT AIRFIELD CHI!' : 'THEN LAND ON RIGHT PAD'}
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={600}
          height={260}
          className="w-full h-auto block"
          aria-label="Ingenuity Mars Helicopter Flight 72 Aerial Scout Simulation"
        />
      </div>

      <div className="flex items-center justify-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => flyStep(-25, 0)}
          aria-label="Fly Ingenuity Left"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => flyStep(0, -22)}
            aria-label="Spin Rotors Up"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => flyStep(0, 22)}
            aria-label="Descend Ingenuity"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => flyStep(25, 0)}
          aria-label="Fly Ingenuity Right"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 transition cursor-pointer flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CHAPTER 5 MINI-GAME: 70m Deep Space Network Dish & Exoplanet Signal Decoder
// ============================================================================
const DeepSpaceMiniGame: React.FC<{ onWin: () => void }> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dishAngle, setDishAngle] = useState(45);
  const [targets, setTargets] = useState([
    { id: 'near', name: 'NEAR Shoemaker (433 Eros)', angle: 55, dist: '2.1 AU', locked: false },
    { id: 'dawn', name: 'Dawn (Ceres Quarantine Orbit)', angle: 135, dist: '2.8 AU', locked: false },
    { id: 'kepler', name: 'Kepler (Earth-Trailing Orbit)', angle: 225, dist: '1.05 AU', locked: false },
    { id: 'pioneer', name: 'Pioneer 10 (82 AU Interstellar)', angle: 315, dist: '82.0 AU', locked: false }
  ]);

  const activeTarget = targets.find((t) => Math.abs(t.angle - dishAngle) <= 8 && !t.locked);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#05070E';
    ctx.fillRect(0, 0, 600, 270);

    const cx = 300;
    const cy = 135;

    // Radar Concentric Orbits
    [45, 80, 115].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // DSN Dish Beam Cone
    const rad = ((dishAngle - 90) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 128, rad - 0.14, rad + 0.14);
    ctx.closePath();
    ctx.fillStyle = activeTarget ? 'rgba(16, 185, 129, 0.28)' : 'rgba(168, 85, 247, 0.2)';
    ctx.fill();

    // Center 70m DSN Dish
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();

    // Draw 4 Deep Space Monuments
    targets.forEach((t, idx) => {
      const tRad = ((t.angle - 90) * Math.PI) / 180;
      const radius = 58 + idx * 18;
      const tx = cx + Math.cos(tRad) * radius;
      const ty = cy + Math.sin(tRad) * radius;

      ctx.beginPath();
      ctx.arc(tx, ty, 8, 0, Math.PI * 2);
      ctx.fillStyle = t.locked ? '#10B981' : '#EC4899';
      ctx.fill();
      ctx.strokeStyle = '#FAFAFA';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = t.locked ? '#6EE7B7' : '#F472B6';
      ctx.font = '10px "Space Mono", monospace';
      ctx.fillText(`${t.name} [${t.angle}°]`, tx - 55, ty - 12);
    });
  }, [dishAngle, targets, activeTarget]);

  const handleLockSignal = () => {
    if (!activeTarget) {
      sound.playAlert();
      return;
    }
    sound.playLaserPing();
    sound.playCollect();
    const updated = targets.map((t) => (t.id === activeTarget.id ? { ...t, locked: true } : t));
    setTargets(updated);
    if (updated.every((t) => t.locked)) {
      sound.playSuccessChord();
      onWin();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/90 border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs font-mono-tech">
        <span className="text-purple-400 font-bold">
          DSN 70m ANTENNA AZIMUTH: {dishAngle}°
        </span>
        <span className="text-emerald-400 font-bold">
          DEEP SPACE ARCHIVES DECODED: {targets.filter((t) => t.locked).length}/4
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/40 bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={600}
          height={270}
          className="w-full h-auto block"
          aria-label="NASA Deep Space Network 70-meter Dish Signal Lock Radar"
        />
      </div>

      <div className="bg-zinc-900/80 p-4 rounded-xl border border-purple-500/30 flex flex-wrap items-center gap-4">
        <label htmlFor="dsn-azimuth-slider" className="text-xs font-mono-tech text-purple-300 font-bold shrink-0">
          Dish Angle: {dishAngle}°
        </label>
        <input
          id="dsn-azimuth-slider"
          type="range"
          min={0}
          max={359}
          value={dishAngle}
          onChange={(e) => {
            setDishAngle(Number(e.target.value));
            sound.playBeep(300 + Number(e.target.value), 0.02, 'sine', 0.03);
          }}
          className="flex-1 accent-purple-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
        />
        <button
          type="button"
          onClick={handleLockSignal}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold text-xs font-mono-tech transition cursor-pointer flex items-center gap-2"
        >
          <Radio className="w-4 h-4" />
          Lock Signal
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// WRAPPER COMPONENT WITH JUDGE INSTANT-CALIBRATE OPTION
// ============================================================================
export const MiniGameContainer: React.FC<MiniGameProps> = ({
  chapterId,
  onComplete,
  isCompleted
}) => {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-4" key={key}>
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
