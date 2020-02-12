import * as r from './shared/lambda-response';
import * as s3 from '../lib/gateways/s3-gateway';
import config from '../lib/infrastructure/config';

import { APIGatewayEvent, Context, Callback, Handler } from 'aws-lambda';
import { logger } from '../lib/infrastructure/logger';
import { fetchPdf, PdfFetchResult } from './converter';
import { parseRequestBody } from './shared/request-body-parser';

interface RenderRequest {
  url: string;
}

async function upload(pdfResult: PdfFetchResult): Promise<string> {
  const bucket = config.application.pdfBucket;
  const key = Date.now() + '.pdf';
  await s3.upload(bucket, key, pdfResult.pdfBuffer);
  return key;
}

export const handler: Handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
  logger.info('event request', event);
  const body = parseRequestBody<RenderRequest>(event);
  if (!body) {
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
