# TODO - Anima Ingenium

Ce fichier suit les priorités et les tâches à accomplir.

## Tâches Actives (Confiance & Sécurité)
- [x] Basculer Kim sur Gemini (Primaire) et OpenAI (Fallback) pour améliorer le français.
- [x] Nettoyer la documentation (suppression voix Tara).
- [x] Mettre en place le "Visual Heartbeat" (fréquence 30 min sur Telegram).
- [ ] Valider la qualité des réponses de Kim avec Gemini sur des sessions longues.
- [ ] Vérifier la cohérence de la mémoire (Honcho) avec le nouveau modèle.

## Backlog P1 (Setup & Exploitation)
- [ ] Mettre à jour l'audit du runtime avec le nouveau setup LLM.
- [ ] Documenter le "Visual Heartbeat" dans les ressources.
- [ ] Finaliser OAuth Google (Calendar/Tasks) - *Reporté, Pauline doit valider la stabilité d'abord.*
- [ ] Automatiser le déploiement vers `/root/Hermes-Agent` avec rollback.
- [ ] Mettre en place sauvegarde/restauration pour `/root/Hermes-Agent` et `/root/.hermes`.
- [ ] Durcir la sécurité opérationnelle (permissions, rotation secrets, audit logs).
- [ ] Documenter un plan de reprise incident VPS (perte service/réseau/reboot).

