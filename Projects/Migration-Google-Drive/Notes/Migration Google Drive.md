Type : #context
Subject : #productivity
Status : #inprogress
Date : 2026-03-08

# PROJET — Migration Google Drive

## Ligne d'arrivée

OneDrive déconnecté. Tout centralisé dans Google Drive. Structure cible en place.

## État des phases

- [x] Phase 0 : Clarifier la situation
- [x] Phase 1 : Nettoyage disque (23 GB libérés, Downloads vidé)
- [ ] Phase 2 : Transfert OneDrive → Google Drive (**EN COURS**)
  - rclone installé et lancé (--ignore-existing)
  - 4 dossiers OneDrive locaux encore présents : Desktop, Documents, Images, Videos
  - Protégés par Windows (Known Folder Move) → délier via Paramètres OneDrive → Sauvegarde
- [ ] Phase 3 : Déconnecter OneDrive + supprimer dossier local
  - Délier Desktop/Documents/Images/Videos dans Paramètres OneDrive
  - Supprimer les 4 dossiers restants
  - Désinstaller OneDrive
- [ ] Phase 4 : Organiser Google Drive (trier IMPORT_, créer structure)
  - Supprimer `life-command-center` (dossier vide)

## Structure Google Drive cible

```
Mon Drive/
├── 01_ADMIN/         (banque, contrats, factures, impôts)
├── 02_TRAVAIL/       (CV, horaires, stocks)
├── 03_FAMILLE/
├── 04_PHOTOS/        (par année)
├── 05_VIDEOS/
├── 06_PERSONNEL/     (notes, thérapie, journal)
├── 07_TECH/          (programmes, backups)
├── SECOND CERVEAUX AI/
├── IMPORT_ONEDRIVE/  (temporaire — à trier après transfert)
└── IMPORT_LOCAL/     (temporaire — à trier)
```

## Règle code

Le code (drawn-by-fate, systema.agency, Life-command) ne va JAMAIS dans Google Drive.
Local + GitHub uniquement.

## État disque C

- Libre : ~23 GB (après nettoyage phase 1)
- Google Drive : mode Streaming ✅
- OneDrive local : ~49 GB (à supprimer après transfert complet)

## Notes de session

```
[2026-03-08] [Claude Code Terminal]
Tâche : Mise à jour avec prochaines étapes détaillées depuis session1.txt du backup SCC.
```
