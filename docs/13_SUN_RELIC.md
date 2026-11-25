# 13 – Sun Relic: Rolle und Auftritte

Stand: 25. November 2026 · Konfiguration 1.0.0 (unverändert)

## Entscheidung

Das Sun Relic wird vorerst **kein reguläres Walzensymbol**. Es ist das zentrale Artefakt der
Spielwelt: der Gegenstand, den die Expedition sucht und der die Kammern des Tempels öffnet.

Unverändert bleiben: Paytable (kein neuer Eintrag), Gewinnkombinationen, Symbolgewichte, RNG, RTP,
Auszahlungslogik, Mindestcluster 5. Keine Datei der Engine, der Sitzungsschicht oder der
Konfiguration wurde berührt; der Konfigurations-Hash ist derselbe. Alle Auftritte unten sind reine
Darstellung und lesen nur das Ereignisprotokoll.

## Das Artefakt

Eigenes Bild: freistehende goldene Sonnenscheibe mit zwölf Strahlen, grossem Türkisstein mit
Goldadern und Jade-Einlagen (`public/ui/relic.webp`, Quelle `assets/reference/raw/sun_relic.png`).
KI-erzeugt, nicht von Hand überarbeitet; Rechtslage wie bei allen KI-Bildern offen
(siehe `assets/ASSET_REGISTER.md`).

## Wo das Relikt erscheint

| Ort | Auslöser (bestehendes Ereignis) | Darstellung |
|---|---|---|
| Expedition Track, Station 4 «Relic» | immer sichtbar | Medaillon der Station (Sonnenscheibe mit Türkis, bestehend) |
| Spielfeld | Station Relic wird erreicht | Das Artefakt erscheint mit seinem Wert (z. B. +3) auf dem betroffenen Feld, ein Lichtstrahl geht zur Multiplikatoranzeige, das Feld wird zum Wild. Der Wert ist der bereits von der Engine gezogene Sonnenbonus. |
| Multiplikatoranzeige | Sonnenbonus grösser als 0 | Sonnenkranz und Zusatz «+ n SUN» (bestehend) |
| Über dem Spielfeld | Expedition erreicht in der Basisrunde den Tempel | Das Artefakt steigt gross über dem Spielfeld auf, Lichtstrahlen und Türkisring, dann öffnet sich der Tempel (rund 1,2 s) |
| Temple Bonus, Titel | Bonus und Finale | Zwei kleine, langsam drehende Artefakte flankieren den Titel (nur wenn der Platz reicht) |
| Temple Bonus, Kammer | Preis «Relic Bonus» (bestehender Preistyp: Gewinn plus eine weitere Kammer) | Das Artefakt ist der Fund in der Kammer, mit eigenem Lichtkranz; in nicht gewählten Kammern gedämpft |
| Spielregeln (Reiter «Regeln») | – | Eigener Eintrag mit Bild: zentrales Artefakt, **kein Walzensymbol**, keine eigene Auszahlung, und wo es erscheint |

## Bewusst nicht umgesetzt

- Kein Relikt als fallendes Symbol auf dem Raster, kein Paytable-Eintrag.
- Kein Relikt als zusätzlicher Preis oder Sammelzähler: Das wäre eine neue Spielregel und damit
  eine Mathematikänderung.
- Kein Relikt im Temple Finale als eigener Moment (das Finale beginnt direkt nach den Free Spins;
  dort flankiert es nur den Titel).

## Prüfung

Siehe Abschnitt «Tests» am Ende dieses Dokuments.
