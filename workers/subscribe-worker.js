/**
 * BEZERU subscribe worker (Cloudflare Workers)
 *
 * Deploy:
 * 1) wrangler deploy workers/subscribe-worker.js --name bezeru-subscribe
 * 2) Set env vars:
 *    - SUBSTACK_SUBDOMAIN=bezeru
 *    - ALLOWED_ORIGINS=https://bezeru.com,https://www.bezeru.com
 *    - FALLBACK_ORIGIN=https://bezeru.com
 *    - USER_AGENT=Mozilla/5.0 (optional)
 * 3) Update WORKER_ENDPOINT in script.js to your deployed /subscribe URL.
 */

const ipWindowMs = 3000;
const recentIpHits = new Map();

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, cors);
    }

    if (!isAllowedOrigin(request, env)) {
      return json({ ok: false, error: "origin_not_allowed" }, 403, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400, cors);
    }

    const email = String(body.email || "").trim().toLowerCase();
    const hp = String(body.hp || "").trim();

    // Honeypot: pretend success for bots.
    if (hp) return json({ ok: true }, 200, cors);

    if (!isValidEmail(email)) {
      return json({ ok: false, error: "invalid_email" }, 400, cors);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "";
    if (ip && isRateLimited(ip)) {
      return json({ ok: false, error: "rate_limited" }, 429, cors);
    }

    if (!env.SUBSTACK_SUBDOMAIN) {
      return json({ ok: false, error: "server_misconfig" }, 500, cors);
    }

    const substackUrl = `https://${env.SUBSTACK_SUBDOMAIN}.substack.com/api/v1/free?nojs=true`;

    const form = new URLSearchParams();
    form.set("email", email);
    form.set("source", "bezeru_site");

    const origin = request.headers.get("Origin") || env.FALLBACK_ORIGIN || "";

    const resp = await fetch(substackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json,text/plain,*/*",
        "User-Agent": env.USER_AGENT || "Mozilla/5.0",
        "Origin": origin,
        "Referer": origin ? `${origin}/` : ""
      },
      body: form.toString()
    });

    const text = await resp.text();

    if (!resp.ok) {
      return json(
        { ok: false, error: `substack_${resp.status}`, detail: text.slice(0, 200) },
        502,
        cors
      );
    }

    return json({ ok: true }, 200, cors);
  }
};

function isAllowedOrigin(request, env) {
  const reqOrigin = request.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (!allowed.length) return true;
  return allowed.includes(reqOrigin);
}

function isRateLimited(ip) {
  const now = Date.now();
  const last = recentIpHits.get(ip) || 0;
  recentIpHits.set(ip, now);

  if (recentIpHits.size > 3000) {
    for (const [key, ts] of recentIpHits.entries()) {
      if (now - ts > ipWindowMs) recentIpHits.delete(key);
    }
  }

  return now - last < ipWindowMs;
}

function corsHeaders(request, env) {
  const reqOrigin = request.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const origin = allowed.length ? (allowed.includes(reqOrigin) ? reqOrigin : "") : reqOrigin || "*";

  return {
    "Access-Control-Allow-Origin": origin || "null",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json"
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
