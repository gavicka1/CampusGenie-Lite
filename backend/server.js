import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import healthRoutes from './routes/healthRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import studyTaskRoutes from './routes/studyTaskRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';
import { testDbConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', healthRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/study-tasks', studyTaskRoutes);
app.use('/api/events', eventRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  await testDbConnection();
});
