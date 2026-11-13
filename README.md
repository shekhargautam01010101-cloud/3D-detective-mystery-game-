# Blackwood Mystery 3D

A Java 21 / Spring Boot detective game with a low-poly Three.js client. Spring owns authentication, case content, clue collection, dialogue, accusations, hints, scoring, and persistence; the browser is a rendering and input client. All dependencies are free.

## Architecture

- **Backend:** Spring Boot REST API in `com.blackwood.mystery` (controller, service, model, repository, dto, config, exception).
- **Persistence:** Spring Data JPA with file-backed H2 at `./data/blackwood`; H2 Console is available at `/h2-console` for development.
- **Authentication:** BCrypt password hashes and UUID bearer-like tokens in `X-Auth-Token`; no full Spring Security configuration is used.
- **Frontend:** static resources in `src/main/resources/static`; Three.js r160 from a pinned jsDelivr URL. Game text and rules come from API responses, not client-side case data.

## Run

Requires Java 21. From the repository root on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Then open <http://localhost:8080>. Maven wrapper files must be present in the checkout. If they are absent, run `mvn spring-boot:run` with Maven installed. On other platforms use `./mvnw spring-boot:run`.

Run tests with `./mvnw test` (Windows: `./mvnw.cmd test`). The first build may need internet access to download Maven dependencies and Three.js needs internet access in the browser. H2 data persists in the ignored `data/` directory.

## API

Authentication endpoints accept JSON `{ "username": "...", "password": "..." }`:

- `POST /api/auth/register` — create account and return token.
- `POST /api/auth/login` — authenticate and return token.
- `GET /api/case/intro` — briefing, public suspect names/roles, and room names.
- `POST /api/game/start` — start an authenticated session.
- `POST /api/game/{sessionId}/collect` — body `{ "clueId": 1 }`.
- `GET /api/game/{sessionId}/evidence` — collected evidence, timer and chances.
- `POST /api/game/{sessionId}/talk` — `{ "suspectId": "rahul", "questionId": "1" }`.
- `POST /api/game/{sessionId}/confront` — `{ "suspectId": "karan", "clueId": 2 }`.
- `POST /api/game/{sessionId}/accuse` — `{ "suspectId": "karan", "proofClueIds": [2,3] }`.
- `GET /api/game/{sessionId}/hint` — rate-limited by progress time.
- `GET /api/leaderboard` — top ten scores.

Authenticated requests include `X-Auth-Token`. Errors use JSON with `timestamp`, `error`, and `message`.

## Controls

WASD moves, Shift runs, mouse/touch drag and arrow keys control the camera, E interacts, Tab opens the evidence board, and Esc closes a panel. Use the hint button after the inactivity cooldown. Low-resolution shadows and a 1.5 maximum pixel ratio target integrated graphics.

## Spoiler — solution

**Karan, Arjun's nephew, is the murderer.** The will page (clue 2) gives him a motive, garden prints (clue 3) connect his route to the study, and the K cufflink (clue 4) ties him to the scene. The gate footage clears Rahul; guest and call records clear Aman and Priya. Accuse Karan with any two of clues 2, 3, and 4.
