// Social-API-Module: OAuth, Token-Erneuerung und Upload für TikTok, Instagram und YouTube.
// TikTok/Instagram sind aktiv, sobald ihre App-Schlüssel gesetzt sind (TIKTOK_CLIENT_KEY/SECRET, INSTAGRAM_APP_ID/SECRET).
const env = (k) => (process.env[k] || '').trim(); // trim: eingefügte Werte enthalten oft Zeilenumbrüche
// TikTok: Direct Post (direkt veröffentlichen, braucht Scope video.publish) nur mit TIKTOK_DIRECT_POST=true.
// Standard: Upload als Entwurf in die TikTok-App (Scope video.upload) – der Nutzer veröffentlicht dort selbst.
const tiktokDirect = () => env('TIKTOK_DIRECT_POST') === 'true';

export const PLATFORMS = {
  tiktok: {
    label: 'TikTok',
    configured: () => !!(env('TIKTOK_CLIENT_KEY') && env('TIKTOK_CLIENT_SECRET')),
    get available() { return this.configured(); },
    authUrl: (state, redirectUri) => `https://www.tiktok.com/v2/auth/authorize/?${new URLSearchParams({
      client_key: env('TIKTOK_CLIENT_KEY'), response_type: 'code', scope: tiktokDirect() ? 'user.info.basic,video.upload,video.publish' : 'user.info.basic,video.upload', redirect_uri: redirectUri, state,
    })}`,
    async exchangeCode(code, redirectUri) {
      const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_key: env('TIKTOK_CLIENT_KEY'), client_secret: env('TIKTOK_CLIENT_SECRET'), code, grant_type: 'authorization_code', redirect_uri: redirectUri }),
      });
      const d = await res.json();
      if (!d.access_token) throw new Error(`TikTok-Token fehlgeschlagen: ${d.error_description || d.error || ''}`);
      let account = null;
      try {
        const u = await (await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name', { headers: { Authorization: `Bearer ${d.access_token}` } })).json();
        account = u.data?.user?.display_name || null;
      } catch {}
      return { access_token: d.access_token, refresh_token: d.refresh_token, expires_in: d.expires_in, account_id: account };
    },
    // Access-Token gilt 24 h, Refresh-Token 365 Tage
    async refresh(conn) {
      if (conn.expires_at && new Date(conn.expires_at) > new Date(Date.now() + 120_000)) return null;
      if (!conn.refresh_token) throw new Error('TikTok-Verbindung abgelaufen – bitte im Konto neu verbinden.');
      const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_key: env('TIKTOK_CLIENT_KEY'), client_secret: env('TIKTOK_CLIENT_SECRET'), grant_type: 'refresh_token', refresh_token: conn.refresh_token }),
      });
      const d = await res.json();
      if (!d.access_token) throw new Error('TikTok-Verbindung abgelaufen – bitte im Konto neu verbinden.');
      return { access_token: d.access_token, refresh_token: d.refresh_token || conn.refresh_token, expires_at: new Date(Date.now() + (d.expires_in || 86400) * 1000).toISOString() };
    },
    // Content Posting API (Direct Post). Nicht geprüfte TikTok-Apps dürfen nur privat posten (SELF_ONLY).
    async publish({ connection, file, caption }) {
      const auth = { Authorization: `Bearer ${connection.access_token}`, 'Content-Type': 'application/json; charset=UTF-8' };
      if (!tiktokDirect()) {
        // Entwurf in die TikTok-Inbox: der Nutzer bekommt eine Benachrichtigung in der App, ergänzt Text/Sound und postet selbst
        const init = await (await fetch('https://open.tiktokapis.com/v2/post/publish/inbox/video/init/', {
          method: 'POST', headers: auth,
          body: JSON.stringify({ source_info: { source: 'FILE_UPLOAD', video_size: file.length, chunk_size: file.length, total_chunk_count: 1 } }),
        })).json();
        if (init.error?.code && init.error.code !== 'ok') throw new Error(`TikTok lehnt den Upload ab: ${init.error.message || init.error.code}`);
        const { publish_id: publishId, upload_url: uploadUrl } = init.data || {};
        const up = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(file.length), 'Content-Range': `bytes 0-${file.length - 1}/${file.length}` }, body: file });
        if (!up.ok) throw new Error(`TikTok-Upload fehlgeschlagen (${up.status})`);
        return { id: String(publishId), url: null, draft: true, note: 'Als Entwurf in deiner TikTok-App – dort öffnen und veröffentlichen (KI-Label einschalten).' };
      }
      const info = await (await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', { method: 'POST', headers: auth })).json();
      const options = info.data?.privacy_level_options || [];
      const wanted = env('TIKTOK_PRIVACY') || 'PUBLIC_TO_EVERYONE';
      const privacy = options.includes(wanted) ? wanted : options.includes('SELF_ONLY') ? 'SELF_ONLY' : options[0] || 'SELF_ONLY';
      const init = await (await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
        method: 'POST', headers: auth,
        body: JSON.stringify({
          post_info: { title: String(caption || '').slice(0, 2200), privacy_level: privacy, disable_comment: false, disable_duet: false, disable_stitch: false, is_aigc: true },
          source_info: { source: 'FILE_UPLOAD', video_size: file.length, chunk_size: file.length, total_chunk_count: 1 },
        }),
      })).json();
      if (init.error?.code && init.error.code !== 'ok') throw new Error(`TikTok lehnt den Upload ab: ${init.error.message || init.error.code}`);
      const { publish_id: publishId, upload_url: uploadUrl } = init.data || {};
      const up = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(file.length), 'Content-Range': `bytes 0-${file.length - 1}/${file.length}` }, body: file });
      if (!up.ok) throw new Error(`TikTok-Upload fehlgeschlagen (${up.status})`);
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const st = await (await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', { method: 'POST', headers: auth, body: JSON.stringify({ publish_id: publishId }) })).json();
        const status = st.data?.status;
        if (status === 'PUBLISH_COMPLETE') {
          const id = st.data?.publicaly_available_post_id?.[0] || st.data?.publicly_available_post_id?.[0] || publishId;
          return { id: String(id), url: privacy === 'SELF_ONLY' ? null : `https://www.tiktok.com/video/${id}`, privacy };
        }
        if (status === 'FAILED') throw new Error(`TikTok-Upload fehlgeschlagen: ${st.data?.fail_reason || 'unbekannt'}`);
      }
      return { id: publishId, url: null, privacy, pending: true };
    },
  },
  instagram: {
    // Instagram API mit Instagram-Login (kein Facebook-Konto/-Seite nötig; Instagram-Profi-Konto erforderlich)
    label: 'Instagram',
    configured: () => !!(env('INSTAGRAM_APP_ID') && env('INSTAGRAM_APP_SECRET')),
    get available() { return this.configured(); },
    authUrl: (state, redirectUri) => `https://www.instagram.com/oauth/authorize?${new URLSearchParams({
      client_id: env('INSTAGRAM_APP_ID'), redirect_uri: redirectUri, response_type: 'code', state,
      scope: 'instagram_business_basic,instagram_business_content_publish',
    })}`,
    async exchangeCode(code, redirectUri) {
      const res = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: env('INSTAGRAM_APP_ID'), client_secret: env('INSTAGRAM_APP_SECRET'), grant_type: 'authorization_code', redirect_uri: redirectUri, code }),
      });
      const d = await res.json();
      if (!d.access_token) throw new Error(`Instagram-Token fehlgeschlagen: ${d.error_message || d.error?.message || ''}`);
      // Kurzlebiges Token (1 h) → langlebiges Token (60 Tage)
      const long = await (await fetch(`https://graph.instagram.com/access_token?${new URLSearchParams({ grant_type: 'ig_exchange_token', client_secret: env('INSTAGRAM_APP_SECRET'), access_token: d.access_token })}`)).json();
      const token = long.access_token || d.access_token;
      let account = null;
      try { account = (await (await fetch(`https://graph.instagram.com/me?fields=username&access_token=${encodeURIComponent(token)}`)).json()).username || null; } catch {}
      return { access_token: token, expires_in: long.expires_in || 3600, account_id: account ? `@${account}` : null };
    },
    // Langlebiges Token vor Ablauf verlängern (gültig 60 Tage, verlängerbar ab 24 h Alter)
    async refresh(conn) {
      if (conn.expires_at && new Date(conn.expires_at) > new Date(Date.now() + 7 * 864e5)) return null;
      const d = await (await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(conn.access_token)}`)).json();
      if (!d.access_token) throw new Error('Instagram-Verbindung abgelaufen – bitte im Konto neu verbinden.');
      return { access_token: d.access_token, expires_at: new Date(Date.now() + (d.expires_in || 5184000) * 1000).toISOString() };
    },
    // Reel veröffentlichen: Container mit öffentlicher Video-URL anlegen → verarbeiten lassen → veröffentlichen
    async publish({ connection, videoUrl, caption }) {
      const tok = encodeURIComponent(connection.access_token);
      const g = 'https://graph.instagram.com/v21.0';
      const me = await (await fetch(`${g}/me?fields=user_id&access_token=${tok}`)).json();
      const uid = me.user_id || me.id;
      if (!uid) throw new Error('Instagram-Konto nicht gefunden – bitte neu verbinden.');
      const c = await (await fetch(`${g}/${uid}/media`, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ media_type: 'REELS', video_url: videoUrl, caption: String(caption || '').slice(0, 2200), share_to_feed: 'true', access_token: connection.access_token }),
      })).json();
      if (!c.id) throw new Error(`Instagram lehnt den Upload ab: ${c.error?.message || 'unbekannt'}`);
      for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 5000));
        const st = await (await fetch(`${g}/${c.id}?fields=status_code,status&access_token=${tok}`)).json();
        if (st.status_code === 'FINISHED') break;
        if (st.status_code === 'ERROR' || st.status_code === 'EXPIRED') throw new Error(`Instagram konnte das Video nicht verarbeiten: ${st.status || st.status_code}`);
        if (i === 39) throw new Error('Instagram-Verarbeitung dauert zu lange – bitte später erneut posten.');
      }
      const pub = await (await fetch(`${g}/${uid}/media_publish`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ creation_id: c.id, access_token: connection.access_token }) })).json();
      if (!pub.id) throw new Error(`Instagram-Veröffentlichung fehlgeschlagen: ${pub.error?.message || 'unbekannt'}`);
      let url = null;
      try { url = (await (await fetch(`${g}/${pub.id}?fields=permalink&access_token=${tok}`)).json()).permalink || null; } catch {}
      return { id: pub.id, url };
    },
  },
  youtube: {
    label: 'YouTube',
    available: true,
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
        status: { privacyStatus: env('YOUTUBE_PRIVACY') || 'public', selfDeclaredMadeForKids: false, ...(synthetic ? { containsSyntheticMedia: true } : {}) },
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
