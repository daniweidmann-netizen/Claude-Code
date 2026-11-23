# 03 – Technische Architektur

Stand: 2026-11-23 · Status: zur Freigabe vorgelegt · Noch kein Code implementiert.

## 1. Leitprinzipien

1. **Die Engine ist das Produkt, der Client ist ein Darsteller.** Die gesamte Spiellogik läuft ohne Browser, ohne Phaser und ohne Zeitbezug.
2. **Eine Runde ist eine reine Funktion:** `(Konfiguration, Einsatz, RNG, Spielerentscheidungen) → RoundResult`. Gleicher Seed und gleiche Entscheidungen ergeben bitgenau dasselbe Ergebnis.
3. **Der Client berechnet nichts.** Er erhält eine geordnete Ereignisliste und spielt sie ab. Animationsdauer, Überspringen und Bildrate können das Ergebnis nicht beeinflussen.
4. **Alle Zahlen liegen in Konfigurationsdaten**, nicht im Code. Keine fest codierten Gewinnresultate.
5. **Geldbeträge sind Ganzzahlen** (kleinste Währungseinheit); Auszahlungswerte sind Ganzzahlen in Hundertstel-Einsatz. Keine Gleitkommarechnung im Gewinnpfad.

## 2. Schichten und Abhängigkeiten

```
┌──────────────────────────────────────────────────────────────┐
│ client (Phaser 3)   Szenen · Präsentation · UI · Audio       │
│        │ liest nur RoundResult / Ereignisse                  │
├────────▼─────────────────────────────────────────────────────┤
│ session             GameService-Schnittstelle                │
│                     LocalGameService (Demo, Engine im        │
│                     Browser) │ RemoteGameService (später RGS)│
├────────▼─────────────────────────────────────────────────────┤
│ engine (reines TypeScript, keine DOM-/Phaser-Abhängigkeit)   │
│   round · cascades · clusters · expedition · bonus ·         │
│   freespins · payout · config · rng                          │
└──────────────────────────────────────────────────────────────┘
 tools/sim (Node, worker_threads) ──► nutzt ausschliesslich engine
```

Abhängigkeiten zeigen nur nach unten. Eine Lint-Regel verbietet Importe von `client` in `engine`.

**Echtgeld-Zielbild (Stufe D, nicht Teil dieses Projekts):** Die Engine läuft auf dem Remote Game Server des Lizenznehmers mit dessen zertifiziertem RNG. Der Client tauscht nur `LocalGameService` gegen `RemoteGameService`. Die Temple-Bonus-Zuordnung wird serverseitig gespeichert, bevor der Client die Kammern anzeigt.

## 3. Verzeichnisstruktur

```
src/
  engine/
    config/        Typen, Validierung, Spielkonfiguration (JSON)
    rng/           Rng-Schnittstelle, Xoshiro256**, gewichtete Auswahl
    grid/          Raster, Schwerkraft, Nachfüllen
    clusters/      Clustererkennung (Flood-Fill mit Wild-Regeln)
    payout/        Auszahlungstabelle, Multiplikator, Gewinnobergrenze
    expedition/    Track-Zustand, Stationseffekte
    bonus/         Temple Bonus (Preisziehung, Auswahl)
    freespins/     Auslösung, Base Camp, Finale
    round/         Rundenablauf, Ereignisprotokoll, Zustandsautomat
    index.ts       öffentliche API
  session/         GameService, Demo-Guthaben, Rundenhistorie
  client/
    scenes/        Boot, Preload, Game, TempleBonus
    presentation/  Ereignis → Animations-Timeline
    reels/         Rasterdarstellung, Fall-Animation
    expedition/    Track-Darstellung
    ui/            Bedienleiste, Menüs, Regeln
    audio/         Audio-Manager, Ereigniszuordnung
    state/         UI-Zustandsautomat
tools/
  sim/             Simulator, Statistik, Berichte
  exploration/     Voruntersuchungen
tests/
  unit/  integration/  property/  golden/  e2e/
docs/
assets/            Quelldateien und Asset-Register
```

