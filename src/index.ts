import express, { Express, Request, Response } from 'express'
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './moddlewares/errors';

const app:Express = express();
app.use(express.json());


// Debugging middleware to log incoming requests
app.use((req, res, next) => {
    console.log('Request Method:', req.method);
    console.log('Request Path:', req.path);
    console.log('Request Body:', req.body); // Check if req.body is populated
    next();
});

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log:['query']
});

app.use(errorMiddleware)

app.listen(PORT, () =>{
    console.log('App Working');
})