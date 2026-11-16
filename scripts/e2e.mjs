// Parcours de fumee au navigateur. Lance par scripts/e2e.sh.
// Chaque page de la liste en 1440 px et 390 px : reponse 200, capture dans
// .verif/, pas de scroll horizontal (avec le nom de l'element coupable), pas
// d'erreur de page ni de console. Chaque plan qui touche l'interface ajoute
// ici ses pages et son bloc de scenarios, nomme d'apres le plan.
import { chromium } from "playwright";
import { mkdirSync, existsSync, readdirSync } from "node:fs";

const base = process.env.E2E_BASE || "http://localhost:3100";
const pages = ["/"];
const tailles = [
  { nom: "desktop", width: 1440, height: 900 },
  { nom: "mobile", width: 390, height: 844 },
];
mkdirSync(".verif", { recursive: true });

// Le bac a sable fournit un Chromium pre-installe (PLAYWRIGHT_BROWSERS_PATH) qui
// n'est pas forcement de la version que le paquet playwright attend : on le
// prend tel quel plutot que de telecharger.
function chromiumLocal() {
  const racine = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (!existsSync(racine)) return undefined;
  const d = readdirSync(racine).find((x) => /^chromium-\d+$/.test(x));
  if (!d) return undefined;
  for (const c of [`${racine}/${d}/chrome-linux/chrome`, `${racine}/${d}/chrome-linux64/chrome`]) {
    if (existsSync(c)) return c;
  }
  return undefined;
}

const browser = await chromium.launch({ executablePath: chromiumLocal() });
const ctx = await browser.newContext({ baseURL: base });
const page = await ctx.newPage();
const erreurs = [];
page.on("pageerror", (e) => erreurs.push(`pageerror ${page.url()} : ${e.message}`));
page.on("console", (m) => {
  if (m.type() !== "error") return;
  const t = m.text();
  // Le navigateur du bac a sable n'a pas de reseau sortant.
  if (/ERR_CONNECTION|net::/.test(t)) return;
  erreurs.push(`console ${page.url()} : ${t}`);
});

let echecs = 0;
function verdict(nom, ok, detail = "") {
  if (!ok) echecs++;
  console.log(`${ok ? "ok " : "KO "} ${nom} ${detail}`.trimEnd());
}

/** Deborde-t-on horizontalement, et qui est coupable ? */
async function debordement() {
  const deborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (!deborde) return null;
  const coupables = await page.evaluate(() => {
    const w = window.innerWidth;
    const res = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.right > w + 1 && r.width > 0) {
        const cls = typeof el.className === "string" && el.className ? "." + el.className.split(" ")[0] : "";
        res.push({ d: r.right, s: `${el.tagName.toLowerCase()}${cls} (droite ${Math.round(r.right)} px)` });
      }
    }
    return res.sort((a, b) => b.d - a.d).slice(0, 4).map((x) => x.s);
  });
  return coupables.join(", ");
}

const sante = await ctx.request.get("/api/health");
verdict("GET /api/health", sante.status() === 200, `statut=${sante.status()}`);

for (const t of tailles) {
  await page.setViewportSize({ width: t.width, height: t.height });
  for (const p of pages) {
    const r = await page.goto(p, { waitUntil: "networkidle" });
    const nom = p === "/" ? "accueil" : p.replace(/^\//, "").replace(/\//g, "_");
    await page.screenshot({ path: `.verif/${t.nom}_${nom}.png`, fullPage: true });
    const deb = await debordement();
    verdict(`${p} (${t.nom})`, r?.status() === 200 && !deb, `statut=${r?.status()} ${deb ? "DEBORDE : " + deb : ""}`);
  }
}

for (const e of erreurs) console.log("erreur :", e);
if (erreurs.length) echecs += erreurs.length;
await browser.close();
console.log(echecs ? `ECHEC : ${echecs} probleme(s)` : "PASS : toutes les pages repondent, sans scroll horizontal ni erreur");
process.exit(echecs ? 1 : 0);
