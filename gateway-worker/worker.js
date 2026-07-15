// Store 8181 Hub — Cloudflare Worker Gateway
// Replaces GAS gateway. No OAuth tokens. No expiry. Ever.
// Secrets required (set in CF dashboard):
//   SECRET_KEY     = Store8181Prit2026
//   GOOGLE_SA_JSON = full contents of service account JSON key file

export default {
  async fetch(request, env) {
    const cors = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405, cors);
    }

    let body;
    try {
      body = JSON.parse(await request.text());
    } catch {
      return json({ error: 'invalid JSON' }, 400, cors);
    }

    if (body.key !== env.SECRET_KEY) {
      return json({ error: 'unauthorized' }, 401, cors);
    }

    if (body.action === 'ping') {
      return json({ pong: true, ts: new Date().toISOString() }, 200, cors);
    }

    let token;
    try {
      token = await getAccessToken(env.GOOGLE_SA_JSON);
    } catch (e) {
      return json({ error: 'SA auth failed: ' + e.message }, 500, cors);
    }

    try {
      const result = await handleAction(body, token);
      return json(result, 200, cors);
    } catch (e) {
      return json({ error: e.message }, 500, cors);
    }
  }
};

// ── Sheets actions ────────────────────────────────────────────────────────────

const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets';

async function handleAction(body, token) {
  const { action, sid, range, values, tabName } = body;
  const auth = { Authorization: 'Bearer ' + token };

  if (action === 'sheets.read') {
    if (!sid || !range) throw new Error('sid and range required');
    const r = await fetch(`${SHEETS}/${sid}/values/${enc(range)}`, { headers: auth });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || 'read failed');
    return { values: d.values || [] };
  }

  if (action === 'sheets.append') {
    if (!sid || !range || !values) throw new Error('sid, range, and values required');
    const url = `${SHEETS}/${sid}/values/${enc(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || 'append failed');
    return { ok: true };
  }

  if (action === 'sheets.update') {
    if (!sid || !range || !values) throw new Error('sid, range, and values required');
    const url = `${SHEETS}/${sid}/values/${enc(range)}?valueInputOption=USER_ENTERED`;
    const r = await fetch(url, {
      method: 'PUT',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || 'update failed');
    return { ok: true };
  }

  if (action === 'sheets.addTab') {
    if (!sid || !tabName) throw new Error('sid and tabName required');
    const url = `${SHEETS}/${sid}:batchUpdate`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tabName } } }] }),
    });
    const d = await r.json();
    if (!r.ok) {
      const msg = d.error?.message || '';
      if (msg.toLowerCase().includes('already exists')) return { ok: true, existed: true };
      throw new Error(msg || 'addTab failed');
    }
    return { ok: true, title: d.replies?.[0]?.addSheet?.properties?.title || tabName };
  }

  throw new Error('unsupported action: ' + action);
}

// ── Service account JWT auth ──────────────────────────────────────────────────

async function getAccessToken(saJson) {
  const sa = JSON.parse(saJson);
  const now = Math.floor(Date.now() / 1000);

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim  = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));

  const input = `${header}.${claim}`;
  const key = await importPrivateKey(sa.private_key);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc2buf(input));
  const jwt = `${input}.${bufB64url(sig)}`;

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt,
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error(data.error_description || JSON.stringify(data));
  return data.access_token;
}

async function importPrivateKey(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const buf = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
  return crypto.subtle.importKey('pkcs8', buf, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function b64url(str) {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function bufB64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}
function enc2buf(str) {
  return new TextEncoder().encode(str);
}
function enc(range) {
  return encodeURIComponent(range);
}
function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers });
}
