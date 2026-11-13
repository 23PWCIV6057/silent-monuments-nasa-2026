import React, { useEffect, useRef } from 'react';

interface StoryStageProps {
  chapterId: number;
  dialogueStep: number;
  characterName: string;
}

/**
 * Animated 2D Character & Planetary Diorama Stage
 * Renders Junior Archivist Maya alongside each chapter's 2D NASA Spacecraft character
 * with real-time animations (blinking camera eyes, spinning rotors, seismic rings, dust & stars).
 */
export const StoryStage: React.FC<StoryStageProps> = ({
  chapterId,
  dialogueStep,
  characterName
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let startTime = performance.now();

    const stars = Array.from({ length: 48 }, (_, i) => ({
      x: (i * 97) % 720,
      y: (i * 53) % 175,
      r: (i % 3) * 0.6 + 0.8,
      phase: i * 0.7
    }));

    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: (i * 61) % 720,
      y: 60 + ((i * 43) % 180),
      speed: 0.4 + (i % 4) * 0.35,
      size: 1.5 + (i % 3)
    }));

    const render = (now: number) => {
      const t = (now - startTime) / 1000;
      ctx.clearRect(0, 0, 720, 260);

      // ======================================================================
      // 1. PLANETARY SKY & TERRAIN BACKDROP PER CHAPTER
      // ======================================================================
      if (chapterId === 1) {
        // THE MOON: Deep black sky, blue Earth on horizon, grey cratered regolith
        const sky = ctx.createLinearGradient(0, 0, 0, 185);
        sky.addColorStop(0, '#03050A');
        sky.addColorStop(1, '#0B1324');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 720, 260);

        stars.forEach((s) => {
          const alpha = 0.4 + 0.5 * Math.sin(t * 2 + s.phase);
          ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Earthrise in the lunar sky
        const ex = 360;
        const ey = 68 + Math.sin(t * 0.8) * 3;
        const earthGrad = ctx.createRadialGradient(ex - 8, ey - 8, 4, ex, ey, 30);
        earthGrad.addColorStop(0, '#60A5FA');
        earthGrad.addColorStop(0.7, '#1D4ED8');
        earthGrad.addColorStop(1, '#0F172A');
        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(ex, ey, 28, 0, Math.PI * 2);
        ctx.fill();
        // Clouds on Earth
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        ctx.ellipse(ex - 6, ey - 4, 12, 5, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Lunar mountains & regolith floor
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.moveTo(0, 185);
        ctx.lineTo(130, 148);
        ctx.lineTo(270, 178);
        ctx.lineTo(460, 142);
        ctx.lineTo(610, 172);
        ctx.lineTo(720, 155);
        ctx.lineTo(720, 260);
        ctx.lineTo(0, 260);
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 185, 720, 75);

        // Craters on ground
        [
          { x: 240, y: 215, rx: 32, ry: 8 },
          { x: 380, y: 230, rx: 45, ry: 10 },
          { x: 630, y: 220, rx: 28, ry: 7 }
        ].forEach((c) => {
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (chapterId === 2) {
        // MARS MERIDIANI PLANUM: Butterscotch/rust sky, drifting dust, red plains
        const sky = ctx.createLinearGradient(0, 0, 0, 190);
        sky.addColorStop(0, '#2A120A');
        sky.addColorStop(0.6, '#6B2712');
        sky.addColorStop(1, '#9A3412');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 720, 260);

        // Pale Martian Sun behind dust haze
        ctx.fillStyle = 'rgba(253, 224, 71, 0.28)';
        ctx.beginPath();
        ctx.arc(355, 65, 34, 0, Math.PI * 2);
        ctx.fill();

        // Red mesas
        ctx.fillStyle = '#5C1F0E';
        ctx.beginPath();
        ctx.moveTo(0, 185);
        ctx.lineTo(95, 152);
        ctx.lineTo(190, 152);
        ctx.lineTo(260, 182);
        ctx.lineTo(480, 148);
        ctx.lineTo(590, 148);
        ctx.lineTo(720, 182);
        ctx.lineTo(720, 260);
        ctx.lineTo(0, 260);
        ctx.fill();

        ctx.fillStyle = '#7C2D12';
        ctx.fillRect(0, 185, 720, 75);

        // Blowing Mars dust particles
        particles.forEach((p) => {
          const px = (p.x + t * p.speed * 55) % 720;
          ctx.fillStyle = 'rgba(253, 186, 116, 0.35)';
          ctx.beginPath();
          ctx.arc(px, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (chapterId === 3) {
        // MARS ELYSIUM PLANITIA + SUBSURFACE SEISMIC PULSE
        const sky = ctx.createLinearGradient(0, 0, 0, 185);
        sky.addColorStop(0, '#0F172A');
        sky.addColorStop(0.6, '#3B1D2E');
        sky.addColorStop(1, '#7C2D12');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 720, 260);

        stars.slice(0, 25).forEach((s) => {
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fillRect(s.x, s.y * 0.6, 1.5, 1.5);
        });

        ctx.fillStyle = '#572213';
        ctx.fillRect(0, 182, 720, 78);

        // Subsurface glowing seismic P/S rings under InSight
        for (let r = 0; r < 3; r++) {
          const waveR = ((t * 42 + r * 35) % 110) + 10;
          const alpha = Math.max(0, 1 - waveR / 120);
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.65})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(515, 205, waveR * 1.4, waveR * 0.42, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (chapterId === 4) {
        // JEZERO CRATER RIVER DELTA & VALINOR HILLS
        const sky = ctx.createLinearGradient(0, 0, 0, 185);
        sky.addColorStop(0, '#1C1917');
        sky.addColorStop(0.5, '#442616');
        sky.addColorStop(1, '#92400E');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 720, 260);

        // Jezero Delta cliffs
        ctx.fillStyle = '#652B13';
        ctx.beginPath();
        ctx.moveTo(0, 185);
        ctx.lineTo(140, 138);
        ctx.lineTo(310, 175);
        ctx.lineTo(510, 128);
        ctx.lineTo(720, 168);
        ctx.lineTo(720, 260);
        ctx.lineTo(0, 260);
        ctx.fill();

        ctx.fillStyle = '#78350F';
        ctx.fillRect(0, 185, 720, 75);
      } else {
        // CHAPTER 5: DEEP SPACE, ASTEROID EROS & CERES
        const sky = ctx.createLinearGradient(0, 0, 720, 260);
        sky.addColorStop(0, '#04060E');
        sky.addColorStop(0.5, '#0F1026');
        sky.addColorStop(1, '#1E1035');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 720, 260);

        stars.forEach((s) => {
          const sx = (s.x - t * 12 + 720) % 720;
          const alpha = 0.35 + 0.6 * Math.sin(t * 3 + s.phase);
          ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, s.y * 1.35, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Distant Dwarf Planet Ceres in background
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(365, 82, 26, 0, Math.PI * 2);
        ctx.fill();
        // Occator bright salt spot on Ceres
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(358, 79, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Asteroid 433 Eros / Comms deck floor
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.ellipse(175, 225, 165, 42, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // ======================================================================
      // 2. LEFT CHARACTER: JUNIOR ARCHIVIST MAYA (2D ANIMATED ASTRONAUT)
      // ======================================================================
      const mayaBob = Math.sin(t * 2.6) * 3;
      const mx = 155;
      const my = 152 + mayaBob;

      ctx.save();
      ctx.translate(mx, my);

      // Shadow under Maya
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 46 - mayaBob, 26, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // PLSS Life Support Backpack
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.roundRect(-24, -18, 18, 38, 5);
      ctx.fill();
      // Backpack antenna with blinking cyan tip
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-16, -18);
      ctx.lineTo(-16, -42);
      ctx.stroke();
      ctx.fillStyle = Math.sin(t * 6) > 0 ? '#38BDF8' : '#0284C7';
      ctx.beginPath();
      ctx.arc(-16, -44, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Spacesuit Legs & Boots
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(-11, 20, 9, 20);
      ctx.fillRect(3, 20, 9, 20);
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(-13, 37, 13, 7, 3);
      ctx.roundRect(1, 37, 13, 7, 3);
      ctx.fill();

      // Spacesuit Torso
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(-16, -15, 32, 37, 9);
      ctx.fill();

      // NASA-style chest mission patch & telemetry chest pack
      ctx.fillStyle = '#1D4ED8';
      ctx.beginPath();
      ctx.arc(-6, -4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(2, -8, 10, 8);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(4, -6, 6, 4);

      // Spacesuit Helmet
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(0, -28, 20, 0, Math.PI * 2);
      ctx.fill();

      // Golden/Cyan Visor + Expressive Eyes inside Helmet
      const visorGrad = ctx.createLinearGradient(-12, -38, 14, -18);
      visorGrad.addColorStop(0, '#0F172A');
      visorGrad.addColorStop(1, '#1E3A8A');
      ctx.fillStyle = visorGrad;
      ctx.beginPath();
      ctx.roundRect(-12, -39, 26, 20, 9);
      ctx.fill();

      // Maya's blinking eyes inside visor
      const isBlinking = Math.sin(t * 1.7) > 0.96;
      ctx.fillStyle = '#38BDF8';
      if (isBlinking) {
        ctx.fillRect(-4, -29, 5, 1.5);
        ctx.fillRect(5, -29, 5, 1.5);
      } else {
        ctx.beginPath();
        ctx.arc(-1.5, -29, 2.3, 0, Math.PI * 2);
        ctx.arc(7.5, -29, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Visor shine reflection
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.ellipse(-5, -34, 5, 2.2, -0.4, 0, Math.PI * 2);
      ctx.fill();

      // Right Arm holding Deep Space Receiver Tablet waving toward the spacecraft
      const armAngle = Math.sin(t * 3) * 0.12 - 0.25;
      ctx.save();
      ctx.translate(12, -6);
      ctx.rotate(armAngle);
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(0, -4, 22, 9, 4);
      ctx.fill();
      // Glowing Hologram Scanner in Maya's hand
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(20, -10, 8, 14);
      ctx.restore();

      ctx.restore();

      // Nameplate under Maya
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(85, 212, 140, 24, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ARCHIVIST MAYA', 155, 228);

      // ======================================================================
      // 3. RADIO / TELEMETRY LINK WAVES BETWEEN MAYA & SPACECRAFT
      // ======================================================================
      for (let i = 0; i < 4; i++) {
        const prog = ((t * 0.85 + i * 0.25) % 1);
        const wx = 210 + prog * 210;
        const wy = 138 - Math.sin(prog * Math.PI) * 28;
        ctx.fillStyle = `rgba(245, 158, 11, ${1 - prog * 0.7})`;
        ctx.beginPath();
        ctx.arc(wx, wy, 3 + Math.sin(prog * Math.PI) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ======================================================================
      // 4. RIGHT CHARACTER: ANTHROPOMORPHIZED 2D NASA SPACECRAFT CHARACTER
      // ======================================================================
      const scX = 525;
      const scY = 148 + Math.sin(t * 2.2 + 1) * 3.5;

      ctx.save();
      ctx.translate(scX, scY);

      if (chapterId === 1) {
        // APOLLO LRV-1 MOON BUGGY + EAGLE GOLD DESCENT STAGE CHARACTER
        // Gold Foil Octagonal Body
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(-52, -16, 104, 34, 8);
        ctx.fill();
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Expressive Camera Head (TV Camera + High-Gain Dish Umbrella)
        const headTilt = Math.sin(t * 2.5) * 0.08;
        ctx.save();
        ctx.translate(-12, -16);
        ctx.rotate(headTilt);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(-4, -22, 8, 22);
        // Camera "Face" with two glowing lens eyes looking at Maya
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(-22, -40, 44, 22, 6);
        ctx.fill();
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(-9, -29, 5, 0, Math.PI * 2);
        ctx.arc(9, -29, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-10, -31, 1.8, 0, Math.PI * 2);
        ctx.arc(8, -31, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Golden Umbrella S-Band Dish on right
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(26, -16);
        ctx.lineTo(26, -42);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(26, -42, 18, Math.PI, 0);
        ctx.stroke();

        // Animated Wire-Mesh Wheels
        [-38, 38].forEach((wx) => {
          ctx.save();
          ctx.translate(wx, 24);
          ctx.rotate(t * 1.5);
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          // Orange fender
          ctx.restore();
          ctx.fillStyle = '#EA580C';
          ctx.beginPath();
          ctx.arc(wx, 24, 19, Math.PI * 1.1, Math.PI * 1.9);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#EA580C';
          ctx.stroke();
        });
      } else if (chapterId === 2) {
        // OPPORTUNITY ("OPPY") MARS ROVER CHARACTER WITH EXPRESSIVE PANCAM HEAD
        // Gull-wing solar panels
        ctx.fillStyle = '#1E3A8A';
        ctx.beginPath();
        ctx.moveTo(-68, -4);
        ctx.lineTo(68, -4);
        ctx.lineTo(52, 14);
        ctx.lineTo(-52, 14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#60A5FA';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Warm Gold Rover Warm Electronics Box
        ctx.fillStyle = '#D97706';
        ctx.fillRect(-30, 4, 60, 22);

        // Pancam Mast & Expressive Binocular Head
        const neckNod = Math.sin(t * 3) * 0.1;
        ctx.save();
        ctx.translate(-14, -4);
        ctx.rotate(neckNod);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(-4, -32, 8, 32);
        // Pancam Head Box
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.roundRect(-24, -50, 48, 22, 6);
        ctx.fill();
        // Big expressive Pancam eyes
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(-10, -39, 6.5, 0, Math.PI * 2);
        ctx.arc(10, -39, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(-10, -39, 3.8, 0, Math.PI * 2);
        ctx.arc(10, -39, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 6 Rocker-Bogie Wheels
        [-42, 0, 42].forEach((wx) => {
          ctx.fillStyle = '#18181B';
          ctx.beginPath();
          ctx.arc(wx, 32, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#A1A1AA';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      } else if (chapterId === 3) {
        // INSIGHT MARS LANDER + GLOWING SEIS DOME CHARACTER
        // Circular twin solar fan wings
        ctx.fillStyle = '#1E293B';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(-62, 0, 26, 14, 0, 0, Math.PI * 2);
        ctx.ellipse(62, 0, 26, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Lander Deck
        ctx.fillStyle = '#CBD5E1';
        ctx.beginPath();
        ctx.roundRect(-34, -12, 68, 24, 6);
        ctx.fill();

        // Lander Sensor Eyes on Deck
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(-20, -28, 40, 18, 5);
        ctx.fill();
        ctx.fillStyle = '#22D3EE';
        ctx.beginPath();
        ctx.arc(-8, -19, 4.2, 0, Math.PI * 2);
        ctx.arc(8, -19, 4.2, 0, Math.PI * 2);
        ctx.fill();

        // Landing Legs
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-26, 12);
        ctx.lineTo(-40, 38);
        ctx.moveTo(26, 12);
        ctx.lineTo(40, 38);
        ctx.stroke();

        // Deployed Golden SEIS Seismometer Dome on the ground to the left
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(-65, 36, 14, Math.PI, 0);
        ctx.fill();
      } else if (chapterId === 4) {
        // INGENUITY ("GINNY") MARS HELICOPTER CHARACTER
        // Coaxial Counter-Rotating Carbon-Fiber Blades
        const bladeSpan = 58 * Math.abs(Math.cos(t * 14));
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-bladeSpan, -34);
        ctx.lineTo(bladeSpan, -34);
        ctx.stroke();

        const bladeSpan2 = 58 * Math.abs(Math.sin(t * 14));
        ctx.strokeStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(-bladeSpan2, -24);
        ctx.lineTo(bladeSpan2, -24);
        ctx.stroke();

        // Rotor Mast & Solar Panel Hat
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(-4, -42, 8, 30);
        ctx.fillStyle = '#1E3A8A';
        ctx.fillRect(-26, -46, 52, 6);

        // Tissue-Box Fuselage with Friendly Camera Eyes
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.roundRect(-22, -12, 44, 30, 8);
        ctx.fill();
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(-16, -6, 32, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(-7, 2, 4, 0, Math.PI * 2);
        ctx.arc(7, 2, 4, 0, Math.PI * 2);
        ctx.fill();

        // 4 Spindly Carbon-Fiber Landing Legs
        ctx.strokeStyle = '#A1A1AA';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-16, 18);
        ctx.lineTo(-38, 42);
        ctx.moveTo(16, 18);
        ctx.lineTo(38, 42);
        ctx.stroke();
      } else {
        // PIONEER 10 & DAWN DEEP SPACE VOYAGER CHARACTER
        // Blue Xenon Ion Thruster Plume on Right
        const plumeGrad = ctx.createLinearGradient(30, 0, 95, 0);
        plumeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
        plumeGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = plumeGrad;
        ctx.beginPath();
        ctx.moveTo(30, -8);
        ctx.lineTo(95 + Math.sin(t * 20) * 8, 0);
        ctx.lineTo(30, 8);
        ctx.closePath();
        ctx.fill();

        // Deep Space Solar Wings (Dawn)
        ctx.fillStyle = '#1D4ED8';
        ctx.fillRect(-12, -52, 24, 34);
        ctx.fillRect(-12, 18, 24, 34);

        // Parabolic Dish facing Maya
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.ellipse(-22, 0, 12, 32, 0, 0, Math.PI * 2);
        ctx.fill();

        // Spacecraft Bus + Golden Plaque + Glowing Eyes
        ctx.fillStyle = '#D97706';
        ctx.beginPath();
        ctx.roundRect(-18, -18, 48, 36, 6);
        ctx.fill();

        // Pioneer Golden Plaque Emblem
        ctx.fillStyle = '#FDE047';
        ctx.fillRect(6, -10, 16, 10);

        // Expressive Sensor Eyes
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(-8, -5, 4.5, 0, Math.PI * 2);
        ctx.arc(-8, 7, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#A855F7';
        ctx.beginPath();
        ctx.arc(-8, -5, 2.5, 0, Math.PI * 2);
        ctx.arc(-8, 7, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Nameplate under NASA Hardware Character
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(410, 212, 230, 24, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      const shortSpeaker =
        characterName.length > 26 ? characterName.slice(0, 24) + '…' : characterName;
      ctx.fillText(shortSpeaker.toUpperCase(), 525, 228);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [chapterId, dialogueStep, characterName]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-zinc-950 shadow-inner">
      <canvas
        ref={canvasRef}
        width={720}
        height={260}
        className="w-full h-auto block"
        aria-label={`2D animated scene showing Junior Archivist Maya conversing with ${characterName}`}
      />
    </div>
  );
};
