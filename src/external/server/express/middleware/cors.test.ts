import { Request, Response } from 'express';
import request from 'supertest'
import app  from '../';

describe('CORS test', () => {
    it('should enable cors', async () => {
        app.post('/test_cors', (req: Request, res: Response) => {
            res.send('')
        })
        await request(app)
            .post('/test_cors')           
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*')
    });
});