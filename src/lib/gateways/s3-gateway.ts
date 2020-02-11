import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

import { logger } from '../infrastructure/logger';

export function upload(bucket: string, s3Key: string, file: Buffer | ArrayBuffer): Promise<string> {
  const s3 = AWSXRay.captureAWSClient(new AWS.S3()) as AWS.S3;
  return s3
    .upload({
      Bucket: bucket,
      Body: file,
      Key: s3Key,
    })
    .promise()
    .then(res => {
      logger.info('file is uploaded successfully', res);
      return s3Key;
    })
    .catch(err => {
      logger.error('failed to upload file to s3', err);
      throw err;
    });
}
