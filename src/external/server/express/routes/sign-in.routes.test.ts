import request from 'supertest'
import app  from '../';
import { Controller } from '../../../../presentation/controller/protocols/interface';
import { HttpRequest, HttpResponse } from '../../../../presentation/controller/protocols/types';
import { httpResponseOk } from '../../../../presentation/controller/helper/http-response';
class MakeSigInControllerStub implements Controller{
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return httpResponseOk('')
    }
}

const makeSigInControllerStub = new MakeSigInControllerStub()
jest.mock('../../../../main/factories/sign-in.ts', () => ({
    makeSignInController: () => makeSigInControllerStub
}))

describe('Sign in route test', () => {
    it('should sign in using correct route', async () => {
        await request(app)
            .post('/api/sign-in')           
            .send({
                email: 'valid_email',
                password: 'valid_password'
            })
            .expect(200)
    });
});