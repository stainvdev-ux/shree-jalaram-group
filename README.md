# Shree Jalaram Group — website

An immersive, scroll-driven site for Shree Jalaram Group and its 13 ventures. The home page is a journey through time: a particle "1977" opens the story, then scrolling carries you along a flowing particle ribbon past the Group's milestones, each a ring you can open.

**Stack:** Next.js 16 (App Router) · Lenis smooth scroll on GSAP's ticker · GSAP ScrollTrigger + SplitText · React Three Fiber with custom GLSL point shaders · three.js EffectComposer (bloom → output → film grain)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| Path | What |
| --- | --- |
| `lib/content.ts` | All copy: group info, ventures, news, journey milestones, contact details |
| `lib/ribbon.ts` | Ribbon shape (JS + matching GLSL), camera path, milestone positions |
| `lib/scene.ts` | Shared state the 3D scene reads (journey progress, ambient mode, dim) |
| `components/three/` | Background gradient, ribbon + pearls, bokeh/dust, particle "1977", camera rig, post-processing |
| `components/home/Journey.tsx` | Sticky journey section: intro, milestone rings, year scrubber, story drawer |
| `components/home/Sections.tsx` | Ventures grid, statement + stats, values |
| `components/SmoothScroll.tsx` | Lenis ↔ GSAP/ScrollTrigger wiring |
| `components/Transition.tsx` | Page transitions (`TLink`) |
| `app/globals.css` | Theme tokens and all styles |

To add a milestone, append it to `milestones` in `lib/content.ts`; rings and the scrubber space themselves along the ribbon automatically.

Venture photos and logos are loaded from `shreejalaramgroup.com` (see `photo()` / `logo()` in `lib/content.ts`). Original copies are kept in `assets-original/` if you'd rather self-host them in `public/`.
