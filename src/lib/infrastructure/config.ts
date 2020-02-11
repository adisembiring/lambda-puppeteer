export default {
  application: {
    name: process.env.APPLICATION_NAME || 'error',
    pdfBucket: process.env.PDF_BUCKET || 'error',
  },
};
