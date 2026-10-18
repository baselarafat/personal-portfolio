import { useEffect, useRef, useState } from "react";

const SIZE = 560;          // internal canvas resolution (square)
const PAD = 30;            // margin around the unit square
const BATCH = 260;         // darts thrown per animation frame
const MAX_DRAWN = 12000;   // cap rendered dots so the canvas stays readable
const TEAL = "#2dd4bf";
const AMBER = "#f0b429";

interface Counts { inside: number; total: number }

export default function MonteCarloPi() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const countsRef = useRef<Counts>({ inside: 0, total: 0 });
  const drawnRef = useRef(0);
  const runningRef = useRef(true);

  const [running, setRunning] = useState(true);
  const [stats, setStats] = useState({ pi: 0, err: 0, total: 0 });

  const paintBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#0d1210";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // faint grid
    ctx.strokeStyle = "rgba(45,212,191,0.07)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 12; i++) {
      const p = (i / 12) * SIZE;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(SIZE, p); ctx.stroke();
    }

    // unit square + inscribed circle
    const s = SIZE - PAD * 2;
    ctx.strokeStyle = "rgba(45,212,191,0.55)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(PAD, PAD, s, s);
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, s / 2, 0, Math.PI * 2);
    ctx.stroke();
  };

  const reset = () => {
    countsRef.current = { inside: 0, total: 0 };
    drawnRef.current = 0;
    paintBoard();
    setStats({ pi: 0, err: 0, total: 0 });
  };

  const toggle = () => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  };

  useEffect(() => {
    paintBoard();
    let raf = 0;
    let lastStats = 0;

    const toPx = (v: number) => PAD + ((v + 1) / 2) * (SIZE - PAD * 2);

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!runningRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const c = countsRef.current;
      for (let i = 0; i < BATCH; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const inside = x * x + y * y <= 1;
        c.total++;
        if (inside) c.inside++;
        if (drawnRef.current < MAX_DRAWN) {
          ctx.fillStyle = inside ? TEAL : AMBER;
          ctx.globalAlpha = inside ? 0.85 : 0.5;
          ctx.fillRect(toPx(x), toPx(y), 2, 2);
          drawnRef.current++;
        }
      }
      ctx.globalAlpha = 1;

      if (t - lastStats > 200) {
        lastStats = t;
        const pi = c.total > 0 ? (4 * c.inside) / c.total : 0;
        setStats({
          pi,
          err: c.total > 0 ? (Math.abs(pi - Math.PI) / Math.PI) * 100 : 0,
          total: c.total,
        });
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="experiment" id="monte-carlo">
      <div className="exp-head">
        <h2>EXP-01 · MONTE CARLO π ESTIMATE</h2>
        <span className="live">{running ? "RUNNING" : "PAUSED"} · {fmt(stats.total)} darts</span>
      </div>
      <div className="panel">
        <div className="pi-grid">
          <canvas ref={canvasRef} className="sim" aria-label="Monte Carlo pi estimation simulation" />
          <div className="stats">
            <div className="stat">
              <div className="label">π ESTIMATE</div>
              <div className="value">{stats.pi > 0 ? stats.pi.toFixed(4) : "—"}</div>
              <div className="sub">target π = 3.14159265…</div>
            </div>
            <div className="stat">
              <div className="label">RELATIVE ERROR</div>
              <div className="value teal">{stats.total > 0 ? stats.err.toFixed(4) + "%" : "—"}</div>
            </div>
            <div className="stat">
              <div className="label">SAMPLES</div>
              <div className="value">{fmt(stats.total)}</div>
            </div>
            <div className="controls">
              <button className="btn btn-primary" onClick={toggle}>
                {running ? "❚❚ PAUSE" : "▶ RUN SIMULATION"}
              </button>
              <button className="btn" onClick={reset}>[ RESET BOARD ]</button>
            </div>
          </div>
        </div>
        <div className="readout">
          &gt; π ≈ {stats.pi > 0 ? stats.pi.toFixed(4) : "—"} — {fmt(stats.total)} darts thrown
          <span className="dim">
            Rendering capped at {fmt(MAX_DRAWN)} dots for readability — the math keeps counting.
          </span>
        </div>
        <p className="method">
          Method: Monte Carlo random sampling. Throw darts uniformly at the unit square;
          the fraction landing inside the inscribed circle converges to π/4 as the dart count grows.
        </p>
      </div>
    </div>
  );
}
