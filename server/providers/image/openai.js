// Bild-Modul über die OpenAI Images API (KI-generierte Bilder passend zur Szene).
// Gibt eine JPEG-Data-URL zurück; der Client lädt sie in Supabase Storage hoch.
// Kosten steuerbar über OPENAI_IMAGE_MODEL (Standard gpt-image-1-mini) und
// OPENAI_IMAGE_QUALITY (low | medium | high, Standard medium).
const STYLE_PROMPTS = {
  realistic: 'photorealistic, natural light, detailed, 35mm photo',
  anime: 'anime illustration, vibrant colors, clean line art, studio quality',
  comic: 'comic book style, bold ink outlines, halftone shading, flat colors',
  cinematic: 'cinematic film still, dramatic lighting, teal and orange grading, shallow depth of field',
  stock: 'high quality stock footage frame, neutral colors, documentary look',
  manga: 'black and white manga panel, screentone shading, bold ink lines, high contrast, Japanese manga style, no color',
};

const MODEL = () => process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1-mini';
const QUALITY = () => process.env.OPENAI_IMAGE_QUALITY || 'medium';

async function toResult(res) {
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Bildmodell-Fehler ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  return { imageUrl: b64 ? `data:image/jpeg;base64,${b64}` : data.data?.[0]?.url || null };
}

// Referenzbild der Hauptfigur (Figuren-Geschichten)
export async function createCharacter({ description, style }) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: MODEL(), quality: QUALITY(), size: '1024x1536', output_format: 'jpeg', output_compression: 85, n: 1,
      prompt: `Character reference portrait of an invented, fictional person (not a real or famous person): ${description}. Upper body, facing the viewer, friendly neutral expression, plain simple background. ${STYLE_PROMPTS[style] || STYLE_PROMPTS.cinematic}. No text, no logos.`,
    }),
  });
  return toResult(res);
}

// Szene mit derselben Figur: Referenzbild wird als Vorlage mitgegeben
export async function generateWithCharacter({ prompt, style, characterUrl, characterDescription }) {
  const ref = await fetch(characterUrl);
  if (!ref.ok) throw new Error(`Referenzbild nicht ladbar (${ref.status})`);
  const fd = new FormData();
  fd.append('model', MODEL());
  fd.append('quality', QUALITY());
  fd.append('size', '1024x1536');
  fd.append('output_format', 'jpeg');
  fd.append('output_compression', '85');
  fd.append('image[]', new Blob([Buffer.from(await ref.arrayBuffer())], { type: ref.headers.get('content-type') || 'image/jpeg' }), 'character.jpg');
  fd.append('prompt', `The person in the reference image is the main character of this story${characterDescription ? ` (${characterDescription})` : ''}. Keep exactly the same face, hair, body and clothing. If the scene does not involve the main character, you may leave them out. Scene: ${prompt}. ${STYLE_PROMPTS[style] || ''}. Vertical 9:16 composition, no text, no logos.`);
  const res = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: fd });
  return toResult(res);
}

export default {
  name: 'openai',
  async generate({ prompt, style }) {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1-mini',
        quality: process.env.OPENAI_IMAGE_QUALITY || 'medium',
        output_format: 'jpeg',
        output_compression: 85,
        prompt: `${prompt}. ${STYLE_PROMPTS[style] || ''}. Vertical 9:16 composition, no text, no logos, no recognizable real people.`,
        size: '1024x1536',
        n: 1,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Bildmodell-Fehler ${res.status}: ${detail.slice(0, 200)}`);
    }
    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;
    return {
      imageUrl: b64 ? `data:image/jpeg;base64,${b64}` : data.data?.[0]?.url || null,
    };
  },
};
