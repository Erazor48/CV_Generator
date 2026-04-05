import { CVOrientation } from "@/types/cv";

export function printCV(
  previewElementId = "cv-preview-root",
  orientation: CVOrientation = "portrait"
) {
  const el = document.getElementById(previewElementId);
  if (!el) {
    console.error(`[cv-export] Element #${previewElementId} not found.`);
    return;
  }

  const clone = el.cloneNode(true) as HTMLElement;

  const styles = Array.from(
    document.querySelectorAll("style, link[rel='stylesheet']")
  )
    .map((node) => node.outerHTML)
    .join("\n");

  const pageSize =
    orientation === "portrait" ? "A4 portrait" : "A4 landscape";

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CV</title>
    ${styles}
    <style>
      @page { size: ${pageSize}; margin: 0; }
      html, body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body > * { display: none !important; }
      #__print_target { display: block !important; }
      #__print_target > * {
        width: ${orientation === "portrait" ? "210mm" : "297mm"};
        min-height: ${orientation === "portrait" ? "297mm" : "210mm"};
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
`;

  const printWindow = window.open("", "_blank", "width=1000,height=1200");
  if (!printWindow) {
    alert("Popup blocked — please allow popups for this page.");
    return;
  }

  // On crée un document complet à partir du HTML
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(html, "text/html");

  // On remplace tout le contenu du document de la fenêtre
  printWindow.document.replaceChildren(
    ...Array.from(parsedDoc.childNodes)
  );
}

export function saveJSON(cv: object, filename = "my-cv.json") {
  const blob = new Blob([JSON.stringify(cv, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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