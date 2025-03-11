const sharp = require('sharp');
const axios = require('axios');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const downloadImage = async (url) => {
  const response = await axios({ url, responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
};

exports.processJob = async (job_id, visits, onComplete) => {
  const results = [];
  const errors = [];

  for (const visit of visits) {
    for (const url of visit.image_url) {
      try {
        const imgBuffer = await downloadImage(url);
        const metadata = await sharp(imgBuffer).metadata();
        const perimeter = 2 * (metadata.width + metadata.height);

        await sleep(Math.random() * (400 - 100) + 100);

        results.push({
          store_id: visit.store_id,
          image_url: url,
          perimeter,
          visit_time: visit.visit_time
        });
      } catch (error) {
        errors.push({ store_id: visit.store_id, error: error.message });
      }
    }
  }

  const status = errors.length > 0 ? 'failed' : 'completed';
  onComplete(results, status, errors);
};
