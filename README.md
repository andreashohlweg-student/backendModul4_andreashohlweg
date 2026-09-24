# Twitter Clone Backend

Das Express-/TypeScript-Backend verwendet PostgreSQL für Nutzer und Tweets. Die
Datenbank läuft lokal in Docker; die Node-Anwendung läuft direkt auf dem Mac.

## Voraussetzungen auf macOS

1. [Docker Desktop für Mac nach der offiziellen Anleitung](https://docs.docker.com/desktop/setup/install/mac-install/)
   passend zum Mac-Chip (Apple Silicon oder Intel) herunterladen.
2. `Docker.dmg` öffnen, Docker in den Ordner **Programme** ziehen und
   `Docker.app` starten. Die Ersteinrichtung abschließen und warten, bis Docker
   Desktop meldet, dass die Engine läuft.
3. Im Terminal prüfen: `docker --version` und `docker compose version`.
4. Node.js (empfohlen: aktuelle LTS-Version) und npm müssen installiert sein.

## Einmalige Einrichtung

```bash
cd /Users/andreashohlweg/Documents/WebEntwicklung/BackEnd/twitter-clone
npm install
npm run db:up
```

Falls noch keine `.env` existiert, zuerst `cp .env.example .env` ausführen. Falls
bereits eine `.env` existiert, nicht überschreiben. Ergänze stattdessen:

```env
DATABASE_URL=postgresql://twitter:twitter_dev@localhost:5432/twitter_clone
PORT=3000
```

Die SQL-Datei `database/init/001-schema.sql` wird beim ersten Erstellen des
Docker-Volumes automatisch ausgeführt. Sie legt die Tabellen und Beispieldaten
an.

## Anwendung starten

```bash
npm run dev
```

Danach ist die API unter `http://localhost:3000` erreichbar. Zum Beispiel:

```bash
curl http://localhost:3000/users
curl http://localhost:3000/tweets
```

## Nützliche Befehle

```bash
npm run db:up      # PostgreSQL starten
npm run db:down    # Container stoppen (Daten bleiben erhalten)
npm run db:logs    # Datenbank-Logs ansehen
npm run db:psql    # PostgreSQL-Konsole öffnen
npm run typecheck  # TypeScript prüfen
```

Komplett neu initialisieren (löscht ausschließlich das Docker-Datenbank-Volume
dieses Projekts):

```bash
docker compose down -v
npm run db:up
```

Hinweis: Die Beispiel-Zugangsdaten sind nur für lokale Entwicklung. Für einen
produktiven Einsatz gehören Passwörter gehasht in die Datenbank und Secrets
nicht in Compose-Dateien.
