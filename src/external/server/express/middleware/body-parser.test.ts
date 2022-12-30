import { Request, Response } from 'express';
import request from 'supertest'
import { DataSource } from 'typeorm';
import app  from '../';
import { AppDataSource } from '../../../db/typeorm/db/jest-pg-data-source';
import { Account } from '../../../db/typeorm/entity/account';

describe('Body parser test', () => {
    it('should parse body as json', async () => {
        app.post('/test_body_parser', (req: Request, res: Response) => {
            res.send(req.body)
        })
        await request(app)
            .post('/test_body_parser')
            .send({field: 'valid_field'})
            .expect({field: 'valid_field'})
    });
});