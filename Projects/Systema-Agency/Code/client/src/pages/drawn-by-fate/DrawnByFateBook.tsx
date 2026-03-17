import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FateLayout, FateTitle, FateDivider } from "@/components/drawn-by-fate/FateLayout";

const PAGES = [
  {
    title: "Qu'est-ce que le Tarot ?",
    content: `Le Tarot est un jeu de cartes apparu en Europe au XVe siècle, composé de 78 cartes divisées en deux grandes familles : les Arcanes Majeures et les Arcanes Mineures.

Les 22 Arcanes Majeures représentent les grandes forces universelles et les étapes du voyage de l'âme humaine. Du Fou au Monde, chacune incarne un archétype intemporel — des énergies que nous traversons toutes et tous au cours de notre vie.

Les 56 Arcanes Mineures, réparties en quatre suites (Bâtons, Coupes, Épées et Pentacles), illustrent les situations, émotions et défis quotidiens qui composent notre existence.

Ensemble, ces 78 cartes forment un miroir de l'âme humaine — un langage symbolique qui parle à notre inconscient et nous aide à voir ce que nos yeux ordinaires ne perçoivent pas toujours.`,
  },
  {
    title: "Comment ça fonctionne ?",
    content: `Le Tarot n'est pas de la magie — c'est de la synchronicité. Selon le psychologue Carl Jung, les coïncidences significatives ne sont pas des hasards : elles reflètent les mouvements de notre inconscient collectif.

Lorsque tu tires des cartes, tu n'es pas en train de prédire l'avenir de façon figée. Tu crées un espace de réflexion. Les cartes agissent comme un miroir : elles reflètent ce qui est déjà en toi — tes peurs, tes espoirs, tes forces cachées.

La méthode est simple : tu poses une question ou fixes une intention dans ton esprit, tu mélanges les cartes en te concentrant, puis tu en tires un nombre choisi. Chaque position dans la disposition peut représenter le passé, le présent, les influences cachées ou le résultat potentiel.

L'interprétation n'est jamais absolue. C'est un dialogue entre les symboles et ton ressenti intérieur.`,
  },
  {
    title: "Les Quatre Suites",
    content: `Les Arcanes Mineures sont organisées en quatre suites, chacune liée à un élément et à une sphère de la vie :

✦ Les Bâtons (Feu) — Passion, créativité, ambition, énergie vitale. Ils parlent de projets, d'élans, de ce qui nous anime et nous fait avancer.

✦ Les Coupes (Eau) — Émotions, relations, intuition, amour. Ils explorent le monde intérieur, les sentiments et les connexions entre les êtres.

✦ Les Épées (Air) — Intellect, vérité, conflits, décisions. Ils abordent les pensées, les mots, les choix difficiles et les épreuves de l'esprit.

✦ Les Pentacles (Terre) — Matière, travail, corps, stabilité. Ils traitent de l'argent, de la carrière, de la santé et du monde concret.

Ensemble, ces quatre éléments couvrent la totalité de l'expérience humaine.`,
  },
  {
    title: "Comment croire en ses cartes ?",
    content: `Croire au Tarot, ce n'est pas croire en des forces surnaturelles. C'est choisir d'écouter sa propre voix intérieure à travers le langage des symboles.

Quelques principes pour accueillir les cartes avec ouverture :

✦ Suspends le jugement. Laisse les images et les mots résonner avant d'analyser rationnellement.

✦ Fais confiance à ton intuition. Si une interprétation ne "sonne" pas juste pour toi, explore-la différemment — le Tarot est un outil, pas une sentence.

✦ Médite sur les cartes. Garde-les près de toi quelques jours. Observe si leur message prend du sens dans ta vie.

✦ Tiens un journal. Note tes tirages et tes ressentis. Avec le temps, tu verras des patterns émerger.

Le Tarot parle à ceux qui s'ouvrent à l'entendre. Plus tu y reviens avec curiosité et respect, plus il devient un précieux compagnon de voyage intérieur.`,
  },
  {
    title: "Conseils pour une bonne lecture",
    content: `Pour obtenir le meilleur d'une séance de Tarot, voici quelques conseils essentiels :

✦ Crée un espace calme. Éteignez les distractions, allumez une bougie si tu le souhaites. L'intention compte.

✦ Formule des questions ouvertes. Préfère "Qu'est-ce que je dois comprendre sur ma situation amoureuse ?" à "Est-ce que je vais me marier ?". Le Tarot éclaire, il ne dicte pas.

✦ Ne tire pas les mêmes cartes en boucle. Si tu n'aimes pas la réponse, tirer à nouveau ne changera pas ta réalité — mais peut-être ta compréhension.

✦ Intègre le message progressivement. Certaines cartes font sens immédiatement, d'autres après quelques jours. Patience.

✦ Le Tarot est un outil de croissance personnelle. Utilise-le pour mieux te comprendre, explorer tes possibilités, et prendre des décisions avec plus de conscience.

Rappelle-toi : tu es toujours l'auteure de ton histoire. Les cartes ne font qu'éclairer le chemin.`,
  },
];

