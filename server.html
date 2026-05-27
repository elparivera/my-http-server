#!/usr/bin/env node
// ┌─────────────────────────────────────────────────────────────────────────┐
// │                                                                         │
// │   ██╗    ██╗██╗██╗      ██████╗ ██╗██╗   ██╗███████╗██████╗           │
// │   ██║    ██║██║██║      ██╔══██╗██║██║   ██║██╔════╝██╔══██╗          │
// │   ██║ █╗ ██║██║██║      ██████╔╝██║██║   ██║█████╗  ██████╔╝          │
// │   ██║███╗██║██║██║      ██╔══██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗          │
// │   ╚███╔███╔╝██║███████╗ ██║  ██║██║ ╚████╔╝ ███████╗██║  ██║          │
// │    ╚══╝╚══╝ ╚═╝╚══════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝          │
// │                                                                         │
// │   Personal HTTP Server — Professional Edition v3.0                     │
// │                                                                         │
// │   Copyright © 2025 Wil Rivera. Todos los derechos reservados.          │
// │   Propiedad intelectual exclusiva de Wil Rivera.                       │
// │   Prohibida su reproducción o distribución sin autorización.           │
// │                                                                         │
// │   Author   : Wil Rivera                                                │
// │   Version  : 3.0.0                                                     │
// │   License  : Proprietary — All Rights Reserved                         │
// │                                                                         │
// └─────────────────────────────────────────────────────────────────────────┘
"use strict";
// ╔══════════════════════════════════════════════════════════════════╗
// ║           MY PERSONAL HTTP SERVER — Professional Edition         ║
// ║                                                                  ║
// ║   Copyright © 2025 Wil Rivera. Todos los derechos reservados.   ║
// ║   Este software es propiedad exclusiva de Wil Rivera.           ║
// ║   Queda prohibida su reproducción, distribución o modificación  ║
// ║   sin autorización expresa y por escrito del autor.             ║
// ║                                                                  ║
// ║   Author  : Wil Rivera                                          ║
// ║   Version : 2.0.0                                               ║
// ║   License : Proprietary — All Rights Reserved                   ║
// ╚══════════════════════════════════════════════════════════════════╝
"use strict";

const http   = require("http");
const fs     = require("fs");
const fsp    = fs.promises;
const path   = require("path");
const os     = require("os");
const crypto = require("crypto");
const url    = require("url");

// ── config ────────────────────────────────────────────────────────────────────
const PORT      = parseInt(process.env.PORT || "3000", 10);
const DATA_DIR  = process.env.DATA_DIR || __dirname;
const SITES_DIR = path.join(DATA_DIR, "sites");
const CFG_FILE  = path.join(DATA_DIR, "config.json");
const SECRET    = process.env.SECRET_KEY || loadOrCreateSecret();

function loadOrCreateSecret() {
  const f = path.join(DATA_DIR, ".secret");
  try { return fs.readFileSync(f, "utf8").trim(); } catch {}
  const s = crypto.randomBytes(32).toString("hex");
  try { fs.writeFileSync(f, s); } catch {}
  return s;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function getMime(ext) {
  const t = {
    ".html":"text/html; charset=utf-8",".htm":"text/html; charset=utf-8",
    ".css":"text/css",".js":"application/javascript",".mjs":"application/javascript",
    ".json":"application/json",".png":"image/png",".jpg":"image/jpeg",
    ".jpeg":"image/jpeg",".gif":"image/gif",".svg":"image/svg+xml",
    ".webp":"image/webp",".ico":"image/x-icon",".woff":"font/woff",
    ".woff2":"font/woff2",".ttf":"font/ttf",".mp4":"video/mp4",
    ".webm":"video/webm",".mp3":"audio/mpeg",".pdf":"application/pdf",
    ".txt":"text/plain",".xml":"application/xml",".zip":"application/zip",
    ".wav":"audio/wav",".ogg":"audio/ogg",".webmanifest":"application/manifest+json",
  };
  return t[ext.toLowerCase()] || "application/octet-stream";
}

function sign(d)    { return crypto.createHmac("sha256", SECRET).update(d).digest("hex"); }
function hashPwd(p) { return crypto.createHash("sha256").update(p + SECRET).digest("hex"); }
function uid()      { return crypto.randomBytes(6).toString("hex"); }

function makeToken()      { const t = Date.now().toString(); return `${t}.${sign(t)}`; }
function verifyToken(tok) {
  if (!tok) return false;
  const [ts, sig] = tok.split(".");
  if (!ts || !sig || Date.now() - parseInt(ts) > 86400000) return false;
  return sign(ts) === sig;
}
function getCookie(req, name) {
  for (const part of (req.headers.cookie || "").split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v || "");
  }
  return null;
}
function parseBody(req) {
  return new Promise((res, rej) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => res(Buffer.concat(chunks)));
    req.on("error", rej);
  });
}
function parseMultipart(buf, boundary) {
  const files = [], fields = {};
  const sep = Buffer.from("--" + boundary);
  const parts = [];
  let start = 0;
  for (let i = 0; i <= buf.length - sep.length; i++) {
    if (buf.slice(i, i + sep.length).equals(sep)) {
      if (start > 0) parts.push(buf.slice(start, i - 2));
      start = i + sep.length + 2;
    }
  }
  for (const part of parts) {
    const he = part.indexOf("\r\n\r\n");
    if (he === -1) continue;
    const hdr = part.slice(0, he).toString();
    const raw = part.slice(he + 4);
    const data = raw.slice(-2).equals(Buffer.from("\r\n")) ? raw.slice(0, -2) : raw;
    const cd   = hdr.match(/Content-Disposition:[^\r\n]*/i)?.[0] || "";
    const name = cd.match(/name="([^"]+)"/)?.[1];
    const fn   = cd.match(/filename="([^"]+)"/)?.[1];
    if (fn) files.push({ fieldname: name, filename: fn, data });
    else if (name) fields[name] = data.toString();
  }
  return { files, fields };
}
function sendJSON(res, data, status = 200) {
  const body = JSON.stringify(data);
  res.writeHead(status, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}
function sendHTML(res, html, status = 200) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

// ── config persistence ────────────────────────────────────────────────────────
function loadCfg() {
  try { return JSON.parse(fs.readFileSync(CFG_FILE, "utf8")); }
  catch { return { password: hashPwd(process.env.ADMIN_PASSWORD || "admin1234"), sites: [] }; }
}
function saveCfg(cfg) {
  try { fs.writeFileSync(CFG_FILE, JSON.stringify(cfg, null, 2)); }
  catch (e) { console.error("saveCfg:", e.message); }
}
function listFiles(siteId) {
  const dir = path.join(SITES_DIR, siteId);
  if (!fs.existsSync(dir)) return [];
  const results = [];
  function walk(d, rel) {
    for (const f of fs.readdirSync(d)) {
      const full = path.join(d, f), relP = rel ? rel + "/" + f : f;
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full, relP);
      else results.push({ name: relP, size: st.size });
    }
  }
  walk(dir, "");
  return results;
}

// ── access log & stats ────────────────────────────────────────────────────────
const accessLogs = [];
let totalReqs = 0;
const siteStats = {}; // { siteId: { hits: [], totalBytes: 0 } }

function addLog(entry) {
  totalReqs++;
  const log = { ...entry, ts: new Date().toISOString() };
  accessLogs.unshift(log);
  if (accessLogs.length > 1000) accessLogs.pop();
  // per-site stats
  if (entry.siteId) {
    if (!siteStats[entry.siteId]) siteStats[entry.siteId] = { hits: [], totalBytes: 0 };
    siteStats[entry.siteId].hits.unshift({ ts: log.ts, bytes: entry.bytes || 0, status: entry.status });
    if (siteStats[entry.siteId].hits.length > 500) siteStats[entry.siteId].hits.pop();
    siteStats[entry.siteId].totalBytes += (entry.bytes || 0);
  }
}

