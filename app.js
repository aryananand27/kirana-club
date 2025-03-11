const express = require('express');
const app = express();
const jobRoutes = require('./routes/jobroutes');
const fs = require('fs');
const path = require('path');


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', jobRoutes);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const csvPath = path.join(dataDir, 'jobs.csv');
if (!fs.existsSync(csvPath)) {
  fs.writeFileSync(csvPath, 'job_id,store_id,image_url,perimeter,status,error,visit_time\n');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
