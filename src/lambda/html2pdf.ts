import * as r from './shared/lambda-response';
import * as chromium from 'chrome-aws-lambda';
import { APIGatewayEvent, Context, Callback, Handler } from 'aws-lambda';
import { logger } from '../lib/infrastructure/logger';

interface RenderRequest {
  url: string;
}
export const handler: Handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
  const body: RenderRequest = { url: 'https://stackoverflow.com' };
  if (!body.url) {
    return r.badRequest('invalid request', callback);
  }
  let browser = null;
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
    const title = await page.title();

    const resBody = { page_title: title, status: 'ok' };
    logger.info('start completed', resBody);
    return r.ok(resBody, callback);
  } catch (e) {
    logger.error('start failed', e, body);
    return context.fail(e);
  }
};
