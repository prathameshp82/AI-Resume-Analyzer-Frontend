import * as pdfParse from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const parse = (pdfParse as unknown as { default: typeof pdfParse }).default ?? pdfParse;
  const data = await (parse as unknown as (buf: Buffer) => Promise<{ text: string }>)(buffer);
  return data.text;
}
