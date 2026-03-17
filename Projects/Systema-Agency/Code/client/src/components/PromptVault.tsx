import { useState, useMemo } from "react";

const CATS = [
  { id: "all", label: "TOUS", color: "#00f5ff" },
  { id: "restaurant", label: "RESTAURANT", color: "#ff4757" },
  { id: "tech", label: "TECH/CODE", color: "#7bed9f" },
  { id: "coaching", label: "COACHING", color: "#eccc68" },
  { id: "organisation", label: "ORGANISATION", color: "#a29bfe" },
  { id: "creativite", label: "CRÉATIVITÉ", color: "#fd79a8" },
  { id: "rh", label: "RH/GESTION", color: "#74b9ff" },
  { id: "analyse", label: "ANALYSE", color: "#55efc4" },
];

const DATA = [
  { id:1, cat:"restaurant", title:"Briefing équipe pré-service", tags:["équipe","service","gestion"], text:"Tu es un gestionnaire expérimenté en restauration. Génère un briefing pré-service de 5 minutes pour une équipe de salle incluant : les réservations du soir, les plats à pousser, les absences, et un message de motivation. Ton: direct, énergique." },
  { id:2, cat:"restaurant", title:"Réponse avis négatif Google", tags:["client","réputation","communication"], text:"Rédige une réponse professionnelle et empathique à cet avis négatif Google pour un restaurant familial québécois. Reconnais le problème, excuse-toi sans excès, explique les mesures prises. Reste chaleureux et humain. Avis: [COLLER ICI]" },
  { id:3, cat:"restaurant", title:"Description menu saisonnier", tags:["menu","marketing","texte"], text:"Crée des descriptions appétissantes pour 5 plats du menu. Style: bistro québécois chaleureux, pas prétentieux. Chaque description: 2-3 lignes max, met en valeur les ingrédients locaux. Plats: [LISTE ICI]" },
  { id:4, cat:"restaurant", title:"Planification horaire semaine", tags:["horaire","planification","équipe"], text:"Crée un horaire hebdomadaire optimal pour une équipe de restaurant de [X] employés. Tiens compte des heures de pointe (déjeuner 11h-13h, souper 17h-20h), des jours fériés et des disponibilités. Contraintes: [LISTE]" },
  { id:5, cat:"coaching", title:"Clarifier une décision difficile", tags:["décision","clarté","blocage"], text:"Je dois prendre une décision et je tourne en rond. Aide-moi à clarifier en posant 5 questions puissantes, une à la fois. Commence par identifier ce que je veux vraiment VS ce que je crois devoir faire. Situation: [DÉCRIRE ICI]" },
  { id:6, cat:"coaching", title:"Identifier un pattern répétitif", tags:["pattern","comportement","conscience"], text:"Analyse cette situation que je vis régulièrement et identifie le pattern sous-jacent. Qu'est-ce que ça révèle sur mes croyances ou besoins non comblés? Sois direct, pas doux. Situation récurrente: [DÉCRIRE ICI]" },
  { id:7, cat:"coaching", title:"Plan d'action 30 jours", tags:["objectif","action","planification"], text:"Crée un plan d'action réaliste sur 30 jours pour atteindre cet objectif. Découpe en semaines, avec 1-2 actions concrètes par jour max. Tiens compte de mon énergie et contraintes. Objectif: [ICI] Contraintes: [ICI]" },
  { id:8, cat:"tech", title:"Déboguer un workflow Make.com", tags:["make","automation","debug"], text:"Je rencontre une erreur dans mon scénario Make.com. Analyse l'erreur suivante et donne-moi les 3 causes les plus probables avec la solution pour chacune. Sois précis et technique. Erreur: [COLLER ICI] Contexte: [DÉCRIRE]" },
  { id:9, cat:"tech", title:"Structure table Airtable", tags:["airtable","base de données","structure"], text:"Je veux créer une table Airtable pour [OBJECTIF]. Propose-moi la structure complète: noms des champs, types de champs, et les liaisons avec d'autres tables si pertinent. Optimise pour la facilité d'utilisation et les automatisations Make.com." },
  { id:10, cat:"tech", title:"Prompt système pour agent IA", tags:["agent","prompt","ia"], text:"Crée un prompt système complet pour un agent IA spécialisé en [DOMAINE]. Inclus: rôle, personnalité, règles de réponse, format de sortie, exemples de cas d'usage. L'agent doit être: [CARACTÉRISTIQUES]" },
  { id:11, cat:"organisation", title:"Planifier une semaine chargée", tags:["planning","priorités","énergie"], text:"Voici mes tâches et contraintes pour la semaine. Crée un plan réaliste en tenant compte de mon niveau d'énergie (matin=haute, après-midi=moyenne, soir=basse), mes contraintes familiales, et le principe d'une seule tâche majeure par jour. Tâches: [LISTE]" },
  { id:12, cat:"organisation", title:"Triage de liste de tâches", tags:["priorités","triage","focus"], text:"Voici ma liste de tâches. Classe-les selon la matrice Eisenhower (urgent/important). Pour chaque quadrant, donne-moi l'action recommandée. Identifie les 3 tâches absolument prioritaires aujourd'hui. Tâches: [LISTE]" },
  { id:13, cat:"rh", title:"Évaluation constructive employé", tags:["feedback","employé","développement"], text:"Rédige une évaluation de performance constructive pour un employé de salle. Points positifs: [LISTE]. Points à améliorer: [LISTE]. Ton: bienveillant mais direct. Inclus 2-3 objectifs concrets et mesurables pour le prochain trimestre." },
  { id:14, cat:"rh", title:"Message recrutement candidat", tags:["recrutement","communication","rh"], text:"Rédige un message d'offre d'emploi pour [POSTE] dans un restaurant familial québécois. Ton: chaleureux, direct, honnête. Inclus: salaire, horaires, avantages, culture d'équipe. Évite le jargon corporate." },
  { id:15, cat:"analyse", title:"Analyser des données de ventes", tags:["ventes","analyse","insights"], text:"Analyse ces données de ventes et identifie: 1) les tendances principales, 2) les anomalies à investiguer, 3) les opportunités cachées, 4) les recommandations concrètes. Présente sous forme de rapport structuré. Données: [COLLER ICI]" },
  { id:16, cat:"analyse", title:"Audit processus opérationnel", tags:["processus","audit","optimisation"], text:"Analyse ce processus opérationnel et identifie: les goulots d'étranglement, les étapes redondantes, les risques d'erreur, et propose 3 améliorations concrètes classées par impact/effort. Processus: [DÉCRIRE ICI]" },
  { id:17, cat:"creativite", title:"Post Instagram restaurant", tags:["réseaux sociaux","contenu","engagement"], text:"Crée 3 versions d'un post Instagram pour un restaurant familial québécois. Chaque version a un angle différent: émotionnel, informatif, humour. Inclus les hashtags pertinents. Sujet du post: [DÉCRIRE]" },
  { id:18, cat:"creativite", title:"Nom + slogan pour projet", tags:["branding","créativité","naming"], text:"Génère 10 noms créatifs pour [DÉCRIRE LE PROJET]. Pour chaque nom: propose un slogan court (max 8 mots), explique l'angle créatif en 1 phrase. Critères: mémorable, prononçable en français et en anglais, évoque [VALEURS CLÉS]." },
];

