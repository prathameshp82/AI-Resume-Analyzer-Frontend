import { jsPDF } from "jspdf";

/**
 * Single-column PDF using standard Helvetica — readable by humans and typical ATS parsers.
 */
export function downloadOptimizedResumePdf(resumeText: string, baseFileName = "optimized_resume_ats") {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 50;
  const marginTop = 50;
  const marginBottom = 50;
  const usableWidth = pageWidth - marginX * 2;
  const lineHeight = 16;

  const lines = resumeText.split("\n");
  let y = marginTop;

  for (const line of lines) {
    const trimmed = line.trim();

    const isHeading =
      (trimmed.length > 0 && trimmed.length < 60 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) ||
      (trimmed.endsWith(":") && trimmed.length < 60);

    if (isHeading) {
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
    } else if (trimmed === "") {
      y += lineHeight * 0.5;
      continue;
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(50, 50, 50);
    }

    const wrapped: string[] = doc.splitTextToSize(trimmed, usableWidth);

    for (const wrappedLine of wrapped) {
      if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(wrappedLine, marginX, y);
      y += lineHeight;
    }

    if (isHeading) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(marginX, y - 4, pageWidth - marginX, y - 4);
      y += 4;
    }
  }

  const safe = baseFileName.replace(/[^a-zA-Z0-9-_]/g, "_").replace(/_+/g, "_").slice(0, 80) || "resume";
  doc.save(`${safe}.pdf`);
}

export function downloadOptimizedResumeTxt(resumeText: string, baseFileName = "optimized_resume_ats") {
  const safe = baseFileName.replace(/[^a-zA-Z0-9-_]/g, "_").replace(/_+/g, "_").slice(0, 80) || "resume";
  const blob = new Blob([resumeText.replace(/\r\n/g, "\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safe}.txt`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
