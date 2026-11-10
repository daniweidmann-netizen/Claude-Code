// Kein TTS verbunden → Vorschau nutzt die Browser-Stimme, Export ohne Voiceover.
export default { name: 'mock', async synthesize() { return { audioUrl: null }; } };
