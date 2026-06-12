// Client-only helper: extract text from a PDF File using pdf.js.
// pdfjs-dist ships an ESM worker; we point the worker to the bundled file URL.
export async function extractPdfText(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Wire up the worker using a bundler-friendly URL.
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

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
  await doc.destroy();
  return parts.join("\n\n").replace(/\s+\n/g, "\n").trim();
}
