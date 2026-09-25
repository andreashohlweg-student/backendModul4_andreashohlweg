# Twitter Clone Backend

Das Express-/TypeScript-Backend und PostgreSQL laufen gemeinsam in Docker. Das
Backend ist auf dem Host unter `http://localhost:3000` erreichbar. PostgreSQL
ist nur innerhalb des Docker-Netzwerks verfügbar und wird vom Backend über den
Servicenamen `postgres` angesprochen.

## Aufbau

| Compose-Service | Aufgabe | Erreichbarkeit |
| --- | --- | --- |
| `backend` | Express-API mit TypeScript | `http://localhost:3000` |
| `postgres` | PostgreSQL 16 | intern unter `postgres:5432` |

Das benannte Volume `postgres_data` hält die Daten auch dann, wenn die
Container beendet oder neu erstellt werden.

## Voraussetzungen

- Docker Desktop mit Docker Compose
- eine lokale `.env`-Datei

Node.js und npm müssen nicht separat auf dem Host installiert werden. Die
Abhängigkeiten werden beim Bau des Backend-Images im Container installiert.

## Einmalige Einrichtung

Im Projektverzeichnis die Beispielkonfiguration kopieren:

```bash
cp .env.example .env
```

Die `.env` muss mindestens diese Werte enthalten:

```env
POSTGRES_DB=twitter_clone
POSTGRES_USER=twitter
POSTGRES_PASSWORD=twitter_dev
PORT=3000

ALICE_PASSWORD=alice123
BOB_PASSWORD=bob123
CHARLIE_PASSWORD=charlie123
```

Die Werte sind nur für die lokale Entwicklung gedacht. Die Datei `.env` wird
nicht in Git eingecheckt. Compose setzt die interne `DATABASE_URL` für das
Backend automatisch auf den PostgreSQL-Service.

## Gesamte Anwendung starten

```bash
docker compose up --build -d
```

Der Befehl baut das Backend-Image, startet PostgreSQL, wartet auf dessen
Healthcheck und startet anschließend das Backend.

Status prüfen:

```bash
docker compose ps
```

API testen:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/users
curl http://localhost:3000/tweets
```

## Änderungen am Backend übernehmen

Der Quellcode wird in das Docker-Image kopiert. Nach Änderungen muss das
Backend deshalb neu gebaut werden:

```bash
docker compose up --build -d backend
```

## Logs und Diagnose

```bash
docker compose logs -f backend
docker compose logs -f postgres
docker compose exec backend npm run typecheck
docker compose exec backend npm run test:db
docker compose exec backend sh
docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Die Datenbanktests erzeugen ihre Prüfdaten innerhalb von Transaktionen und
rollen sie anschließend zurück. Die vorhandenen lokalen Daten bleiben dabei
unverändert.

## Anwendung stoppen

Container nur anhalten:

```bash
docker compose stop
```

Container und Compose-Netzwerk entfernen, Datenbankdaten aber behalten:

```bash
docker compose down
```

Später genügt zum erneuten Starten:

```bash
docker compose up -d
```

## Datenbank initialisieren

PostgreSQL führt die Dateien unter `database/init` beim ersten Start in
alphabetischer Reihenfolge aus:

1. `001-schema.sql` legt die Tabellen und Beziehungen an.
2. `002-seed.sql` fügt die lokalen Beispielnutzer und Tweets ein.

Die Initialisierung wird nur ausgeführt, wenn das PostgreSQL-Volume noch leer
ist. Änderungen an den Dateien wirken sich deshalb nicht auf ein bereits
initialisiertes Volume aus.

Soll die lokale Datenbank vollständig neu erstellt werden, zuerst Container
und Volume löschen und anschließend den Stack neu starten:

```bash
docker compose down -v
docker compose up --build -d
```

`docker compose down -v` löscht alle Daten im PostgreSQL-Volume dieses
Projekts unwiderruflich.

## Hinweise

- Port `3000` muss auf dem Host frei sein.
- PostgreSQL veröffentlicht keinen Host-Port. Verwende für direkten Zugriff
  den oben gezeigten `docker compose exec postgres ...`-Befehl.
- Wenn ein Container nicht startet, zuerst `docker compose ps` und danach die
  Logs des betroffenen Services prüfen.
- Sitzungen werden aktuell im Arbeitsspeicher des Backends gehalten und gehen
  bei einem Neustart des Backend-Containers verloren.
