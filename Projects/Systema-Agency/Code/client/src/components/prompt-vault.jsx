import { useState, useMemo } from "react";

const CATEGORIES = [
  { id: "all", label: "TOUS", color: "#00f5ff" },
  { id: "restaurant", label: "RESTAURANT", color: "#ff4757" },
  { id: "tech", label: "TECH / CODE", color: "#7bed9f" },
  { id: "coaching", label: "COACHING", color: "#eccc68" },
  { id: "organisation", label: "ORGANISATION", color: "#a29bfe" },
  { id: "creativite", label: "CRÉATIVITÉ", color: "#fd79a8" },
  { id: "rh", label: "RH / GESTION", color: "#74b9ff" },
  { id: "analyse", label: "ANALYSE", color: "#55efc4" },
];

const PROMPTS = [
  { id:1, category:"restaurant", title:"Briefing équipe pré-service", tags:["gestion","équipe","service"], text:"Tu es un gestionnaire expérimenté en restauration. Génère un briefing pré-service de 5 minutes pour une équipe de salle incluant : les réservations du soir, les plats à pousser, les absences, et un message de motivation. Ton: direct, énergique." },
  { id:2, category:"restaurant", title:"Réponse avis négatif Google", tags:["réputation","client","communication"], text:"Rédige une réponse professionnelle et empathique à cet avis négatif Google pour un restaurant familial québécois. Reconnais le problème, excuse-toi sans excès, explique les mesures prises. Reste chaleureux et humain. Avis : [COLLER L'AVIS ICI]" },
  { id:3, category:"restaurant", title:"Description menu saisonnier", tags:["menu","marketing","texte"], text:"Crée des descriptions appétissantes pour 5 plats du menu. Style: bistro québécois chaleureux, pas prétentieux. Chaque description: 2-3 lignes max, met en valeur les ingrédients locaux. Plats: [LISTE ICI]" },
  { id:4, category:"coaching", title:"Clarifier une décision difficile", tags:["décision","clarté","blocage"], text:"Je dois prendre une décision et je tourne en rond. Aide-moi à clarifier en posant 5 questions puissantes, une à la fois. Commence par identifier ce que je veux vraiment VS ce que je crois devoir faire. Situation: [DÉCRIRE ICI]" },
  { id:5, category:"coaching", title:"Identifier un pattern répétitif", tags:["pattern","comportement","prise de conscience"], text:"Analyse cette situation que je vis régulièrement et identifie le pattern sous-jacent. Qu'est-ce que ça révèle sur mes croyances ou besoins non comblés? Sois direct, pas doux. Situation récurrente: [DÉCRIRE ICI]" },
  { id:6, category:"tech", title:"Déboguer un workflow Make.com", tags:["make","automation","debug"], text:"Je rencontre une erreur dans mon scénario Make.com. Analyse l'erreur suivante et donne-moi les 3 causes les plus probables avec la solution pour chacune. Erreur: [COLLER L'ERREUR] Contexte: [DÉCRIRE]" },
  { id:7, category:"tech", title:"Structure table Airtable", tags:["airtable","base de données","structure"], text:"Je veux créer une table Airtable pour [OBJECTIF]. Propose-moi la structure complète: noms des champs, types de champs, et les liaisons avec d'autres tables. Optimise pour Make.com." },
  { id:8, category:"organisation", title:"Planifier une semaine chargée", tags:["planning","priorités","énergie"], text:"Voici mes tâches et contraintes pour la semaine. Crée un plan réaliste en tenant compte de mon niveau d'énergie (matin=haute, soir=basse), mes contraintes familiales, et le principe d'une seule tâche majeure par jour. Tâches: [LISTE]" },
  { id:9, category:"rh", title:"Évaluation constructive employé", tags:["feedback","employé","développement"], text:"Rédige une évaluation de performance constructive pour un employé de salle. Points positifs: [LISTE]. Points à améliorer: [LISTE]. Ton: bienveillant mais direct. Inclus 2-3 objectifs concrets pour le prochain trimestre." },
  { id:10, category:"analyse", title:"Analyser des données de ventes", tags:["ventes","analyse","insights"], text:"Analyse ces données de ventes et identifie: 1) les tendances principales, 2) les anomalies, 3) les opportunités cachées, 4) les recommandations concrètes. Données: [COLLER ICI]" },
  { id:11, category:"creativite", title:"Post Instagram restaurant", tags:["réseaux sociaux","contenu","engagement"], text:"Crée 3 versions d'un post Instagram pour un restaurant familial québécois. Chaque version a un angle différent: émotionnel, informatif, humour. Inclus les hashtags. Sujet: [DÉCRIRE]" },
  { id:12, category:"creativite", title:"Nom + slogan pour projet", tags:["branding","créativité","naming"], text:"Génère 10 noms créatifs pour [DÉCRIRE LE PROJET]. Pour chaque nom: propose un slogan court (max 8 mots). Critères: mémorable, prononçable en français et anglais, évoque [VALEURS CLÉS]." },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [favs, setFavs] = useState([]);
  const [copied, setCopied] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [prompts, setPrompts] = useState(PROMPTS);
  const [newPrompt, setNewPrompt] = useState({ title:"", category:"restaurant", tags:"", text:"" });

  const filtered = useMemo(() => prompts.filter(p => {
    const matchCat = activeCat === "all" || p.category === activeCat;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q) || p.tags.some(t => t.includes(q));
    return matchCat && matchSearch;
  }), [prompts, activeCat, search]);

  const toggleFav = (id) => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  const copyPrompt = (id, text) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });
  };
  const getCatColor = (catId) => CATEGORIES.find(c => c.id === catId)?.color || "#00f5ff";

  const addPrompt = () => {
    if (!newPrompt.title || !newPrompt.text) return;
    const id = prompts.length + 1;
    setPrompts(p => [...p, { ...newPrompt, id, tags: newPrompt.tags.split(",").map(t=>t.trim()).filter(Boolean) }]);
    setNewPrompt({ title:"", category:"restaurant", tags:"", text:"" });
    setShowForm(false);
  };

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.15)",
    borderRadius:"4px", padding:"10px 14px", color:"#e0e0ff", fontSize:"12px", letterSpacing:"0.5px",
    outline:"none", boxSizing:"border-box", fontFamily:"inherit", marginBottom:"10px"
  };

  return (
    <div style={{ background:"linear-gradient(160deg,#050510 0%,#0a0a1a 40%,#06060f 100%)", minHeight:"100vh", fontFamily:"'Trebuchet MS',sans-serif", color:"#e0e0ff", position:"relative", overflow:"hidden" }}>
      {/* Grid BG */}
      <div style={{ position:"fixed", inset:0, zIndex:0, backgroundImage:"linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:"-100px", left:"-100px", width:"400px", height:"400px", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,245,255,0.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"-100px", right:"-100px", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,rgba(162,155,254,0.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:"1100px", margin:"0 auto", padding:"32px 20px" }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ fontSize:"11px", letterSpacing:"6px", color:"#00f5ff", marginBottom:"8px", opacity:0.8 }}>⬡ SYSTÈME COGNITIF EXTERNE ⬡</div>
          <h1 style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:900, letterSpacing:"4px", margin:0, lineHeight:1, textTransform:"uppercase" }}>
            <span style={{ color:"#ffffff" }}>PROMPT</span>{" "}
            <span style={{ color:"#00f5ff", textShadow:"0 0 30px #00f5ff,0 0 60px #00f5ff88" }}>VAULT</span>
          </h1>
          <div style={{ fontSize:"12px", letterSpacing:"3px", color:"#a29bfe", marginTop:"8px", opacity:0.7 }}>BIBLIOTHÈQUE DE PROMPTS — {prompts.length} MODULES ACTIFS</div>
          <div style={{ display:"flex", justifyContent:"center", gap:"32px", marginTop:"24px", flexWrap:"wrap" }}>
            {[{val:prompts.length,label:"PROMPTS",color:"#00f5ff"},{val:CATEGORIES.length-1,label:"CATÉGORIES",color:"#a29bfe"},{val:favs.length,label:"FAVORIS",color:"#eccc68"}].map(s=>(
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:"28px", fontWeight:900, color:s.color, textShadow:`0 0 20px ${s.color}` }}>{s.val}</div>
                <div style={{ fontSize:"9px", letterSpacing:"3px", color:"#ffffff66" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH + ADD */}
        <div style={{ display:"flex", gap:"10px", marginBottom:"24px" }}>
          <div style={{ position:"relative", flex:1 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="⌕  RECHERCHER UN PROMPT, TAG, CATÉGORIE..."
              style={{ width:"100%", background:"rgba(0,245,255,0.04)", border:"1px solid rgba(0,245,255,0.25)", borderRadius:"4px", padding:"14px 20px 14px 20px", color:"#e0e0ff", fontSize:"13px", letterSpacing:"1px", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />
            {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#ff4757aa", cursor:"pointer", fontSize:"16px" }}>✕</button>}
          </div>
          <button onClick={()=>setShowForm(!showForm)} style={{ background:showForm?"rgba(0,245,255,0.15)":"rgba(0,245,255,0.05)", border:"1px solid rgba(0,245,255,0.4)", borderRadius:"4px", padding:"14px 20px", color:"#00f5ff", fontSize:"11px", letterSpacing:"2px", cursor:"pointer", fontFamily:"inherit", fontWeight:700, whiteSpace:"nowrap", boxShadow:showForm?"0 0 20px rgba(0,245,255,0.2)":"none" }}>
            {showForm ? "✕ ANNULER" : "+ NOUVEAU"}
          </button>
        </div>

        {/* ADD FORM */}
        {showForm && (
          <div style={{ background:"rgba(0,245,255,0.03)", border:"1px solid rgba(0,245,255,0.2)", borderRadius:"6px", padding:"24px", marginBottom:"24px", boxShadow:"0 0 40px rgba(0,245,255,0.05)" }}>
            <div style={{ fontSize:"10px", letterSpacing:"3px", color:"#00f5ff", marginBottom:"16px" }}>⬡ NOUVEAU PROMPT</div>
            <input value={newPrompt.title} onChange={e=>setNewPrompt(p=>({...p,title:e.target.value}))} placeholder="TITRE DU PROMPT" style={inputStyle} />
            <select value={newPrompt.category} onChange={e=>setNewPrompt(p=>({...p,category:e.target.value}))} style={{...inputStyle, cursor:"pointer"}}>
              {CATEGORIES.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input value={newPrompt.tags} onChange={e=>setNewPrompt(p=>({...p,tags:e.target.value}))} placeholder="TAGS (séparés par des virgules)" style={inputStyle} />
            <textarea value={newPrompt.text} onChange={e=>setNewPrompt(p=>({...p,text:e.target.value}))} placeholder="TEXTE DU PROMPT..." rows={4}
              style={{...inputStyle, resize:"vertical", lineHeight:1.6}} />
            <button onClick={addPrompt} style={{ background:"rgba(0,245,255,0.15)", border:"1px solid rgba(0,245,255,0.5)", borderRadius:"3px", padding:"10px 24px", color:"#00f5ff", fontSize:"11px", letterSpacing:"2px", cursor:"pointer", fontFamily:"inherit", fontWeight:700, boxShadow:"0 0 20px rgba(0,245,255,0.1)" }}>
              ⬡ AJOUTER AU VAULT
            </button>
          </div>
        )}

        {/* FILTERS */}
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"32px" }}>
          {CATEGORIES.map(cat=>(
            <button key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{ background:activeCat===cat.id?`${cat.color}22`:"rgba(255,255,255,0.03)", border:activeCat===cat.id?`1px solid ${cat.color}88`:"1px solid rgba(255,255,255,0.1)", borderRadius:"3px", padding:"7px 14px", color:activeCat===cat.id?cat.color:"#ffffff66", fontSize:"10px", letterSpacing:"2px", cursor:"pointer", fontFamily:"inherit", fontWeight:activeCat===cat.id?700:400, boxShadow:activeCat===cat.id?`0 0 15px ${cat.color}33`:"none", transition:"all 0.2s" }}>
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize:"10px", letterSpacing:"3px", color:"#ffffff33", marginBottom:"20px" }}>▸ {filtered.length} RÉSULTAT{filtered.length!==1?"S":""}</div>

        {/* GRID */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"16px" }}>
          {filtered.map(prompt=>{
            const color=getCatColor(prompt.category);
            const isExpanded=expanded===prompt.id;
            const isFav=favs.includes(prompt.id);
            const isCopied=copied===prompt.id;
            return (
              <div key={prompt.id} onClick={()=>setExpanded(isExpanded?null:prompt.id)}
                style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(0,0,0,0.3) 100%)", borderRadius:"6px", padding:"20px", cursor:"pointer", position:"relative", overflow:"hidden", boxShadow:`0 0 20px ${color}33,0 0 40px ${color}11,inset 0 0 20px ${color}08`, border:`1px solid ${color}44`, transition:"all 0.2s" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg,transparent,${color},transparent)` }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                  <span style={{ fontSize:"9px", letterSpacing:"2px", color, fontWeight:700, background:`${color}18`, padding:"3px 8px", borderRadius:"2px", border:`1px solid ${color}33` }}>
                    {CATEGORIES.find(c=>c.id===prompt.category)?.label}
                  </span>
                  <button onClick={e=>{e.stopPropagation();toggleFav(prompt.id);}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"16px", color:isFav?"#eccc68":"#ffffff22", textShadow:isFav?"0 0 10px #eccc68":"none", padding:0 }}>
                    {isFav?"★":"☆"}
                  </button>
                </div>
                <h3 style={{ margin:"0 0 10px", fontSize:"15px", fontWeight:700, letterSpacing:"1px", color:"#ffffff", lineHeight:1.3 }}>{prompt.title}</h3>
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"12px" }}>
                  {prompt.tags.map(tag=>(
                    <span key={tag} style={{ fontSize:"9px", color:"#ffffff44", letterSpacing:"1px", border:"1px solid rgba(255,255,255,0.08)", padding:"2px 7px", borderRadius:"2px" }}>{tag}</span>
                  ))}
                </div>
                <p style={{ fontSize:"12px", color:"#ffffff66", margin:"0 0 16px", lineHeight:1.7, display:isExpanded?"block":"-webkit-box", WebkitLineClamp:isExpanded?"none":3, WebkitBoxOrient:"vertical", overflow:isExpanded?"visible":"hidden" }}>
                  {prompt.text}
                </p>
                <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                  <button onClick={e=>{e.stopPropagation();copyPrompt(prompt.id,prompt.text);}}
                    style={{ background:isCopied?`${color}33`:`${color}15`, border:`1px solid ${color}${isCopied?"88":"44"}`, borderRadius:"3px", padding:"7px 14px", color:isCopied?color:`${color}99`, fontSize:"10px", letterSpacing:"2px", cursor:"pointer", fontFamily:"inherit", fontWeight:700, boxShadow:isCopied?`0 0 15px ${color}44`:"none` }}>
                    {isCopied?"✓ COPIÉ":"⎘ COPIER"}
                  </button>
                  <span style={{ fontSize:"10px", color:`${color}66`, marginLeft:"auto", letterSpacing:"1px" }}>{isExpanded?"▲ RÉDUIRE":"▼ VOIR TOUT"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length===0&&(
          <div style={{ textAlign:"center", padding:"80px 20px", color:"#ffffff22" }}>
            <div style={{ fontSize:"40px", marginBottom:"16px" }}>⬡</div>
            <div style={{ fontSize:"12px", letterSpacing:"4px" }}>AUCUN PROMPT TROUVÉ</div>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:"60px", paddingTop:"24px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize:"9px", letterSpacing:"4px", color:"#ffffff22" }}>PROMPT VAULT ⬡ SYSTÈME COGNITIF EXTERNE ⬡ PAW 2026</div>
        </div>
      </div>
    </div>
  );
}
