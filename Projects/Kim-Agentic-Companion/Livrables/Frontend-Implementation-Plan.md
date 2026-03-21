# Kim Agentic Companion — Frontend Implementation Plan

## Context

Kim Agentic Companion is a Replika-style AI companion app. The backend is fully functional (chat, voice, MCP tools, memory, sessions) and deployed on Vercel. The current UI is ~500 lines of inline HTML/CSS/JS embedded in `server.ts` — a static 2D PNG avatar with a galaxy CSS background and a basic chat panel.

**The goal**: Build a production-grade frontend with a 3D avatar walking in a galaxy room, clothing/furniture customization, voice chat, and all tabs functional — deployable to Google Play Store and Apple App Store.

**The problem**: The inline HTML cannot scale. We need a proper React app, separated from the backend, with clean architecture that any agent can work on safely.

**Constraint**: All work is REMOTE-ONLY via `gh api repos/paulineduluc07-svg/Systema-Central-Continuum/contents/...`

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 + React 19 | App Router, static export for Capacitor |
| 3D | Three.js + React Three Fiber + drei | Dominant ecosystem, React-native integration |
| Avatar | Ready Player Me GLB + Mixamo animations | Fast MVP, customizable, standard skeleton |
| State (3D) | Zustand | Works outside React render cycle (animation loops) |
| State (app) | Jotai | Atomic, lightweight, localStorage persistence |
| Styling | Tailwind CSS | Matches existing glassmorphism design tokens |
| Mobile | Capacitor 7 | Single codebase → Play Store + App Store |
| Testing | Vitest + React Testing Library + Playwright | Same as backend, consistent tooling |
| Assets | gltf-transform + Draco compression | 90%+ size reduction on 3D models |

---

## Architecture

```
Projects/Kim-Agentic-Companion/
  Code/          ← UNTOUCHED (backend API)
  Frontend/      ← NEW (this plan)
    src/
      app/           → Next.js pages & layouts
      components/    → UI components (chat, scene, wardrobe, etc.)
      lib/           → API client, voice utils, 3D helpers
      stores/        → Zustand (3D) + Jotai (app data)
      hooks/         → React hooks
    public/
      models/        → GLB models, animations
      icons/         → PWA icons
    e2e/             → Playwright tests
    capacitor.config.ts
```

The frontend is a **standalone app** deployed on its own Vercel project. It talks to the backend via `NEXT_PUBLIC_API_URL`. Zero coupling.

---

## Phase 1 — Foundation: Next.js + Chat Parity

**Goal**: Replace inline HTML with a proper React app. Zero regressions. Galaxy background, 2D avatar, working chat, auth, tool listing.

**Files** (`Frontend/`):
```
package.json, tsconfig.json, next.config.ts, tailwind.config.ts
.env.example, .gitignore, README.md, AGENT-INSTRUCTIONS.md

src/app/layout.tsx, page.tsx, globals.css
src/components/ui/          → GlassPanel, Button, Input, ChatBubble, TabBar, Badge
src/components/layout/      → TopNav, CosmosBackground (CSS), AppShell
src/components/chat/        → ChatPanel, ChatLog, ChatInput, TypingIndicator
src/components/avatar/      → AvatarStage (2D image + orb)
src/components/sidebar/     → InfoCards, ToolList
src/lib/api/client.ts       → Typed KimApiClient (all endpoints)
src/lib/api/types.ts        → Mirror of backend types
src/lib/auth/token.ts       → localStorage token management
src/lib/config.ts           → Env var access
src/stores/                 → authStore, chatStore, toolStore (Jotai)
src/hooks/                  → useChat, useAuth, useTools
```

**Dependencies**: next, react, react-dom, jotai, clsx, tailwindcss, vitest, @testing-library/react, playwright

**Design tokens preserved**:
- `--bg-1: #050714`, `--bg-2: #13182f`, `--accent: #ff5f7c`, `--accent-2: #68fff0`
- `--glass: rgba(33,38,78,0.52)`, `--glass-edge: rgba(183,194,255,0.22)`
- Glassmorphism: `backdrop-filter: blur(14px)`

**API client** (`KimApiClient`):
- `createSession(userId)` → `POST /v1/sessions`
- `chat(req)` → `POST /v1/chat`
- `getTools()` → `GET /v1/tools`
- `synthesizeVoice(req)` → `POST /v1/voice/synthesize`
- `health()` → `GET /health`
- All methods typed, single `fetch` wrapper, Bearer auth header

**Verify**: Deploy to Vercel. Side-by-side comparison with current staging. Chat works. Tools list populates. No regressions.

---

## Phase 2 — Functional Tabs: Memory, Profile, Activities, Diary

**Goal**: All 6 tabs clickable and functional. Memory CRUD, personality sliders, activity timeline, diary entries.

