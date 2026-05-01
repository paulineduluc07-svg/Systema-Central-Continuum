import { trpc } from "@/lib/trpc";
import { Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ============================================================
// Floating Notes — Systema Agency (desktop, passe A)
// Design source: design_handoff_floating_notes/
// Persistance: tRPC floatingNotes.* (Neon via Drizzle)
// ============================================================

type AccentKey = "pink" | "violet" | "lavender" | "cyan" | "mint";
type StyleKey = "neon" | "frost" | "holo";

type ChecklistItem = { text: string; done: boolean };

type Note = {
  id: number;
  title: string;
  body: string;
  checklist: ChecklistItem[];
  x: number;
  y: number;
  w: number;
  h: number;
  accent: AccentKey;
  style: StyleKey | null;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const ACCENT_HUES: Record<AccentKey, number> = {
  pink: 350,
  violet: 310,
  lavender: 280,
  cyan: 220,
  mint: 160,
};

const TWEAKS = {
  style: "neon" as StyleKey,
  accent: "pink" as AccentKey,
  blur: 22,
  opacity: 0.9,
  grain: true,
  showGrid: true,
  defaultSize: { w: 240, h: 220 },
};

const MIN_W = 180;
const MIN_H = 160;
const DEBOUNCE_MS = 600;

// ============================================================
// Page
// ============================================================

export default function FloatingNotesPage() {
  const utils = trpc.useUtils();
  const activeQuery = trpc.floatingNotes.listActive.useQuery();
  const archivedQuery = trpc.floatingNotes.listArchived.useQuery();

  const [vaultOpen, setVaultOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const [localNotes, setLocalNotes] = useState<Note[] | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Sync server -> local sur chaque refetch (mais on n'écrase pas pendant qu'on tape)
  useEffect(() => {
    if (activeQuery.data) {
      setLocalNotes(activeQuery.data as Note[]);
    }
  }, [activeQuery.data]);

  const notes = localNotes ?? [];
  const archived = (archivedQuery.data ?? []) as Note[];

  const createMutation = trpc.floatingNotes.create.useMutation({
    onSuccess: () => {
      void utils.floatingNotes.listActive.invalidate();
    },
    onError: (e) => toast.error(`Création impossible : ${e.message}`),
  });

  const updateMutation = trpc.floatingNotes.update.useMutation({
    onError: (e) => toast.error(`Sauvegarde impossible : ${e.message}`),
  });

  const archiveMutation = trpc.floatingNotes.archive.useMutation({
    onSuccess: () => {
      void utils.floatingNotes.listActive.invalidate();
      void utils.floatingNotes.listArchived.invalidate();
    },
    onError: (e) => toast.error(`Archivage impossible : ${e.message}`),
  });

  const restoreMutation = trpc.floatingNotes.restore.useMutation({
    onSuccess: () => {
      void utils.floatingNotes.listActive.invalidate();
      void utils.floatingNotes.listArchived.invalidate();
    },
    onError: (e) => toast.error(`Restauration impossible : ${e.message}`),
  });

  const deleteMutation = trpc.floatingNotes.delete.useMutation({
    onSuccess: () => {
      void utils.floatingNotes.listActive.invalidate();
      void utils.floatingNotes.listArchived.invalidate();
    },
    onError: (e) => toast.error(`Suppression impossible : ${e.message}`),
  });

  // Debounce buffer par note
  const pendingPatchRef = useRef<Map<number, Partial<Note>>>(new Map());
  const debounceTimerRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const flushPatch = (id: number) => {
    const patch = pendingPatchRef.current.get(id);
    if (!patch) return;
    pendingPatchRef.current.delete(id);
    const timer = debounceTimerRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      debounceTimerRef.current.delete(id);
    }
    updateMutation.mutate({ id, ...patch });
  };

  const queuePatch = (id: number, patch: Partial<Note>) => {
    const existing = pendingPatchRef.current.get(id) ?? {};
    pendingPatchRef.current.set(id, { ...existing, ...patch });
    const timer = debounceTimerRef.current.get(id);
    if (timer) clearTimeout(timer);
    debounceTimerRef.current.set(
      id,
      setTimeout(() => flushPatch(id), DEBOUNCE_MS),
    );
  };

  // Flush au unmount
  useEffect(() => {
    return () => {
      const ids = Array.from(pendingPatchRef.current.keys());
      ids.forEach(flushPatch);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  }, []);

  const updateNote = (id: number, patch: Partial<Note>) => {
    setLocalNotes((prev) => (prev ?? []).map((n) => (n.id === id ? { ...n, ...patch } : n)));
    // n'envoie au backend que les champs persistables (pas archivedAt etc.)
    const persistable: Partial<Note> = {};
    for (const k of ["title", "body", "checklist", "x", "y", "w", "h", "accent", "style"] as const) {
      if (k in patch) (persistable as Record<string, unknown>)[k] = patch[k];
    }
    if (Object.keys(persistable).length > 0) {
      queuePatch(id, persistable);
    }
  };

  const handleArchive = (id: number) => {
    flushPatch(id);
    setLocalNotes((prev) => (prev ?? []).filter((n) => n.id !== id));
    archiveMutation.mutate({ id });
  };

  const handleDelete = (id: number) => {
    flushPatch(id);
    setLocalNotes((prev) => (prev ?? []).filter((n) => n.id !== id));
    deleteMutation.mutate({ id });
  };

  const handleRestore = (id: number) => {
    restoreMutation.mutate({ id });
  };

  const handlePurge = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const handleCreate = (clientX?: number, clientY?: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    let x = 200 + Math.floor(Math.random() * 200);
    let y = 160 + Math.floor(Math.random() * 160);
    if (rect && clientX != null && clientY != null) {
      x = Math.max(0, Math.round(clientX - rect.left - TWEAKS.defaultSize.w / 2));
      y = Math.max(0, Math.round(clientY - rect.top - TWEAKS.defaultSize.h / 2));
    }
    createMutation.mutate({
      title: "",
      body: "",
      checklist: [],
      x,
      y,
      w: TWEAKS.defaultSize.w,
      h: TWEAKS.defaultSize.h,
      accent: TWEAKS.accent,
      style: null,
    });
  };

  const onBoardDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== boardRef.current) return;
    handleCreate(e.clientX, e.clientY);
  };

  return (
    <main
      className="-mt-20 min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/backgrounds/main-v2.jpg)" }}
    >
      {/* Bouton "Tiroir" flottant sous la navbar */}
      <button
        onClick={() => setVaultOpen(true)}
        className="fixed right-5 top-[88px] z-40 flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/25"
        title="Ouvrir le tiroir des archives"
      >
        <ArchiveIcon className="h-3.5 w-3.5" />
        <span>Tiroir</span>
        {archived.length > 0 && (
          <span
            className="rounded-md px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-white"
            style={{ background: "oklch(75% 0.2 350 / 0.55)" }}
          >
            {archived.length}
          </span>
        )}
      </button>

      {/* Board free-form */}
      <div
        ref={boardRef}
        onDoubleClick={onBoardDoubleClick}
        className="relative h-[calc(100vh-80px)] w-full overflow-hidden"
        style={{
          marginTop: 80,
          backgroundImage: TWEAKS.showGrid
            ? `radial-gradient(oklch(95% 0.04 320 / 0.18) 1px, transparent 1px)`
            : "none",
          backgroundSize: "32px 32px",
        }}
      >
        {activeQuery.isLoading && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-2xl border border-white/30 bg-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white/80 backdrop-blur-md">
              Chargement des notes…
            </div>
          </div>
        )}

        {!activeQuery.isLoading && notes.length === 0 && (
          <div
            className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[13px] uppercase tracking-widest"
            style={{ color: "oklch(95% 0.04 320 / 0.55)" }}
          >
            ◇ Double-cliquez pour créer une note
          </div>
        )}

        {notes.map((note) => (
          <FloatingNote
            key={note.id}
            note={note}
            focused={focusedId === note.id}
            onFocus={() => setFocusedId(note.id)}
            onChange={(patch) => updateNote(note.id, patch)}
            onArchive={() => handleArchive(note.id)}
            onDelete={() => handleDelete(note.id)}
          />
        ))}

        <CreateFAB onCreate={() => handleCreate()} disabled={createMutation.isPending} />
      </div>
