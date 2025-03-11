const { processJob } = require('../services/imgprocess');
const { appendJobResult, readJobsById } = require('../utils/csvutils');

let jobCounter = Date.now();

exports.submitJob = async (req, res) => {
  const { count, visits } = req.body;
  if (!count || !visits || count !== visits.length) {
    return res.status(400).json({ error: 'Invalid count or visits' });
  }

  const job_id = jobCounter++;

  processJob(job_id, visits, async (rows, status, errorList) => {
    const formattedRows = rows.map(r => ({
      ...r,
      job_id,
      status,
      error: '',
    }));

    const failedRows = errorList.map(err => ({
      job_id,
      store_id: err.store_id,
      image_url: '',
      perimeter: '',
      visit_time: '',
      status: 'failed',
      error: err.error,
    }));

    await appendJobResult([...formattedRows, ...failedRows]);
  });

  return res.status(201).json({ job_id });
};

exports.getJobStatus = async (req, res) => {
    const jobId = req.query.jobid;
    console.log("Received jobid:", jobId);
  
    if (!jobId) return res.status(400).json({});
  
    const rows = await readJobsById(jobId);
    if (rows.length === 0) {
      console.log("Job not found in job CSV");
      return res.status(400).json({});
    }
  
    const statuses = new Set(rows.map(r => r.status));
  
    if (statuses.has('failed')) {
      const errorList = rows
        .filter(r => r.status === 'failed')
        .map(r => ({ store_id: r.store_id, error: r.error }));
  
      return res.status(200).json({ status: 'failed', job_id: jobId, error: errorList });
    }
  
    const status = statuses.has('processing') ? 'processing' : 'completed';
    return res.status(200).json({ status, job_id: jobId });
  };
  
  
