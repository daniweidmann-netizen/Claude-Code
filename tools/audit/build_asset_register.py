"""Builds IP_AND_LICENSE_AUDIT/MASTER_ASSET_REGISTER.csv from the repository (read-only for all
assets): embedded provenance records, Git history, file contents. Run from the repository root:
    python3 tools/audit/build_asset_register.py
Statuses are factual labels, not legal conclusions."""
import csv, glob, hashlib, os, re, subprocess
from PIL import Image

def git(*a): return subprocess.run(['git', *a], capture_output=True, text=True).stdout
files = git('ls-files').split('\n')[:-1]
first = {}
for line in git('log', '--reverse', '--format=@%ad|%an', '--date=short', '--name-only', '--diff-filter=A').split('\n'):
    if line.startswith('@'): cur = line[1:].split('|')
    elif line and line not in first: first[line] = cur

RAW_IMG = {}
for f in glob.glob('assets/reference/raw/*.png'):
    d = open(f, 'rb').read()
    w = re.search(rb'c2pa\.createddwhen[^0-9]{0,6}(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)', d)
    RAW_IMG[os.path.basename(f)] = dict(job=Image.open(f).info.get('hf-job-id', ''), when=(w.group(1).decode() + 'Z') if w else '',
        openai=b'OpenAI Media Service' in d, c2pa=b'c2pa' in d)
RAW_AUD = {}
for f in glob.glob('assets/audio/raw/*.mp3'):
    d = open(f, 'rb').read()
    RAW_AUD[os.path.basename(f)] = dict(c2pa=b'c2pa' in d, eleven=b'Eleven Labs Inc.' in d)

# shipped image -> raw source (from tools/assets/process.py)
SRC = {'symbols/sym0.png': 'sapphire.png', 'symbols/sym1.png': 'scarab.png', 'symbols/sym2.png': 'chalice.png', 'symbols/sym3.png': 'crown.png',
 'symbols/sym4.png': 'jade_mask_b.png', 'symbols/sym5.png': 'wild_a.png', 'symbols/sym6.png': 'compass.png', 'symbols/sym7.png': 'key.png', 'symbols/sym8.png': 'explorer.png',
 'logo.webp': 'logo_b.png', 'bg_portrait.webp': 'bg_portrait.png', 'bg_landscape.webp': 'bg_landscape.png', 'bgfs_portrait.webp': 'bgfs_portrait.png', 'bgfs_landscape.webp': 'bgfs_landscape.png',
 'ui/station1.png': 'st1_discovery.png', 'ui/station2.png': 'st2_treasure.png', 'ui/station3.png': 'st3_ancient.png', 'ui/station4.png': 'st4_relic.png', 'ui/station5.png': 'st5_temple.png',
 'ui/relic.webp': 'sun_relic.png', 'ui/frame.webp': 'frame.png', 'ui/tile.png': 'tile.png', 'ui/spin.png': 'spin.png', 'ui/gate.webp': 'gate_open.png', 'ui/treasure.webp': 'treasure.png',
 'ui/door_sun.webp': 'door_sun_v2.png', 'ui/door_sun_open.webp': 'door_sun_open.png', 'ui/door_jade.webp': 'door_jade_v2.png', 'ui/door_jade_open.webp': 'door_jade_open.png',
 'ui/door_moon.webp': 'door_moon_v2.png', 'ui/door_moon_open.webp': 'door_moon_open.png'}
NAMES = {'sym0': 'Sapphire Gem', 'sym1': 'Golden Scarab', 'sym2': 'Golden Chalice', 'sym3': 'Ruby Crown', 'sym4': 'Jade Mask', 'sym5': 'Wild', 'sym6': 'Compass', 'sym7': 'Temple Key', 'sym8': 'Explorer'}
USED_RAW = set(SRC.values())
AUD_SRC = {'bonus.mp3': 'bonus_v2.mp3'}
MUSIC = ('music_base.mp3', 'music_free.mp3')

