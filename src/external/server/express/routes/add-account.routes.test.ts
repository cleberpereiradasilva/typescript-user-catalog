import request from 'supertest'
import app  from '../';
import { Controller } from '../../../../presentation/controller/protocols/interface';
import { HttpRequest, HttpResponse } from '../../../../presentation/controller/protocols/types';
import { httpResponseOk } from '../../../../presentation/controller/helper/http-response';
class MakeSignupControllerStub implements Controller{
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return httpResponseOk('')
    }
}

const makeSignupControllerStub = new MakeSignupControllerStub()
jest.mock('../../../../main/factories/signup.ts', () => ({
    makeSignupController: () => makeSignupControllerStub
}))

describe('AddAccount route test', () => {
    it('should create a account using correct route', async () => {
        await request(app)
            .post('/api/signup')           
            .send({
                name: 'valid_name', 
                email: 'valid_email',
                password: 'valid_password',
                confirm: 'valid_password'
            })
            .expect(200)
    });
});