import { CVOrientation } from "@/types/cv";

/**
 * printCV
 *
 * Builds a self-contained HTML page as a Blob and opens it in a new tab.
 * The page prints itself on load then closes.
 *
 * Uses Blob + URL.createObjectURL — NO document.write.
 */
export function printCV(
  previewElementId = "cv-preview-root",
  orientation: CVOrientation = "portrait"
) {
  const el = document.getElementById(previewElementId);
  if (!el) {
    console.error(`[cv-export] Element #${previewElementId} not found.`);
    return;
  }

  // Deep-clone the rendered CV DOM
  const clone = el.cloneNode(true) as HTMLElement;

  // Collect all stylesheets from the current page
  const styleNodes = Array.from(
    document.querySelectorAll<HTMLStyleElement | HTMLLinkElement>(
      "style, link[rel='stylesheet']"
    )
  );

  // Inline <style> blocks — copy textContent directly (avoids cross-origin link issues)
  const inlineStyles = styleNodes
    .map((node) => {
      if (node.tagName === "STYLE") {
        return `<style>${(node as HTMLStyleElement).textContent}</style>`;
      }
      // External link — keep the <link> tag; same origin will work
      return node.outerHTML;
    })
    .join("\n");

  const pageSize   = orientation === "portrait" ? "A4 portrait"  : "A4 landscape";
  const pageWidth  = orientation === "portrait" ? "210mm" : "297mm";
  const pageHeight = orientation === "portrait" ? "297mm" : "210mm";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CV</title>
    ${inlineStyles}
    <style>
      @page {
        size: ${pageSize};
        margin: 0;
      }
      html, body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      #cv-root {
        width: ${pageWidth};
        min-height: ${pageHeight};
      }
    </style>
  </head>
  <body>
    <div id="cv-root">${clone.outerHTML}</div>
    <script>
      window.addEventListener("load", function () {
        window.print();
        window.addEventListener("afterprint", function () {
          window.close();
        });
      });
    </script>
  </body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);

  const printWindow = window.open(url, "_blank");
  if (!printWindow) {
    alert("Popup blocked — please allow popups for this page and try again.");
    URL.revokeObjectURL(url);
    return;
  }

  // Revoke the object URL after enough time for the page to fully load
  setTimeout(() => URL.revokeObjectURL(url), 15_000);
}

/** Export the CV data as a downloadable JSON file */
export function saveJSON(cv: object, filename = "my-cv.json") {
  const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Read a JSON file from an <input type="file"> and parse it */
export async function loadJSON(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => {
      try   { resolve(JSON.parse(e.target?.result as string)); }
      catch { reject(new Error("Invalid JSON — could not parse file.")); }
    };
    reader.onerror = () => reject(new Error("File read error."));
    reader.readAsText(file);
  });
}