IMG_STATUS = 'SOURCE VERIFIED; EXCLUSIVITY NOT CONFIRMED; PROVIDER USE NEEDS CLARIFICATION; LEGAL REVIEW REQUIRED'
IMG_COMM = 'Higgsfield terms (read 2026-11-25): commercial use not restricted. Underlying model provider policy lists "real money gambling" as not permitted; not cleared for a real-money product'
IMG_SUB = 'Higgsfield terms (read): transfer and sublicence to third parties permitted. Not confirmed against the underlying model provider'
AUD_STATUS = IMG_STATUS
AUD_COMM = 'ElevenLabs terms (read 2026-11-25): commercial use on a paid plan, subject to the Prohibited Use Policy, which lists "Operating or facilitating real-money gambling"; not cleared for a real-money product'
AUD_SUB = 'Not confirmed. Standalone sale or sublicence of output is not permitted; distribution inside a game by a third party is unclarified'
CODE_STATUS = 'SOURCE VERIFIED; EXCLUSIVITY NOT CONFIRMED; PROVIDER USE NEEDS CLARIFICATION; LEGAL REVIEW REQUIRED'
CODE_COMM = 'Not confirmed. Anthropic Consumer Terms for Switzerland (read 2026-11-25): "Non-commercial use only"'
CODE_SUB = 'Not confirmed (depends on the point above)'
LIC_STATUS = 'SOURCE VERIFIED; COMMERCIAL USE CONFIRMED; SUBLICENSING CONFIRMED; EXCLUSIVITY NOT CONFIRMED'

COLS = ['path', 'asset_type', 'description', 'used_in_shipped_game', 'generator_or_source', 'platform', 'ai_model', 'generation_or_first_commit_date',
        'subscription_plan_documented', 'invoice_or_receipt_available', 'prompt_or_history_available', 'licence_documentation', 'provenance_evidence',
        'rights_status', 'commercial_use_documented', 'sublicensing_documented', 'human_rework', 'sha256_16', 'bytes', 'notes']
rows = []
def add(path, **k):
    r = dict.fromkeys(COLS, '')
    r['path'] = path
    if os.path.isfile(path):
        d = open(path, 'rb').read(); r['sha256_16'] = hashlib.sha256(d).hexdigest()[:16]; r['bytes'] = len(d)
        if path in first and not k.get('generation_or_first_commit_date'): r['generation_or_first_commit_date'] = first[path][0] + ' (first commit)'
    r.update(k); rows.append(r)

HF = dict(generator_or_source='AI-generated image', platform='Higgsfield (connector called from the development tool)',
          subscription_plan_documented='"basic" (account query 2026-11-24; no invoice in the project)', invoice_or_receipt_available='NO - owner to provide',
          prompt_or_history_available='YES - full prompt in the development session record (not in the repository); summary in assets/ASSET_REGISTER.md',
          licence_documentation='Higgsfield Terms of Use, last updated 2026-10-23 (read online, no saved copy); underlying model provider usage policies effective 2026-11-20 (read online, no saved copy)',
          rights_status=IMG_STATUS, commercial_use_documented=IMG_COMM, sublicensing_documented=IMG_SUB, human_rework='none')
EL = dict(generator_or_source='AI-generated audio', platform='ElevenLabs (connector called from the development tool)',
          subscription_plan_documented='"creator", active (account query 2026-11-25; no invoice in the project)', invoice_or_receipt_available='NO - owner to provide',
          prompt_or_history_available='YES - prompt in the development session record; summary in assets/ASSET_REGISTER.md',
          licence_documentation='ElevenLabs Terms of Use EU, Prohibited Use Policy (last updated 2026-10-09), Creative Terms, Music Terms (read online, no saved copy)',
          rights_status=AUD_STATUS, commercial_use_documented=AUD_COMM, sublicensing_documented=AUD_SUB, human_rework='none (owner listened and approved the sound on 2026-11-25)')