function getHourlyStats(siteId) {
  const hits = (siteStats[siteId]?.hits || []);
  const now = Date.now();
  const hours = {};
  for (let i = 23; i >= 0; i--) {
    const h = new Date(now - i * 3600000);
    const key = `${h.getHours().toString().padStart(2,'0')}:00`;
    hours[key] = 0;
  }
  for (const h of hits) {
    const d = new Date(h.ts);
    if (now - d.getTime() < 86400000) {
      const key = `${d.getHours().toString().padStart(2,'0')}:00`;
      if (key in hours) hours[key]++;
    }
  }
  return hours;
}

// ── HTML pages ────────────────────────────────────────────────────────────────
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>`;

const BASE_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0c0c10;--bg1:#111118;--bg2:#16161f;--bg3:#1c1c28;
  --bd:#ffffff0d;--bd2:#ffffff18;--bd3:#ffffff28;
  --t0:#e8e8f0;--t1:#9898b0;--t2:#55556a;--t3:#33333f;
  --p:#7c6aff;--p2:#9d8fff;--p3:#c4baff;
  --teal:#2dd4bf;--rose:#f43f5e;--amber:#f59e0b;--sky:#38bdf8;
  --glow:0 0 20px #7c6aff44,0 0 40px #7c6aff22;
  --card-glow:0 4px 32px #00000044;
}
html,body{min-height:100%;background:var(--bg);color:var(--t0);font-family:'DM Mono',monospace;font-size:13px;line-height:1.6;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--bd3);border-radius:4px;}
::selection{background:#7c6aff33;color:var(--p3);}

/* Layout */
.shell{display:flex;min-height:100vh;}
.sidebar{width:220px;min-height:100vh;background:var(--bg1);border-right:1px solid var(--bd);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;}
.main-content{margin-left:220px;flex:1;min-height:100vh;display:flex;flex-direction:column;}
.topbar{height:56px;background:var(--bg1);border-bottom:1px solid var(--bd);display:flex;align-items:center;padding:0 24px;gap:16px;position:sticky;top:0;z-index:40;}
.page{padding:28px 28px;flex:1;}

/* Sidebar */
.sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid var(--bd);}
.logo-mark{font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:var(--t0);letter-spacing:.5px;display:flex;align-items:center;gap:10px;}
.logo-icon{width:28px;height:28px;background:linear-gradient(135deg,var(--p),#4f3dcc);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:var(--glow);}
.logo-sub{font-size:9px;color:var(--t2);letter-spacing:2px;margin-top:2px;font-family:'DM Mono',monospace;}
.sidebar-nav{padding:12px 10px;flex:1;}
.nav-section{font-size:9px;color:var(--t3);letter-spacing:2px;padding:8px 10px 4px;font-family:'DM Mono',monospace;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;cursor:pointer;color:var(--t1);font-size:12px;transition:all .15s;border:1px solid transparent;margin-bottom:2px;text-decoration:none;}
.nav-item:hover{background:var(--bg2);color:var(--t0);}
.nav-item.active{background:#7c6aff18;color:var(--p3);border-color:#7c6aff28;}
.nav-item .icon{width:16px;text-align:center;opacity:.7;}
.nav-item.active .icon{opacity:1;}
.sidebar-footer{padding:12px 10px;border-top:1px solid var(--bd);}

/* Status dot */
.status-dot{width:7px;height:7px;border-radius:50%;background:var(--teal);box-shadow:0 0 8px var(--teal);animation:blink 3s ease infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.4;}}

/* Cards */
.card{background:var(--bg1);border:1px solid var(--bd);border-radius:12px;padding:20px;position:relative;overflow:hidden;}
.card-sm{padding:14px 16px;}
.card-title{font-family:'Syne',sans-serif;font-size:11px;font-weight:600;color:var(--t2);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;}
.stat-card{background:var(--bg1);border:1px solid var(--bd);border-radius:12px;padding:20px 22px;}
.stat-val{font-family:'Syne',sans-serif;font-size:28px;font-weight:700;color:var(--t0);line-height:1;}
.stat-label{font-size:10px;color:var(--t2);letter-spacing:1px;margin-top:6px;text-transform:uppercase;}
.stat-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:2px 8px;border-radius:20px;margin-top:8px;}
.stat-badge.up{background:#2dd4bf18;color:var(--teal);border:1px solid #2dd4bf28;}
.stat-badge.purple{background:#7c6aff18;color:var(--p3);border:1px solid #7c6aff28;}

/* Buttons */
.btn{font-family:'DM Mono',monospace;cursor:pointer;border:none;transition:all .15s;padding:8px 18px;border-radius:8px;font-size:12px;letter-spacing:.5px;display:inline-flex;align-items:center;gap:6px;}
.btn:hover{filter:brightness(1.1);}
.btn:active{transform:scale(.98);}
.btn-primary{background:var(--p);color:#fff;box-shadow:0 0 16px #7c6aff44;}
.btn-primary:hover{background:var(--p2);box-shadow:0 0 24px #7c6aff66;}
.btn-ghost{background:var(--bg2);color:var(--t1);border:1px solid var(--bd2);}
.btn-ghost:hover{color:var(--t0);border-color:var(--bd3);}
.btn-danger{background:#f43f5e18;color:var(--rose);border:1px solid #f43f5e28;}
.btn-danger:hover{background:#f43f5e28;}
.btn-sm{padding:5px 12px;font-size:11px;border-radius:6px;}
.btn-xs{padding:3px 8px;font-size:10px;border-radius:5px;}
.btn-teal{background:#2dd4bf18;color:var(--teal);border:1px solid #2dd4bf28;}
.btn-teal:hover{background:#2dd4bf28;}

/* Inputs */
input,select,textarea{font-family:'DM Mono',monospace;background:var(--bg2);border:1px solid var(--bd2);color:var(--t0);font-size:12px;padding:9px 12px;border-radius:8px;outline:none;width:100%;transition:all .15s;}
input:focus,select:focus,textarea:focus{border-color:var(--p);box-shadow:0 0 0 3px #7c6aff18;}
textarea{resize:vertical;min-height:140px;}
label{font-size:10px;color:var(--t2);letter-spacing:1px;display:block;margin-bottom:6px;text-transform:uppercase;}
.form-group{margin-bottom:16px;}
.input-hint{font-size:10px;color:var(--t2);margin-top:4px;}

/* Table */
.data-table{width:100%;border-collapse:collapse;}
.data-table th{font-size:9px;color:var(--t2);letter-spacing:1.5px;padding:8px 14px;text-align:left;border-bottom:1px solid var(--bd);text-transform:uppercase;font-family:'DM Mono',monospace;}
.data-table td{padding:12px 14px;border-bottom:1px solid var(--bd);font-size:12px;vertical-align:middle;}
.data-table tr:last-child td{border-bottom:none;}
.data-table tbody tr:hover td{background:#ffffff04;}

/* Badges */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:500;}
.badge-live{background:#2dd4bf15;color:var(--teal);border:1px solid #2dd4bf25;}
.badge-purple{background:#7c6aff15;color:var(--p3);border:1px solid #7c6aff25;}
.badge-amber{background:#f59e0b15;color:var(--amber);border:1px solid #f59e0b25;}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn .15s ease;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.modal{background:var(--bg1);border:1px solid var(--bd2);border-radius:16px;padding:28px;width:540px;max-width:95vw;max-height:90vh;overflow-y:auto;animation:slideUp .2s ease;}
@keyframes slideUp{from{transform:translateY(16px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.modal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
.modal-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--t0);}
.modal-close{background:none;border:none;color:var(--t2);cursor:pointer;font-size:18px;padding:4px;border-radius:6px;transition:all .15s;line-height:1;}
.modal-close:hover{background:var(--bg3);color:var(--t0);}

/* Drop zone */
.drop-zone{border:2px dashed var(--bd2);border-radius:10px;padding:32px;text-align:center;color:var(--t2);transition:all .2s;cursor:pointer;}
.drop-zone:hover,.drop-zone.drag-over{border-color:var(--p);background:#7c6aff08;color:var(--p3);}
.drop-icon{font-size:28px;margin-bottom:10px;opacity:.5;}
.drop-zone.drag-over .drop-icon{opacity:1;}

/* Progress */
.progress-bar{height:3px;background:var(--bg3);border-radius:3px;overflow:hidden;margin-top:10px;}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--p),var(--teal));box-shadow:0 0 8px var(--p);transition:width .3s ease;width:0%;}

/* Alerts */
.alert{padding:10px 14px;border-radius:8px;font-size:12px;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.alert-err{background:#f43f5e15;border:1px solid #f43f5e25;color:#fca5b4;}
.alert-ok{background:#2dd4bf15;border:1px solid #2dd4bf25;color:var(--teal);}

/* Links */
a.link{color:var(--sky);text-decoration:none;font-size:11px;transition:all .15s;}
a.link:hover{color:#7dd3fc;text-decoration:underline;}

/* URL chip */
.url-chip{display:inline-flex;align-items:center;gap:6px;background:var(--bg2);border:1px solid var(--bd2);border-radius:6px;padding:4px 10px;font-size:11px;color:var(--sky);max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Copy btn */
.copy-btn{background:none;border:1px solid var(--bd2);color:var(--t2);font-family:'DM Mono',monospace;font-size:10px;padding:3px 8px;cursor:pointer;border-radius:5px;transition:all .15s;flex-shrink:0;}
.copy-btn:hover{border-color:var(--p);color:var(--p3);}

/* Chart */
.chart-wrap{height:80px;display:flex;align-items:flex-end;gap:3px;padding-top:8px;}
.chart-bar{flex:1;border-radius:3px 3px 0 0;transition:height .4s ease,background .15s;min-height:2px;cursor:default;}
.chart-bar:hover{filter:brightness(1.4);}
.chart-labels{display:flex;gap:3px;margin-top:4px;}
.chart-label{flex:1;text-align:center;font-size:8px;color:var(--t3);overflow:hidden;}

/* Editor */
.file-editor{background:var(--bg);border:1px solid var(--bd2);border-radius:8px;overflow:hidden;}
.editor-toolbar{background:var(--bg2);border-bottom:1px solid var(--bd);padding:8px 12px;display:flex;align-items:center;gap:8px;}
.editor-filename{font-size:12px;color:var(--t1);flex:1;}
.editor-textarea{font-family:'DM Mono',monospace;font-size:12px;line-height:1.7;color:#e2e8f0;background:var(--bg);border:none;width:100%;padding:16px;min-height:360px;resize:vertical;outline:none;tab-size:2;}

/* Domain chip */
.domain-chip{display:inline-flex;align-items:center;gap:6px;background:#7c6aff15;border:1px solid #7c6aff30;border-radius:6px;padding:3px 10px;font-size:11px;color:var(--p3);}

/* Grid */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}

/* Misc */
.hidden{display:none!important;}
.divider{height:1px;background:var(--bd);margin:20px 0;}
.text-muted{color:var(--t2);}
.text-sm{font-size:11px;}
.text-xs{font-size:10px;}
.empty-state{text-align:center;padding:48px 24px;color:var(--t2);}
.empty-icon{font-size:36px;margin-bottom:12px;opacity:.3;}
.empty-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:var(--t1);margin-bottom:6px;}
.tag{display:inline-block;background:var(--bg3);color:var(--t1);border:1px solid var(--bd2);border-radius:4px;padding:1px 6px;font-size:10px;}
.flex{display:flex;} .items-center{align-items:center;} .justify-between{justify-content:space-between;} .gap-2{gap:8px;} .gap-3{gap:12px;} .flex-1{flex:1;}
.mt-1{margin-top:4px;} .mt-2{margin-top:8px;} .mt-3{margin-top:12px;} .mt-4{margin-top:16px;}
.mb-2{margin-bottom:8px;} .mb-3{margin-bottom:12px;} .mb-4{margin-bottom:16px;}

/* Responsive */
@media(max-width:768px){
  .sidebar{width:100%;min-height:auto;position:relative;flex-direction:row;flex-wrap:wrap;}
  .main-content{margin-left:0;}
  .grid2,.grid3,.grid4{grid-template-columns:1fr;}
}
`;

