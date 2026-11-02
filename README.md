# Shree Jalaram Group — website

Immersive corporate site for Shree Jalaram Group and its 13 ventures.

**Stack:** Next.js 16 (App Router) · Lenis 1.3 smooth scroll on GSAP's ticker · GSAP ScrollTrigger + SplitText · React Three Fiber (custom GLSL particle shaders)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| Path | What |
| --- | --- |
| `lib/content.ts` | All copy: group info, ventures, news, contact details |
| `lib/scene.ts` | Shared state the 3D scene reads (shape, color, position) |
| `components/three/` | Particle sculpture, particle ocean, shape generators |
| `components/home/HorizontalVentures.tsx` | Pinned horizontal venture rail |
| `components/SmoothScroll.tsx` | Lenis ↔ GSAP/ScrollTrigger wiring |
| `components/Transition.tsx` | Page transitions (`TLink`) |
| `app/globals.css` | Theme tokens and all styles |

Venture photos and logos are loaded from `shreejalaramgroup.com` (see `photo()` / `logo()` in `lib/content.ts`). Original copies are kept in `assets-original/` if you'd rather self-host them in `public/`.
