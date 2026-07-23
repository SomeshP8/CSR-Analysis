// Client-only helper: extract text from a PDF File using pdf.js.
// We use a CDN worker URL to avoid Vite's import-analysis plugin from trying
// to parse the pre-compiled, minified pdf.worker.min.mjs bundle (which breaks
// under Vite 7's stricter JS parser).
export async function extractPdfText(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  // Point to the matching CDN worker so Vite never has to bundle it.
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buffer }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ");
    parts.push(text);
    onProgress?.(i, doc.numPages);
  }
  await doc.cleanup();
  return parts.join("\n\n").replace(/\s+\n/g, "\n").trim();
}
