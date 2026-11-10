// Vorbereitete Social-API-Module. OAuth-URLs und Token-Austausch sind umgesetzt,
// das eigentliche Hochladen ist als klar markierter Stub vorbereitet (App-Review nötig).
const env = (k) => process.env[k] || '';

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
      if (!d.access_token) throw new Error('Google-Token fehlgeschlagen');
      return { access_token: d.access_token, refresh_token: d.refresh_token, expires_in: d.expires_in };
    },
    // TODO: YouTube Data API – resumable upload (videos.insert, part=snippet,status), #Shorts im Titel/Beschreibung.
    async publish() { throw new Error('YouTube-Upload noch nicht aktiviert (Verifizierung ausstehend).'); },
  },
};
