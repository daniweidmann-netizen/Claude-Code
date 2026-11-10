// Kein Bildmodell verbunden → Browser rendert prozedurale Platzhalter-Grafiken.
export default { name: 'mock', async generate() { return { imageUrl: null }; } };
