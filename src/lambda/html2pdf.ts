import * as r from './shared/lambda-response';
import * as chromium from 'chrome-aws-lambda';
import * as s3 from '../lib/gateways/s3-gateway';
import config from '../lib/infrastructure/config';

import { APIGatewayEvent, Context, Callback, Handler } from 'aws-lambda';
import { logger } from '../lib/infrastructure/logger';
import { Browser } from 'puppeteer';

interface RenderRequest {
  url: string;
}

interface PdfFetchResult {
  pdfBuffer: Buffer;
  title: string;
}

async function fetchPdf(url: string): Promise<PdfFetchResult> {
  let browser: Browser;
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
    throw e;
  }
}

async function upload(pdfResult: PdfFetchResult): Promise<void> {
  const bucket = config.application.pdfBucket;
  const key = Date.now() + '.pdf';
  await s3.upload(bucket, key, pdfResult.pdfBuffer);
}

export const handler: Handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
  const body: RenderRequest = { url: 'https://stackoverflow.com' };
  if (!body.url) {
    return r.badRequest('invalid request', callback);
  }
  try {
    const pdfResult = await fetchPdf(body.url);
    await upload(pdfResult);
  } catch (e) {
    logger.error('failed to render pdf', e);
  }
};