function loginPage(err = "") {
  return `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Acceso — HTTP Server</title>${FONTS}
<style>
${BASE_CSS}
html,body{display:flex;align-items:center;justify-content:center;min-height:100vh;}
.bg-glow{position:fixed;inset:0;pointer-events:none;overflow:hidden;}
.bg-glow::before{content:'';position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:600px;height:600px;background:radial-gradient(ellipse,#7c6aff12 0%,transparent 70%);border-radius:50%;}
.login-wrap{position:relative;z-index:10;width:380px;}
.login-box{background:var(--bg1);border:1px solid var(--bd2);border-radius:16px;padding:40px;}
.login-logo{text-align:center;margin-bottom:32px;}
.login-logo-icon{width:52px;height:52px;background:linear-gradient(135deg,var(--p),#4f3dcc);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 auto 14px;box-shadow:var(--glow);}
.login-title{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;color:var(--t0);}
.login-sub{font-size:11px;color:var(--t2);margin-top:4px;letter-spacing:.5px;}
.login-btn{width:100%;padding:11px;font-size:13px;border-radius:9px;letter-spacing:.5px;justify-content:center;}
.hint{font-size:10px;color:var(--t2);text-align:center;margin-top:14px;}
.hint strong{color:var(--p3);}
</style></head><body>
<div class="bg-glow"></div>
<div class="login-wrap">
  <div class="login-box">
    <div class="login-logo">
      <div class="login-logo-icon">⬡</div>
      <div class="login-title">HTTP Server</div>
      <div class="login-sub">Panel de control</div>
    </div>
    ${err ? `<div class="alert alert-err">⚠ ${err}</div>` : ""}
    <form method="POST" action="/login">
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" placeholder="••••••••" autofocus autocomplete="current-password"/>
      </div>
      <button type="submit" class="btn btn-primary login-btn">Entrar →</button>
    </form>
    <div class="hint">Por defecto: <strong>admin1234</strong> — cámbiala en Ajustes</div>
  </div>
  <div style="text-align:center;margin-top:16px;font-size:10px;color:#33333f;letter-spacing:.5px;">
    © 2025 <span style="color:#7c6aff88;">Wil Rivera</span> — Todos los derechos reservados
  </div>
</div></body></html>`;
}

