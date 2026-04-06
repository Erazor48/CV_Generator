import React from "react";

/**
 * renderDescription
 *
 * Parses a multi-line description string.
 * Lines that start with "- " (or just "-") are rendered as bullet points (•).
 * All other non-empty lines are rendered as plain text paragraphs.
 *
 * Example input:
 *   "Some intro text\n- Point one\n- Point two"
 *
 * Renders as:
 *   <p>Some intro text</p>
 *   <ul>
 *     <li>• Point one</li>
 *     <li>• Point two</li>
 *   </ul>
 */
export function renderDescription(
  text: string | undefined,
  styles: {
    textColor: string;
    bulletColor: string;
    fontSize?: string;
  }
): React.ReactNode {
  if (!text?.trim()) return null;

  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  const bulletBuffer: string[] = [];

  const flushBullets = (key: string) => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul key={`ul-${key}`} className="mt-0.5 ml-2 space-y-0.5">
        {bulletBuffer.map((b, i) => (
          <li
            key={i}
            className="flex items-start gap-1.5"
            style={{ color: styles.textColor, fontSize: styles.fontSize ?? "0.75rem" }}
          >
            <span
              className="mt-1.5 w-1 h-1 rounded-full shrink-0"
              style={{ backgroundColor: styles.bulletColor }}
            />
            {b}
          </li>
        ))}
      </ul>
    );
    bulletBuffer.length = 0;
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (!line) return;

    const isBullet = line.trimStart().startsWith("-");

    if (isBullet) {
      bulletBuffer.push(line.trimStart().replace(/^-\s*/, ""));
    } else {
      flushBullets(String(i));
      nodes.push(
        <p
          key={`p-${i}`}
          className="mt-0.5 leading-relaxed"
          style={{ color: styles.textColor, fontSize: styles.fontSize ?? "0.75rem" }}
        >
          {line}
        </p>
      );
    }
  });

  flushBullets("end");

  return <>{nodes}</>;
}