CODE = dict(generator_or_source='Written by an AI coding assistant on the owner\'s instructions', platform='Claude Code (Anthropic)',
            ai_model='named in the Co-Authored-By trailers of the Git commits', subscription_plan_documented='Claude Max per owner\'s statement; no evidence in the project',
            invoice_or_receipt_available='NO - owner to provide', prompt_or_history_available='YES - development session record; Git history',
            licence_documentation='Anthropic Consumer Terms of Service for Switzerland, effective 2025-10-08 (read online, no saved copy); no licence file in the repository',
            provenance_evidence='Git history (author "Claude" for every commit except the first); session record', rights_status=CODE_STATUS,
            commercial_use_documented=CODE_COMM, sublicensing_documented=CODE_SUB, human_rework='none documented')

for f in files:
    b = os.path.basename(f)
    if f == 'IP_AND_LICENSE_AUDIT/MASTER_ASSET_REGISTER.csv': continue  # the register does not list itself
    if f.startswith('assets/reference/raw/') and b in RAW_IMG:
        m = RAW_IMG[b]
        add(f, asset_type='image - raw generation', description='original output as delivered', used_in_shipped_game='source of a shipped file' if b in USED_RAW else 'NO - unused variant',
            ai_model='platform model id gpt_image_2_6; embedded record: issuer "OpenAI Media Service API", software "gpt-image"', generation_or_first_commit_date=m['when'],
            provenance_evidence=f'embedded hf-job-id {m["job"]}; embedded C2PA record signed by OpenAI (read, not cryptographically validated); session record', **HF)
    elif f.startswith('public/') and f[7:] in SRC:
        raw = SRC[f[7:]]; m = RAW_IMG[raw]; stem = os.path.splitext(b)[0]
        add(f, asset_type='image - symbol' if 'symbols/' in f else 'image - background' if b.startswith('bg') else 'image - logo' if b.startswith('logo') else 'image - UI graphic',
            description=NAMES.get(stem, stem), used_in_shipped_game='YES', ai_model='platform model id gpt_image_2_6 (OpenAI gpt-image per the record in the raw file)',
            generation_or_first_commit_date=m['when'] + ' (raw file)', provenance_evidence=f'derived automatically from assets/reference/raw/{raw} by tools/assets/process.py (job {m["job"]}); this shipped copy carries no embedded record',
            **{**HF, 'human_rework': 'none; automatic cut-out, crop, resize, format conversion'})
    elif f.startswith('assets/audio/raw/') and b in RAW_AUD:
        add(f, asset_type='audio - raw generation', description='original output as delivered', used_in_shipped_game='source of a shipped file',
            ai_model='eleven_music_v2' if b in MUSIC else 'eleven_text_to_sound_v2', generation_or_first_commit_date='2026-11-25 (generation calls 05:58-07:23 UTC per session record)',
            provenance_evidence='embedded C2PA record signed by "Eleven Labs Inc." (read, not cryptographically validated); session record', **EL,
            notes='byte-identical to bonus_v2.mp3' if b == 'bonus.mp3' else 'byte-identical to bonus.mp3' if b == 'bonus_v2.mp3' else '')
    elif f.startswith('public/audio/'):
        raw = AUD_SRC.get(b, b)
        add(f, asset_type='audio - music loop' if b in MUSIC else 'audio - sound effect', description=os.path.splitext(b)[0], used_in_shipped_game='YES',
            ai_model='eleven_music_v2' if b in MUSIC else 'eleven_text_to_sound_v2', generation_or_first_commit_date='2026-11-25 (raw file)',
            provenance_evidence=f'derived automatically from assets/audio/raw/{raw} by tools/assets/audio.sh (trim, loudness, re-encode); shipped copy re-encoded',
            **{**EL, 'human_rework': 'none; automatic processing (owner listened and approved the sound on 2026-11-25)'},
            notes='Music Terms: self-serve plans exclude "Studio Games"' if b in MUSIC else '')
    elif f.startswith('public/fonts/'):
        fam = 'Cinzel' if 'cinzel' in b else 'Source Sans 3'
        add(f, asset_type='font', description=fam, used_in_shipped_game='YES', generator_or_source='third-party font', platform=f'npm package @fontsource/{"cinzel" if fam == "Cinzel" else "source-sans-3"} (package not declared in package.json)',
            subscription_plan_documented='n/a', invoice_or_receipt_available='n/a (free licence)', prompt_or_history_available='n/a', licence_documentation='SIL Open Font License 1.1 (licence file in the npm package; text not bundled with the build)',
            provenance_evidence='file copied from the npm package', rights_status=LIC_STATUS, commercial_use_documented='YES - OFL 1.1 permits commercial use and embedding',
            sublicensing_documented='Redistribution permitted under the same licence; the font may not be sold by itself', human_rework='n/a')
    elif f == 'public/ui/frame.json':
        add(f, asset_type='data file', description='position of the opening in the frame image', used_in_shipped_game='YES', **{**CODE, 'generator_or_source': 'generated by tools/assets/process.py'})
    elif f.startswith('docs/polish/'):
        add(f, asset_type='image - screenshot of the game', description='screenshot for documentation', used_in_shipped_game='NO', generator_or_source='screenshot of the demo taken by automated tests',
            platform='n/a', rights_status='SOURCE VERIFIED; LEGAL REVIEW REQUIRED', notes='shows the AI-generated art; same rights position as the art', human_rework='n/a')
    elif f == 'README.md':
        add(f, asset_type='documentation', used_in_shipped_game='NO', **{**CODE, 'notes': 'first line committed by the owner on 2026-06-16; rest written by the assistant'})
    elif f.endswith('.zip'):
        add(f, asset_type='archive of documents', used_in_shipped_game='NO', **CODE)
    elif f.endswith('.md') or f.startswith('docs/') or f.endswith('.csv'):
        add(f, asset_type='documentation' if not f.startswith('docs/math/reports') else 'simulation report', used_in_shipped_game='NO', **CODE)
    elif f.startswith('src/'):
        add(f, asset_type='source code - ' + f.split('/')[1], used_in_shipped_game='YES', **CODE,
            notes='includes code-drawn effects and UI (no image files)' if f in ('src/client/fx.ts', 'src/client/textures.ts') else '')
    elif f.startswith('config/'):
        add(f, asset_type='game configuration', used_in_shipped_game='YES' if 'v1.0.0' in f else 'NO (test)', **CODE)
    elif f.startswith(('tests/', 'tools/')):
        add(f, asset_type='source code - tests' if f.startswith('tests/') else 'source code - tools', used_in_shipped_game='NO', **CODE)
    else:
        add(f, asset_type='project file', used_in_shipped_game='build configuration' if f in ('package.json', 'package-lock.json', 'vite.config.ts', 'index.html') or f.startswith('tsconfig') else 'NO', **CODE)