function dashboardPage(cfg) {
  const host = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

  const totalHits  = Object.values(siteStats).reduce((a, s) => a + s.hits.length, 0);
  const totalBytes = Object.values(siteStats).reduce((a, s) => a + s.totalBytes, 0);
  const fmtBytes   = b => b > 1048576 ? (b/1048576).toFixed(1)+" MB" : b > 1024 ? (b/1024).toFixed(1)+" KB" : b+" B";

  return `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>HTTP Server — Panel</title>${FONTS}
<style>${BASE_CSS}</style>
</head><body>
<div class="shell">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-mark">
        <div class="logo-icon">⬡</div>
        <div>
          <div>HTTP Server</div>
          <div class="logo-sub">PANEL DE CONTROL</div>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">Principal</div>
      <a class="nav-item active" id="nav-overview" onclick="showPage('overview',this)">
        <span class="icon">◈</span> Resumen
      </a>
      <a class="nav-item" id="nav-sites" onclick="showPage('sites',this)">
        <span class="icon">◻</span> Sitios Web
      </a>
      <div class="nav-section" style="margin-top:8px;">Sistema</div>
      <a class="nav-item" id="nav-logs" onclick="showPage('logs',this)">
        <span class="icon">▤</span> Access Log
      </a>
      <a class="nav-item" id="nav-settings" onclick="showPage('settings',this)">
        <span class="icon">⊙</span> Ajustes
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="flex items-center gap-2" style="padding:8px 10px;">
        <div class="status-dot"></div>
        <span class="text-xs text-muted">Online</span>
        <span class="flex-1"></span>
        <button class="btn btn-xs btn-ghost" onclick="logout()">Salir</button>
      </div>
    </div>
  </aside>

  <!-- MAIN -->
  <div class="main-content">
    <div class="topbar">
      <span style="font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:var(--t0);" id="page-title">Resumen</span>
      <div class="flex-1"></div>
      <a class="url-chip" href="${host}" target="_blank">🔗 ${host.replace('https://','').replace('http://','')}
      </a>
    </div>

    <div class="page">
      <div id="alert-global" class="hidden"></div>

      <!-- OVERVIEW PAGE -->
      <div id="page-overview">
        <div class="grid4 mb-4">
          <div class="stat-card">
            <div class="stat-val" id="ov-sites">${cfg.sites.length}</div>
            <div class="stat-label">Sitios activos</div>
            <div class="stat-badge purple">◈ Publicados</div>
          </div>
          <div class="stat-card">
            <div class="stat-val" id="ov-hits">${totalHits}</div>
            <div class="stat-label">Visitas totales</div>
            <div class="stat-badge up">↑ Acumulado</div>
          </div>
          <div class="stat-card">
            <div class="stat-val" id="ov-reqs">${totalReqs}</div>
            <div class="stat-label">Peticiones HTTP</div>
            <div class="stat-badge up">↑ Sesión</div>
          </div>
          <div class="stat-card">
            <div class="stat-val" id="ov-bytes">${fmtBytes(totalBytes)}</div>
            <div class="stat-label">Datos servidos</div>
            <div class="stat-badge purple">⬡ Transfer</div>
          </div>
        </div>

        <div class="grid2">
          <div class="card">
            <div class="card-title">Sitios recientes</div>
            <div id="ov-sites-list"></div>
          </div>
          <div class="card">
            <div class="card-title">Actividad — últimas 24h</div>
            <div class="chart-wrap" id="global-chart"></div>
            <div class="chart-labels" id="global-chart-labels"></div>
          </div>
        </div>
      </div>

      <!-- SITES PAGE -->
      <div id="page-sites" class="hidden">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;">Sitios Web</div>
            <div class="text-xs text-muted mt-1">Gestiona y despliega tus sitios estáticos</div>
          </div>
          <button class="btn btn-primary" onclick="openAdd()">+ Nuevo sitio</button>
        </div>
        <div class="card" style="padding:0;overflow:hidden;">
          <table class="data-table">
            <thead><tr>
              <th>Nombre</th><th>Ruta</th><th>URL pública</th>
              <th>Archivos</th><th>Visitas</th><th>Estado</th><th>Acciones</th>
            </tr></thead>
            <tbody id="sites-tbody"></tbody>
          </table>
          <div id="sites-empty" class="hidden empty-state">
            <div class="empty-icon">◻</div>
            <div class="empty-title">Sin sitios todavía</div>
            <div class="text-sm text-muted mb-3">Crea tu primer sitio web estático</div>
            <button class="btn btn-primary btn-sm" onclick="openAdd()">+ Nuevo sitio</button>
          </div>
        </div>
      </div>

      <!-- LOGS PAGE -->
      <div id="page-logs" class="hidden">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;">Access Log</div>
            <div class="text-xs text-muted mt-1">Registro de peticiones HTTP en tiempo real</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="loadLogs()">↺ Actualizar</button>
        </div>
        <div class="card" style="padding:0;overflow:hidden;">
          <table class="data-table">
            <thead><tr>
              <th>Hora</th><th>IP</th><th>Método</th><th>URL</th><th>Status</th><th>Bytes</th>
            </tr></thead>
            <tbody id="log-tbody"></tbody>
          </table>
        </div>
      </div>

      <!-- SETTINGS PAGE -->
      <div id="page-settings" class="hidden">
        <div class="mb-4">
          <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;">Ajustes</div>
          <div class="text-xs text-muted mt-1">Configuración del servidor</div>
        </div>
        <div class="grid2">
          <div class="card">
            <div class="card-title">Cambiar contraseña</div>
            <div id="pwd-alert" class="hidden"></div>
            <div class="form-group"><label>Contraseña actual</label><input type="password" id="pwd-old"/></div>
            <div class="form-group"><label>Nueva contraseña</label><input type="password" id="pwd-new"/></div>
            <div class="form-group"><label>Confirmar</label><input type="password" id="pwd-cf"/></div>
            <button class="btn btn-primary" onclick="changePwd()">Guardar cambios</button>
          </div>
          <div class="card">
            <div class="card-title">Información del sistema</div>
            <div style="display:flex;flex-direction:column;gap:12px;">
              <div class="flex justify-between"><span class="text-muted text-sm">Node.js</span><span class="tag">${process.version}</span></div>
              <div class="flex justify-between"><span class="text-muted text-sm">Plataforma</span><span class="tag">${os.platform()}</span></div>
              <div class="flex justify-between"><span class="text-muted text-sm">Arquitectura</span><span class="tag">${os.arch()}</span></div>
              <div class="flex justify-between"><span class="text-muted text-sm">Uptime</span><span class="tag" id="uptime-val">—</span></div>
              <div class="flex justify-between"><span class="text-muted text-sm">Memoria</span><span class="tag" id="mem-val">—</span></div>
            </div>
            <div class="divider"></div>
            <div class="card-title">URL del servidor</div>
            <div class="url-chip" style="max-width:100%;width:100%;">${host}</div>
          </div>
        </div>
      </div>

    </div><!-- /page -->

    <!-- FOOTER -->
    <footer style="border-top:1px solid var(--bd);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;background:var(--bg1);">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:22px;height:22px;background:linear-gradient(135deg,var(--p),#4f3dcc);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:var(--glow);">⬡</div>
        <span style="font-family:'Syne',sans-serif;font-size:12px;font-weight:600;color:var(--t1);">HTTP Server</span>
        <span style="font-size:10px;color:var(--t3);">v2.0.0</span>
      </div>
      <div style="font-size:10px;color:var(--t2);letter-spacing:.5px;">
        © 2025 <span style="color:var(--p3);font-weight:500;">Wil Rivera</span> — Todos los derechos reservados
      </div>
    </footer>

  </div><!-- /main-content -->
</div><!-- /shell -->

<!-- ADD SITE MODAL -->
<div id="modal-add" class="modal-overlay hidden">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">Nuevo sitio web</div>
      <button class="modal-close" onclick="closeAdd()">✕</button>
    </div>
    <div id="add-alert" class="hidden"></div>
    <div class="form-group">
      <label>Nombre del sitio</label>
      <input type="text" id="s-name" placeholder="Mi portafolio"/>
    </div>
    <div class="form-group">
      <label>Ruta URL</label>
      <input type="text" id="s-slug" placeholder="portafolio"/>
      <div class="input-hint" id="s-prev">URL: ${host}/sites/portafolio/</div>
    </div>
    <div class="form-group">
      <label>Dominio personalizado (opcional)</label>
      <input type="text" id="s-domain" placeholder="midominio.com"/>
      <div class="input-hint">Si tienes un dominio apuntando a este servidor, ponlo aquí</div>
    </div>
    <div class="form-group">
      <label>Archivos del sitio</label>
      <div class="drop-zone" id="dz" onclick="document.getElementById('fi').click()">
        <div class="drop-icon">⬆</div>
        <div style="font-size:13px;">Arrastra archivos o haz clic para seleccionar</div>
        <div class="text-xs text-muted mt-1">HTML, CSS, JS, imágenes...</div>
      </div>
      <input type="file" id="fi" multiple class="hidden"/>
    </div>
    <div id="fp" style="max-height:140px;overflow-y:auto;"></div>
    <div class="progress-bar hidden" id="pb"><div class="progress-fill" id="pf"></div></div>
    <div class="flex gap-2 mt-4" style="justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeAdd()">Cancelar</button>
      <button class="btn btn-primary" onclick="submitSite()">Crear sitio</button>
    </div>
  </div>
</div>

<!-- FILES MODAL -->
<div id="modal-files" class="modal-overlay hidden">
  <div class="modal" style="width:600px;">
    <div class="modal-header">
      <div class="modal-title" id="fm-title">Archivos</div>
      <button class="modal-close" onclick="document.getElementById('modal-files').classList.add('hidden')">✕</button>
    </div>
    <div id="fm-tabs" class="flex gap-2 mb-4">
      <button class="btn btn-sm btn-primary" id="fm-tab-files" onclick="showFileTab('files')">Archivos</button>
      <button class="btn btn-sm btn-ghost" id="fm-tab-editor" onclick="showFileTab('editor')">Editor</button>
      <button class="btn btn-sm btn-ghost" id="fm-tab-stats" onclick="showFileTab('stats')">Estadísticas</button>
    </div>
    <div id="fm-files">
      <div id="fm-content"></div>
      <div class="flex gap-2 mt-4">
        <button class="btn btn-teal btn-sm" onclick="uploadMore()">+ Subir más</button>
        <div class="flex-1"></div>
      </div>
    </div>
    <div id="fm-editor" class="hidden">
      <div class="form-group">
        <label>Selecciona un archivo para editar</label>
        <select id="editor-file-select" onchange="loadFileContent()">
          <option value="">-- elige un archivo --</option>
        </select>
      </div>
      <div id="editor-wrap" class="hidden">
        <div class="file-editor">
          <div class="editor-toolbar">
            <span class="editor-filename" id="editor-filename">—</span>
            <button class="btn btn-xs btn-primary" onclick="saveFile()">Guardar</button>
          </div>
          <textarea class="editor-textarea" id="editor-content" spellcheck="false"></textarea>
        </div>
        <div id="editor-alert" class="hidden mt-2"></div>
      </div>
    </div>
    <div id="fm-stats" class="hidden">
      <div class="grid2 mb-4">
        <div class="stat-card card-sm">
          <div class="stat-val" id="modal-total-hits">0</div>
          <div class="stat-label">Visitas totales</div>
        </div>
        <div class="stat-card card-sm">
          <div class="stat-val" id="modal-total-bytes">0 B</div>
          <div class="stat-label">Datos transferidos</div>
        </div>
      </div>
      <div class="card-title">Visitas — últimas 24h</div>
      <div class="chart-wrap" id="modal-chart"></div>
      <div class="chart-labels" id="modal-chart-labels"></div>
    </div>
  </div>
</div>

<script>
const BASE='${host}';
let sites=${JSON.stringify(cfg.sites)};
let selFiles=[], curId=null, curSiteName='';
let currentFileTab='files';

// ── Navigation ────────────────────────────────────────────────────────────────
function showPage(name, el) {
  ['overview','sites','logs','settings'].forEach(p=>{
    document.getElementById('page-'+p).classList.add('hidden');
    document.getElementById('nav-'+p)?.classList.remove('active');
  });
  document.getElementById('page-'+name).classList.remove('hidden');
  if(el) el.classList.add('active');
  const titles={overview:'Resumen',sites:'Sitios Web',logs:'Access Log',settings:'Ajustes'};
  document.getElementById('page-title').textContent=titles[name]||name;
  if(name==='logs') loadLogs();
  if(name==='overview') refreshOverview();
  if(name==='settings') updateSysInfo();
}

// ── Overview ──────────────────────────────────────────────────────────────────
function refreshOverview() {
  document.getElementById('ov-sites').textContent=sites.length;
  fetch('/api/stats/global').then(r=>r.json()).then(d=>{
    document.getElementById('ov-hits').textContent=d.totalHits||0;
    document.getElementById('ov-reqs').textContent=d.totalReqs||0;
    document.getElementById('ov-bytes').textContent=d.bytesFormatted||'0 B';
    renderGlobalChart(d.hourly||{});
  });
  renderOverviewSites();
}

function renderOverviewSites() {
  const el = document.getElementById('ov-sites-list');
  if(!sites.length){el.innerHTML='<div class="empty-state" style="padding:24px;"><div class="text-muted text-sm">Sin sitios todavía.</div></div>';return;}
  el.innerHTML = sites.slice(0,5).map(s=>\`
    <div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--bd);">
      <div>
        <div style="font-size:12px;color:var(--t0);">\${s.name}</div>
        <div class="text-xs text-muted">/sites/\${s.slug}/</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge badge-live">● Live</span>
        <a href="\${BASE}/sites/\${s.slug}/" target="_blank" class="btn btn-xs btn-ghost">↗</a>
      </div>
    </div>\`).join('');
}

function renderGlobalChart(hourly) {
  const entries = Object.entries(hourly);
  const max = Math.max(...entries.map(e=>e[1]), 1);
  document.getElementById('global-chart').innerHTML = entries.map(([h,v])=>{
    const pct = Math.max((v/max)*100, 2);
    const alpha = 0.3 + (v/max)*0.7;
    return \`<div class="chart-bar" title="\${h}: \${v} visitas" style="height:\${pct}%;background:rgba(124,106,255,\${alpha});"></div>\`;
  }).join('');
  const visibleLabels = entries.filter((_,i)=>i%4===0);
  document.getElementById('global-chart-labels').innerHTML = entries.map(([h],i)=>
    \`<div class="chart-label">\${i%4===0?h:''}</div>\`
  ).join('');
}

// ── Sites ─────────────────────────────────────────────────────────────────────
function renderSites() {
  const tb=document.getElementById('sites-tbody'), em=document.getElementById('sites-empty');
  if(!sites.length){tb.innerHTML='';em.classList.remove('hidden');return;}
  em.classList.add('hidden');
  tb.innerHTML=sites.map(s=>{
    const stats=window._siteStats&&window._siteStats[s.id];
    const hits=stats?stats.hits:0;
    const domainBadge=s.domain?\`<div class="domain-chip mt-1">⬡ \${s.domain}</div>\`:'';
    return \`<tr>
      <td>
        <div style="font-weight:500;color:var(--t0);">\${s.name}</div>
        \${domainBadge}
      </td>
      <td><span class="tag">/sites/\${s.slug}/</span></td>
      <td>
        <div class="flex items-center gap-2">
          <a class="link" href="\${BASE}/sites/\${s.slug}/" target="_blank" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">\${BASE}/sites/\${s.slug}/</a>
          <button class="copy-btn" onclick="copy('\${BASE}/sites/\${s.slug}/')">Copiar</button>
        </div>
      </td>
      <td><span class="text-muted">\${s.fileCount||0}</span></td>
      <td><span class="text-muted">\${hits}</span></td>
      <td><span class="badge badge-live">● Activo</span></td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-xs btn-ghost" onclick="viewFiles('\${s.id}','\${s.name}')">Archivos</button>
          <button class="btn btn-xs btn-ghost" onclick="editDomain('\${s.id}','\${s.name}','\${s.domain||''}')">Dominio</button>
          <button class="btn btn-xs btn-danger" onclick="delSite('\${s.id}','\${s.name}')">✕</button>
        </div>
      </td>
    </tr>\`;
  }).join('');
}

// ── Add site modal ────────────────────────────────────────────────────────────
function openAdd() {
  document.getElementById('modal-add').classList.remove('hidden');
  ['s-name','s-slug','s-domain'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fp').innerHTML='';
  document.getElementById('pb').classList.add('hidden');
  document.getElementById('add-alert').classList.add('hidden');
  selFiles=[];
}
function closeAdd(){document.getElementById('modal-add').classList.add('hidden');}

document.getElementById('s-name').addEventListener('input',function(){
  const slug=this.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  document.getElementById('s-slug').value=slug;
  document.getElementById('s-prev').textContent='URL: '+BASE+'/sites/'+(slug||'mi-sitio')+'/';
});

const dz=document.getElementById('dz'),fi=document.getElementById('fi');
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag-over');});
dz.addEventListener('dragleave',()=>dz.classList.remove('drag-over'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('drag-over');addFiles(e.dataTransfer.files);});
fi.addEventListener('change',()=>addFiles(fi.files));

function addFiles(list){for(const f of list)selFiles.push(f);renderPreview();}
function renderPreview(){
  document.getElementById('fp').innerHTML=selFiles.map(f=>\`
    <div class="flex justify-between" style="padding:5px 0;border-bottom:1px solid var(--bd);font-size:11px;">
      <span style="color:var(--t1);">\${f.name}</span>
      <span class="text-muted">\${(f.size/1024).toFixed(1)} KB</span>
    </div>\`).join('');
}

async function submitSite() {
  const name=document.getElementById('s-name').value.trim();
  const slug=document.getElementById('s-slug').value.trim();
  const domain=document.getElementById('s-domain').value.trim();
  if(!name||!slug) return showAlert('add-alert','Completa nombre y ruta.','err');
  if(!/^[a-z0-9-]+$/.test(slug)) return showAlert('add-alert','Ruta inválida (solo letras, números y guiones).','err');
  if(!selFiles.length) return showAlert('add-alert','Sube al menos un archivo.','err');
  const fd=new FormData();
  fd.append('name',name);fd.append('slug',slug);if(domain)fd.append('domain',domain);
  for(const f of selFiles) fd.append('files',f,f.name);
  const pb=document.getElementById('pb'),pf=document.getElementById('pf');
  pb.classList.remove('hidden');
  return new Promise(resolve=>{
    const xhr=new XMLHttpRequest();
    xhr.upload.onprogress=e=>{if(e.lengthComputable)pf.style.width=(e.loaded/e.total*100)+'%';};
    xhr.onload=()=>{
      pb.classList.add('hidden');
      if(xhr.status===200){const r=JSON.parse(xhr.responseText);sites=r.sites;renderSites();refreshOverview();closeAdd();globalOk('Sitio "'+name+'" creado correctamente.');}
      else showAlert('add-alert',JSON.parse(xhr.responseText).error||'Error.','err');
      resolve();
    };
    xhr.onerror=()=>{pb.classList.add('hidden');showAlert('add-alert','Error de red.','err');resolve();};
    xhr.open('POST','/api/sites');xhr.send(fd);
  });
}

async function delSite(id,name) {
  if(!confirm(\`¿Eliminar "\${name}"? Esta acción no se puede deshacer.\`)) return;
  const r=await fetch('/api/sites/'+id,{method:'DELETE'});
  const d=await r.json();
  if(r.ok){sites=d.sites;renderSites();refreshOverview();globalOk('Sitio eliminado.');}
}

// ── Domain editor ─────────────────────────────────────────────────────────────
function editDomain(id, name, currentDomain) {
  const d = prompt(\`Dominio personalizado para "\${name}"\\n(Deja vacío para eliminar):\`, currentDomain||'');
  if(d===null) return;
  fetch('/api/sites/'+id+'/domain',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domain:d.trim()})})
    .then(r=>r.json()).then(data=>{if(data.sites){sites=data.sites;renderSites();globalOk('Dominio actualizado.');}});
}

// ── Files modal ───────────────────────────────────────────────────────────────
async function viewFiles(id, name) {
  curId=id; curSiteName=name;
  document.getElementById('fm-title').textContent=name;
  document.getElementById('modal-files').classList.remove('hidden');
  showFileTab('files');
  loadFilesTab();
}

function showFileTab(tab) {
  currentFileTab=tab;
  ['files','editor','stats'].forEach(t=>{
    document.getElementById('fm-'+t).classList.add('hidden');
    document.getElementById('fm-tab-'+t).className='btn btn-sm btn-ghost';
  });
  document.getElementById('fm-'+tab).classList.remove('hidden');
  document.getElementById('fm-tab-'+tab).className='btn btn-sm btn-primary';
  if(tab==='stats') loadSiteStats();
  if(tab==='editor') loadEditorFiles();
}

async function loadFilesTab() {
  const r=await fetch('/api/sites/'+curId+'/files');
  const d=await r.json();
  document.getElementById('fm-content').innerHTML=d.files.length?d.files.map(f=>\`
    <div class="flex items-center justify-between" style="padding:8px 0;border-bottom:1px solid var(--bd);">
      <div>
        <div style="font-size:12px;color:var(--t1);">\${f.name}</div>
        <div class="text-xs text-muted">\${(f.size/1024).toFixed(1)} KB</div>
      </div>
      <button class="btn btn-xs btn-danger" onclick="delFile('\${curId}','\${f.name.replace(/'/g,'\\\\&apos;')}')">✕</button>
    </div>\`).join('')
  :'<div class="empty-state" style="padding:24px;"><div class="text-muted text-sm">Sin archivos en este sitio.</div></div>';
}

async function delFile(sid,fname) {
  if(!confirm('¿Eliminar "'+fname+'"?')) return;
  await fetch('/api/sites/'+sid+'/files/'+encodeURIComponent(fname),{method:'DELETE'});
  loadFilesTab();
  const r2=await fetch('/api/sites');const d2=await r2.json();sites=d2.sites;renderSites();
}

function uploadMore() {
  const inp=document.createElement('input');inp.type='file';inp.multiple=true;
  inp.onchange=async()=>{
    const fd=new FormData();for(const f of inp.files)fd.append('files',f,f.name);
    const r=await fetch('/api/sites/'+curId+'/files',{method:'POST',body:fd});
    const d=await r.json();if(r.ok){sites=d.sites;renderSites();}
    loadFilesTab();
  };inp.click();
}

// ── Editor ────────────────────────────────────────────────────────────────────
async function loadEditorFiles() {
  const r=await fetch('/api/sites/'+curId+'/files');
  const d=await r.json();
  const editable=['.html','.htm','.css','.js','.json','.txt','.xml','.svg','.md'];
  const files=d.files.filter(f=>editable.some(e=>f.name.toLowerCase().endsWith(e)));
  const sel=document.getElementById('editor-file-select');
  sel.innerHTML='<option value="">-- elige un archivo --</option>'+
    files.map(f=>\`<option value="\${f.name}">\${f.name}</option>\`).join('');
  document.getElementById('editor-wrap').classList.add('hidden');
}

async function loadFileContent() {
  const fname=document.getElementById('editor-file-select').value;
  if(!fname){document.getElementById('editor-wrap').classList.add('hidden');return;}
  const r=await fetch('/api/sites/'+curId+'/files/'+encodeURIComponent(fname)+'/content');
  if(!r.ok){showAlert('editor-alert','No se pudo cargar el archivo.','err');return;}
  const text=await r.text();
  document.getElementById('editor-filename').textContent=fname;
  document.getElementById('editor-content').value=text;
  document.getElementById('editor-wrap').classList.remove('hidden');
  document.getElementById('editor-alert').classList.add('hidden');
}

async function saveFile() {
  const fname=document.getElementById('editor-file-select').value;
  const content=document.getElementById('editor-content').value;
  const r=await fetch('/api/sites/'+curId+'/files/'+encodeURIComponent(fname)+'/content',{
    method:'PUT',headers:{'Content-Type':'text/plain'},body:content
  });
  const d=await r.json();
  if(r.ok) showAlert('editor-alert','Archivo guardado correctamente.','ok');
  else showAlert('editor-alert',d.error||'Error al guardar.','err');
}

// ── Stats ─────────────────────────────────────────────────────────────────────
async function loadSiteStats() {
  const r=await fetch('/api/stats/'+curId);
  const d=await r.json();
  document.getElementById('modal-total-hits').textContent=d.totalHits||0;
  document.getElementById('modal-total-bytes').textContent=d.bytesFormatted||'0 B';
  renderMiniChart(d.hourly||{},'modal-chart','modal-chart-labels');
}

function renderMiniChart(hourly, chartId, labelsId) {
  const entries=Object.entries(hourly);
  const max=Math.max(...entries.map(e=>e[1]),1);
  document.getElementById(chartId).innerHTML=entries.map(([h,v])=>{
    const pct=Math.max((v/max)*100,2);
    const alpha=0.3+(v/max)*0.7;
    return \`<div class="chart-bar" title="\${h}: \${v} visitas" style="height:\${pct}%;background:rgba(45,212,191,\${alpha});"></div>\`;
  }).join('');
  document.getElementById(labelsId).innerHTML=entries.map(([h],i)=>
    \`<div class="chart-label">\${i%4===0?h:''}</div>\`).join('');
}

// ── Logs ──────────────────────────────────────────────────────────────────────
async function loadLogs() {
  const r=await fetch('/api/logs'), d=await r.json();
  const mc={GET:'var(--teal)',POST:'var(--sky)',PUT:'var(--amber)',DELETE:'var(--rose)'};
  const sc=s=>s<300?'var(--teal)':s<400?'var(--amber)':'var(--rose)';
  document.getElementById('log-tbody').innerHTML=d.logs.length?d.logs.map(l=>\`<tr>
    <td class="text-muted text-xs">\${new Date(l.ts).toLocaleTimeString()}</td>
    <td class="text-xs" style="color:var(--t2);">\${l.ip}</td>
    <td style="color:\${mc[l.method]||'var(--t1)'};">\${l.method}</td>
    <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--t1);">\${l.url}</td>
    <td style="color:\${sc(l.status)};font-weight:600;">\${l.status}</td>
    <td class="text-muted text-xs">\${l.bytes?l.bytes+'B':'—'}</td>
  </tr>\`).join(''):'<tr><td colspan="6" class="empty-state">Sin registros todavía.</td></tr>';
}

// ── Settings ──────────────────────────────────────────────────────────────────
async function changePwd() {
  const old=document.getElementById('pwd-old').value,
        nw=document.getElementById('pwd-new').value,
        cf=document.getElementById('pwd-cf').value;
  if(nw!==cf) return showAlert('pwd-alert','Las contraseñas no coinciden.','err');
  if(nw.length<6) return showAlert('pwd-alert','Mínimo 6 caracteres.','err');
  const r=await fetch('/api/settings/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({old,new:nw})});
  const d=await r.json();
  if(r.ok) showAlert('pwd-alert','Contraseña actualizada correctamente.','ok');
  else showAlert('pwd-alert',d.error||'Error.','err');
}

function updateSysInfo() {
  const up=process_uptime||0;
  document.getElementById('uptime-val').textContent=
    up<60?up+'s':up<3600?Math.floor(up/60)+'m':Math.floor(up/3600)+'h';
  fetch('/api/stats/global').then(r=>r.json()).then(d=>{
    if(d.memMB) document.getElementById('mem-val').textContent=d.memMB+' MB';
  });
}

async function logout(){await fetch('/api/logout',{method:'POST'});location.href='/login';}
function copy(t){navigator.clipboard.writeText(t).then(()=>globalOk('Copiado al portapapeles.'));}
function showAlert(id,msg,t){const el=document.getElementById(id);el.className='alert alert-'+(t==='err'?'err':'ok');el.textContent=msg;el.classList.remove('hidden');setTimeout(()=>el.classList.add('hidden'),5000);}
function globalOk(msg){showAlert('alert-global',msg,'ok');}

// ── Init ──────────────────────────────────────────────────────────────────────
const process_uptime = Math.floor(${Math.floor(process.uptime())});
renderSites();
refreshOverview();
</script></body></html>`;
}