Gegenüber der Beispielstruktur sind `math`, `features`, `symbols` in fachliche Engine-Module aufgelöst, und `animation` ist als `presentation` klar vom Rechnen getrennt.

## 4. Kernverträge

```ts
interface Rng {
  /** Gleichverteilte Ganzzahl in [0, n) ohne Modulo-Verzerrung. */
  nextInt(n: number): number;
}

interface RoundRequest {
  bet: number;                 // kleinste Währungseinheit
  picks?: ChamberIndex[];      // Temple-Bonus-Entscheidungen, sobald vorhanden
}

interface RoundResult {
  configVersion: string;
  bet: number;
  totalWin: number;
  capped: boolean;
  events: GameEvent[];         // vollständiger, geordneter Ablauf
  pending?: PendingChoice;     // Runde wartet auf eine Spielerentscheidung
}

type GameEvent =
  | { type: 'gridFilled'; grid: SymbolId[] }
  | { type: 'clustersWon'; clusters: ClusterWin[]; multiplier: number; win: number }
  | { type: 'keysCollected'; positions: number[] }
  | { type: 'trackAdvanced'; from: number; to: number }
  | { type: 'symbolsRemoved'; positions: number[] }
  | { type: 'gridCascaded'; moves: Move[]; refills: Refill[]; grid: SymbolId[] }
  | { type: 'stationEffect'; station: 1 | 2 | 3 | 4 | 5; detail: StationDetail }
  | { type: 'freeSpinsTriggered'; count: number; baseCamp: number }
  | { type: 'freeSpinStarted'; index: number; baseCamp: number; sunBonus: number }
  | { type: 'templeSealCollected'; seals: number }
  | { type: 'templeBonusStarted'; tier: 'bronze' | 'silver' | 'gold' }
  | { type: 'chamberPicked'; chamber: number; prize: Prize }
  | { type: 'chambersRevealed'; prizes: Prize[] }
  | { type: 'maxWinReached' }
  | { type: 'roundEnded'; totalWin: number };
```

Das Ereignisprotokoll dient zugleich als Wiedergabeformat, als Grundlage der Golden-Tests und als Integrationsvertrag für einen fremden Client.

**Spielerentscheidung ohne Informationsleck:** Solange eine Kammerwahl aussteht, enthält `RoundResult` die Preise der Kammern nicht. Im Demo-Modus hält `LocalGameService` sie zurück; im Echtgeldbetrieb verlassen sie den Server nicht.

## 5. RNG

- **Schnittstelle** `Rng` wie oben; die Engine kennt keine konkrete Implementierung.
- **Simulation und Tests:** Xoshiro256** mit SplitMix64-Initialisierung, über `BigInt`/Uint32-Paare implementiert, gegen veröffentlichte Referenzvektoren getestet. Ganzzahlen per Verwerfungsverfahren, damit keine Modulo-Verzerrung entsteht.
- **Demo im Browser:** Seed aus `crypto.getRandomValues`; der Seed wird in der Rundenhistorie gespeichert, sodass jede Demo-Runde reproduzierbar ist.
- **Echtgeld:** RNG des Lizenznehmers hinter derselben Schnittstelle. Der Prototyp-RNG erhebt keinen Zertifizierungsanspruch.
- **Zugreihenfolge ist Teil der Spezifikation** (GDD 3.3), damit zwei unabhängige Implementierungen mit demselben Seed dasselbe Ergebnis liefern.
- Keine Abhängigkeit der Ziehung von Guthaben, Einsatzhöhe, Spielverlauf oder Spielerverhalten.

## 6. Zustandsverwaltung

