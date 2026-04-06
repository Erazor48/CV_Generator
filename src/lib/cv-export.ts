import { CVOrientation } from "@/types/cv";

/**
 * printCV
 *
 * Fetches ALL stylesheet content (inline + external link tags) and inlines
 * them into a self-contained HTML blob. This is required because blob: URLs
 * cannot resolve relative /_next/static/css/... paths.
 *
 * Flow: collect styles → clone DOM → build HTML string → Blob → window.open
 * No document.write anywhere.
 */
export async function printCV(
  previewElementId = "cv-preview-root",
  orientation: CVOrientation = "portrait"
) {
  const el = document.getElementById(previewElementId);
  if (!el) {
    console.error(`[cv-export] #${previewElementId} not found.`);
    return;
  }

  // ── 1. Collect all styles, fetching external sheets so blob can resolve them ──
  const styleNodes = Array.from(
    document.querySelectorAll<HTMLStyleElement | HTMLLinkElement>("style, link[rel='stylesheet']")
  );

  const styleChunks = await Promise.all(
    styleNodes.map(async (node) => {
      if (node.tagName === "STYLE") {
        return `<style>${(node as HTMLStyleElement).textContent ?? ""}</style>`;
      }
      // External <link> — fetch content and inline it
      const href = (node as HTMLLinkElement).href;
      if (!href) return "";
      try {
        const res = await fetch(href);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const css = await res.text();
        return `<style>${css}</style>`;
      } catch {
        // Fallback: keep the link tag with absolute URL
        return `<link rel="stylesheet" href="${href}" />`;
      }
    })
  );

  const allStyles = styleChunks.join("\n");

  // ── 2. Clone the CV DOM ───────────────────────────────────────────────────
  const clone = el.cloneNode(true) as HTMLElement;

  // ── 3. Page size ──────────────────────────────────────────────────────────
  const pageSize  = orientation === "portrait" ? "A4 portrait"  : "A4 landscape";
  const pageW     = orientation === "portrait" ? "210mm" : "297mm";
  const pageH     = orientation === "portrait" ? "297mm" : "210mm";

  // ── 4. Build self-contained HTML ──────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CV</title>
    ${allStyles}
    <style>
      @page { size: ${pageSize}; margin: 0; }
      html, body {
        margin: 0; padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      #cv-root {
        width: ${pageW};
        min-height: ${pageH};
      }
    </style>
  </head>
  <body>
    <div id="cv-root">${clone.outerHTML}</div>
    <script>
      window.addEventListener("load", function () {
        window.print();
        window.addEventListener("afterprint", function () { window.close(); });
      });
    </script>
  </body>
</html>`;

  // ── 5. Open as blob ───────────────────────────────────────────────────────
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);

  const win = window.open(url, "_blank");
  if (!win) {
    alert("Popup bloqué — autorise les popups pour cette page puis réessaie.");
    URL.revokeObjectURL(url);
    return;
  }

  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** Export CV data as a downloadable JSON file */
export function saveJSON(cv: object, filename = "my-cv.json") {
  const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

/** Parse a JSON file from <input type="file"> */
export async function loadJSON(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => {
      try   { resolve(JSON.parse(e.target?.result as string)); }
      catch { reject(new Error("Fichier JSON invalide.")); }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier."));
    reader.readAsText(file);
  });
}
