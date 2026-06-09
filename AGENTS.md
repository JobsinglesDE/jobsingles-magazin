<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deploy & Versioning — PFLICHT (beide Schritte!)

Content darf **nie** nur live (Vercel) und nicht im Git landen — sonst Repo-Drift und Verlust beim nächsten Build.

Nach `next build` (EXIT 0) und Live-QC:

1. **Live:** `vercel deploy --prod` (GitHub-App↔Vercel-Auto-Deploy ist noch nicht verbunden).
2. **Versionieren (NICHT überspringen):** Im Clone `/tmp/gastro-push` arbeiten:
   ```bash
   cd /tmp/gastro-push && git pull -q origin main      # erst syncen
   # neuen/geänderten Content (content/articles/*.mdoc + public/images/articles/<slug>/) hineinkopieren
   git add -A && git commit -m "content(gastro): <Titel>"
   sudo /usr/local/bin/gastro-push                      # pusht nur main → JobsinglesDE/gastrosingles-magazin
   ```
   Der paperclip-User darf via sudoers ausschließlich dieses eine Push-Script als root laufen lassen.

Beweis-Check nach jedem Lauf: `git -C /tmp/gastro-push rev-list --left-right --count HEAD...origin/main` muss `0	0` zeigen.
