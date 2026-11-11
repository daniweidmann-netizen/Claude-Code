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
};

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
