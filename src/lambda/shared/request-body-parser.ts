import { APIGatewayEvent } from 'aws-lambda';

function isJsonString(str: any) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function parseRequestBody<T>(event: APIGatewayEvent): T | null {
  const body = event.body;
  try {
    if (isJsonString(body)) {
      return JSON.parse(body || '');
    }
    return body || ({} as any);
  } catch (e) {
    return null;
  }
}
