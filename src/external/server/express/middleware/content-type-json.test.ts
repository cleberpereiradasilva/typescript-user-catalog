import { Request, Response } from 'express';
import request from 'supertest'
import app  from '../';

describe('Json content type', () => {
    it('should return default content type as json', async () => {
        app.post('/test_content_type_json', (req: Request, res: Response) => {
            res.send('')
        })
        await request(app)
            .post('/test_content_type_json')           
            .expect('content-type', /json/)
    });

    it('should return custom content type as xml', async () => {
        app.post('/test_content_type_xml', (req: Request, res: Response) => {
            res.contentType('xml')
            res.send('')
        })
        await request(app)
            .post('/test_content_type_xml')           
            .expect('content-type', /xml/)
    });
});