import MonteCarloPi from "./components/MonteCarloPi";
import GaltonBoard from "./components/GaltonBoard";
import QueueingLab from "./components/QueueingLab";

const GITHUB = "https://github.com/baselarafat";
const LINKEDIN = "https://www.linkedin.com/in/basil-arafat/";

const FEATURED_WORK = [
  {
    id: "WORK-01",
    title: "OnPace",
    desc: "A pacing companion for long efforts — plan splits, track progress in real time, and let the numbers tell you when to push.",
    tags: "TypeScript · React",
    status: "PRIVATE PROJECT",
  },
  {
    id: "WORK-02",
    title: "Seasons & Soil",
    desc: "A Unity strategy simulation about planting, harvesting, and surviving changing seasons through interconnected resource systems.",
    tags: "Unity · C# · simulation",
    status: "PRIVATE PROJECT",
  },
];

const OPEN_SOURCE_PROJECTS = [
  {
    id: "CODE-01",
    title: "Slots Game",
    desc: "A full slots experience: reel math, paytables, and bonus features — the probability theory I work with daily, made playable.",
    tags: "Unity · TypeScript · probability",
    url: `${GITHUB}/slots-game`,
  },
  {
    id: "CODE-02",
    title: "FinWise",
    desc: "Personal finance, minus the spreadsheet dread. Budgets, trends, and forecasts in one calm dashboard.",
    tags: "React · Django · PostgreSQL",
    url: `${GITHUB}/FinWise`,
  },
  {
    id: "CODE-03",
    title: "Monte Carlo Simulation",
    desc: "The engine behind EXP-01: Monte Carlo methods in Python — sampling, convergence, and visualization of stochastic processes.",
    tags: "Python · statistics",
    url: `${GITHUB}/monte-carlo-simulation`,
  },
];

export default function App() {
  const scrollToSim = () => {
    document.getElementById("monte-carlo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="#">Basil Arafat <small>◇</small></a>
        <nav className="nav">
          <a href="#monte-carlo">Experiments</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <button className="btn btn-primary" onClick={scrollToSim}>▶ RUN SIM</button>
        </nav>
      </header>

      <section className="hero">
        <h1>Probability Playground</h1>
        <p className="tagline">Mathematician · Game Developer · Interactive probability experiments</p>
        <p className="lede">
          I'm Basil — a software engineer and mathematician. I build <b>games, web apps, and
          tools — and the math behind them.</b> This site doesn't describe probability.
          It <b>runs</b> it. Every number below is being computed live, in your browser, right now.
        </p>
        <div className="tags">
          <span className="tag">open source</span>
          <span className="tag alt">math + code</span>
          <span className="tag">react + canvas</span>
        </div>
      </section>

      <MonteCarloPi />
      <GaltonBoard />
      <QueueingLab />

      <div className="section-label" id="projects">// FEATURED WORK</div>
      <div className="projects-grid">
        {FEATURED_WORK.map((p) => (
          <article key={p.id} className="exp-card private-card">
            <span className="exp-id">{p.id}</span>
            <span className="project-status">{p.status}</span>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <span className="go">{p.tags}</span>
          </article>
        ))}
      </div>

      <div className="section-label">// OPEN SOURCE</div>
      <div className="projects-grid">
        {OPEN_SOURCE_PROJECTS.map((p) => (
          <a key={p.id} className="exp-card" href={p.url} target="_blank" rel="noreferrer">
            <span className="exp-id">{p.id}</span>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <span className="go">{p.tags} →</span>
          </a>
        ))}
      </div>

      <footer className="site-footer" id="contact">
        <span>© 2026 Basil Arafat · Probability Playground — crafting playful math &amp; game systems</span>
        <span className="links">
          <a href={GITHUB} target="_blank" rel="noreferrer">GitHub</a>
          <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn</a>
        </span>
      </footer>
    </div>
  );
}
