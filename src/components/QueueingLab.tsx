import { useEffect, useMemo, useRef, useState } from "react";

const SIM_SPEED = 6;
const MAX_VISIBLE_QUEUE = 24;

interface Customer {
  id: number;
  arrivedAt: number;
}

interface Server {
  customerId: number | null;
  remaining: number;
}

interface Snapshot {
  queueLength: number;
  served: number;
  averageWait: number;
  elapsed: number;
  servers: Server[];
}

const exponential = (mean: number) => -Math.log(1 - Math.random()) * mean;

const factorial = (n: number) => {
  let value = 1;
  for (let i = 2; i <= n; i++) value *= i;
  return value;
};

function theoreticalMetrics(arrivalsPerMinute: number, serviceSeconds: number, serverCount: number) {
  const lambda = arrivalsPerMinute;
  const mu = 60 / serviceSeconds;
  const offeredLoad = lambda / mu;
  const utilization = offeredLoad / serverCount;

  if (utilization >= 1) {
    return { utilization, waitSeconds: Infinity, stable: false };
  }

  let denominator = 0;
  for (let n = 0; n < serverCount; n++) {
    denominator += Math.pow(offeredLoad, n) / factorial(n);
  }
  const tail = Math.pow(offeredLoad, serverCount) /
    (factorial(serverCount) * (1 - utilization));
  const p0 = 1 / (denominator + tail);
  const probabilityOfWaiting = tail * p0;
  const waitMinutes = probabilityOfWaiting / (serverCount * mu - lambda);

  return {
    utilization,
    waitSeconds: waitMinutes * 60,
    stable: true,
  };
}

