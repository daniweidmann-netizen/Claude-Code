// Welche Plattformen auf dem Server aktiv sind (App-Schlüssel gesetzt) – einmal laden, dann zwischenspeichern.
import { useEffect, useState } from 'react';
import { PLATFORMS } from '../config/catalog.js';

let cache = null;
let pending = null;
const load = () => (pending ||= fetch('/api/social/status').then((r) => r.json()).then((d) => (cache = d)).catch(() => (cache = {})));

// Plattform-Liste, bei der „bald verfügbar“ entfällt, sobald der Server die Plattform aktiviert hat
export function usePlatforms() {
  const [status, setStatus] = useState(cache);
  useEffect(() => { if (!cache) load().then(setStatus); }, []);
  return PLATFORMS.map((p) => (p.soon && status?.[p.id]?.configured ? { ...p, soon: false } : p));
}
