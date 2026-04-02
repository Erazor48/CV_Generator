/**
 * cv-export.ts
 *
 * Strategy: window.print() with a dedicated print stylesheet.
 * This keeps the exact visual fidelity of CVPreview without
 * introducing a heavy canvas/pdf library.
 *
 * Usage:
 *   import { printCV } from "@/lib/cv-export";
 *   printCV("cv-preview-root");  // pass the id of <CVPreview>'s wrapper
 */

export function printCV(previewElementId = "cv-preview-root") {
  const el = document.getElementById(previewElementId);
  if (!el) {
    console.error(`[cv-export] Element #${previewElementId} not found.`);
    return;
  }

  // Clone the node so we can inject it into a fresh window
  const clone = el.cloneNode(true) as HTMLElement;

  // Gather all <style> and <link rel="stylesheet"> from the current page
  const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
    .map((node) => node.outerHTML)
    .join("\n");

  const printWindow = window.open("", "_blank", "width=1200,height=900");
  if (!printWindow) {
    alert("Popup blocked – please allow popups for this page.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>CV</title>
        ${styles}
        <style>
          /* Force A4 layout */
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #0d1b2a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Hide everything except the CV */
          body > * { display: none !important; }
          #__print_target { display: block !important; }
          /* Make the CV fill the page */
          #__print_target > * {
            width: 297mm;
            min-height: 210mm;
          }
        </style>
      </head>
      <body>
        <div id="__print_target">${clone.outerHTML}</div>
        <script>
          window.onload = function () {
            window.print();
            window.onafterprint = function () { window.close(); };
          };
        <\/script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

/**
 * saveJSON – exports the CV data as a JSON file the user can reload later.
 */
export function saveJSON(cv: object, filename = "my-cv.json") {
  const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * loadJSON – reads a JSON file from an <input type="file"> and returns parsed data.
 */
export async function loadJSON(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string));
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
}