**Files** (`Frontend/src/`):
```
app/(tabs)/memory/page.tsx, profile/page.tsx, activities/page.tsx, diary/page.tsx
components/memory/    → MemoryList, MemoryEditor, MemorySearch
components/profile/   → ProfileCard, PersonalitySliders
components/activities/ → ActivityTimeline, ActivityItem
components/diary/     → DiaryEntry, DiaryComposer
stores/               → memoryStore, profileStore, activityStore
hooks/                → useMemory, useActivities
```

**Key decisions**:
- Tab routing via Next.js App Router route groups
- Memory: fetched via chat API ("Show me what you remember") until a dedicated `GET /v1/memories` endpoint exists
- Profile personality sliders: stored client-side (Jotai + localStorage), injected into chat context
- Activities: derived from local chat history
- Diary: uses `POST /v1/chat` with `[DIARY]` prefix prompt

**Verify**: All tabs render. Memory shows entries. Profile sliders persist across reload. Chat still works.

---

## Phase 3 — Voice Chat + Audio

**Goal**: Voice input (browser Speech Recognition) + voice output (ElevenLabs TTS via backend). Push-to-talk and toggle modes.

**Files** (`Frontend/src/`):
```
components/voice/     → VoiceButton, VoiceWaveform, AudioPlayer, VoiceControls
lib/voice/            → speechRecognition.ts, audioPlayback.ts
stores/voiceStore.ts
hooks/                → useVoice, useTTS
```

**Key decisions**:
- STT: Browser `SpeechRecognition` API (Chrome/Edge). Mic button hidden on unsupported browsers.
- TTS: `POST /v1/voice/synthesize` → decode `audioBase64` → play via `<audio>` element
- Push-to-talk: hold button to record, release to send transcript
- Toggle mode: click to start/stop continuous listening
- VoiceWaveform: CSS-only animation (no canvas)

**Verify**: Mic button appears (Chrome). Speak → transcript sent as message. Kim's reply plays as audio. Toggle works.

---

## Phase 4 — 3D Galaxy Room + Kim Avatar

**Goal**: Replace 2D avatar + CSS starfield with full Three.js 3D scene. Kim avatar with Mixamo animations standing in a galaxy room.

**Files** (`Frontend/src/`):
```
components/scene/     → SceneCanvas, GalaxyRoom, Starfield, NebulaLighting, CameraController
components/avatar/    → KimAvatar, AvatarAnimations, AnimationController, AvatarFallback
lib/three/            → loaders.ts, materials.ts, particles.ts
stores/sceneStore.ts  → Zustand (camera, animation state, room state)
hooks/                → useAvatar, useScene

public/models/kim-avatar.glb
public/animations/    → idle.fbx, wave.fbx, walk.fbx, sit.fbx, dance.fbx
```

**Dependencies**: three, @react-three/fiber, @react-three/drei, zustand, @types/three

**Key decisions**:
- SceneCanvas: R3F `<Canvas>` with `<Suspense>` fallback. WebGL detection → 2D fallback if unsupported.
- GalaxyRoom: Floor plane + transparent glass walls + ambient fog. ~10x10 units.
- Starfield: Instanced `<Points>` from drei. 2000 particles with twinkle shader.
- NebulaLighting: Pink/cyan/purple PointLights with intensity oscillation.
- KimAvatar: Ready Player Me GLB loaded via `useGLTF`. Animations via `useAnimations` from drei.
- AnimationController: Kim waves on reply, idles during typing, walks when transitioning.
- Performance budget: 60fps mobile, avatar < 5MB (Draco), no shadow maps.
- Camera: OrbitControls with constrained pitch (no underground), auto-rotate.

**Verify**: 3D scene loads. Stars + nebula visible. Kim stands with idle animation. Waves on message. Camera orbits. Fallback on no-WebGL. Load time < 3s on 4G.

---

## Phase 5 — Customization: Wardrobe + Room Decoration

**Goal**: Change Kim's clothes/accessories. Add/move furniture in the room. Replika-style personalization.

**Files** (`Frontend/src/`):
```
components/wardrobe/  → WardrobePanel, OutfitCard, AccessorySlot
components/room/      → RoomEditor, FurnitureItem, FurnitureCatalog, RoomPresets
lib/customization/    → meshSwapper.ts, furniturePlacer.ts, catalog.ts
stores/               → wardrobeStore, roomStore (Zustand + persist)
hooks/                → useWardrobe, useRoomEditor

public/models/outfits/    → casual-top.glb, formal-top.glb, etc.
public/models/furniture/  → chair.glb, table.glb, lamp.glb, plant.glb, bookshelf.glb
```

**Key decisions**:
- Wardrobe: Slot-based system (hair, top, bottom, shoes, accessory). Each slot is an independent mesh swapped on the shared skeleton via `meshSwapper.ts`.
- Outfit catalog: Static JSON defining items with `{ id, name, slot, modelPath, thumbnailPath, locked }`.
- Room editor: "Room" tab activates top-down camera. Drag furniture from catalog onto floor. Raycasting for placement. Snap to 0.5-unit grid.
- Room presets: 4 pre-built layouts ("Cozy", "Minimal", "Studio", "Galaxy Lounge").
- Persistence: Zustand `persist` middleware → localStorage. Future: sync to backend.

