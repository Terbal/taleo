// client/src/utils/export.js
import { jsPDF } from "jspdf";

export function exportAsPDF(story) {
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(18);
  doc.text(story.title, 10, y);
  y += 10;
  doc.setFontSize(12);

  story.paragraphs.forEach((p, i) => {
    const split = doc.splitTextToSize(p.content, 180);
    doc.text(split, 10, y);
    y += split.length * 6 + 4;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`${story.title}.pdf`);
}

export function exportAsTXT(story) {
  const lines = [story.title, "", ...story.paragraphs.map((p) => p.content)];
  const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${story.title}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
