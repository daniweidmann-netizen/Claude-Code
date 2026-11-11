// Vorbereitete Social-API-Module. OAuth-URLs und Token-Austausch sind umgesetzt,
// das eigentliche Hochladen ist als klar markierter Stub vorbereitet (App-Review nötig).
const env = (k) => (process.env[k] || '').trim(); // trim: eingefügte Werte enthalten oft Zeilenumbrüche

export const PLATFORMS = {
  tiktok: {
    label: 'TikTok',
    configured: () => !!(env('TIKTOK_CLIENT_KEY') && env('TIKTOK_CLIENT_SECRET')),
    authUrl: (state, redirectUri) => `https://www.tiktok.com/v2/auth/authorize/?${new URLSearchParams({
      client_key: env('TIKTOK_CLIENT_KEY'), response_type: 'code', scope: 'user.info.basic,video.upload,video.publish', redirect_uri: redirectUri, state,
    })}`,
    async exchangeCode(code, redirectUri) {
      const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_key: env('TIKTOK_CLIENT_KEY'), client_secret: env('TIKTOK_CLIENT_SECRET'), code, grant_type: 'authorization_code', redirect_uri: redirectUri }),
      });
      const d = await res.json();
      if (!d.access_token) throw new Error('TikTok-Token fehlgeschlagen');
      return { access_token: d.access_token, refresh_token: d.refresh_token, expires_in: d.expires_in, account_id: d.open_id };
    },
    // TODO: Content Posting API – POST /v2/post/publish/video/init/ (FILE_UPLOAD), dann Upload der MP4-Chunks.
    async publish() { throw new Error('TikTok-Upload noch nicht aktiviert (App-Review ausstehend).'); },
  },
  instagram: {
    label: 'Instagram',
    configured: () => !!(env('META_APP_ID') && env('META_APP_SECRET')),
    authUrl: (state, redirectUri) => `https://www.facebook.com/v21.0/dialog/oauth?${new URLSearchParams({
      client_id: env('META_APP_ID'), redirect_uri: redirectUri, state, response_type: 'code',
      scope: 'instagram_basic,instagram_content_publish,pages_show_list,business_management',
    })}`,
    async exchangeCode(code, redirectUri) {
      const res = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?${new URLSearchParams({
        client_id: env('META_APP_ID'), client_secret: env('META_APP_SECRET'), redirect_uri: redirectUri, code,
      })}`);
      const d = await res.json();
      if (!d.access_token) throw new Error('Meta-Token fehlgeschlagen');
      return { access_token: d.access_token, expires_in: d.expires_in };
    },
    // TODO: Graph API – POST /{ig-user-id}/media (media_type=REELS, video_url) → /{ig-user-id}/media_publish
    async publish() { throw new Error('Instagram-Upload noch nicht aktiviert (App-Review ausstehend).'); },
  },
  youtube: {
    label: 'YouTube',
    configured: () => !!(env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET')),
    authUrl: (state, redirectUri) => `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: env('GOOGLE_CLIENT_ID'), redirect_uri: redirectUri, response_type: 'code', access_type: 'offline', prompt: 'consent',
      scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly', state,
    })}`,
    async exchangeCode(code, redirectUri) {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: env('GOOGLE_CLIENT_ID'), client_secret: env('GOOGLE_CLIENT_SECRET'), code, grant_type: 'authorization_code', redirect_uri: redirectUri }),
      });
      const d = await res.json();
      if (!d.access_token) throw new Error(`Google-Token fehlgeschlagen: ${d.error_description || d.error || ''}`);
      // Kanalname für die Anzeige im Konto
      let account = null;
      try {
        const ch = await (await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', { headers: { Authorization: `Bearer ${d.access_token}` } })).json();
        account = ch.items?.[0]?.snippet?.title || null;
      } catch {}
      return { access_token: d.access_token, refresh_token: d.refresh_token, expires_in: d.expires_in, account_id: account };
    },
    // Access-Token erneuern (gültig ca. 1 h) – gibt aktualisierte Felder zurück
    async refresh(conn) {
      if (conn.expires_at && new Date(conn.expires_at) > new Date(Date.now() + 60_000)) return null;
      if (!conn.refresh_token) throw new Error('YouTube-Verbindung abgelaufen – bitte im Konto neu verbinden.');
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: env('GOOGLE_CLIENT_ID'), client_secret: env('GOOGLE_CLIENT_SECRET'), refresh_token: conn.refresh_token, grant_type: 'refresh_token' }),
      });
      const d = await res.json();
      if (!d.access_token) throw new Error('YouTube-Verbindung abgelaufen – bitte im Konto neu verbinden.');
      return { access_token: d.access_token, expires_at: new Date(Date.now() + (d.expires_in || 3600) * 1000).toISOString() };
    },
    // Resumable Upload (videos.insert). Nicht geprüfte Google-Apps dürfen nur "private" hochladen.
    async publish({ connection, file, title, description, tags = [], categoryId = '22' }) {
      const meta = (synthetic) => JSON.stringify({
        snippet: { title: title.slice(0, 95), description: description.slice(0, 4900), tags: tags.slice(0, 15), categoryId, defaultLanguage: undefined },
        status: { privacyStatus: env('YOUTUBE_PRIVACY') || 'private', selfDeclaredMadeForKids: false, ...(synthetic ? { containsSyntheticMedia: true } : {}) },
      });
      let init;
      for (const synthetic of [true, false]) { // Feld für KI-Kennzeichnung; falls die API es ablehnt, ohne
        init = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${connection.access_token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Upload-Content-Type': 'video/mp4',
            'X-Upload-Content-Length': String(file.length),
          },
          body: meta(synthetic),
        });
        if (init.ok || init.status !== 400) break;
      }
      if (!init.ok) throw new Error(`YouTube lehnt den Upload ab (${init.status}): ${(await init.text()).slice(0, 200)}`);
      const upload = await fetch(init.headers.get('location'), { method: 'PUT', headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(file.length) }, body: file });
      const d = await upload.json().catch(() => ({}));
      if (!upload.ok || !d.id) throw new Error(`YouTube-Upload fehlgeschlagen (${upload.status}): ${JSON.stringify(d.error?.message || d).slice(0, 200)}`);
      return { id: d.id, url: `https://youtube.com/shorts/${d.id}`, privacy: d.status?.privacyStatus };
    },
  },

};
