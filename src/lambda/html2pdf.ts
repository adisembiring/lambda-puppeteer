import * as r from './shared/lambda-response';
import * as chromium from 'chrome-aws-lambda';
import { APIGatewayEvent, Context, Callback, Handler } from 'aws-lambda';

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
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(body.url || 'https://example.com');
    const title = await page.title();
    return r.ok({ page_title: title, status: 'ok' }, callback);
  } catch (e) {
    return context.fail(e);
  }
};
