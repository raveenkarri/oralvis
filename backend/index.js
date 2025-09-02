
require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db');

const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scans');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => res.send({ status: 'OralVis API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`OralVis backend listening on port ${PORT}`));