// ── main server ───────────────────────────────────────────────────────────────
const cfg = loadCfg();
if (!cfg.sites) cfg.sites = [];
try { fs.mkdirSync(SITES_DIR, { recursive: true }); } catch {}

const server = http.createServer(async (req, res) => {
  const ip       = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "?";
  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const method   = req.method;

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (pathname === "/login") {
    if (method === "GET") return sendHTML(res, loginPage());
    if (method === "POST") {
      const body = await parseBody(req);
      const pwd  = new URLSearchParams(body.toString()).get("password") || "";
      if (hashPwd(pwd) === cfg.password) {
        const token = makeToken();
        res.writeHead(302, { "Set-Cookie": `auth=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/`, Location: "/admin" });
        return res.end();
      }
      return sendHTML(res, loginPage("Contraseña incorrecta."), 401);
    }
  }

  // ── PUBLIC SITES ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/sites/")) {
    const parts   = pathname.slice(7).split("/");
    const slug    = parts[0];
    const subpath = "/" + parts.slice(1).join("/");
    const site    = cfg.sites.find(s => s.slug === slug);

    if (!slug || !site) {
      addLog({ ip, method, url: req.url, status: 404, bytes: 0 });
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>body{background:#0c0c10;color:#e8e8f0;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;}</style></head><body><div style="text-align:center;"><div style="font-size:64px;color:#7c6aff;margin-bottom:16px;">404</div><div style="color:#55556a;">Sitio no encontrado</div></div></body></html>`);
    }
    if (!pathname.endsWith("/") && !parts[1]) { res.writeHead(301, { Location: pathname + "/" }); return res.end(); }

    const siteDir  = path.join(SITES_DIR, site.id);
    let   rel      = path.posix.normalize(subpath || "/");
    if (rel === "/") rel = "/index.html";

    const filePath = path.join(siteDir, rel);
    if (!filePath.startsWith(siteDir)) { res.writeHead(403); return res.end("Forbidden"); }

    try {
      const st = await fsp.stat(filePath);
      if (st.isDirectory()) {
        const idx = path.join(filePath, "index.html");
        const content = await fsp.readFile(idx);
        addLog({ ip, method, url: req.url, status: 200, bytes: content.length, siteId: site.id });
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(content);
      }
      const content = await fsp.readFile(filePath);
      const mime    = getMime(path.extname(filePath));
      addLog({ ip, method, url: req.url, status: 200, bytes: content.length, siteId: site.id });
      res.writeHead(200, { "Content-Type": mime, "Content-Length": content.length, "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" });
      return res.end(content);
    } catch (e) {
      const status = e.code === "ENOENT" ? 404 : 500;
      addLog({ ip, method, url: req.url, status, bytes: 0 });
      res.writeHead(status, { "Content-Type": "text/html" });
      return res.end(`<h1 style='font-family:monospace;background:#0c0c10;color:#f43f5e;padding:40px'>${status}</h1>`);
    }
  }

  // ── AUTH WALL ─────────────────────────────────────────────────────────────
  const cookie = getCookie(req, "auth");
  if (!verifyToken(cookie)) {
    if (pathname.startsWith("/api/")) return sendJSON(res, { error: "Unauthorized" }, 401);
    res.writeHead(302, { Location: "/login" }); return res.end();
  }

  addLog({ ip, method, url: req.url, status: 200, bytes: 0 });

  // ── ADMIN DASHBOARD ───────────────────────────────────────────────────────
  if (pathname === "/" || pathname === "/admin") return sendHTML(res, dashboardPage(cfg));

  // ── API ───────────────────────────────────────────────────────────────────
  if (pathname === "/api/logout" && method === "POST") {
    res.writeHead(200, { "Set-Cookie": "auth=; Max-Age=0; Path=/", "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true }));
  }

  if (pathname === "/api/sites" && method === "GET") return sendJSON(res, { sites: cfg.sites });

  if (pathname === "/api/sites" && method === "POST") {
    const bnd = (req.headers["content-type"] || "").split("boundary=")[1];
    if (!bnd) return sendJSON(res, { error: "Invalid content-type" }, 400);
    const body = await parseBody(req);
    const { files, fields } = parseMultipart(body, bnd);
    const name   = (fields.name || "").trim();
    const slug   = (fields.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    const domain = (fields.domain || "").trim();
    if (!name || !slug) return sendJSON(res, { error: "Nombre y ruta requeridos" }, 400);
    if (cfg.sites.find(s => s.slug === slug)) return sendJSON(res, { error: "Ruta ya en uso" }, 400);
    const id  = uid(), siteDir = path.join(SITES_DIR, id);
    await fsp.mkdir(siteDir, { recursive: true });
    for (const f of files) {
      const safe = f.filename.replace(/\.\./g, "").replace(/^\//, "");
      const dest = path.join(siteDir, safe);
      await fsp.mkdir(path.dirname(dest), { recursive: true });
      await fsp.writeFile(dest, f.data);
    }
    cfg.sites.push({ id, name, slug, domain: domain || "", fileCount: files.length, created: new Date().toISOString() });
    saveCfg(cfg);
    return sendJSON(res, { sites: cfg.sites });
  }

  const mDel = pathname.match(/^\/api\/sites\/([^\/]+)$/);
  if (mDel && method === "DELETE") {
    try { fs.rmSync(path.join(SITES_DIR, mDel[1]), { recursive: true, force: true }); } catch {}
    cfg.sites = cfg.sites.filter(s => s.id !== mDel[1]);
    saveCfg(cfg);
    return sendJSON(res, { sites: cfg.sites });
  }

  // Domain update
  const mDomain = pathname.match(/^\/api\/sites\/([^\/]+)\/domain$/);
  if (mDomain && method === "POST") {
    const body = await parseBody(req);
    const { domain } = JSON.parse(body.toString());
    const site = cfg.sites.find(s => s.id === mDomain[1]);
    if (!site) return sendJSON(res, { error: "Sitio no encontrado" }, 404);
    site.domain = (domain || "").trim();
    saveCfg(cfg);
    return sendJSON(res, { sites: cfg.sites });
  }

  const mFiles = pathname.match(/^\/api\/sites\/([^\/]+)\/files$/);
  if (mFiles && method === "GET") return sendJSON(res, { files: listFiles(mFiles[1]) });
  if (mFiles && method === "POST") {
    const bnd  = (req.headers["content-type"] || "").split("boundary=")[1];
    const body = await parseBody(req);
    const { files } = parseMultipart(body, bnd);
    const sd = path.join(SITES_DIR, mFiles[1]);
    for (const f of files) {
      const safe = f.filename.replace(/\.\./g,"").replace(/^\//,"");
      const dest = path.join(sd, safe);
      await fsp.mkdir(path.dirname(dest), { recursive: true });
      await fsp.writeFile(dest, f.data);
    }
    const site = cfg.sites.find(s => s.id === mFiles[1]);
    if (site) { site.fileCount = listFiles(mFiles[1]).length; saveCfg(cfg); }
    return sendJSON(res, { sites: cfg.sites });
  }

  // File content - GET (editor read)
  const mFileContent = pathname.match(/^\/api\/sites\/([^\/]+)\/files\/(.+)\/content$/);
  if (mFileContent && method === "GET") {
    const fp = path.join(SITES_DIR, mFileContent[1], decodeURIComponent(mFileContent[2]));
    if (!fp.startsWith(SITES_DIR)) return sendJSON(res, { error: "Forbidden" }, 403);
    try {
      const content = await fsp.readFile(fp, "utf8");
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end(content);
    } catch { return sendJSON(res, { error: "No se pudo leer el archivo" }, 404); }
  }

  // File content - PUT (editor save)
  if (mFileContent && method === "PUT") {
    const fp = path.join(SITES_DIR, mFileContent[1], decodeURIComponent(mFileContent[2]));
    if (!fp.startsWith(SITES_DIR)) return sendJSON(res, { error: "Forbidden" }, 403);
    try {
      const body = await parseBody(req);
      await fsp.writeFile(fp, body);
      return sendJSON(res, { ok: true });
    } catch { return sendJSON(res, { error: "No se pudo guardar" }, 500); }
  }

  const mDelF = pathname.match(/^\/api\/sites\/([^\/]+)\/files\/(.+)$/);
  if (mDelF && method === "DELETE") {
    const fp = path.join(SITES_DIR, mDelF[1], decodeURIComponent(mDelF[2]));
    if (fp.startsWith(path.join(SITES_DIR, mDelF[1]))) try { await fsp.unlink(fp); } catch {}
    const site = cfg.sites.find(s => s.id === mDelF[1]);
    if (site) { site.fileCount = listFiles(mDelF[1]).length; saveCfg(cfg); }
    return sendJSON(res, { ok: true });
  }

  if (pathname === "/api/logs" && method === "GET") return sendJSON(res, { logs: accessLogs, total: totalReqs });

  // Global stats
  if (pathname === "/api/stats/global" && method === "GET") {
    const totalHits  = Object.values(siteStats).reduce((a, s) => a + s.hits.length, 0);
    const totalBytes = Object.values(siteStats).reduce((a, s) => a + s.totalBytes, 0);
    const fmtBytes   = b => b > 1048576 ? (b/1048576).toFixed(1)+" MB" : b > 1024 ? (b/1024).toFixed(1)+" KB" : b+" B";
    const memMB      = Math.round(process.memoryUsage().heapUsed / 1048576);
    // global hourly — merge all sites
    const allHits = Object.values(siteStats).flatMap(s => s.hits);
    const now = Date.now();
    const hours = {};
    for (let i = 23; i >= 0; i--) {
      const h = new Date(now - i * 3600000);
      hours[`${h.getHours().toString().padStart(2,'0')}:00`] = 0;
    }
    for (const h of allHits) {
      const d = new Date(h.ts);
      if (now - d.getTime() < 86400000) {
        const key = `${d.getHours().toString().padStart(2,'0')}:00`;
        if (key in hours) hours[key]++;
      }
    }
    return sendJSON(res, { totalHits, totalReqs, totalBytes, bytesFormatted: fmtBytes(totalBytes), hourly: hours, memMB });
  }

  // Per-site stats
  const mStats = pathname.match(/^\/api\/stats\/([^\/]+)$/);
  if (mStats && method === "GET") {
    const id = mStats[1];
    const s  = siteStats[id] || { hits: [], totalBytes: 0 };
    const fmtBytes = b => b > 1048576 ? (b/1048576).toFixed(1)+" MB" : b > 1024 ? (b/1024).toFixed(1)+" KB" : b+" B";
    return sendJSON(res, { totalHits: s.hits.length, totalBytes: s.totalBytes, bytesFormatted: fmtBytes(s.totalBytes), hourly: getHourlyStats(id) });
  }

  if (pathname === "/api/settings/password" && method === "POST") {
    const body = await parseBody(req);
    const { old, new: nw } = JSON.parse(body.toString());
    if (hashPwd(old) !== cfg.password) return sendJSON(res, { error: "Contraseña actual incorrecta" }, 400);
    if (!nw || nw.length < 6) return sendJSON(res, { error: "Mínimo 6 caracteres" }, 400);
    cfg.password = hashPwd(nw);
    saveCfg(cfg);
    return sendJSON(res, { ok: true });
  }

  return sendJSON(res, { error: "Not found" }, 404);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   HTTP SERVER — v2.0 Professional Edition    ║");
  console.log("║   © 2025 Wil Rivera. All Rights Reserved.    ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log(`\n  Local:   http://localhost:${PORT}`);
  console.log(`  Admin:   http://localhost:${PORT}/admin`);
  console.log(`  Pass:    ${process.env.ADMIN_PASSWORD || "admin1234"}`);
  console.log("\n  Ctrl+C para detener\n");
});
