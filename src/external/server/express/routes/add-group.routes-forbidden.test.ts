import request from 'supertest'
import app  from '../';


describe('AddGroup route test', () => {
    it('should return forbiden on create a user group using correct route', async () => {
        await request(app)
            .post('/api/user-group')
            .send({
                description: 'valid_description'
            })
            .expect(403)
    });
});