const gc = (id: string) => CATS.find(c => c.id === id)?.color || "#00f5ff";

export default function PromptVault() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [favs, setFavs] = useState<number[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [exp, setExp] = useState<number | null>(null);
  const [form, setForm] = useState(false);
  const [list, setList] = useState(DATA);
  const [np, setNp] = useState({ title: "", cat: "restaurant", tags: "", text: "" });

  const filtered = useMemo(() => list.filter(p => {
    const mc = cat === "all" || p.cat === cat;
    const ms = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.text.toLowerCase().includes(q.toLowerCase()) || p.tags.some(t => t.includes(q.toLowerCase()));
    return mc && ms;
  }), [list, cat, q]);

  const copy = (id: number, txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const add = () => {
    if (!np.title || !np.text) return;
    setList(l => [...l, { ...np, id: Date.now(), tags: np.tags.split(",").map(t => t.trim()).filter(Boolean) }]);
    setNp({ title: "", cat: "restaurant", tags: "", text: "" });
    setForm(false);
  };

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "4px", padding: "9px 13px", color: "#e0e0ff", fontSize: "12px",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: "9px",
  };

  return (
    <div style={{ background: "linear-gradient(160deg,#050510 0%,#0a0a1a 50%,#06060f 100%)", minHeight: "100vh", fontFamily: "'Trebuchet MS',sans-serif", color: "#e0e0ff", position: "relative", overflowX: "hidden" }}>
      {/* BG Grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "-80px", left: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,255,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(162,155,254,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "28px 16px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "6px", color: "#00f5ff", marginBottom: "6px", opacity: 0.7 }}>⬡ SYSTÈME COGNITIF EXTERNE ⬡</div>
          <h1 style={{ fontSize: "clamp(32px,6vw,58px)", fontWeight: 900, letterSpacing: "4px", margin: 0, lineHeight: 1, textTransform: "uppercase" }}>
            <span style={{ color: "#fff" }}>PROMPT </span>
            <span style={{ color: "#00f5ff", textShadow: "0 0 30px #00f5ff,0 0 60px #00f5ff55" }}>VAULT</span>
          </h1>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#a29bfe", marginTop: "7px", opacity: 0.7 }}>BIBLIOTHÈQUE — {list.length} MODULES ACTIFS</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "18px", flexWrap: "wrap" }}>
            {[{ v: list.length, l: "PROMPTS", c: "#00f5ff" }, { v: CATS.length - 1, l: "CATÉGORIES", c: "#a29bfe" }, { v: favs.length, l: "FAVORIS", c: "#eccc68" }].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 900, color: s.c, textShadow: `0 0 20px ${s.c}` }}>{s.v}</div>
                <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#ffffff44" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH + ADD */}
        <div style={{ display: "flex", gap: "9px", marginBottom: "18px" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="⌕  RECHERCHER..."
            style={{ flex: 1, background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.25)", borderRadius: "4px", padding: "12px 16px", color: "#e0e0ff", fontSize: "12px", outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => setForm(!form)} style={{ background: form ? "rgba(0,245,255,0.12)" : "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: "4px", padding: "12px 16px", color: "#00f5ff", fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, whiteSpace: "nowrap" }}>
            {form ? "✕ ANNULER" : "+ NOUVEAU"}
          </button>
        </div>

        {/* ADD FORM */}
        {form && (
          <div style={{ background: "rgba(0,245,255,0.03)", border: "1px solid rgba(0,245,255,0.18)", borderRadius: "6px", padding: "18px", marginBottom: "18px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#00f5ff", marginBottom: "13px" }}>⬡ NOUVEAU PROMPT</div>
            <input value={np.title} onChange={e => setNp(p => ({ ...p, title: e.target.value }))} placeholder="TITRE" style={inp} />
            <select value={np.cat} onChange={e => setNp(p => ({ ...p, cat: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
              {CATS.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input value={np.tags} onChange={e => setNp(p => ({ ...p, tags: e.target.value }))} placeholder="TAGS (séparés par virgules)" style={inp} />
            <textarea value={np.text} onChange={e => setNp(p => ({ ...p, text: e.target.value }))} placeholder="TEXTE DU PROMPT..." rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 } as React.CSSProperties} />
            <button onClick={add} style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.35)", borderRadius: "3px", padding: "8px 18px", color: "#00f5ff", fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
              ⬡ AJOUTER AU VAULT
            </button>
          </div>
        )}

        {/* FILTERS */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ background: cat === c.id ? `${c.color}20` : "rgba(255,255,255,0.03)", border: cat === c.id ? `1px solid ${c.color}66` : "1px solid rgba(255,255,255,0.09)", borderRadius: "3px", padding: "6px 12px", color: cat === c.id ? c.color : "#ffffff44", fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: cat === c.id ? 700 : 400, boxShadow: cat === c.id ? `0 0 10px ${c.color}22` : "none" }}>
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#ffffff22", marginBottom: "16px" }}>▸ {filtered.length} RÉSULTAT{filtered.length !== 1 ? "S" : ""}</div>

        {/* GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "13px" }}>
          {filtered.map(p => {
            const c = gc(p.cat), isE = exp === p.id, isF = favs.includes(p.id), isC = copied === p.id;
            return (
              <div key={p.id} onClick={() => setExp(isE ? null : p.id)}
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.03),rgba(0,0,0,0.25))", borderRadius: "6px", padding: "17px", cursor: "pointer", position: "relative", overflow: "hidden", border: `1px solid ${c}33`, boxShadow: `0 0 18px ${c}18` }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,transparent,${c},transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ fontSize: "8px", letterSpacing: "2px", color: c, fontWeight: 700, background: `${c}15`, padding: "3px 7px", borderRadius: "2px", border: `1px solid ${c}28` }}>
                    {CATS.find(x => x.id === p.cat)?.label}
                  </span>
                  <button onClick={e => { e.stopPropagation(); setFavs(f => f.includes(p.id) ? f.filter(x => x !== p.id) : [...f, p.id]); }}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: isF ? "#eccc68" : "#ffffff18", textShadow: isF ? "0 0 8px #eccc68" : "none", padding: 0 }}>
                    {isF ? "★" : "☆"}
                  </button>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{p.title}</h3>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "9px" }}>
                  {p.tags.map(t => <span key={t} style={{ fontSize: "8px", color: "#ffffff33", border: "1px solid rgba(255,255,255,0.07)", padding: "1px 6px", borderRadius: "2px" }}>{t}</span>)}
                </div>
                <p style={{ fontSize: "11px", color: "#ffffff50", margin: "0 0 13px", lineHeight: 1.7, display: isE ? "block" : "-webkit-box", WebkitLineClamp: isE ? undefined : 3, WebkitBoxOrient: "vertical" as const, overflow: isE ? "visible" : "hidden" }}>
                  {p.text}
                </p>
                <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                  <button onClick={e => { e.stopPropagation(); copy(p.id, p.text); }}
                    style={{ background: isC ? `${c}28` : `${c}10`, border: `1px solid ${c}${isC ? "66" : "33"}`, borderRadius: "3px", padding: "5px 12px", color: isC ? c : `${c}77`, fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: isC ? `0 0 10px ${c}33` : "none" }}>
                    {isC ? "✓ COPIÉ" : "⎘ COPIER"}
                  </button>
                  <span style={{ fontSize: "9px", color: `${c}44`, marginLeft: "auto" }}>{isE ? "▲ RÉDUIRE" : "▼ VOIR TOUT"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#ffffff18" }}>
            <div style={{ fontSize: "32px" }}>⬡</div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", marginTop: "10px" }}>AUCUN RÉSULTAT</div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: "8px", letterSpacing: "4px", color: "#ffffff15" }}>PROMPT VAULT ⬡ PAW 2026</div>
        </div>
      </div>
    </div>
  );
}
