# Reverse Proxy Konfiguration — blaulichtsingles.ch/magazin/

## Anforderung

Der Pfad `/magazin/` und alle Unterpfade sollen an unseren Vercel-Server weitergeleitet werden.
Alle anderen Pfade (/, /agb.html, App-Seiten etc.) bleiben unverändert bei ICONY.

**Ziel-Server:** `blaulicht-magazin.vercel.app`
**Pfad:** `/magazin/*` wird 1:1 durchgereicht (kein Path-Stripping)

---

## Nginx Konfiguration

```nginx
# Blaulichtsingles Magazin → Vercel
location /magazin/ {
    proxy_pass https://blaulicht-magazin.vercel.app/magazin/;
    proxy_ssl_server_name on;
    proxy_set_header Host blaulichtsingles.ch;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header X-Forwarded-Host blaulichtsingles.ch;

    # Wichtig fuer Next.js
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # Cache-Headers durchreichen
    proxy_buffering off;
}

# /magazin ohne Trailing Slash → Redirect
location = /magazin {
    return 301 /magazin/;
}
```

---

## Apache Konfiguration (Alternative)

```apache
# Blaulichtsingles Magazin → Vercel
SSLProxyEngine On
ProxyPreserveHost Off

# Host-Header setzen
RequestHeader set Host "blaulichtsingles.ch"
RequestHeader set X-Forwarded-Proto "https"
RequestHeader set X-Forwarded-Host "blaulichtsingles.ch"

ProxyPass /magazin/ https://blaulicht-magazin.vercel.app/magazin/
ProxyPassReverse /magazin/ https://blaulicht-magazin.vercel.app/magazin/

# Ohne Trailing Slash
RedirectMatch 301 ^/magazin$ /magazin/
```

---

## Wichtige Hinweise

1. **SSL:** Das SSL-Zertifikat bleibt bei ICONY. Vercel braucht kein eigenes Zertifikat fuer blaulichtsingles.ch.
2. **Host-Header:** MUSS auf `blaulichtsingles.ch` gesetzt sein (nicht auf blaulicht-magazin.vercel.app).
3. **Pfad wird 1:1 weitergereicht:** `/magazin/singles-partnersuche/polizei` → Vercel empfaengt `/magazin/singles-partnersuche/polizei`
4. **SNI:** `proxy_ssl_server_name on` ist wichtig, damit Vercels Edge-Network den richtigen Server anspricht.
5. **Kein Caching auf ICONY-Seite noetig** — Vercel cached bereits ueber sein CDN.

---

## Test nach Aktivierung

Nach dem Einrichten bitte testen:
- `https://blaulichtsingles.ch/magazin/` → sollte die Magazin-Startseite zeigen
- `https://blaulichtsingles.ch/magazin/singles-partnersuche` → Artikel-Hub
- `https://blaulichtsingles.ch/` → weiterhin ICONY Dating-Plattform
