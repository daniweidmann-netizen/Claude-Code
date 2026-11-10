// Ablauf "neues Video für eine Folge erstellen" (Skript → Projekt → Entwurf speichern).
import { generateScript, fillImages } from '../video/generate.js';
import { scriptToProject } from '../video/project.js';
import { saveVideo } from './store.js';

export async function createVideoForEpisode(user, series, episode, onStatus) {
  const script = await generateScript({
    niche: series.niche,
    topic: series.topic,
    language: series.language,
    seriesTitle: series.title,
    episodeKey: episode?.key,
    episodeTitle: episode?.title,
  });
  const project = scriptToProject(script, {
    language: series.language,
    voiceId: series.voice_id,
    artStyle: series.art_style,
    captions: series.captions,
    music: series.music,
  });
  onStatus?.('Bilder werden gesucht …');
  const withImages = (await fillImages(project).catch(() => null))?.project || project;
  return saveVideo({
    user_id: user.id,
    series_id: series.id,
    title: script.title || episode?.title || series.title,
    episode_key: episode?.key || null,
    status: 'draft',
    project: withImages,
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