export default function QueueingLab() {
  const [arrivalsPerMinute, setArrivalsPerMinute] = useState(10);
  const [serviceSeconds, setServiceSeconds] = useState(18);
  const [serverCount, setServerCount] = useState(3);
  const [running, setRunning] = useState(true);
  const [snapshot, setSnapshot] = useState<Snapshot>({
    queueLength: 0,
    served: 0,
    averageWait: 0,
    elapsed: 0,
    servers: Array.from({ length: 3 }, () => ({ customerId: null, remaining: 0 })),
  });

  const queueRef = useRef<Customer[]>([]);
  const serversRef = useRef<Server[]>(snapshot.servers);
  const elapsedRef = useRef(0);
  const nextArrivalRef = useRef(exponential(60 / arrivalsPerMinute));
  const servedRef = useRef(0);
  const totalWaitRef = useRef(0);
  const nextIdRef = useRef(1);
  const runningRef = useRef(true);

  const theoretical = useMemo(
    () => theoreticalMetrics(arrivalsPerMinute, serviceSeconds, serverCount),
    [arrivalsPerMinute, serviceSeconds, serverCount],
  );

  const reset = () => {
    queueRef.current = [];
    serversRef.current = Array.from({ length: serverCount }, () => ({ customerId: null, remaining: 0 }));
    elapsedRef.current = 0;
    nextArrivalRef.current = exponential(60 / arrivalsPerMinute);
    servedRef.current = 0;
    totalWaitRef.current = 0;
    nextIdRef.current = 1;
    setSnapshot({
      queueLength: 0,
      served: 0,
      averageWait: 0,
      elapsed: 0,
      servers: [...serversRef.current],
    });
  };

  useEffect(() => {
    reset();
    // Reset whenever the queue's operating assumptions change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalsPerMinute, serviceSeconds, serverCount]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    let animationFrame = 0;
    let previous = performance.now();
    let lastUiUpdate = 0;

    const frame = (now: number) => {
      animationFrame = requestAnimationFrame(frame);
      const realDelta = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (!runningRef.current) return;

      const delta = realDelta * SIM_SPEED;
      elapsedRef.current += delta;
      nextArrivalRef.current -= delta;

      while (nextArrivalRef.current <= 0) {
        queueRef.current.push({ id: nextIdRef.current++, arrivedAt: elapsedRef.current });
        nextArrivalRef.current += exponential(60 / arrivalsPerMinute);
      }

      for (const server of serversRef.current) {
        if (server.customerId !== null) {
          server.remaining -= delta;
          if (server.remaining <= 0) {
            server.customerId = null;
            server.remaining = 0;
            servedRef.current++;
          }
        }

        if (server.customerId === null && queueRef.current.length > 0) {
          const customer = queueRef.current.shift();
          if (customer) {
            totalWaitRef.current += Math.max(0, elapsedRef.current - customer.arrivedAt);
            server.customerId = customer.id;
            server.remaining = exponential(serviceSeconds);
          }
        }
      }

      if (now - lastUiUpdate > 150) {
        lastUiUpdate = now;
        setSnapshot({
          queueLength: queueRef.current.length,
          served: servedRef.current,
          averageWait: servedRef.current > 0 ? totalWaitRef.current / servedRef.current : 0,
          elapsed: elapsedRef.current,
          servers: serversRef.current.map((server) => ({ ...server })),
        });
      }
    };

    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [arrivalsPerMinute, serviceSeconds]);

  const utilizationPercent = Math.round(theoretical.utilization * 100);

  return (
    <div className="experiment" id="queueing-lab">
      <div className="exp-head">
        <h2>EXP-03 · QUEUEING LAB</h2>
        <span className={`live ${theoretical.stable ? "" : "warning"}`}>
          {running ? "RUNNING" : "PAUSED"} · {theoretical.stable ? "STABLE SYSTEM" : "OVER CAPACITY"}
        </span>
      </div>
      <div className="panel queue-lab">
        <div className="queue-controls" aria-label="Queue simulation controls">
          <label>
            <span>ARRIVALS / MINUTE <b>{arrivalsPerMinute}</b></span>
            <input
              type="range"
              min="2"
              max="30"
              value={arrivalsPerMinute}
              onChange={(event) => setArrivalsPerMinute(Number(event.target.value))}
            />
          </label>
          <label>
            <span>AVG. SERVICE TIME <b>{serviceSeconds}s</b></span>
            <input
              type="range"
              min="6"
              max="45"
              value={serviceSeconds}
              onChange={(event) => setServiceSeconds(Number(event.target.value))}
            />
          </label>
          <label>
            <span>WORKERS / SERVERS <b>{serverCount}</b></span>
            <input
              type="range"
              min="1"
              max="6"
              value={serverCount}
              onChange={(event) => setServerCount(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="queue-stage">
          <div className="queue-line" aria-label={`${snapshot.queueLength} customers waiting`}>
            <span className="stage-label">WAITING · {snapshot.queueLength}</span>
            <div className="queue-people">
              {Array.from({ length: Math.min(snapshot.queueLength, MAX_VISIBLE_QUEUE) }, (_, index) => (
                <span className="customer" key={index} style={{ animationDelay: `${index * 35}ms` }} />
              ))}
              {snapshot.queueLength > MAX_VISIBLE_QUEUE && (
                <span className="overflow">+{snapshot.queueLength - MAX_VISIBLE_QUEUE}</span>
              )}
              {snapshot.queueLength === 0 && <span className="empty-queue">no one waiting</span>}
            </div>
          </div>
          <div className="server-bank">
            <span className="stage-label">IN SERVICE</span>
            <div className="servers">
              {snapshot.servers.map((server, index) => (
                <div className={`server ${server.customerId !== null ? "busy" : "idle"}`} key={index}>
                  <span className="server-number">0{index + 1}</span>
                  <span>{server.customerId !== null ? `serving #${server.customerId}` : "available"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="queue-stats">
          <div className="stat">
            <div className="label">UTILIZATION</div>
            <div className={`value ${theoretical.stable ? "teal" : "danger"}`}>{utilizationPercent}%</div>
            <div className="sub">capacity currently in demand</div>
          </div>
          <div className="stat">
            <div className="label">OBSERVED AVG. WAIT</div>
            <div className="value">{snapshot.served > 0 ? `${snapshot.averageWait.toFixed(1)}s` : "—"}</div>
            <div className="sub">across {snapshot.served.toLocaleString("en-US")} completed jobs</div>
          </div>
          <div className="stat">
            <div className="label">MODELLED AVG. WAIT</div>
            <div className="value teal">
              {Number.isFinite(theoretical.waitSeconds) ? `${theoretical.waitSeconds.toFixed(1)}s` : "∞"}
            </div>
            <div className="sub">M/M/c queue prediction</div>
          </div>
        </div>

        <div className="queue-actions">
          <span>{Math.floor(snapshot.elapsed / 60)}m {Math.floor(snapshot.elapsed % 60)}s simulated</span>
          <div>
            <button className="btn" onClick={() => setRunning((value) => !value)}>
              {running ? "❚❚ PAUSE" : "▶ RUN"}
            </button>
            <button className="btn" onClick={reset}>[ RESET ]</button>
          </div>
        </div>

        <p className="method">
          A queue can represent patients, support tickets, restaurant orders, warehouse jobs, or web requests.
          Push utilization toward 100% and watch waiting time become nonlinear; add capacity and see the system recover.
        </p>
      </div>
    </div>
  );
}
