import { Callback } from 'aws-lambda';

export function badRequest(message: string, callback: Callback) {
  const response = {
    statusCode: 400,
    body: message,
  };
  callback(null, response);
}

export function created(body: any, callback: Callback) {
  const response = {
    statusCode: 201,
    body: JSON.stringify(body),
  };
  callback(null, response);
}

export function ok(body: any, callback: Callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };
  callback(null, response);
}
