/**
 * Adresse publique de l'application. Toute URL ou redirection construite cote
 * serveur part d'ici, jamais de `req.nextUrl.origin` : derriere le proxy de
 * l'hebergeur, l'origine de la requete est l'adresse d'ecoute interne.
 */
export function publicAppUrl(env: Record<string, string | undefined> = process.env): string {
  const brute = (env.PUBLIC_APP_URL ?? "").trim();
  if (!brute) throw new Error("PUBLIC_APP_URL manquante");
  return brute.replace(/\/+$/, "");
}

/** URL absolue d'un chemin de l'application. */
export function urlPublique(chemin: string, env?: Record<string, string | undefined>): string {
  const c = chemin.startsWith("/") ? chemin : `/${chemin}`;
  return `${publicAppUrl(env)}${c}`;
}