<VaultDrawer
  open={vaultOpen}
  activeNotes={notes}
  archived={archived}
  loading={archivedQuery.isLoading}
  onClose={() => setVaultOpen(false)}
  onRestore={handleRestore}
  onDelete={handlePurge}
  onArchive={handleArchive}
  onRescue={rescueNotes}
/>
    </main>
  );
}

// ============================================================
// FloatingNote — drag + resize wrapper
// ============================================================

type FloatingNoteProps = {
  note: Note;
  focused: boolean;
  onFocus: () => void;
  onChange: (patch: Partial<Note>) => void;
  onArchive: () => void;
  onDelete: () => void;
};

function FloatingNote({ note, focused, onFocus, onChange, onArchive, onDelete }: FloatingNoteProps) {
  const [pos, setPos] = useState({ x: note.x, y: note.y });
  const [size, setSize] = useState({ w: note.w, h: note.h });
  const [dragging, setDragging] = useState(false);

  // Sync depuis les props si elles changent côté serveur (et qu'on ne drag pas)
  useEffect(() => {
    if (!dragging) setPos({ x: note.x, y: note.y });
  }, [note.x, note.y, dragging]);
  useEffect(() => {
    if (!dragging) setSize({ w: note.w, h: note.h });
  }, [note.w, note.h, dragging]);

  const startDrag = (e: React.PointerEvent) => {
    onFocus();
    const start = { mx: e.clientX, my: e.clientY, x: pos.x, y: pos.y };
    setDragging(true);
    const move = (ev: PointerEvent) => {
      setPos({
        x: Math.max(0, start.x + (ev.clientX - start.mx)),
        y: Math.max(0, start.y + (ev.clientY - start.my)),
      });
    };
    const up = (ev: PointerEvent) => {
      const nx = Math.max(0, Math.round(start.x + (ev.clientX - start.mx)));
      const ny = Math.max(0, Math.round(start.y + (ev.clientY - start.my)));
      setDragging(false);
      onChange({ x: nx, y: ny });
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    onFocus();
    const start = { mx: e.clientX, my: e.clientY, w: size.w, h: size.h };
    setDragging(true);
    const move = (ev: PointerEvent) => {
      setSize({
        w: Math.max(MIN_W, start.w + (ev.clientX - start.mx)),
        h: Math.max(MIN_H, start.h + (ev.clientY - start.my)),
      });
    };
    const up = (ev: PointerEvent) => {
      const nw = Math.max(MIN_W, Math.round(start.w + (ev.clientX - start.mx)));
      const nh = Math.max(MIN_H, Math.round(start.h + (ev.clientY - start.my)));
      setDragging(false);
      onChange({ w: nw, h: nh });
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  const accentH = ACCENT_HUES[note.accent ?? TWEAKS.accent];
  const styleKey: StyleKey = note.style ?? TWEAKS.style;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: focused ? 60 : 45,
        touchAction: "none",
      }}
      onPointerDown={onFocus}
    >
      <NoteShell
        styleKey={styleKey}
        accentH={accentH}
        width={size.w}
        height={size.h}
        dragging={dragging}
        focused={focused}
        onArchive={onArchive}
        onClose={onDelete}
        onDragHandlePointerDown={startDrag}
      >
        <NoteBody note={note} styleKey={styleKey} accentH={accentH} onChange={onChange} />
        {/* Resize handle */}
        <div
          onPointerDown={startResize}
          className="absolute"
          style={{ right: 2, bottom: 2, width: 14, height: 14, cursor: "nwse-resize", zIndex: 5 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 12 L12 3 M7 12 L12 7 M11 12 L12 11"
              stroke={`oklch(${styleKey === "holo" ? "85%" : "40%"} 0.05 ${accentH} / 0.5)`}
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </NoteShell>
    </div>
  );
}

// ============================================================
// NoteShell — three glass treatments
// ============================================================

type NoteShellProps = {
  styleKey: StyleKey;
  accentH: number;
  width: number;
  height: number;
  dragging: boolean;
  focused: boolean;
  onArchive: () => void;
  onClose: () => void;
  onDragHandlePointerDown: (e: React.PointerEvent) => void;
  children: React.ReactNode;
};

function NoteShell({
  styleKey,
  accentH,
  width,
  height,
  dragging,
  focused,
  onArchive,
  onClose,
  onDragHandlePointerDown,
  children,
}: NoteShellProps) {
  const o = TWEAKS.opacity;
  const blur = TWEAKS.blur;

  const baseStyle: React.CSSProperties = {
    width,
    height,
    backdropFilter: `blur(${blur}px) saturate(140%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(140%)`,
    transition: dragging ? "none" : "transform 220ms cubic-bezier(.2,.7,.2,1), box-shadow 220ms",
    transform: dragging ? "scale(1.02)" : focused ? "scale(1.005)" : "scale(1)",
  };

  let glass: React.CSSProperties = {};
  let scanline: React.ReactNode = null;
  let glow: React.ReactNode = null;

  if (styleKey === "neon") {
    glass = {
      background: `linear-gradient(135deg, oklch(95% 0.04 ${accentH} / ${o * 0.55}) 0%, oklch(70% 0.18 ${accentH} / ${o * 0.35}) 100%)`,
      border: `1px solid oklch(96% 0.04 ${accentH} / ${o * 0.7})`,
      boxShadow: `0 24px 60px -20px oklch(50% 0.2 ${accentH} / 0.55), inset 0 1px 0 0 oklch(99% 0.02 ${accentH} / 0.6), inset 0 -1px 0 0 oklch(60% 0.18 ${accentH} / 0.3)`,
      borderRadius: 18,
    };
  } else if (styleKey === "frost") {
    glass = {
      background: `linear-gradient(180deg, oklch(98% 0.015 ${accentH} / ${o * 0.7}) 0%, oklch(94% 0.03 ${accentH} / ${o * 0.55}) 100%)`,
      border: `1px solid oklch(99% 0.005 ${accentH} / ${o * 0.85})`,
      boxShadow: `0 18px 40px -16px oklch(40% 0.05 ${accentH} / 0.4), inset 0 1px 0 0 rgba(255,255,255,0.7)`,
      borderRadius: 14,
    };
  } else {
    glass = {
      background: `linear-gradient(135deg, oklch(80% 0.15 ${accentH} / ${o * 0.25}) 0%, oklch(70% 0.18 ${(accentH + 60) % 360} / ${o * 0.3}) 100%)`,
      border: `1px solid oklch(90% 0.12 ${accentH} / ${o * 0.9})`,
      boxShadow: `inset 0 0 0 1px oklch(95% 0.1 ${accentH} / 0.3), 0 0 24px 0 oklch(75% 0.2 ${accentH} / 0.45), 0 24px 60px -20px oklch(40% 0.2 ${accentH} / 0.6)`,
      borderRadius: 10,
    };
    scanline = (
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 10,
          pointerEvents: "none",
          background: `repeating-linear-gradient(180deg, transparent 0 3px, oklch(90% 0.1 ${accentH} / 0.06) 3px 4px)`,
          mixBlendMode: "screen",
        }}
      />
    );
    glow = (
      <div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: 12,
          pointerEvents: "none",
          boxShadow: `0 0 16px 0 oklch(80% 0.2 ${accentH} / 0.4)`,
        }}
      />
    );
  }

  const handleBg =
    styleKey === "holo"
      ? `linear-gradient(180deg, oklch(85% 0.16 ${accentH} / 0.35) 0%, transparent 100%)`
      : `linear-gradient(180deg, oklch(98% 0.04 ${accentH} / 0.4) 0%, transparent 100%)`;
  const handleBorder =
    styleKey === "holo"
      ? `1px solid oklch(85% 0.15 ${accentH} / 0.3)`
      : `1px solid oklch(98% 0.02 ${accentH} / 0.25)`;
  const iconColor = styleKey === "holo" ? `oklch(95% 0.05 ${accentH})` : `oklch(35% 0.05 ${accentH})`;

  return (
    <div
      style={{
        ...baseStyle,
        ...glass,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {glow}
      {scanline}
      {TWEAKS.grain && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.18,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      )}
      {/* Drag handle bar */}
      <div
        onPointerDown={onDragHandlePointerDown}
        style={{
          height: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          cursor: "grab",
          flexShrink: 0,
          background: handleBg,
          borderBottom: handleBorder,
        }}
      >
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: `oklch(75% 0.2 ${accentH})`,
              boxShadow: `0 0 6px oklch(75% 0.22 ${accentH})`,
            }}
          />
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: `oklch(85% 0.1 ${accentH} / 0.6)`,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onArchive}
            title="Archiver"
            style={iconButtonStyle(iconColor)}
          >
            <ArchiveIcon className="h-[11px] w-[11px]" />
          </button>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            title="Supprimer"
            style={iconButtonStyle(iconColor)}
          >
            <CloseIcon className="h-[10px] w-[10px]" />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

