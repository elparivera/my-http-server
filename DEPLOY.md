# 🚀 Guía de despliegue en Railway (gratis)

## Archivos que necesitas tener en tu carpeta:
```
server.js
package.json
.gitignore
railway.toml
README.md
```

---

## PASO 1 — Crear cuenta en GitHub
Si no tienes cuenta: https://github.com → Sign up

---

## PASO 2 — Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name:** `my-http-server`
3. Selecciona **Private** (solo tú lo ves)
4. Haz clic en **Create repository**

---

## PASO 3 — Subir los archivos a GitHub

### Opción A: Desde la web de GitHub (sin instalar nada)
1. En tu repositorio vacío, haz clic en **"uploading an existing file"**
2. Arrastra los archivos: `server.js`, `package.json`, `.gitignore`, `railway.toml`
3. Haz clic en **Commit changes**

### Opción B: Con Git desde terminal (más profesional)
```bash
# Instala Git si no lo tienes: https://git-scm.com

cd carpeta-del-servidor

git init
git add server.js package.json .gitignore railway.toml README.md
git commit -m "first commit"

git remote add origin https://github.com/TU_USUARIO/my-http-server.git
git branch -M main
git push -u origin main
```

---

## PASO 4 — Desplegar en Railway

1. Ve a https://railway.app → **Login with GitHub**
2. Haz clic en **New Project**
3. Selecciona **Deploy from GitHub repo**
4. Elige tu repositorio `my-http-server`
5. Railway detecta Node.js automáticamente y empieza a construir

### Configurar variables de entorno (IMPORTANTE):
En Railway → tu proyecto → **Variables** → añade:
```
ADMIN_PASSWORD = tu_contraseña_segura
SECRET_KEY     = una_cadena_aleatoria_larga_aqui
```

### Configurar disco persistente (para que los sitios no se borren):
1. En Railway → tu proyecto → **Add Volume**
2. Mount path: `/data`
3. En Variables añade:
   ```
   DATA_DIR = /data
   ```

6. Una vez desplegado, Railway te da una URL como:
   `https://my-http-server-production.up.railway.app`

---

## PASO 5 — Acceder al panel

Tu panel estará en:
```
https://TU-URL.up.railway.app/admin
```

Contraseña: la que pusiste en `ADMIN_PASSWORD` (o `admin1234` si no la pusiste)

Tus sitios web se verán en:
```
https://TU-URL.up.railway.app/sites/NOMBRE-DEL-SITIO/
```

---

## Actualizar el servidor (cuando cambies algo)

```bash
git add .
git commit -m "actualización"
git push
```

Railway detecta el push y redespliega automáticamente en ~1 minuto.

---

## ⚠️ Notas importantes

| Característica | Railway Free |
|---|---|
| RAM | 512 MB |
| CPU | Compartida |
| Ancho de banda | 100 GB/mes |
| Disco (con Volume) | 1 GB |
| Sleep si inactivo | No (siempre activo) |
| Dominio personalizado | Sí (gratis) |

- **Sin Volume**: los archivos subidos se pierden al reiniciar (usar Volume es obligatorio para producción)
- **Dominio propio**: en Railway → Settings → Domains → Add Custom Domain

---

## Alternativa: Render (también gratis)

1. https://render.com → New → Web Service
2. Conecta GitHub → selecciona el repo
3. Build Command: (vacío)
4. Start Command: `node server.js`
5. Añade las mismas variables de entorno

⚠️ En Render free, el servidor **duerme** si no hay peticiones en 15 min.
Railway free no tiene esta limitación.
