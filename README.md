# Basil Arafat — Probability Playground

A personal portfolio built as a collection of interactive probability and systems experiments.

## Local development

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

The production build is configured for GitHub Pages at `/personal-portfolio/`.

## Experiments

- Monte Carlo π estimation
- Galton board / central limit theorem
- Queueing Lab for exploring utilization, capacity, and wait times

## Deployment

The editable Vite source lives on `main`. GitHub Actions builds the site, uploads the generated
`dist/` artifact, and deploys it directly to GitHub Pages without committing generated files.
