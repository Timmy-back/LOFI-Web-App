"use client";

import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nodesRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      const n = nodesRef.current;
      if (n) {
        Object.values(n).forEach((node: any) => {
          if (node && typeof node.dispose === "function") node.dispose();
        });
      }
    };
  }, []);

  const buildAudio = () => {
    const reverb = new Tone.Reverb({ decay: 4.5, wet: 0.38 }).toDestination();
    const lofiFilter = new Tone.Filter(1100, "lowpass").connect(reverb);

    const padSynth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1.5,
      modulationIndex: 2,
      envelope: { attack: 1.4, decay: 0.6, sustain: 0.6, release: 3.2 },
      volume: -15,
    }).connect(lofiFilter);

    const chords = [
      ["A3", "C4", "E4", "G4"],
      ["F3", "A3", "C4", "E4"],
      ["C3", "E3", "G3", "B3"],
      ["E3", "G3", "B3", "D4"],
    ];
    let chordIndex = 0;
    const chordLoop = new Tone.Loop((time) => {
      padSynth.triggerAttackRelease(chords[chordIndex % chords.length], "2n", time);
      chordIndex += 1;
    }, "2m");

    const kick = new Tone.MembraneSynth({
      volume: -11,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0 },
    }).toDestination();

    const hat = new Tone.NoiseSynth({
      volume: -27,
      envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
    }).connect(lofiFilter);

    const drumLoop = new Tone.Sequence(
      (time, step) => {
        if (step === 0 || step === 6) kick.triggerAttackRelease("C1", "8n", time);
        if (step % 2 === 1) hat.triggerAttackRelease("16n", time);
      },
      [0, 1, 2, 3, 4, 5, 6, 7],
      "8n"
    );

    const crackleFilter = new Tone.Filter(3200, "highpass").toDestination();
    const crackle = new Tone.Noise("pink");
    crackle.connect(crackleFilter);
    crackle.volume.value = -30;

    Tone.Transport.bpm.value = 72;
    chordLoop.start(0);
    drumLoop.start(0);
    crackle.start();

    return { reverb, lofiFilter, padSynth, chordLoop, kick, hat, drumLoop, crackle, crackleFilter };
  };

  const togglePlay = async () => {
    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
      return;
    }
    setIsLoading(true);
    await Tone.start();
    if (!nodesRef.current) {
      nodesRef.current = buildAudio();
    }
    Tone.Transport.start();
    setIsLoading(false);
    setIsPlaying(true);
  };

  const bars = Array.from({ length: 24 });
  const drops = Array.from({ length: 40 });
  const stars = Array.from({ length: 50 });

  return (
    <div className="lofi-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,500&family=Space+Mono&display=swap');

        .lofi-root {
          --deep: #170f2b;
          --mid: #2a1f49;
          --moon: #f4e6c8;
          --lamp: #ffb27a;
          --pink: #e6a2d6;
          --teal: #8fd8ca;
          --cream: #f6ecda;
          --ink: #120c22;

          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: radial-gradient(120% 90% at 50% -10%, var(--mid) 0%, var(--deep) 65%, #0d0819 100%);
          font-family: 'Space Mono', monospace;
          color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sky { position: absolute; inset: 0; overflow: hidden; }

        .star {
          position: absolute;
          width: 2px; height: 2px;
          background: var(--moon);
          border-radius: 50%;
          animation: twinkle 3.5s ease-in-out infinite;
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; } }

        .moon {
          position: absolute;
          top: 8%; left: 50%;
          transform: translateX(-50%);
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--moon);
          box-shadow: 0 0 40px 6px rgba(244, 230, 200, 0.35);
        }

        .cloud {
          position: absolute;
          width: 200px; height: 40px;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.05);
          filter: blur(2px);
          animation: drift 60s linear infinite;
        }
        @keyframes drift { from { transform: translateX(-260px); } to { transform: translateX(110vw); } }

        .rain { position: absolute; inset: 0; pointer-events: none; }
        .drop {
          position: absolute;
          top: -10%;
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(200, 210, 255, 0.35));
          animation: fall linear infinite;
        }
        @keyframes fall { to { transform: translateY(120vh); } }

        .scene {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 48px 32px;
        }

        .window {
          position: relative;
          width: 220px; height: 150px;
          border: 6px solid #241a3a;
          border-radius: 8px;
          background: linear-gradient(180deg, #241736 0%, #1a1130 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 30px 60px rgba(0,0,0,0.45);
        }
        .window::before, .window::after { content: ''; position: absolute; background: #241a3a; }
        .window::before { left: 50%; top: 0; bottom: 0; width: 6px; transform: translateX(-50%); }
        .window::after { top: 50%; left: 0; right: 0; height: 6px; transform: translateY(-50%); }

        .lamp-glow {
          position: absolute;
          right: 10px; bottom: 6px;
          width: 60px; height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,178,122,0.55) 0%, rgba(255,178,122,0) 70%);
          animation: flicker 4s ease-in-out infinite;
        }
        @keyframes flicker { 0%, 100% { opacity: 0.7; } 48% { opacity: 0.7; } 50% { opacity: 0.4; } 52% { opacity: 0.7; } }

        .cat { position: absolute; left: 14px; bottom: 6px; width: 34px; height: 24px; }
        .cat svg { width: 100%; height: 100%; }

        .steam {
          position: absolute;
          left: 60px; bottom: 18px;
          width: 3px; height: 16px;
          border-radius: 2px;
          background: rgba(255,255,255,0.25);
          animation: steam 3s ease-in-out infinite;
        }
        .steam:nth-child(2) { left: 66px; animation-delay: 0.6s; }
        @keyframes steam {
          0% { transform: translateY(0) scaleY(1); opacity: 0.5; }
          80% { opacity: 0; }
          100% { transform: translateY(-18px) scaleY(1.4); opacity: 0; }
        }

        .player { position: relative; display: flex; flex-direction: column; align-items: center; gap: 18px; }

        .vinyl {
          position: relative;
          width: 132px; height: 132px;
          border-radius: 50%;
          background: repeating-radial-gradient(circle, #0f0a1c 0 3px, #1b1330 3px 6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          animation: spin 6s linear infinite;
          animation-play-state: paused;
        }
        .vinyl.spinning { animation-play-state: running; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .vinyl-label { width: 46px; height: 46px; border-radius: 50%; background: var(--pink); }

        .play-btn {
          position: absolute;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: none;
          background: var(--cream);
          color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(0,0,0,0.4);
          transition: transform 0.15s ease;
        }
        .play-btn:hover { transform: scale(1.06); }
        .play-btn:active { transform: scale(0.96); }
        .play-btn:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; }

        .title { font-family: 'Fraunces', serif; font-style: italic; font-size: 26px; font-weight: 500; color: var(--cream); letter-spacing: 0.3px; }
        .subtitle { font-size: 12px; color: rgba(246,236,218,0.55); letter-spacing: 0.4px; }

        .waveform { display: flex; align-items: flex-end; gap: 3px; height: 22px; }
        .bar { width: 3px; background: var(--teal); border-radius: 2px; height: 4px; opacity: 0.5; transition: opacity 0.3s ease; }
        .bar.active { opacity: 1; animation: bounce 1.1s ease-in-out infinite; }
        @keyframes bounce { 0%, 100% { height: 4px; } 50% { height: 20px; } }

        @media (prefers-reduced-motion: reduce) {
          .vinyl, .drop, .cloud, .star, .bar, .steam, .lamp-glow { animation: none !important; }
        }
      `}</style>

      <div className="sky">
        {stars.map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 55}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3.5}s`,
            }}
          />
        ))}
        <div className="moon" />
        <div className="cloud" style={{ top: "14%", animationDuration: "70s" }} />
        <div className="cloud" style={{ top: "22%", animationDuration: "95s", animationDelay: "-30s" }} />
        <div className="rain">
          {drops.map((_, i) => (
            <span
              key={i}
              className="drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.6 + Math.random() * 0.6}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.4 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      </div>

      <div className="scene">
        <div className="window">
          <div className="lamp-glow" />
          <div className="steam" />
          <div className="steam" />
          <div className="cat">
            <svg viewBox="0 0 34 24" fill="none">
              <path d="M2 22c0-7 4-11 9-11 1-3 3-5 3-5s0 3 1 5c5 0 9 4 9 11z" fill="#0e0a1b" />
              <path d="M8 12l-2-4 4 2z" fill="#0e0a1b" />
              <path d="M20 12l2-4-4 2z" fill="#0e0a1b" />
            </svg>
          </div>
        </div>

        <div className="player">
          <div className={`vinyl ${isPlaying ? "spinning" : ""}`}>
            <div className="vinyl-label" />
          </div>
          <button
            className="play-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? "Поставить на паузу" : "Включить"}
            disabled={isLoading}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="4" width="5" height="16" rx="1.5" />
                <rect x="14" y="4" width="5" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4.5v15l14-7.5z" />
              </svg>
            )}
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <div className="title">rainy night radio</div>
          <div className="subtitle">soft beats for late nights</div>
        </div>

        <div className="waveform">
          {bars.map((_, i) => (
            <span key={i} className={`bar ${isPlaying ? "active" : ""}`} style={{ animationDelay: `${(i % 8) * 0.09}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