export default function DrawnByFateBook() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <FateLayout>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 24px 80px" }}>
        <FateTitle subtitle="Comprendre l'art du Tarot">
          Le Livre des Arcanes
        </FateTitle>

        {/* Table of contents sidebar on larger screens — mini dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "20px 0 32px" }}>
          {PAGES.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              title={p.title}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === currentPage ? "#CC0000" : "#CC000033",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "#0A0505",
              border: "1px solid #CC000033",
              borderRadius: 8,
              padding: "36px 40px",
              minHeight: 360,
              position: "relative",
            }}
          >
            {/* Top red bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, transparent, #CC0000, transparent)",
                borderRadius: "8px 8px 0 0",
              }}
            />

            {/* Page number */}
            <p style={{ color: "#5a3030", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
              Page {currentPage + 1} sur {PAGES.length}
            </p>

            <h2
              style={{
                color: "#CC0000",
                fontFamily: "Georgia, serif",
                fontSize: 22,
                letterSpacing: 1,
                marginBottom: 20,
                fontWeight: "normal",
              }}
            >
              {PAGES[currentPage].title}
            </h2>

            <FateDivider />

            <div style={{ marginTop: 20 }}>
              {PAGES[currentPage].content.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    color: "#C0A898",
                    fontSize: 15,
                    lineHeight: 1.85,
                    marginBottom: 16,
                    fontStyle: paragraph.startsWith("✦") ? "normal" : "italic",
                    paddingLeft: paragraph.startsWith("✦") ? 12 : 0,
                    borderLeft: paragraph.startsWith("✦") ? "1px solid #CC000033" : "none",
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              background: "transparent",
              border: "1px solid #CC000033",
              borderRadius: 4,
              color: currentPage === 0 ? "#2a0000" : "#8B0000",
              fontFamily: "Georgia, serif",
              fontSize: 12,
              letterSpacing: 2,
              padding: "8px 20px",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => currentPage > 0 && ((e.currentTarget as HTMLElement).style.color = "#CC0000")}
            onMouseLeave={(e) => currentPage > 0 && ((e.currentTarget as HTMLElement).style.color = "#8B0000")}
          >
            ← Précédent
          </button>

          <span style={{ color: "#5a3030", fontFamily: "Georgia, serif", fontSize: 13, fontStyle: "italic" }}>
            {currentPage + 1} / {PAGES.length}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(PAGES.length - 1, p + 1))}
            disabled={currentPage === PAGES.length - 1}
            style={{
              background: "transparent",
              border: "1px solid #CC000033",
              borderRadius: 4,
              color: currentPage === PAGES.length - 1 ? "#2a0000" : "#8B0000",
              fontFamily: "Georgia, serif",
              fontSize: 12,
              letterSpacing: 2,
              padding: "8px 20px",
              cursor: currentPage === PAGES.length - 1 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => currentPage < PAGES.length - 1 && ((e.currentTarget as HTMLElement).style.color = "#CC0000")}
            onMouseLeave={(e) => currentPage < PAGES.length - 1 && ((e.currentTarget as HTMLElement).style.color = "#8B0000")}
          >
            Suivant →
          </button>
        </div>
      </div>
    </FateLayout>
  );
}
