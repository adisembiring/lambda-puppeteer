import { APIGatewayEvent } from 'aws-lambda';

function isJson(str: any) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function parseRequestBody<T>(event: APIGatewayEvent): T | null {
  const body = event.body;
  if (isJson(body)) {
    return body as any;
  }
  try {
    return JSON.parse(body || '');
  } catch (e) {
    return null;
  }
}
