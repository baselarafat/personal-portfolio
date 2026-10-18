import { useEffect, useRef, useState } from "react";

const W = 960;
const H = 470;
const ROWS = 12;                 // peg rows
const SX = 54;                   // horizontal peg spacing
const TOP_Y = 56;                // first peg row
const ROW_GAP = 21;
const BIN_TOP = 372;             // top of histogram area
const BIN_BOTTOM = 448;
const BALL_SPEED = 2.4;          // rows per second
const SPAWN_MS = 130;
const MAX_BALLS = 42;
const TEAL = "#2dd4bf";
const AMBER = "#f0b429";

interface Ball { path: number[]; t: number }

export default function GaltonBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const binsRef = useRef<number[]>(new Array(ROWS + 1).fill(0));
  const ballsRef = useRef<Ball[]>([]);
  const totalRef = useRef(0);
  const runningRef = useRef(true);
  const lastSpawnRef = useRef(0);

  const [running, setRunning] = useState(true);
  const [meta, setMeta] = useState({ total: 0, mean: 0, std: 0 });

  const cx = W / 2;

  // horizontal offset of a ball that has completed r decisions
  const offsetAt = (path: number[], r: number) => {
    let rights = 0;
    for (let i = 0; i < r; i++) rights += path[i];
    return (rights - r / 2) * SX;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== W * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // pegs
    ctx.fillStyle = TEAL;
    for (let r = 0; r < ROWS; r++) {
      const y = TOP_Y + r * ROW_GAP;
      for (let k = 0; k <= r; k++) {
        const x = cx + (k - r / 2) * SX;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // bin dividers
    ctx.strokeStyle = "rgba(45,212,191,0.25)";
    ctx.lineWidth = 1;
    for (let b = 0; b <= ROWS; b++) {
      const x = cx + (b - ROWS / 2) * SX - SX / 2;
      ctx.beginPath();
      ctx.moveTo(x, BIN_TOP - 18);
      ctx.lineTo(x, BIN_BOTTOM);
      ctx.stroke();
    }

    // histogram bars
    const bins = binsRef.current;
    const max = Math.max(1, ...bins);
    const barMaxH = BIN_BOTTOM - BIN_TOP;
    for (let b = 0; b <= ROWS; b++) {
      const h = (bins[b] / max) * barMaxH;
      if (h <= 0) continue;
      const x = cx + (b - ROWS / 2) * SX - SX / 2 + 3;
      ctx.fillStyle = TEAL;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, BIN_BOTTOM - h, SX - 6, h);
    }
    ctx.globalAlpha = 1;

    // balls
    for (const ball of ballsRef.current) {
      const r0 = Math.floor(ball.t);
      const frac = ball.t - r0;
      const x0 = cx + offsetAt(ball.path, Math.min(r0, ROWS));
      const x1 = cx + offsetAt(ball.path, Math.min(r0 + 1, ROWS));
      const x = x0 + (x1 - x0) * frac;
      const y = TOP_Y - 24 + (ball.t / ROWS) * (BIN_TOP - 34 - (TOP_Y - 24));
      ctx.fillStyle = AMBER;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const reset = () => {
    binsRef.current = new Array(ROWS + 1).fill(0);
    ballsRef.current = [];
    totalRef.current = 0;
    setMeta({ total: 0, mean: 0, std: 0 });
    draw();
  };

  const toggle = () => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastMeta = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (runningRef.current) {
        // spawn
        if (now - lastSpawnRef.current > SPAWN_MS && ballsRef.current.length < MAX_BALLS) {
          lastSpawnRef.current = now;
          const path = Array.from({ length: ROWS }, () => (Math.random() < 0.5 ? 0 : 1));
          ballsRef.current.push({ path, t: 0 });
        }
        // advance
        const bins = binsRef.current;
        const alive: Ball[] = [];
        for (const ball of ballsRef.current) {
          ball.t += dt * BALL_SPEED;
          if (ball.t >= ROWS) {
            const bin = ball.path.reduce((a, b) => a + b, 0);
            bins[bin]++;
            totalRef.current++;
          } else {
            alive.push(ball);
          }
        }
        ballsRef.current = alive;

        if (now - lastMeta > 300) {
          lastMeta = now;
          const total = totalRef.current;
          let mean = 0, std = 0;
          if (total > 0) {
            mean = bins.reduce((a, c, i) => a + i * c, 0) / total;
            const variance = bins.reduce((a, c, i) => a + c * (i - mean) * (i - mean), 0) / total;
            std = Math.sqrt(variance);
          }
          setMeta({ total, mean, std });
        }
      }
      draw();
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="experiment">
      <div className="exp-head">
        <h2>EXP-02 · GALTON BOARD</h2>
        <span className="live">{running ? "RUNNING" : "PAUSED"} · {meta.total.toLocaleString("en-US")} balls dropped</span>
      </div>
      <div className="panel">
        <canvas ref={canvasRef} className="sim" aria-label="Galton board simulation" />
        <div className="galton-meta">
          <span>distribution: <b>gaussian</b></span>
          <span>mean: <b>{meta.total > 0 ? meta.mean.toFixed(2) : "—"}</b></span>
          <span>std dev: <b>{meta.total > 0 ? meta.std.toFixed(2) : "—"}</b></span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button className="btn" onClick={toggle}>{running ? "❚❚ PAUSE" : "▶ RUN"}</button>
            <button className="btn" onClick={reset}>[ RESET ]</button>
          </span>
        </div>
        <p className="method">
          Each ball bounces left or right with equal probability at every peg. The pile-up
          of thousands of random paths converges to the normal distribution — the central
          limit theorem, falling from the sky.
        </p>
      </div>
    </div>
  );
}