**Verify**: Wardrobe panel opens. Select outfit → avatar mesh changes. Room tab → drag chair → appears in 3D. Customizations survive reload.

---

## Phase 6 — Auth UX + MCP Tools UI + Settings

**Goal**: Production auth flow (no raw Bearer token), visual tool permission manager, settings page.

**Files** (`Frontend/src/`):
```
app/login/page.tsx, app/settings/page.tsx
components/auth/      → LoginForm, AuthGuard, TokenRefresher
components/tools/     → ToolsPanel, ToolCard, PermissionBadge, ToolInvokeDialog, ConfirmationDialog
components/settings/  → SettingsForm, AccountSection, DangerZone
lib/auth/             → authProvider.ts, bearerAuth.ts, magicLinkAuth.ts (future)
stores/settingsStore.ts
hooks/usePermissions.ts
```

**Key decisions**:
- Login: Friendly "Enter your companion access code" input (Bearer token wrapped in nice UX). Future: magic link auth.
- AuthGuard: Wraps all routes. No token → redirect to `/login`.
- ConfirmationDialog: Critical safety UX. Shows tool name, description, input, sensitivity. Buttons: "Allow once", "Always allow", "Deny". Decision sent via `grantedTools` / `permissionContext` in next chat call.
- Settings: Voice auto-play, theme toggle, notification prefs, clear data, logout.

**Verify**: `/` redirects to `/login`. Enter code → chat loads. Tool confirmation dialog works during chat. Settings persist.

---

## Phase 7 — PWA + Capacitor Mobile

**Goal**: Installable PWA with offline support. Native iOS + Android builds for App Store / Play Store.

**Files** (`Frontend/`):
```
src/app/manifest.ts           → PWA manifest
public/icons/                 → icon-192.png, icon-512.png, apple-touch-icon.png
capacitor.config.ts
scripts/build-mobile.sh       → next build + cap sync + cap open
ios/                          → (Generated by cap init)
android/                      → (Generated by cap init)
```

**Dependencies**: @capacitor/core, @capacitor/app, @capacitor/haptics, @capacitor/keyboard, @capacitor/status-bar, @capacitor/splash-screen, serwist

**Key decisions**:
- Next.js `output: 'export'` for static build (Capacitor requires static files)
- Service worker via Serwist: cache-first for app shell + models, network-first for API
- Capacitor 7: webDir → static export output
- Safe area insets for iOS notch via `env(safe-area-inset-*)`
- Android back button handling via Capacitor App plugin
- Splash screen: galaxy-themed

**Verify**: Lighthouse PWA score > 90. Install prompt on Chrome mobile. `cap sync` succeeds. iOS Simulator runs. Android Emulator runs. Offline → app shell loads with offline indicator.

---

## Phase Dependencies

```
Phase 1 (Foundation + Chat)
    ↓
Phase 2 (Tabs)
    ↓
Phase 3 (Voice)
    ↓
Phase 4 (3D Scene)        ← biggest phase
    ↓
Phase 5 (Customization)
    ↓
Phase 6 (Auth + Tools UI)
    ↓
Phase 7 (PWA + Mobile)
```

Phases 3 and 6 could technically run in parallel with other phases, but sequential execution is safer for agent handoff.

---

## Agent Handoff Protocol

After EACH phase, the following must be true:

1. `Frontend/README.md` updated: working features, commands, env vars, known limitations
2. `Frontend/AGENT-INSTRUCTIONS.md` updated: last completed phase, next phase details
3. All tests pass: `npm test` + `npm run build`
4. Deployed and verified on staging URL
5. `Roadmap.md` and `Todo.md` updated in the project root

This ensures any agent can pick up at any phase boundary without context loss.

---

## Backend Files Referenced (READ-ONLY)

- `Code/src/api/server.ts` — Current inline HTML to replicate in Phase 1
- `Code/src/shared/types.ts` — TypeScript interfaces to mirror in `lib/api/types.ts`
- `Code/vercel.json` — Backend deployment config (frontend must not conflict)
- `Code/src/agent-core/kimAgent.ts` — Agent response shape
- `Code/src/integrations/elevenLabsClient.ts` — Voice synthesis contract

---

## Verification (End-to-End)

After all 7 phases:
- Web: Visit frontend URL. Login. Chat with Kim in 3D room. Voice works. Change outfit. Place furniture. Grant/revoke tools.
- iOS: Build via Xcode. Install on device. Full feature parity.
- Android: Build via Android Studio. Install on device. Full feature parity.
- Offline: Kill network. App shell loads. Chat shows offline. Reconnects on restore.
- Any agent: Read `AGENT-INSTRUCTIONS.md`. Run `npm test`. Run `npm run build`. Continue work.
