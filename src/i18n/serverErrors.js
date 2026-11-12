import { getLang } from './index.jsx';

// Der Server antwortet mit deutschen Fehlermeldungen; hier werden sie für die
// englische Oberfläche übersetzt (exakte Texte und Muster mit variablen Teilen).
const EXACT = {
  'Antwort des KI-Modells war unvollständig. Bitte erneut versuchen.': 'The AI model returned an incomplete answer. Please try again.',
  'Das Thema wurde vom KI-Modell abgelehnt. Bitte wähle ein anderes Thema.': 'The AI model declined this topic. Please choose a different topic.',
  'Für diese Serie ist keine Plattform ausgewählt.': 'No platform is selected for this series.',
  'Instagram-Upload noch nicht aktiviert (App-Review ausstehend).': 'Instagram upload is not enabled yet (app review pending).',
  'TikTok-Upload noch nicht aktiviert (App-Review ausstehend).': 'TikTok upload is not enabled yet (app review pending).',
  'Noch kein exportiertes MP4 gespeichert – bitte zuerst exportieren.': 'No exported MP4 saved yet – please export first.',
  'Pixabay-Limit erreicht – bitte kurz warten.': 'Pixabay limit reached – please wait a moment.',
  'Server nicht vollständig konfiguriert (Supabase).': 'Server not fully configured (Supabase).',
  'Video nicht gefunden.': 'Video not found.',
  'YouTube-Verbindung abgelaufen – bitte im Konto neu verbinden.': 'YouTube connection expired – please reconnect it under Account.',
  'Checkout konnte nicht gestartet werden.': 'Checkout could not be started.',
  'Deine Dateien konnten nicht gelöscht werden. Bitte versuche es erneut oder kontaktiere den Support.': 'Your files could not be deleted. Please try again or contact support.',
  'FFmpeg ist auf dem Server nicht installiert.': 'FFmpeg is not installed on the server.',
  'Kein Abo vorhanden': 'No subscription found',
  'Keine Datei': 'No file',
  'Kundenportal konnte nicht geöffnet werden.': 'The customer portal could not be opened.',
  'Löschen fehlgeschlagen': 'Deletion failed',
  'MP4-Umwandlung fehlgeschlagen': 'MP4 conversion failed',
  'Nicht angemeldet': 'Not signed in',
  'Sitzung ungültig': 'Session invalid',
  'Unbekannte Plattform': 'Unknown platform',
  'Unbekannter Plan': 'Unknown plan',
  'Kein Zugriff': 'No access',
  'Du hast bereits ein aktives Abo. Planwechsel bitte über „Zahlungsdaten & Rechnungen“.': 'You already have an active subscription. Please change plans via “Payment details & invoices”.',
  'Meta-Token fehlgeschlagen': 'Meta token request failed',
  'TikTok-Token fehlgeschlagen': 'TikTok token request failed',
};
const PATTERNS = [
  [/^(.+) ist nicht verbunden\.$/, '$1 is not connected.'],
  [/^Bild-Download fehlgeschlagen/, 'Image download failed'],
  [/^Bildmodell-Fehler/, 'Image model error'],
  [/^Pixabay-Fehler/, 'Pixabay error'],
  [/^Wikimedia-Fehler/, 'Wikimedia error'],
  [/^TTS-Fehler/, 'TTS error'],
  [/^Video-Datei nicht gefunden:/, 'Video file not found:'],
  [/^Google-Token fehlgeschlagen:/, 'Google token request failed:'],
  [/^YouTube lehnt den Upload ab/, 'YouTube rejected the upload'],
  [/^YouTube-Upload fehlgeschlagen/, 'YouTube upload failed'],
  [/^Fehler (\d+)$/, 'Error $1'],
];

export function translateServerError(msg) {
  if (!msg || getLang() === 'de') return msg;
  if (EXACT[msg]) return EXACT[msg];
  for (const [re, rep] of PATTERNS) if (re.test(msg)) return msg.replace(re, rep);
  return msg;
}
