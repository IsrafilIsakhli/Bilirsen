# Project instructions

## Current scope

The user approved `KOD-ARXITEKTURASI.az.md` and authorized implementation on 2026-10-06. The visible application name is **Bilirsən?**. Start incrementally with Expo Go-compatible Studio screens and persistent, server-authoritative solo play. Existing bank and data must be preserved. Duel and registered-account features must never be represented as functional before implementation and validation.

## Sources of truth

- `KOD-ARXITEKTURASI.az.md`: approved architecture and documented implementation proposals.
- `MOBIL-TƏTBİQ-PLANI.az.md`: product history and game decisions. Some earlier sections still mention obsolete XP; the current product uses match score and separate solo/duel rank, with no XP feature.
- `output/design/son-dizayn-2026-10-05/`: chosen navy/gold Studio design. Do not replace it with the rejected minimal design.
- `question-bank/`: existing authored question bank. `review_ready` does not mean approved for public release.

## Clean code

- Use TypeScript with strict checking once implementation begins. Prefer explicit public contracts, descriptive names, focused functions and cohesive modules.
- Optimize for readable behavior and clear responsibilities, not arbitrary line-count targets or abstraction for its own sake.
- Keep route files, controllers and socket gateways thin. Game rules belong to server domain/application code.
- Avoid business logic in UI components and persistence details in domain code. Share reusable code when the abstraction serves an actual need.
- Use the shared theme and reusable mobile components to preserve the accepted design. All player-facing content is Azerbaijani.
- Validate external inputs at boundaries. Map database records to explicit public DTOs; do not expose internal records directly.
- Do not use unchecked `any`, suppress type errors, swallow exceptions, or add success-shaped fallback data to hide failures.
- Treat server state as authoritative. Do not independently calculate official ranks, winners or accepted deadlines on the phone.
- Implement concurrency, idempotency and atomic result/rank settlement as specified. Shared contracts must never contain answer keys or server-only secrets.
- Test meaningful game behavior and failure boundaries. Do not create implementation-mirroring tests just to raise coverage.
- Run appropriate type, lint and behavior checks when executable code exists; do not claim the empty structure is a functioning app.

## Preserve existing data

Do not read or print `.local/postgres-password.txt`. Do not put secrets in source, logs, docs or mobile configuration. Existing `question_bank` data and Docker volumes must be preserved. Future migrations manage the new application schema; they must not reset the preparation bank. Separate application, migration and administrator permissions.

Do not install packages, generate framework boilerplate, launch game services, change the database, or deploy anything as part of a structure-only request.
