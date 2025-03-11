const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');

const csvPath = path.join(__dirname, '../data/jobs.csv');


const csvHeaders = [
  { id: 'job_id', title: 'job_id' },
  { id: 'store_id', title: 'store_id' },
  { id: 'image_url', title: 'image_url' },
  { id: 'perimeter', title: 'perimeter' },
  { id: 'status', title: 'status' },
  { id: 'error', title: 'error' },
  { id: 'visit_time', title: 'visit_time' },
];


const initializeCsv = async () => {
  if (!fs.existsSync(csvPath) || fs.statSync(csvPath).size === 0) {
    const headerLine = csvHeaders.map(h => h.title).join(',') + '\n';
    fs.writeFileSync(csvPath, headerLine, 'utf8');
  }
};

const csvWriter = createCsvWriter({
  path: csvPath,
  header: csvHeaders,
  append: true,
});

const appendJobResult = async (rows) => {
  await initializeCsv(); 
  await csvWriter.writeRecords(rows);
};

const readJobsById = async (jobId) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (data) => {
        if (data.job_id && data.job_id.trim() === String(jobId).trim()) {
          results.push(data);
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

module.exports = {
  appendJobResult,
  readJobsById,
};
