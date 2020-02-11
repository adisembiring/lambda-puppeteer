import * as chromium from 'chrome-aws-lambda';

import { Browser } from 'puppeteer';

export interface PdfFetchResult {
  pdfBuffer: Buffer;
  title: string;
}

export async function fetchPdf(url: string): Promise<PdfFetchResult> {
  let browser: Browser | undefined;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(url);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '2.54cm',
        right: '2.54cm',
        bottom: '2.54cm',
        left: '2.54cm',
      },
    });
    const title = await page.title();
    await browser.close();
    return { pdfBuffer, title };
  } catch (e) {
    if (browser) {
      await browser.close();
    }
    throw e;
  }
}
