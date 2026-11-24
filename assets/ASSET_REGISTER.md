# Asset-Register

Jedes Asset wird hier mit Herkunft, Werkzeug, Lizenzlage und Bearbeitung erfasst (CR-07). Status: `ENTWURF` · `REFERENZ (in Prüfung)` · `FREIGEGEBEN` · `VERWORFEN`.

## Rechtlicher Stand (keine Rechtsberatung)

- **Higgsfield:** Laut Help Center des Anbieters ist die kommerzielle Nutzung der Ergebnisse in allen Tarifen erlaubt, und der Anbieter beansprucht kein Eigentum an den Ergebnissen (dort zitiert: Abschnitt 4.4 der Terms of Use). Den Volltext der Terms habe ich **nicht** geprüft. Drittquellen beschreiben eine weitreichende, unwiderrufliche Lizenz, die sich der Anbieter an Inhalten einräumt; der aktuelle Wortlaut ist vor einem IP-Verkauf anwaltlich zu prüfen. Abgerufen am 2026-11-24:
  https://higgsfield.ai/creator-hub/help-center/account-and-privacy/who-owns-my-generations-and-can-i-use-them-commercially · https://higgsfield.ai/Terms-of-Use-Agreement
- **Zugrunde liegendes Bildmodell** (`gpt_image_2_6`): Nutzungsbedingungen des Modellanbieters nicht geprüft.
- **Schutzfähigkeit:** Rein KI-generierte Bilder sind in wichtigen Rechtsordnungen möglicherweise nicht urheberrechtlich geschützt. Für die finale Grafik ist eine dokumentierte menschliche Überarbeitung vorgesehen; bei den Referenzbildern unten gibt es sie noch **nicht**.
- **Ähnlichkeit:** Keine Prüfung auf Ähnlichkeit mit bestehenden Spielen oder realen Artefakten durchgeführt. Masken und Sonnenscheiben in diesem Stil sind im Genre verbreitet.

## Im Code gezeichnete Platzhalter

| Asset | Datei | Herkunft | Status |
|---|---|---|---|
| 9 Symbol-Platzhalter | `src/client/textures.ts` | eigene Arbeit, im Code gezeichnet, kein Fremdmaterial | ENTWURF (wird ersetzt) |

## Referenzsymbole (Qualitätstor, 2026-11-24)

Werkzeug: Higgsfield, Modell `gpt_image_2_6`, Seitenverhältnis 1:1, 1024×1024, je 2 Varianten, Kosten 3 Credits insgesamt. Konto des Auftraggebers.

| Asset | Rohdatei | Job-ID | Verwendung | Bearbeitung | Status |
|---|---|---|---|---|---|
| Jade Mask A | `assets/reference/raw/jade_mask_a.png` | 88d18963-2b19-4bc7-b537-126ee70c0b18 | – | keine | REFERENZ (in Prüfung) |
| Jade Mask B | `assets/reference/raw/jade_mask_b.png` | 06379c7f-ab7e-4ea5-ad66-f0935ed2dc2d | `public/symbols/sym4.png` | automatisch: auf 128 px verkleinert, Ecken abgerundet | REFERENZ (in Prüfung) |
| Wild A | `assets/reference/raw/wild_a.png` | 201a38f2-b73f-42c5-9017-5d2b20ede290 | `public/symbols/sym5.png` | automatisch: auf 128 px verkleinert, Ecken abgerundet | REFERENZ (in Prüfung) |
| Wild B | `assets/reference/raw/wild_b.png` | a7ba59af-ef39-40a7-afc6-be48805443f3 | – | keine | REFERENZ (in Prüfung) |

**Prompt Jade Mask:**
> Single game icon for a premium adventure slot game: an ancient ceremonial mask carved from polished green jade with gold inlay lines and small turquoise accents, calm closed-mouth expression, original invented design not based on any real artifact or existing game. Centered, front view, fills about 80 percent of the frame, strong readable silhouette that works at 96 pixels. Stylised painterly 3D rendering, warm golden rim light from upper left, deep teal shadows, crisp edges, subtle glow. Plain flat dark navy background (#10131c), no text, no letters, no frame, no border, no watermark, no other objects.

**Prompt Wild:**
> Single game icon for a premium adventure slot game: a radiant golden sun disc relic, a round engraved gold medallion with a stylised sun face-less emblem in the centre and twelve short pointed rays, small inlaid amber gem in the middle, original invented design not based on any real artifact or existing game. Centered, front view, fills about 80 percent of the frame, strong readable silhouette that works at 96 pixels. Stylised painterly 3D rendering, warm golden rim light from upper left, deep teal shadows, crisp edges, soft golden glow. Plain flat dark navy background (#10131c), no text, no letters, no frame, no border, no watermark, no other objects.

Die Referenzbilder erscheinen im Client nur mit dem Parameter `?art=ref`; der Standard-Build zeigt ausschliesslich Platzhalter.
