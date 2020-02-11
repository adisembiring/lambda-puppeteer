export default {
  application: {
    name: process.env.APPLICATION_NAME || 'error',
    raw_file_bucket: process.env.RAW_FILE_BUCKET || 'error',
    final_file_bucket: process.env.FINAL_FILE_BUCKET || 'error',
    sqs_raw_image_uploaded: process.env.SQS_RAW_IMAGE_UPLOADED || 'error',
  },
};
