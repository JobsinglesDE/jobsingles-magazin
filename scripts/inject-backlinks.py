#!/usr/bin/env python3
"""Inject contextual backlink block at end of each Detail-Page body.

3-4 In-Content-Links pro Page mit Anchor-Variation:
- 1× Sister-Pillar (Stammtische → Unikliniken / Unikliniken → Stammtische)
- 1× Schwester-Kammer (Bundesland-Kammer)
- 1× Top-Hub /singles-regional
- 1× (optional) Sister-Stadt-Stammtisch falls existiert

Anti-Linkwüste: max 4 Links, alle in eigener "## Auch in {Bundesland}"-Sektion.
Anchor-Variation: nie Exact-Match-Spam.
"""
import re, os, glob, random

REPO = '/docker/projects/medicsingles-magazin'
random.seed(42)  # deterministic

BL_NAMES = {
    'baden-wuerttemberg': 'Baden-Württemberg', 'bayern': 'Bayern', 'berlin': 'Berlin',
    'brandenburg': 'Brandenburg', 'bremen': 'Bremen', 'hamburg': 'Hamburg',
    'hessen': 'Hessen', 'mecklenburg-vorpommern': 'Mecklenburg-Vorpommern',
    'niedersachsen': 'Niedersachsen', 'nordrhein': 'Nordrhein', 'westfalen-lippe': 'Westfalen-Lippe',
    'nordrhein-westfalen': 'NRW', 'rheinland-pfalz': 'Rheinland-Pfalz',
    'saarland': 'Saarland', 'sachsen': 'Sachsen', 'sachsen-anhalt': 'Sachsen-Anhalt',
    'schleswig-holstein': 'Schleswig-Holstein', 'thueringen': 'Thüringen',
    'deutschland': 'Deutschland',
}

# Collect available Bundesland-routes for each pillar
def collect_routes():
    routes = {'aerztestammtische': set(), 'unikliniken_stadt': {}, 'aerztekammern': set()}
    for fp in glob.glob(f'{REPO}/content/aerztestammtische/*.mdoc'):
        with open(fp) as f: c = f.read()
        fm = re.match(r'^---\n(.*?)\n---', c, re.S)
        if not fm: continue
        bl = re.search(r'^"?bundesland"?:\s*["\']?([a-z-]+)', fm.group(1), re.M)
        if bl: routes['aerztestammtische'].add(bl.group(1))
    for fp in glob.glob(f'{REPO}/content/unikliniken/*.mdoc'):
        with open(fp) as f: c = f.read()
        fm = re.match(r'^---\n(.*?)\n---', c, re.S)
        if not fm: continue
        bl = re.search(r'^"?bundesland"?:\s*["\']?([a-z-]+)', fm.group(1), re.M)
        st = re.search(r'^"?stadt"?:\s*["\']?([a-z-]+)', fm.group(1), re.M)
        if bl and st: routes['unikliniken_stadt'].setdefault(bl.group(1), set()).add(st.group(1))
    for fp in glob.glob(f'{REPO}/content/aerztekammern/*.mdoc'):
        with open(fp) as f: c = f.read()
        fm = re.match(r'^---\n(.*?)\n---', c, re.S)
        if not fm: continue
        bl = re.search(r'^"?bundesland"?:\s*["\']?([a-z-]+)', fm.group(1), re.M)
        if bl: routes['aerztekammern'].add(bl.group(1))
    return routes

ROUTES = collect_routes()

# Anchor-Variationen pool (gegen Spam)
STAMMTISCH_ANCHORS = [
    'Mediziner-Stammtische in {bl}',
    'JADE- und MB-Treffen in {bl}',
    'Stammtisch-Übersicht {bl}',
    'Treffpunkte für junge Ärzte in {bl}',
    'lokale Ärzte-Runden in {bl}',
]
UNIKLINIK_ANCHORS = [
    'Unikliniken in {bl}',
    'Universitätskliniken {bl}',
    'Maximalversorger {bl}',
    'Klinik-Übersicht {bl}',
]
KAMMER_ANCHORS = [
    'Ärztekammer {bl}',
    'Landesärztekammer {bl}',
    'Kammer-Fortbildungen {bl}',
]
HUB_ANCHORS = [
    'der Cluster Singles Regional',
    'alle regionalen Mediziner-Treffpunkte',
    'die Pillar-Übersicht Singles Regional',
]

def pick(pool, key):
    """Deterministic pick based on slug-hash so same page always gets same anchor"""
    return pool[hash(key) % len(pool)]

BACKLINK_MARKER = '<!-- INTERNAL-LINK-BLOCK -->'

