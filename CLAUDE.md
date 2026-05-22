# ELBIO — Project Pointer for Sub-Agents

ELBIO is a premium creative portfolio HTML template targeting ThemeForest's $29–$79 price band. The build is executed by three sub-agents (team-frontend, team-motion, team-reviewer) coordinated through `coordination.md` and `tests/*.md`. Read `coordination.md` BEFORE any other file.

## Required output

All paths are relative to this directory (`alissio/elbio/`). Do NOT create a project subfolder.

- Pages: `index.html`, `project-single.html`, `blog-single.html`, `preview.html`, `contact.html`, `documentation/index.html`
- Styles: `assets/css/{variables,base,nav,sections,responsive,motion}.css`
- Scripts: `assets/js/{main,forms,theme-init}.js` and `assets/js/motion/{hero,scroll,cursor,reveals,transitions,index}.js`
- Data: `assets/data/projects.json` with 6–12 portfolio items

## Quality guardrails (HARD)

The full list is in `coordination.md` under `## Quality Guardrails`. Summary:

1. No opacity-only fades. GSAP spring easings + Lenis + ScrollTrigger.
2. 6–12 portfolio items with full case-study data in `project-single.html`.
3. Documentation page covers structure, color/font customizing, adding projects, Web3Forms setup.
4. Editorial typography, 3D tilt cards, noise/grain, creative cursor.
5. Hero is abstract layered typography OR bold portrait with clip-path reveals — never generic stock photo.

## Reference sites

Match or exceed these in polish:

- Hebo: https://html.aqlova.com/hebo-prev/hebo/index-personal-portfolio-2.html
- Orisa: https://orisa-html-demo.pages.dev/index-5
- Jesper: https://demo.themetorium.net/html/jesper/landing-page-1.html

## Coordination rules

- Strict file boundaries (see each agent's `.claude/agents/*.md`). team-frontend never edits motion files; team-motion never edits HTML or core CSS.
- Communicate via `coordination.md` sections only. No agent calls another agent.
- Nothing is "done" until team-reviewer marks it APPROVED in `coordination.md` under `## Reviewer Sign-Off`.
- Test all responsive breakpoints: 375 / 768 / 1280 / 1920 px.