- **Engine:** expliziter Zustandsautomat je Runde (`BaseSpin → TempleBonus? → FreeSpins? → TempleFinale? → Done`). Der Rundenzustand ist serialisierbar (Wiederaufnahme nach Verbindungsabbruch).
- **Client:** eigener UI-Automat (GDD 9.3), der ausschliesslich von Ereignissen und Benutzereingaben getrieben wird. Guthaben wird erst nach `roundEnded` als verfügbar gebucht; die Anzeige zählt während der Präsentation hoch.

## 7. Client

- **Phaser 3** (aktuelle 3.x-Version, wird beim Aufsetzen festgelegt), **Vite** als Build-Werkzeug, **TypeScript strict**.
- Skalierung: `Scale.RESIZE` mit eigenem Layout-Manager für Hoch- und Querformat; sichere Bereiche (Notch) berücksichtigt.
- Präsentationsschicht übersetzt Ereignisse in eine Timeline; «Überspringen» spult die Timeline vor, ändert aber keine Daten.
- Texturatlanten in zwei Auflösungen; Audio als Sprite-Datei (Ogg + M4A/MP3).
- Leistungsziele: 60 fps auf Mittelklasse-Smartphones, Erstladung unter 8 MB, kein Speicherzuwachs über 1 000 Runden (wird in der QA gemessen).

## 8. Teststrategie

| Ebene | Werkzeug | Inhalt |
|---|---|---|
| Unit | Vitest | Clustererkennung (inkl. Wild-Sonderfälle), Schwerkraft, Auszahlung, Multiplikator, Stationseffekte, Preisziehung, RNG-Referenzvektoren |
| Property | fast-check | Invarianten: Raster immer vollständig, Symbolerhalt beim Fallen, Runde terminiert, Gewinn ≤ Obergrenze, Track monoton, gleicher Seed = gleiches Ergebnis |
| Integration | Vitest | vollständige Runden mit festgelegten Zufallsfolgen für jeden Feature-Pfad |
| Golden | Vitest | gespeicherte Ereignisprotokolle für feste Seeds; jede Abweichung erfordert bewusste Freigabe |
| Simulation | tools/sim | RTP, Verteilungen, Konvergenz (Dokument 04) |
| Statistik | tools/sim | Chi-Quadrat-Tests der Symbolhäufigkeiten und der gewichteten Auswahl |
| E2E | Playwright | Demo-Ablauf, Hoch-/Querformat, Bildvergleich wichtiger Zustände, Chromium/Firefox/WebKit |
| Leistung | Playwright + Messskript | Bildrate, Ladezeit, Speicher über lange Sitzungen |

Zum Testen seltener Pfade erhält die Engine einen **Skript-RNG** (vorgegebene Zahlenfolge). Er existiert nur im Testcode und ist im Produktions-Build nicht enthalten.

**CI (GitHub Actions, kostenfrei):** Lint, Typprüfung, Unit-/Property-/Integration-/Golden-Tests und eine Kurzsimulation bei jedem Push; Langsimulationen manuell.

## 9. Abhängigkeiten

Bewusst wenige: `phaser`, `typescript`, `vite`, `vitest`, `fast-check`, `@playwright/test`, `eslint`, `prettier`. Die Engine hat **keine** Laufzeitabhängigkeit. Jede weitere Bibliothek braucht eine Begründung im Entscheidungsregister.

## 10. Bekannte technische Risiken

| Risiko | Massnahme |
|---|---|
| Simulationsgeschwindigkeit in TypeScript reicht nicht für 10⁹+ Spins | flache typisierte Arrays, keine Ereigniserzeugung im Simulationsmodus, `worker_threads`; Messung als erste Aufgabe der Mathematikphase |
| 64-Bit-Arithmetik in JavaScript ist langsam | RNG auf Uint32-Paaren; Referenzvektoren sichern die Korrektheit |
| Abweichung zwischen Simulations- und Ereignismodus | ein gemeinsamer Rechenkern; Test vergleicht beide Modi über viele Seeds |
| Käufer nutzt eine andere Client-Technologie | Ereignisprotokoll als dokumentierter Vertrag, Engine ohne UI-Abhängigkeit |
