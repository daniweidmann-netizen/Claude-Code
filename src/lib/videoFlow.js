// Ablauf "neues Video für eine Folge erstellen" (Skript → Projekt → Entwurf speichern).
import { generateScript, fillImages } from '../video/generate.js';
import { scriptToProject } from '../video/project.js';
import { saveVideo, uploadMedia } from './store.js';
import { splitOwnText } from '../../shared/mockScripts.js';
import { synthesize } from '../video/tts.js';

export async function createVideoForEpisode(user, series, episode, onStatus, custom = {}) {
  onStatus?.(custom.ownText ? 'Dein Text wird in Szenen aufgeteilt …' : 'Skript wird geschrieben …');
  const script = await generateScript({
    idea: custom.idea || undefined,
    notes: custom.notes || undefined,
    ownText: custom.ownText || undefined,
    niche: series.niche,
    topic: series.topic,
    language: series.language,
    seriesTitle: series.title,
    episodeKey: episode?.key,
    episodeTitle: episode?.title,
    targetSeconds: series.target_seconds || 65,
  });
  // Eigener Text muss wortgetreu bleiben – sonst lokale Aufteilung verwenden (Bildbeschreibungen der KI behalten)
  if (custom.ownText) {
    const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();
    const joined = norm([script.hook, ...(script.scenes || []).map((x) => x.text), script.cta].filter(Boolean).join(' '));
    if (joined !== norm(custom.ownText)) {
      const local = splitOwnText(custom.ownText, script.title);
      local.scenes = local.scenes.map((sc, i) => ({ ...sc, visual: script.scenes?.[i]?.visual || sc.visual }));
      Object.assign(script, { ...local, archiveQuery: script.archiveQuery, motif: script.motif || local.motif });
    }
  }
  const project = scriptToProject(script, {
    niche: series.niche,
    language: series.language,
    voiceId: series.voice_id,
    artStyle: series.art_style,
    captions: series.captions,
    music: series.music,
  });
  onStatus?.('Bilder werden gesucht …');
  const withImages = (await fillImages(project, user.id).catch(() => null))?.project || project;
  onStatus?.('Voiceover wird gesprochen …');
  const withVoice = await fillVoice(withImages, user.id).catch(() => withImages);
  return saveVideo({
    user_id: user.id,
    series_id: series.id,
    title: custom.title || script.title || episode?.title || series.title,
    episode_key: episode?.key || (custom.idea || custom.ownText ? `eigene-${Date.now()}` : null),
    status: 'draft',
    project: withVoice,
    platforms: series.platforms || [],
  });
}

export const STATUS_LABELS = {
  draft: { label: 'Entwurf', cls: 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200' },
  ready: { label: 'Bereit', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200' },
  pending_approval: { label: 'Freigabe ausstehend', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200' },
  scheduled: { label: 'Geplant', cls: 'bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200' },
  posted: { label: 'Gepostet', cls: 'bg-emerald-600 text-white' },
  failed: { label: 'Fehlgeschlagen', cls: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' },
};

// Erzeugt für alle Szenen ohne Audio ein KI-Voiceover (nur wenn ein Sprach-Anbieter verbunden ist).
export async function fillVoice(project, userId) {
  const scenes = [];
  for (const s of project.scenes) {
    if (s.audioUrl || !s.text?.trim()) { scenes.push(s); continue; }
    const r = await synthesize(s.text, { lang: project.language, voiceId: s.voiceId || project.voiceId });
    if (!r) return project; // kein Anbieter verbunden → nichts ändern
    scenes.push({ ...s, audioUrl: await uploadMedia(userId, r.audioUrl, 'audio'), audioDuration: r.duration });
  }
  return { ...project, scenes };
}