# third-party software that ships (not tracked in the repository)
for name, ver, lic, note in [('phaser', '3.90.0', 'MIT (Copyright (c) 2024 Richard Davey, Phaser Studio Inc.)', 'game framework'), ('eventemitter3', '5.0.4', 'MIT', 'dependency inside Phaser')]:
    add(f'node_modules/{name} (dependency, not in the repository)', asset_type='external library', description=note, used_in_shipped_game='YES', generator_or_source='third-party open-source software',
        platform='npm', generation_or_first_commit_date=f'version {ver}', subscription_plan_documented='n/a', invoice_or_receipt_available='n/a (free licence)', prompt_or_history_available='n/a',
        licence_documentation=f'{lic}; licence file in the npm package; notice not yet bundled with the build', provenance_evidence='package-lock.json', rights_status=LIC_STATUS,
        commercial_use_documented='YES - MIT', sublicensing_documented='YES - MIT permits sublicensing', human_rework='n/a')

os.makedirs('IP_AND_LICENSE_AUDIT', exist_ok=True)
with open('IP_AND_LICENSE_AUDIT/MASTER_ASSET_REGISTER.csv', 'w', newline='') as fh:
    w = csv.DictWriter(fh, fieldnames=COLS); w.writeheader(); w.writerows(rows)
import collections
print(len(rows), 'rows'); print(collections.Counter(r['asset_type'].split(' - ')[0] for r in rows))
print('rows without status:', [r['path'] for r in rows if not r['rights_status']])
