# GUIDESOFT Production Checklist (1-28)

Updated: 2026-03-12

## Status Legend
- `[x]` Completed in codebase
- `[ ]` Pending / partial

## 1-28 Tracking

1. [x] Brand logo unified to `gslogo-BdL-tM9p.png` across app shell.
2. [x] Site favicon updated and linked through `index.html`.
3. [x] Header branding updated with GUIDESOFT identity.
4. [x] Footer branding updated and includes `Design and Developed by GUIDESOFT` linking to `https://www.guideitsol.com`.
5. [x] Admin bootstrap email mapping added for `praveenkumar.kanneganti@gmail.com` via Supabase migration trigger.
6. [x] Auth page redesigned to left-right layout with animated dark/light glass surfaces.
7. [x] App routes use lazy loading with suspense loader.
8. [x] UPI ID set to `8884162999-4@ybl`.
9. [x] QR generation implemented for UPI payment flow.
10. [x] Payment gate blocks unpaid access and collects Transaction ID + UTR.
11. [x] Admin page can approve/reject registration payments from live Supabase data.
12. [x] Admin route is role-guarded (`platform_super_admin` only).
13. [x] Chatbot module implemented under `/app/chatbot`.
14. [x] Messages flow migrated from mock data to Supabase conversations/messages (read + send + create conversation).
15. [x] Cloud Drive migrated from mock cards to Supabase-backed file/folder list with create/delete/share actions.
16. [x] Production release script added (`scripts/release.sh` + `npm run release:prod`).
17. [x] Playwright E2E setup added (`playwright.config.ts`, `tests/e2e/landing.spec.ts`).
18. [x] CI workflow added for typecheck, lint, build, and Playwright.
19. [x] Vercel config added for SPA rewrites (`vercel.json`).
20. [x] OpenGraph/Twitter image metadata updated to brand logo URL.
21. [x] Primary `href="#"` shell placeholders removed from header/footer/right sidebar.
22. [x] Full moderation backend for content review (using `reports` table and moderation fields).
23. [x] Dedicated audit log explorer UI implemented in Admin Console.
24. [x] Stories page backend-complete with media upload to Supabase Storage.
25. [x] Reels page backend-complete with media upload to Supabase Storage.
26. [ ] Live/Channels/News/Workspaces are still mostly demo data surfaces.
27. [x] Cloud upload pipeline fully connected to Supabase Storage bucket.
28. [ ] Observability stack missing (error tracking, metrics, alerts, uptime checks).

## Critical Blockers (Before “ALL DONE”)

1. Backend-complete media flows (stories/reels/live/channels/news/workspaces) are not finished.
2. Content moderation and audit tooling are not production complete.
3. Storage upload/download lifecycle is partial without bucket upload integration.
4. Monitoring and incident-response tooling is not configured.

## Recommended Next Delivery Slice

1. Integrate Supabase Storage upload/download in Cloud Drive and Stories/Reels media flows.
2. Implement moderation queue actions + audit log explorer.
3. Convert remaining demo modules (live/channels/news/workspaces) to DB-backed data models.
4. Add Sentry + health checks + alerting before final production signoff.
