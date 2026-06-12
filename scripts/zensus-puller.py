#!/usr/bin/env python3
"""
Zensus-2022-Puller für Jobsingles Städte-Seiten (Golden Page Spec).

Zieht pro Stadt die mdoc-Datenfelder:
  - einwohner          (Gemeinde, GEOGM4)
  - ledigeAnzahl       (HOCHRECHNUNG: Kreis-Ledig-Quote × Gemeinde-EW, als "Rund" gelabelt)
  - altersstruktur     (Kreis Ø-Alter, GEOLK4)
  - geschlechterquote  (Kreis ♂/♀, GEOLK4)

API: ergebnisse.zensus2022.de  (GENESIS-REST 2020).
Auth: HTTP-Header `username: <token>`, POST.  Doku-Befund siehe reference_zensus2022_api.

Nutzung:
  python3 zensus-puller.py --probe                # roher Response-Dump für Radolfzell (Format lernen)
  python3 zensus-puller.py --stadt radolfzell-am-bodensee
  python3 zensus-puller.py --csv cities.csv       # batch: name,bundesland,gemeinde_ags,kreis_ags
"""
import argparse
import csv
import io
import os
import sys
import json
import urllib.request
import urllib.parse

BASE = "https://ergebnisse.zensus2022.de/api/rest/2020"
TOKEN = os.environ.get("ZENSUS_TOKEN", "b48791f8873f4daca2d5b87ad7a311f0")

# Minimal-Seed (AGS aus Destatis-Gemeindeverzeichnis). Radolfzell = Validierungs-Fall.
SEED = {
    "radolfzell-am-bodensee": {
        "name": "Radolfzell am Bodensee", "bundesland": "baden-wuerttemberg",
        "gemeinde_ags": "08335079", "kreis_ags": "08335",
    },
}


def api(table, regionalvariable, regionalkey, fmt="ffcsv"):
    """GENESIS tablefile-Abruf. POST + Header-Auth."""
    params = {
        "name": table,
        "area": "all",
        "regionalvariable": regionalvariable,
        "regionalkey": regionalkey,
        "format": fmt,
        "language": "de",
    }
    url = f"{BASE}/data/tablefile?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, method="POST")
    req.add_header("username", TOKEN)
    req.add_header("Accept", "*/*")
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", errors="replace")


def probe(city):
    """Roh-Dump der drei Tabellen, um Spaltenstruktur zu lernen."""
    for tbl, var, key, label in [
        ("1000A-1013", "GEOLK4", city["kreis_ags"], "Familienstand (Kreis)"),
        ("1000A-0003", "GEOLK4", city["kreis_ags"], "Durchschnittsalter (Kreis)"),
        ("1000A-1017", "GEOLK4", city["kreis_ags"], "Geschlecht (Kreis)"),
        ("1000A-0001", "GEOGM4", city["gemeinde_ags"], "Einwohner (Gemeinde)"),
    ]:
        print(f"\n========== {label} — {tbl} {var}={key} ==========")
        try:
            print(api(tbl, var, key)[:2500])
        except Exception as e:
            print(f"  FEHLER: {e}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--probe", action="store_true")
    ap.add_argument("--stadt")
    ap.add_argument("--csv")
    args = ap.parse_args()

    if args.probe:
        probe(SEED["radolfzell-am-bodensee"])
        return
    print("TODO: parse + emit nach Probe-Befund", file=sys.stderr)


if __name__ == "__main__":
    main()
