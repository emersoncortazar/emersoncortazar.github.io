// draws each page of the cv pdf, since phone browsers often won't show a pdf inline.
// if this fails, the View CV link above it still opens the file.
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build';
const pages = document.getElementById('cv-pages');

try {
  const pdfjs = await import(`${PDFJS}/pdf.min.mjs`);
  pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS}/pdf.worker.min.mjs`;
  const pdf = await pdfjs.getDocument(pages.dataset.src).promise;

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const scale = 1600 / page.getViewport({ scale: 1 }).width;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', `Page ${n} of Emerson Cortazar's CV. Use the View CV link to open the text.`);
    pages.append(canvas);
    // the print intent keeps drawing when the tab is in the background
    await page.render({ canvasContext: canvas.getContext('2d'), viewport, intent: 'print' }).promise;
  }
} catch (error) {
  console.warn('Could not draw the CV', error);
}
