import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { logger } from '../lib/infrastructure/logger';
import { fetchPdf } from './converter';

export const handler: Handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
  logger.info('event request', event);
  const body = {
    url: 'https://css-tricks.com/examples/EditableInvoice/',
  };
  try {
    const pdfResult = await fetchPdf(body.url);
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=invoice01.pdf',
      },
      body: pdfResult.pdfBuffer.toString('utf-8'),
    };
    callback(null, response);
  } catch (e) {
    logger.error('failed to render pdf', e);
    context.done(e);
  }
};
