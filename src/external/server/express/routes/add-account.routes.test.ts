import request from 'supertest'
import app  from '../';

describe('AddAccount route test', () => {
    xit('should create a account using correct route', async () => {
        
        await request(app)
            .post('/api/signup')           
            .send({
                name: 'valid_name', 
                email: 'valid_email',
                password: 'valid_password',
                confirmation: 'valid_password'
            })
            .expect(200)
    });
});