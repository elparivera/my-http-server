#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
//  MY PERSONAL HTTP SERVER  —  cloud edition (Railway / Render)
//  pure Node.js, zero dependencies
// ════════════════════════════════════════════════════════════════
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

// ── config persistence ─────────────────────────────────────────────────────────
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

// ── access log ────────────────────────────────────────────────────────────────
const accessLogs = [];
let totalReqs = 0;
function addLog(entry) {
  totalReqs++;
  accessLogs.unshift({ ...entry, ts: new Date().toISOString() });
  if (accessLogs.length > 500) accessLogs.pop();
}

// ── HTML pages ─────────────────────────────────────────────────────────────────
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700&display=swap" rel="stylesheet"/>`;
const BASE_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#050e07;--bg1:#070f08;--bg2:#0a160b;--bg3:#0e1e10;--bd:#0f2a14;--bd2:#1a4020;
  --t0:#ccffdd;--t1:#88bb88;--t2:#446644;--t3:#2a4a2a;--p:#33ff99;--blue:#33ddff;--amber:#ffdd33;--red:#ff4466;}
html,body{min-height:100%;background:var(--bg);color:var(--t0);font-family:'Share Tech Mono',monospace;font-size:13px;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:var(--bd2);}
.scanline{pointer-events:none;position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.05) 3px,rgba(0,0,0,.05) 4px);z-index:9999;}
.vignette{pointer-events:none;position:fixed;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.75) 100%);z-index:9998;}
.btn{font-family:'Share Tech Mono',monospace;cursor:pointer;border:none;transition:all .15s;padding:8px 18px;border-radius:2px;font-size:12px;letter-spacing:1px;}
.btn:hover{filter:brightness(1.2);} .btn:active{transform:scale(.97);}
.btn-primary{background:#052e16;color:var(--p);border:1px solid #1a6030;}
.btn-danger{background:#1c0005;color:var(--red);border:1px solid #660022;}
.btn-sm{padding:5px 12px;font-size:11px;} .btn-ghost{background:none;color:var(--t2);border:1px solid var(--bd);}
input,select{font-family:'Share Tech Mono',monospace;background:var(--bg2);border:1px solid var(--bd2);color:var(--t0);font-size:12px;padding:8px 10px;border-radius:2px;outline:none;width:100%;transition:border .15s;}
input:focus,select:focus{border-color:var(--p);}
label{font-size:10px;color:var(--t3);letter-spacing:1px;display:block;margin-bottom:5px;}
.form-group{margin-bottom:14px;}
.card{background:var(--bg1);border:1px solid var(--bd);border-radius:2px;padding:16px;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--p)44,transparent);}
.card-title{font-size:9px;color:var(--t3);letter-spacing:2px;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.card-title::after{content:'';flex:1;height:1px;background:var(--bd);}
.hidden{display:none!important;}
.alert{padding:10px 14px;border-radius:2px;font-size:11px;margin-bottom:14px;}
.alert-err{background:#1c0505;border:1px solid #440000;color:var(--red);}
.alert-ok{background:#052e16;border:1px solid #1a6030;color:var(--p);}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:200;display:flex;align-items:center;justify-content:center;}
.modal{background:var(--bg1);border:1px solid var(--bd2);border-radius:2px;padding:24px;width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;}
.modal-title{font-family:'Orbitron',monospace;font-size:14px;color:var(--p);margin-bottom:18px;}
.tabs{display:flex;border-bottom:1px solid var(--bd);margin-bottom:16px;}
.tab{font-family:'Share Tech Mono',monospace;background:none;border:none;cursor:pointer;padding:10px 18px;font-size:10px;letter-spacing:1px;color:var(--t3);border-bottom:2px solid transparent;transition:all .15s;}
.tab.active{color:var(--p);border-bottom-color:var(--p);}
.drop-zone{border:2px dashed var(--bd2);border-radius:4px;padding:28px;text-align:center;color:var(--t3);transition:all .2s;cursor:pointer;}
.drop-zone.drag-over{border-color:var(--p);background:#0a2a14;color:var(--p);}
.progress-bar{height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:8px;}
.progress-fill{height:100%;background:var(--p);box-shadow:0 0 8px var(--p);transition:width .3s ease;width:0%;}
.sites-table{width:100%;border-collapse:collapse;}
.sites-table th{font-size:9px;color:var(--t3);letter-spacing:2px;padding:6px 12px;text-align:left;border-bottom:1px solid var(--bd);}
.sites-table td{padding:10px 12px;border-bottom:1px solid #0a160b;font-size:12px;vertical-align:middle;}
.sites-table tr:hover td{background:#0a160b;}
.badge-on{display:inline-block;padding:2px 8px;border-radius:2px;font-size:10px;font-weight:700;background:#052e16;color:var(--p);border:1px solid #1a6030;}
.a-blue{color:var(--blue);text-decoration:none;font-size:11px;} .a-blue:hover{text-shadow:0 0 8px var(--blue);}
.copy-btn{background:none;border:1px solid var(--bd);color:var(--t3);font-family:'Share Tech Mono',monospace;font-size:10px;padding:2px 8px;cursor:pointer;border-radius:2px;margin-left:6px;transition:all .15s;}
.copy-btn:hover{border-color:var(--p);color:var(--p);}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
`;

function loginPage(err = "") {
  return `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Login — My HTTP Server</title>${FONT}
<style>${BASE_CSS}
html,body{display:flex;align-items:center;justify-content:center;}
.box{background:var(--bg1);border:1px solid #1a4020;border-radius:2px;padding:40px;width:380px;position:relative;z-index:10;}
.logo{font-family:'Orbitron',monospace;font-size:18px;font-weight:700;color:var(--p);text-align:center;letter-spacing:3px;text-shadow:0 0 20px #33ff9966;margin-bottom:6px;}
.sub{font-size:10px;color:var(--t3);text-align:center;letter-spacing:2px;margin-bottom:28px;}
button{font-family:'Share Tech Mono',monospace;cursor:pointer;border:none;width:100%;padding:11px;background:#052e16;color:var(--p);border:1px solid #1a6030;font-size:12px;letter-spacing:2px;border-radius:2px;transition:all .15s;}
button:hover{background:#0a3d1e;}
.hint{font-size:10px;color:var(--t3);text-align:center;margin-top:12px;}
</style></head><body>
<div class="scanline"></div><div class="vignette"></div>
<div class="box">
  <div class="logo">HTTP-SRV</div>
  <div class="sub">SERVIDOR PERSONAL</div>
  ${err ? `<div class="alert alert-err">${err}</div>` : ""}
  <form method="POST" action="/login">
    <label>CONTRASEÑA</label>
    <input type="password" name="password" placeholder="••••••••" autofocus autocomplete="current-password" style="margin-bottom:14px;"/>
    <button type="submit">ENTRAR →</button>
  </form>
  <div class="hint">Default: <strong>admin1234</strong> — cámbiala en Ajustes</div>
</div></body></html>`;
}

function dashboardPage(cfg) {
  const host = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

  return `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>My HTTP Server</title>${FONT}
<style>${BASE_CSS}
header{background:#030905;border-bottom:1px solid var(--bd);display:flex;align-items:center;gap:16px;padding:0 24px;height:48px;position:sticky;top:0;z-index:100;}
.logo{font-family:'Orbitron',monospace;font-size:14px;font-weight:700;color:var(--p);letter-spacing:2px;text-shadow:0 0 12px var(--p);}
.dot{width:8px;height:8px;border-radius:50%;background:var(--p);box-shadow:0 0 10px var(--p),0 0 20px #33ff9966;animation:pulse 2s ease infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}}
.url-badge{font-size:11px;color:var(--blue);background:#0a1628;border:1px solid #1a3060;padding:4px 12px;border-radius:2px;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:320px;}
main{max-width:1060px;margin:0 auto;padding:20px;}
</style></head><body>
<div class="scanline"></div><div class="vignette"></div>
<header>
  <div class="dot"></div>
  <div class="logo">MY HTTP SERVER</div>
  <div style="flex:1;"></div>
  <a class="url-badge" href="${host}" target="_blank">${host}</a>
</header>
<main>
  <div id="alert-global" class="hidden"></div>
  <div class="tabs">
    <button class="tab active" onclick="showTab('sites',this)">◈ SITIOS WEB</button>
    <button class="tab" onclick="showTab('logs',this)">▤ ACCESS LOG</button>
    <button class="tab" onclick="showTab('settings',this)">◆ AJUSTES</button>
  </div>

  <!-- SITES -->
  <div id="tab-sites">
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px;">
      <button class="btn btn-primary" onclick="openAdd()">+ AGREGAR SITIO</button>
    </div>
    <div class="card">
      <div class="card-title">MIS SITIOS</div>
      <table class="sites-table"><thead><tr>
        <th>NOMBRE</th><th>RUTA</th><th>URL PÚBLICA</th><th>ARCHIVOS</th><th>ESTADO</th><th>ACCIONES</th>
      </tr></thead><tbody id="sites-tbody"></tbody></table>
      <div id="sites-empty" class="hidden" style="padding:32px;text-align:center;color:var(--t3);">
        No hay sitios todavía. Haz clic en "+ AGREGAR SITIO".
      </div>
    </div>
  </div>

  <!-- LOGS -->
  <div id="tab-logs" class="hidden">
    <div class="card">
      <div class="card-title" style="display:flex;justify-content:space-between;">
        <span>ACCESS LOG</span>
        <button class="btn btn-sm btn-ghost" onclick="loadLogs()">↺ ACTUALIZAR</button>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;"><thead><tr>
        <th style="font-size:9px;color:var(--t3);letter-spacing:2px;padding:4px 8px;text-align:left;">HORA</th>
        <th style="font-size:9px;color:var(--t3);letter-spacing:2px;padding:4px 8px;text-align:left;">IP</th>
        <th style="font-size:9px;color:var(--t3);letter-spacing:2px;padding:4px 8px;text-align:left;">MÉTODO</th>
        <th style="font-size:9px;color:var(--t3);letter-spacing:2px;padding:4px 8px;text-align:left;">URL</th>
        <th style="font-size:9px;color:var(--t3);letter-spacing:2px;padding:4px 8px;text-align:left;">STATUS</th>
      </tr></thead><tbody id="log-tbody"><tr><td colspan="5" style="text-align:center;color:var(--t3);padding:20px;">Cargando...</td></tr></tbody></table>
    </div>
  </div>

  <!-- SETTINGS -->
  <div id="tab-settings" class="hidden">
    <div class="grid2">
      <div class="card">
        <div class="card-title">CAMBIAR CONTRASEÑA</div>
        <div id="pwd-alert" class="hidden"></div>
        <div class="form-group"><label>CONTRASEÑA ACTUAL</label><input type="password" id="pwd-old"/></div>
        <div class="form-group"><label>NUEVA CONTRASEÑA</label><input type="password" id="pwd-new"/></div>
        <div class="form-group"><label>CONFIRMAR</label><input type="password" id="pwd-cf"/></div>
        <button class="btn btn-primary" onclick="changePwd()">GUARDAR</button>
      </div>
      <div class="card">
        <div class="card-title">INFORMACIÓN</div>
        <div style="display:flex;flex-direction:column;gap:10px;font-size:12px;">
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--t3);">NODE</span><span>${process.version}</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--t3);">PLATAFORMA</span><span>${os.platform()}</span></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:var(--t3);">URL BASE</span><span style="color:var(--blue);font-size:10px;max-width:180px;overflow:hidden;text-overflow:ellipsis;">${host}</span></div>
        </div>
        <div style="margin-top:16px;border-top:1px solid var(--bd);padding-top:14px;">
          <button class="btn btn-danger btn-sm" onclick="logout()">CERRAR SESIÓN</button>
        </div>
      </div>
    </div>
  </div>
</main>

<!-- ADD MODAL -->
<div id="modal-add" class="modal-overlay hidden">
  <div class="modal">
    <div class="modal-title">+ NUEVO SITIO WEB</div>
    <div id="add-alert" class="hidden"></div>
    <div class="form-group"><label>NOMBRE DEL SITIO</label><input type="text" id="s-name" placeholder="Mi portafolio"/></div>
    <div class="form-group">
      <label>RUTA URL (letras, números, guiones)</label>
      <input type="text" id="s-slug" placeholder="portafolio"/>
      <div style="font-size:10px;color:var(--t3);margin-top:4px;" id="s-prev">URL: ${host}/sites/portafolio/</div>
    </div>
    <div class="card-title" style="margin:14px 0 10px;">ARCHIVOS DEL SITIO</div>
    <div class="drop-zone" id="dz" onclick="document.getElementById('fi').click()">
      <div style="font-size:22px;margin-bottom:8px;">↑</div>
      <div>Arrastra archivos o haz clic para seleccionar</div>
      <div style="font-size:10px;color:var(--t3);margin-top:4px;">HTML, CSS, JS, imágenes... Sube todos los archivos de tu sitio</div>
    </div>
    <input type="file" id="fi" multiple class="hidden"/>
    <div id="fp" style="margin-top:10px;font-size:11px;max-height:140px;overflow-y:auto;"></div>
    <div class="progress-bar hidden" id="pb"><div class="progress-fill" id="pf"></div></div>
    <div style="display:flex;gap:10px;margin-top:18px;justify-content:flex-end;">
      <button class="btn btn-ghost" onclick="closeAdd()">CANCELAR</button>
      <button class="btn btn-primary" onclick="submitSite()">CREAR SITIO</button>
    </div>
  </div>
</div>

<!-- FILES MODAL -->
<div id="modal-files" class="modal-overlay hidden">
  <div class="modal" style="width:560px;">
    <div class="modal-title" id="fm-title">ARCHIVOS</div>
    <div id="fm-content"></div>
    <div style="display:flex;gap:10px;margin-top:18px;">
      <button class="btn btn-primary btn-sm" onclick="uploadMore()">+ SUBIR MÁS</button>
      <div style="flex:1;"></div>
      <button class="btn btn-ghost btn-sm" onclick="document.getElementById('modal-files').classList.add('hidden')">CERRAR</button>
    </div>
  </div>
</div>

<script>
const BASE='${host}';
let sites=${JSON.stringify(cfg.sites)};
let selFiles=[], curId=null;

function showTab(t,btn){
  ['sites','logs','settings'].forEach(id=>document.getElementById('tab-'+id).classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+t).classList.remove('hidden');
  btn.classList.add('active');
  if(t==='logs')loadLogs();
}

function renderSites(){
  const tb=document.getElementById('sites-tbody'),em=document.getElementById('sites-empty');
  if(!sites.length){tb.innerHTML='';em.classList.remove('hidden');return;}
  em.classList.add('hidden');
  tb.innerHTML=sites.map(s=>\`<tr>
    <td><strong style="color:#ccffdd;">\${s.name}</strong></td>
    <td><span style="color:#33ddff;">/sites/\${s.slug}/</span></td>
    <td><a class="a-blue" href="\${BASE}/sites/\${s.slug}/" target="_blank">\${BASE}/sites/\${s.slug}/</a>
        <button class="copy-btn" onclick="copy('\${BASE}/sites/\${s.slug}/')">COPIAR</button></td>
    <td style="color:#446644;">\${s.fileCount||0}</td>
    <td><span class="badge-on">● ACTIVO</span></td>
    <td>
      <button class="btn btn-sm btn-ghost" style="margin-right:6px;" onclick="viewFiles('\${s.id}','\${s.name}')">ARCHIVOS</button>
      <button class="btn btn-sm btn-danger" onclick="delSite('\${s.id}','\${s.name}')">ELIMINAR</button>
    </td>
  </tr>\`).join('');
}

function openAdd(){
  document.getElementById('modal-add').classList.remove('hidden');
  ['s-name','s-slug'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fp').innerHTML='';
  document.getElementById('pb').classList.add('hidden');
  document.getElementById('add-alert').classList.add('hidden');
  selFiles=[];
}
function closeAdd(){document.getElementById('modal-add').classList.add('hidden');}

document.getElementById('s-name').addEventListener('input',function(){
  const slug=this.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-\$/g,'');
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
  document.getElementById('fp').innerHTML=selFiles.map(f=>
    \`<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #0a160b;">
      <span style="color:#88bb88;">\${f.name}</span><span style="color:#334455;">\${(f.size/1024).toFixed(1)}KB</span>
    </div>\`).join('');
}

async function submitSite(){
  const name=document.getElementById('s-name').value.trim();
  const slug=document.getElementById('s-slug').value.trim();
  if(!name||!slug)return showAlert('add-alert','Completa nombre y ruta.','err');
  if(!/^[a-z0-9-]+\$/.test(slug))return showAlert('add-alert','Ruta inválida.','err');
  if(!selFiles.length)return showAlert('add-alert','Sube al menos un archivo.','err');
  const fd=new FormData();
  fd.append('name',name);fd.append('slug',slug);
  for(const f of selFiles)fd.append('files',f,f.name);
  const pb=document.getElementById('pb'),pf=document.getElementById('pf');
  pb.classList.remove('hidden');
  return new Promise(resolve=>{
    const xhr=new XMLHttpRequest();
    xhr.upload.onprogress=e=>{if(e.lengthComputable)pf.style.width=(e.loaded/e.total*100)+'%';};
    xhr.onload=()=>{
      pb.classList.add('hidden');
      if(xhr.status===200){const r=JSON.parse(xhr.responseText);sites=r.sites;renderSites();closeAdd();globalOk('Sitio "'+name+'" creado.');}
      else showAlert('add-alert',JSON.parse(xhr.responseText).error||'Error.','err');
      resolve();
    };
    xhr.onerror=()=>{pb.classList.add('hidden');showAlert('add-alert','Error de red.','err');resolve();};
    xhr.open('POST','/api/sites');xhr.send(fd);
  });
}

async function delSite(id,name){
  if(!confirm('¿Eliminar "'+name+'"?'))return;
  const r=await fetch('/api/sites/'+id,{method:'DELETE'});
  const d=await r.json();
  if(r.ok){sites=d.sites;renderSites();globalOk('Sitio eliminado.');}
}

async function viewFiles(id,name){
  curId=id;
  document.getElementById('fm-title').textContent='ARCHIVOS: '+name.toUpperCase();
  document.getElementById('modal-files').classList.remove('hidden');
  const r=await fetch('/api/sites/'+id+'/files');
  const d=await r.json();
  document.getElementById('fm-content').innerHTML=d.files.length?d.files.map(f=>\`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #0a160b;font-size:11px;">
      <span style="color:#88bb88;">\${f.name}</span>
      <div style="display:flex;gap:8px;align-items:center;">
        <span style="color:#334455;">\${(f.size/1024).toFixed(1)}KB</span>
        <button class="btn btn-sm btn-danger" onclick="delFile('\${id}','\${f.name.replace(/'/g,'\\\\&apos;')}')">✕</button>
      </div>
    </div>\`).join(''):'<div style="color:var(--t3);padding:16px;">Sin archivos.</div>';
}
async function delFile(sid,fname){
  await fetch('/api/sites/'+sid+'/files/'+encodeURIComponent(fname),{method:'DELETE'});
  viewFiles(sid,document.getElementById('fm-title').textContent.replace('ARCHIVOS: ',''));
}
function uploadMore(){
  const inp=document.createElement('input');inp.type='file';inp.multiple=true;
  inp.onchange=async()=>{
    const fd=new FormData();for(const f of inp.files)fd.append('files',f,f.name);
    const r=await fetch('/api/sites/'+curId+'/files',{method:'POST',body:fd});
    const d=await r.json();if(r.ok){sites=d.sites;renderSites();}
    viewFiles(curId,document.getElementById('fm-title').textContent.replace('ARCHIVOS: ',''));
  };inp.click();
}

async function loadLogs(){
  const r=await fetch('/api/logs'),d=await r.json();
  const mc={GET:'#33ff99',POST:'#33ddff',PUT:'#ffdd33',DELETE:'#ff4466'};
  const sc=s=>s<300?'#33ff99':s<400?'#ffdd33':'#ff4466';
  document.getElementById('log-tbody').innerHTML=d.logs.length?d.logs.map(l=>\`<tr style="cursor:default;">
    <td style="padding:4px 8px;border-bottom:1px solid #0a160b;color:#2a5a2a;">\${new Date(l.ts).toLocaleTimeString()}</td>
    <td style="padding:4px 8px;border-bottom:1px solid #0a160b;color:#446644;">\${l.ip}</td>
    <td style="padding:4px 8px;border-bottom:1px solid #0a160b;color:\${mc[l.method]||'#88bb88'};">\${l.method}</td>
    <td style="padding:4px 8px;border-bottom:1px solid #0a160b;color:#668866;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">\${l.url}</td>
    <td style="padding:4px 8px;border-bottom:1px solid #0a160b;color:\${sc(l.status)};font-weight:700;">\${l.status}</td>
  </tr>\`).join(''):'<tr><td colspan="5" style="text-align:center;color:var(--t3);padding:20px;">Sin registros.</td></tr>';
}

async function changePwd(){
  const old=document.getElementById('pwd-old').value,nw=document.getElementById('pwd-new').value,cf=document.getElementById('pwd-cf').value;
  if(nw!==cf)return showAlert('pwd-alert','Las contraseñas no coinciden.','err');
  if(nw.length<6)return showAlert('pwd-alert','Mínimo 6 caracteres.','err');
  const r=await fetch('/api/settings/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({old,new:nw})});
  const d=await r.json();
  if(r.ok)showAlert('pwd-alert','Contraseña cambiada.','ok');else showAlert('pwd-alert',d.error||'Error.','err');
}
async function logout(){await fetch('/api/logout',{method:'POST'});location.href='/login';}
function copy(t){navigator.clipboard.writeText(t).then(()=>globalOk('Copiado al portapapeles.'));}
function showAlert(id,msg,t){const el=document.getElementById(id);el.className='alert alert-'+(t==='err'?'err':'ok');el.textContent=msg;el.classList.remove('hidden');setTimeout(()=>el.classList.add('hidden'),5000);}
function globalOk(msg){showAlert('alert-global',msg,'ok');}

renderSites();
</script></body></html>`;
}

// ── main server ────────────────────────────────────────────────────────────────
const cfg = loadCfg();
if (!cfg.sites) cfg.sites = [];
try { fs.mkdirSync(SITES_DIR, { recursive: true }); } catch {}

const server = http.createServer(async (req, res) => {
  const ip       = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "?";
  const parsed   = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const method   = req.method;

  // ── LOGIN (public) ────────────────────────────────────────────────────────
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

  // ── PUBLIC SITES  /sites/:slug/* ─────────────────────────────────────────
  if (pathname.startsWith("/sites/")) {
    const parts   = pathname.slice(7).split("/");
    const slug    = parts[0];
    const subpath = "/" + parts.slice(1).join("/");
    const site    = cfg.sites.find(s => s.slug === slug);

    if (!slug || !site) {
      addLog({ ip, method, url: req.url, status: 404, bytes: 0 });
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("<h1 style='font-family:monospace;color:#ff4466;background:#050e07;padding:40px'>404 — Sitio no encontrado</h1>");
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
        addLog({ ip, method, url: req.url, status: 200, bytes: content.length });
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(content);
      }
      const content = await fsp.readFile(filePath);
      const mime    = getMime(path.extname(filePath));
      addLog({ ip, method, url: req.url, status: 200, bytes: content.length });
      res.writeHead(200, { "Content-Type": mime, "Content-Length": content.length, "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" });
      return res.end(content);
    } catch (e) {
      const status = e.code === "ENOENT" ? 404 : 500;
      addLog({ ip, method, url: req.url, status, bytes: 0 });
      res.writeHead(status, { "Content-Type": "text/html" });
      return res.end(`<h1 style='font-family:monospace;color:#ff4466;background:#050e07;padding:40px'>${status}</h1>`);
    }
  }

  // ── AUTH WALL ─────────────────────────────────────────────────────────────
  const cookie = getCookie(req, "auth");
  if (!verifyToken(cookie)) {
    if (pathname.startsWith("/api/")) return sendJSON(res, { error: "Unauthorized" }, 401);
    res.writeHead(302, { Location: "/login" }); return res.end();
  }

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
    const name = (fields.name || "").trim();
    const slug = (fields.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
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
    cfg.sites.push({ id, name, slug, fileCount: files.length, created: new Date().toISOString() });
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

  const mDelF = pathname.match(/^\/api\/sites\/([^\/]+)\/files\/(.+)$/);
  if (mDelF && method === "DELETE") {
    const fp = path.join(SITES_DIR, mDelF[1], decodeURIComponent(mDelF[2]));
    if (fp.startsWith(path.join(SITES_DIR, mDelF[1]))) try { await fsp.unlink(fp); } catch {}
    const site = cfg.sites.find(s => s.id === mDelF[1]);
    if (site) { site.fileCount = listFiles(mDelF[1]).length; saveCfg(cfg); }
    return sendJSON(res, { ok: true });
  }

  if (pathname === "/api/logs" && method === "GET") return sendJSON(res, { logs: accessLogs, total: totalReqs });

  if (pathname === "/api/settings/password" && method === "POST") {
    const body = await parseBody(req);
    const { old, new: nw } = JSON.parse(body.toString());
    if (hashPwd(old) !== cfg.password) return sendJSON(res, { error: "Contraseña actual incorrecta" }, 400);
    if (!nw || nw.length < 6) return sendJSON(res, { error: "Contraseña muy corta (mín. 6)" }, 400);
    cfg.password = hashPwd(nw);
    saveCfg(cfg);
    return sendJSON(res, { ok: true });
  }

  return sendJSON(res, { error: "Not found" }, 404);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("\n════════════════════════════════════════");
  console.log("  MY PERSONAL HTTP SERVER — cloud edition");
  console.log("════════════════════════════════════════");
  console.log(`\n  Local:      http://localhost:${PORT}`);
  console.log(`  Admin:      http://localhost:${PORT}/admin`);
  console.log(`  Contraseña: ${process.env.ADMIN_PASSWORD || "admin1234"}`);
  console.log("\n  Ctrl+C para detener\n");
});
