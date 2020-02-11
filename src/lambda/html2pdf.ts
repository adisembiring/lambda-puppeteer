import * as r from './shared/lambda-response';
import * as chromium from 'chrome-aws-lambda';
import { APIGatewayEvent, Context, Callback, Handler } from 'aws-lambda';
import { logger } from '../lib/infrastructure/logger';
import { Browser } from 'puppeteer';

interface RenderRequest {
  url: string;
}
export const handler: Handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
  const body: RenderRequest = { url: 'https://stackoverflow.com' };
  if (!body.url) {
    return r.badRequest('invalid request', callback);
  }
  let browser: Browser;
  try {
    logger.info('start rendering', body);
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(body.url || 'https://example.com');
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '2.54cm',
        right: '2.54cm',
        bottom: '2.54cm',
        left: '2.54cm',
      },
    });

    const title = await page.title();
    const resBody = { page_title: title, status: 'ok', pdf_size: pdf.length };
    logger.info('start completed', resBody);
    await browser.close();
    return r.ok(resBody, callback);
  } catch (e) {
    logger.error('start failed', e, body);
    return context.fail(e);
  }
};
