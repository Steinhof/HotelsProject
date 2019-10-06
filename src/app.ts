import express from 'express';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import logger from './config/logger';

// Express server
const app = express();

// Middleware
app.use(compression());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());

// Static files
app.use(express.static(path.resolve(__dirname, 'public')));

// Server start
const PORT = parseInt(process.env.SERVER_PORT as string, 10) || 8000;

app.listen(PORT, () => {
    logger.info(`Server running at port ${PORT}`);
});