def build_block(collection, slug, bl, stadt=None):
    """Build the markdown backlink section."""
    bl_name = BL_NAMES.get(bl, bl.title())
    lines = []
    used_anchors = set()

    def add(anchor_template, target, context_sentence):
        a = anchor_template.format(bl=bl_name)
        if a in used_anchors: return False
        used_anchors.add(a)
        lines.append(f'- [{a}]({target}) — {context_sentence}')
        return True

    # Always: Sister-Pillar zur eigenen Sammlung (Cross-Topic)
    if collection == 'aerztestammtische':
        # Sister 1: Unikliniken Bundesland (oder Pillar wenn keine vorhanden)
        if bl in ROUTES.get('unikliniken_stadt', {}):
            stadt_link = sorted(ROUTES['unikliniken_stadt'][bl])[0]
            add(pick(UNIKLINIK_ANCHORS, slug+'1'),
                f'/singles-regional/unikliniken/{bl}/{stadt_link}',
                f'Universitätsklinikum {stadt_link.replace("-"," ").title()} mit Schwerpunkten, Belegschaft und Campus-Treffpunkten.')
        else:
            add(pick(UNIKLINIK_ANCHORS, slug+'1'),
                '/singles-regional/unikliniken',
                'Alle Universitätskliniken und Maximalversorger Deutschlands im Überblick.')
        # Sister 2: Ärztekammer
        if bl in ROUTES.get('aerztekammern', set()):
            add(pick(KAMMER_ANCHORS, slug+'2'),
                f'/singles-regional/aerztekammern/{bl}',
                'Pflichtfortbildungen, Junge-Ärzte-Foren und Versorgungswerk-Termine pro Bundesland.')
        # Hub
        add(pick(HUB_ANCHORS, slug+'3'),
            '/singles-regional',
            'Stammtische, Unikliniken und Kammern als drei Wege zu regionalen Mediziner-Begegnungen.')

    elif collection == 'unikliniken':
        # Sister 1: Stammtisch Bundesland
        if bl in ROUTES.get('aerztestammtische', set()):
            add(pick(STAMMTISCH_ANCHORS, slug+'1'),
                f'/singles-regional/aerztestammtische/{bl}',
                'Lokale Mediziner-Stammtische jenseits der Klinik — JADE, Marburger Bund, ÄKV-Runden.')
        # Sister 2: Ärztekammer
        if bl in ROUTES.get('aerztekammern', set()):
            add(pick(KAMMER_ANCHORS, slug+'2'),
                f'/singles-regional/aerztekammern/{bl}',
                'Strukturierte Anlässe über die zuständige Landesärztekammer.')
        # Hub
        add(pick(HUB_ANCHORS, slug+'3'),
            '/singles-regional',
            'Drei regionale Pillars im Cluster — Stammtisch, Uniklinik, Kammer.')

    elif collection == 'aerztekammern':
        # Sister 1: Stammtisch Bundesland
        if bl in ROUTES.get('aerztestammtische', set()):
            add(pick(STAMMTISCH_ANCHORS, slug+'1'),
                f'/singles-regional/aerztestammtische/{bl}',
                'Informelle Mediziner-Treffen ergänzen Kammer-Pflichtfortbildungen — JADE und MB-Netzwerke.')
        # Sister 2: Uniklinik Bundesland (Pillar wenn keine Stadt-Page)
        if bl in ROUTES.get('unikliniken_stadt', {}):
            stadt_link = sorted(ROUTES['unikliniken_stadt'][bl])[0]
            add(pick(UNIKLINIK_ANCHORS, slug+'2'),
                f'/singles-regional/unikliniken/{bl}/{stadt_link}',
                f'Universitätsklinik {stadt_link.replace("-"," ").title()} im Bundesland.')
        else:
            add(pick(UNIKLINIK_ANCHORS, slug+'2'),
                '/singles-regional/unikliniken',
                'Universitätskliniken und Maximalversorger als Berufsalltag-Treffpunkte.')
        # Hub
        add(pick(HUB_ANCHORS, slug+'3'),
            '/singles-regional',
            'Drei regionale Pillars für Mediziner-Begegnungen im Überblick.')

    if not lines: return ''
    # No HTML comment marker — Markdoc rendert sie als sichtbaren Text.
    # Detection für Idempotenz läuft über das Heading-Pattern "## Auch in {bl_name}".
    block = f'\n\n## Auch in {bl_name}\n\n' + '\n'.join(lines) + '\n'
    return block


def process_file(fp, collection):
    with open(fp) as f: c = f.read()
    # Extract bundesland + stadt from frontmatter
    fm = re.match(r'^---\n(.*?)\n---\n(.*)', c, re.S)
    if not fm: return False
    front, body = fm.group(1), fm.group(2)
    bl_m = re.search(r'^"?bundesland"?:\s*["\']?([a-z-]+)', front, re.M)
    st_m = re.search(r'^"?stadt"?:\s*["\']?([a-z-]+)', front, re.M)
    if not bl_m: return False
    bl = bl_m.group(1)
    stadt = st_m.group(1) if st_m else None
    slug = os.path.basename(fp).replace('.mdoc','')

    # Remove any prior backlink block (idempotent).
    # Detection: das "## Auch in {Bundesland}"-Heading am Body-Ende.
    body = re.sub(
        r'\n*' + re.escape(BACKLINK_MARKER) + r'.*$',
        '',
        body, flags=re.S
    )
    # Strip prior "## Auch in {bl_name}" block (no HTML marker variant)
    body = re.sub(
        r'\n+##\s*Auch in [^\n]+\n+(?:-\s*\[[^\]]+\]\([^)]+\)[^\n]*\n*)+',
        '',
        body
    )
    # Alte "## Mehr aus ..." + "<!-- xlink -->" Blöcke entfernen (oft 404-Links auf
    # nicht-existente Stadt-Stammtisch-Routen)
    body = re.sub(
        r'\n+## Mehr aus [^\n]+\n+<!--\s*xlink\s*-->.*?(?=\n##|\Z)',
        '',
        body, flags=re.S
    )
    body = body.rstrip()

    block = build_block(collection, slug, bl, stadt)
    if not block: return False
    new = f'---\n{front}\n---\n{body}{block}'
    with open(fp,'w') as f: f.write(new)
    n = block.count('\n- [')
    return n

count = 0
total_links = 0
for coll in ['aerztestammtische','unikliniken','aerztekammern']:
    for fp in sorted(glob.glob(f'{REPO}/content/{coll}/*.mdoc')):
        n = process_file(fp, coll)
        if n:
            count += 1
            total_links += n
print(f'{count} Pages mit Backlink-Block aktualisiert, {total_links} Links eingefügt.')
