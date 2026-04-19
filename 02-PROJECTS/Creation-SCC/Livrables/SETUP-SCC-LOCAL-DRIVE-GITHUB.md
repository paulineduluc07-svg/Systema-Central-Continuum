# SETUP OFFICIEL SCC - LOCAL / GOOGLE DRIVE / GITHUB

Date: 2026-04-03
Statut: reference officielle

## 1) Objectif simple
On utilise 3 espaces, avec 1 role clair chacun:

1. `GitHub` = source de verite pour le code + documents versionnes
2. `Google Drive` = source de verite pour docs bureautiques + medias
3. `Local (Windows/WSL)` = espace de travail technique temporaire

Regle cle:
Le local sert a travailler. Il ne sert pas a etre la source de verite.

## 2) Nomenclature officielle (obligatoire)
Dans le hub SCC, les dossiers standards s'appellent:

1. `SCC-INBOX`
2. `SCC-PROJECTS`
3. `SCC-AREAS`
4. `SCC-RESSOURCES`
5. `SCC-ARCHIVES`

## 3) Structure finale exacte

### 3.1 GitHub (repo principal)
Repo: `paulineduluc07-svg/Systema-Central-Continuum`

Racine du repo:

```text
SCC-INBOX/
SCC-PROJECTS/
SCC-AREAS/
SCC-RESSOURCES/
SCC-ARCHIVES/
AGENTS.md
README.md
```

### 3.2 Google Drive (hub unique)
Chemin cible unique:

```text
G:\Mon Drive\SCC-HUB\
```

Contenu:

```text
SCC-HUB/
  SCC-INBOX/
  SCC-PROJECTS/
  SCC-AREAS/
  SCC-RESSOURCES/
  SCC-ARCHIVES/
```

Important:
Il ne doit plus y avoir plusieurs SCC en parallele.
Tout SCC secondaire (ex: `03 - RESSOURCES\scc`) devient archive ou fusionne.

### 3.3 Local Windows (clone de travail)
Chemin cible:

```text
C:\Users\pauli\Systema-Central-Continuum\
```

Ce dossier est le clone Git de travail (developpement, commits, tests, scripts).

## 4) Regles "quoi va ou"

### 4.1 Fichiers qui vont dans GitHub (versionnes)
1. Code source (`.ts`, `.tsx`, `.js`, `.py`, etc.)
2. Docs techniques (`.md`)
3. Configs (`.json`, `.yml`, `.yaml`, `.toml`, etc.)
4. Instructions agents et workflows versionnes

### 4.2 Fichiers qui vont dans Google Drive
1. Google Docs / Sheets / Slides (`.gdoc`, `.gsheet`, etc.)
2. Medias lourds bruts (video, PSD, exports intermediaires)
3. Documents bureautiques non techniques

### 4.3 Fichiers qui restent local seulement (jamais sync Drive/GitHub)
1. `node_modules/`
2. `.git/`
3. `dist/`, `build/`, `.next/`
4. Caches outils et temporaires

## 5) Workflow officiel de sync

## 5.1 Flux de reference (recommande)
1. Tu travailles dans le clone local Git
2. Commit local
3. Push GitHub
4. Si besoin, copie/export des livrables vers Drive

## 5.2 Flux Drive vers GitHub (si tu modifies dans Drive)
1. Modifier dans `G:\Mon Drive\SCC-HUB\...`
2. Synchroniser vers le clone local SCC (copie selective, sans caches)
3. Verifier diff Git local
4. Commit + push vers GitHub

Note:
Le lien Drive -> GitHub passe toujours par le clone local.
Il ne faut pas essayer d'utiliser Drive comme depot Git principal.

## 6) Règles anti-confusion (non negociables)
1. Un seul hub SCC sur Drive
2. Un seul repo SCC principal sur GitHub
3. Un seul clone SCC actif en local
4. Aucun travail "projet SCC" en dehors de ces 3 emplacements
5. Les outils/agents travaillent dans `SCC-RESSOURCES/<NomAgent>/`

## 7) Concernant WSL2
WSL2 est un environnement Linux local isole.
Oui, techniquement c'est un disque virtuel dans Windows.
Usage recommande:

1. Garder le repo SCC sur le disque Windows principal
2. Utiliser WSL2 pour executer des outils Linux si necessaire
3. Eviter de dupliquer plusieurs copies SCC entre Windows et WSL sans regle claire

## 8) Decision finale pour ton systeme
Ton regle "aucun local" est remplacee par:

`local controle, mais aucune source de verite locale`

Version finale:
1. Verite code/docs techniques = GitHub
2. Verite bureautique/media = Google Drive
3. Local = execution + sync + automatisation

---

Ce document devient la reference de setup.
Toute evolution future doit d'abord modifier ce fichier.
