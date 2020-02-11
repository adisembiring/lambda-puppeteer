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

async function upload(pdfResult: PdfFetchResult): Promise<string> {
  const bucket = config.application.pdfBucket;
  const key = Date.now() + '.pdf';
  await s3.upload(bucket, key, pdfResult.pdfBuffer);
  return key;
}

export const handler: Handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
  if (!event.body) {
    r.badRequest('invalid request', callback);
    return;
  }

  const body: RenderRequest = JSON.parse(event.body);
  if (!body.url) {
    return r.badRequest('invalid request', callback);
  }

  try {
    const pdfResult = await fetchPdf(body.url);
    const s3Key = await upload(pdfResult);

    const res = { status: 'OK', page_title: pdfResult.title, s3_key: s3Key };
    r.ok(res, callback);
  } catch (e) {
    logger.error('failed to render pdf', e);
    context.done(e);
  }
};