function iconButtonStyle(color: string): React.CSSProperties {
  return {
    width: 18,
    height: 18,
    border: "none",
    background: "transparent",
    color,
    cursor: "pointer",
    padding: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: 4,
    opacity: 0.7,
    transition: "opacity 150ms, background 150ms",
  };
}

// ============================================================
// NoteBody — title, body, checklist
// ============================================================

type NoteBodyProps = {
  note: Note;
  styleKey: StyleKey;
  accentH: number;
  onChange: (patch: Partial<Note>) => void;
};

function NoteBody({ note, styleKey, accentH, onChange }: NoteBodyProps) {
  const textColor = styleKey === "holo" ? `oklch(98% 0.02 ${accentH})` : `oklch(22% 0.04 ${accentH})`;
  const subTextColor =
    styleKey === "holo" ? `oklch(88% 0.06 ${accentH} / 0.85)` : `oklch(35% 0.04 ${accentH} / 0.85)`;
  const placeholderColor =
    styleKey === "holo" ? `oklch(80% 0.05 ${accentH} / 0.5)` : `oklch(45% 0.04 ${accentH} / 0.5)`;

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: textColor,
    fontFamily: "Inter, sans-serif",
    resize: "none",
  };

  const setChecklist = (next: ChecklistItem[]) => onChange({ checklist: next });
  const updateItem = (idx: number, patch: Partial<ChecklistItem>) =>
    setChecklist(note.checklist.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx: number) => setChecklist(note.checklist.filter((_, i) => i !== idx));
  const addItem = () => setChecklist([...note.checklist, { text: "", done: false }]);

  return (
    <div
      style={{
        padding: "10px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <input
        value={note.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Titre…"
        onPointerDown={(e) => e.stopPropagation()}
        style={{ ...inputBase, fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}
      />
      <textarea
        value={note.body}
        onChange={(e) => onChange({ body: e.target.value })}
        placeholder="Note rapide…"
        rows={3}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ ...inputBase, fontSize: 12.5, lineHeight: 1.5, color: subTextColor, flexShrink: 0 }}
      />
      {note.checklist.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
          {note.checklist.map((item, i) => (
            <ChecklistRow
              key={i}
              item={item}
              accentH={accentH}
              styleKey={styleKey}
              textColor={textColor}
              onToggle={() => updateItem(i, { done: !item.done })}
              onText={(t) => updateItem(i, { text: t })}
              onRemove={() => removeItem(i)}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={addItem}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: `1px dashed ${placeholderColor}`,
          color: subTextColor,
          fontSize: 10.5,
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          padding: "3px 8px",
          borderRadius: 6,
          cursor: "pointer",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        + tâche
      </button>
      <div
        style={{
          marginTop: "auto",
          paddingTop: 6,
          fontSize: 9.5,
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          color: placeholderColor,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span>{formatDate(note.createdAt)}</span>
        <span>
          {note.checklist.filter((c) => c.done).length}/{note.checklist.length || 0}
        </span>
      </div>
    </div>
  );
}

type ChecklistRowProps = {
  item: ChecklistItem;
  accentH: number;
  styleKey: StyleKey;
  textColor: string;
  onToggle: () => void;
  onText: (t: string) => void;
  onRemove: () => void;
};

function ChecklistRow({ item, accentH, styleKey, textColor, onToggle, onText, onRemove }: ChecklistRowProps) {
  const checkBg = item.done
    ? `oklch(70% 0.2 ${accentH})`
    : styleKey === "holo"
      ? `oklch(95% 0.04 ${accentH} / 0.15)`
      : `oklch(98% 0.02 ${accentH} / 0.5)`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
      <button
        type="button"
        onClick={onToggle}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          width: 14,
          height: 14,
          flexShrink: 0,
          borderRadius: 4,
          border: `1px solid oklch(70% 0.15 ${accentH} / 0.6)`,
          background: checkBg,
          cursor: "pointer",
          padding: 0,
          display: "grid",
          placeItems: "center",
          boxShadow: item.done ? `0 0 6px oklch(70% 0.22 ${accentH} / 0.6)` : "none",
        }}
      >
        {item.done && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M1.5 4l1.5 1.5L6.5 2"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <input
        value={item.text}
        onChange={(e) => onText(e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="Tâche…"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          color: textColor,
          textDecoration: item.done ? "line-through" : "none",
          opacity: item.done ? 0.55 : 1,
        }}
      />
      <button
        type="button"
        onClick={onRemove}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          width: 14,
          height: 14,
          border: "none",
          background: "transparent",
          color: textColor,
          opacity: 0.4,
          cursor: "pointer",
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ============================================================
// Vault drawer
// ============================================================

type VaultDrawerProps = {
  open: boolean;
  archived: Note[];
  loading: boolean;
  onClose: () => void;
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
  onRescue: () => void;
};

function VaultDrawer({
  open,
  activeNotes,
  archived,
  loading,
  onClose,
  onRestore,
  onDelete,
  onArchive,
  onRescue,
}: VaultDrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20, 5, 35, 0.4)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 280ms",
          zIndex: 100,
        }}
      />
      <aside
        role="dialog"
        aria-label="Tiroir des notes"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          bottom: 12,
          width: 380,
          maxWidth: "calc(100vw - 24px)",
          transform: open ? "translateX(0)" : "translateX(420px)",
          transition: "transform 380ms cubic-bezier(.2,.7,.2,1)",
          zIndex: 101,
          borderRadius: 20,
          background:
            "linear-gradient(180deg, oklch(95% 0.04 320 / 0.18) 0%, oklch(70% 0.12 320 / 0.22) 100%)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          border: "1px solid oklch(95% 0.04 320 / 0.4)",
          boxShadow:
            "0 30px 80px -20px oklch(20% 0.1 320 / 0.6), inset 0 1px 0 0 rgba(255,255,255,0.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            padding: "18px 22px 14px",
            borderBottom: "1px solid oklch(95% 0.04 320 / 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "JetBrains Mono, ui-monospace, monospace",
                letterSpacing: "0.18em",
                color: "oklch(95% 0.04 320 / 0.7)",
                textTransform: "uppercase",
              }}
            >
              Systema
            </div>
            <h2 style={{ margin: "4px 0 0", fontSize: 19, fontWeight: 600, color: "white", letterSpacing: "-0.02em" }}>
              Tiroir des notes
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onRescue}
              title="Débloquer toutes les notes (les ramener au centre)"
              style={{
                height: 28,
                borderRadius: 8,
                border: "1px solid oklch(75% 0.2 350 / 0.4)",
                background: "oklch(75% 0.2 350 / 0.15)",
                color: "oklch(95% 0.04 350)",
                padding: "0 10px",
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Activity className="h-3 w-3" />
              <span>Rescue</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Fermer"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid oklch(95% 0.04 320 / 0.3)",
                background: "oklch(95% 0.04 320 / 0.1)",
                color: "white",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        </header>
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Section Notes Actives (Failsafe) */}
          {activeNotes.length > 0 && (
            <section>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "oklch(95% 0.04 320 / 0.5)",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  paddingLeft: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "oklch(75% 0.2 160)" }} />
                Notes sur le tableau
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeNotes.map((n) => (
                  <ActiveNoteCard
                    key={n.id}
                    note={n}
                    onArchive={() => onArchive(n.id)}
                    onDelete={() => onDelete(n.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Section Archives */}
          <section>
            <div
              style={{
                fontSize: 10,
                fontFamily: "JetBrains Mono, monospace",
                color: "oklch(95% 0.04 320 / 0.5)",
                textTransform: "uppercase",
                marginBottom: 10,
                paddingLeft: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "oklch(75% 0.2 320)" }} />
              Notes archivées
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {loading && (
                <div
                  style={{
                    padding: "24px 18px",
                    textAlign: "center",
                    color: "oklch(95% 0.04 320 / 0.6)",
                    fontSize: 12,
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  }}
                >
                  Chargement…
                </div>
              )}
              {!loading && archived.length === 0 && (
                <div
                  style={{
                    padding: "36px 18px",
                    textAlign: "center",
                    color: "oklch(95% 0.04 320 / 0.6)",
                    fontSize: 13,
                    fontFamily: "JetBrains Mono, ui-monospace, monospace",
                    letterSpacing: "0.04em",
                  }}
                >
                  Aucune note archivée.
                </div>
              )}
              {archived.map((n) => (
                <ArchivedCard
                  key={n.id}
                  note={n}
                  onRestore={() => onRestore(n.id)}
                  onDelete={() => onDelete(n.id)}
                />
              ))}
            </div>
          </section>
        </div>
        <footer
          style={{
            padding: "12px 22px",
            borderTop: "1px solid oklch(95% 0.04 320 / 0.2)",
            fontSize: 10.5,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            letterSpacing: "0.1em",
            color: "oklch(95% 0.04 320 / 0.55)",
            textTransform: "uppercase",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            {archived.length + activeNotes.length} note{archived.length + activeNotes.length !== 1 ? "s" : ""}
          </span>
          <span>· vault</span>
        </footer>
      </aside>
    </>
  );
}

function ArchivedCard({
  note,
  onRestore,
  onDelete,
}: {
  note: Note;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const accentH = ACCENT_HUES[note.accent ?? "pink"];
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        background: `linear-gradient(135deg, oklch(95% 0.04 ${accentH} / 0.2) 0%, oklch(85% 0.1 ${accentH} / 0.15) 100%)`,
        border: `1px solid oklch(95% 0.04 ${accentH} / 0.3)`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {note.title || <span style={{ opacity: 0.5 }}>Sans titre</span>}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button type="button" onClick={onRestore} title="Restaurer" style={vaultIconBtnStyle}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 6a3 3 0 105.5-1.7M9 3v2.5H6.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" onClick={onDelete} title="Supprimer" style={vaultIconBtnStyle}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4h6m-5 0V3a1 1 0 011-1h2a1 1 0 011 1v1m-4 0v6a1 1 0 001 1h2a1 1 0 001-1V4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {note.body && (
        <div
          style={{
            fontSize: 11.5,
            color: "oklch(98% 0.02 320 / 0.75)",
            lineHeight: 1.4,
            maxHeight: 32,
            overflow: "hidden",
          }}
        >
          {note.body}
        </div>
      )}
      <div
        style={{
          fontSize: 9,
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          color: `oklch(95% 0.04 ${accentH} / 0.6)`,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{formatDate(note.archivedAt ?? note.createdAt)}</span>
        {note.checklist?.length > 0 && (
          <span>
            {note.checklist.filter((c) => c.done).length}/{note.checklist.length} ☑
          </span>
        )}
      </div>
    </div>
  );
}

function ActiveNoteCard({
  note,
  onArchive,
  onDelete,
}: {
  note: Note;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const accentH = ACCENT_HUES[note.accent ?? "pink"];
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {note.title || <span style={{ opacity: 0.4 }}>Sans titre</span>}
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono" }}>
          Pos: {note.x}, {note.y}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={onArchive}
          title="Archiver"
          style={{ ...vaultIconBtnStyle, borderColor: `oklch(75% 0.1 ${accentH} / 0.3)` }}
        >
          <ArchiveIcon className="h-3 w-3" />
        </button>
        <button
          onClick={onDelete}
          title="Supprimer"
          style={{ ...vaultIconBtnStyle, color: "#ff6b6b", borderColor: "rgba(255,107,107,0.3)" }}
        >
          <CloseIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

const vaultIconBtnStyle: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 6,
  border: "1px solid oklch(95% 0.04 320 / 0.25)",
  background: "oklch(95% 0.04 320 / 0.08)",
  color: "white",
  cursor: "pointer",
  padding: 0,
  display: "grid",
  placeItems: "center",
  opacity: 0.85,
};
// ============================================================
// FAB
// ============================================================

function CreateFAB({ onCreate, disabled }: { onCreate: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onCreate}
      disabled={disabled}
      title="Nouvelle note"
      aria-label="Créer une nouvelle note"
      style={{
        position: "fixed",
        right: 22,
        bottom: 96,
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: "1px solid oklch(95% 0.04 350 / 0.4)",
        background:
          "linear-gradient(135deg, oklch(75% 0.22 350 / 0.85) 0%, oklch(60% 0.22 320 / 0.85) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow:
          "0 16px 36px -10px oklch(50% 0.22 320 / 0.7), inset 0 1px 0 0 rgba(255,255,255,0.4)",
        color: "white",
        cursor: disabled ? "wait" : "pointer",
        display: "grid",
        placeItems: "center",
        fontSize: 22,
        fontWeight: 300,
        zIndex: 40,
        opacity: disabled ? 0.6 : 1,
        transition: "opacity 200ms",
      }}
    >
      +
    </button>
  );
}

// ============================================================
// Icons
// ============================================================

function ArchiveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <rect x="1" y="2.5" width="10" height="2" rx="0.5" stroke="currentColor" strokeWidth="1" />
      <path d="M2 4.5v5a1 1 0 001 1h6a1 1 0 001-1v-5" stroke="currentColor" strokeWidth="1" />
      <path d="M5 7h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 10 10" fill="none">
      <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================
// Utils
// ============================================================

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString("fr-CA", { day: "2-digit", month: "short" }) +
    " · " +
    d.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
  );
}

=============================================

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString("fr-CA", { day: "2-digit", month: "short" }) +
    " · " +
    d.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
  );
}

