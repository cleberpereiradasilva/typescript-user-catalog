import request from 'supertest'
import { faker } from '@faker-js/faker';
import app  from '../';
import { AccountData } from '../../../../domain/usecase/account/type';
import { Controller } from '../../../../presentation/controller/protocols/interface';
import { HttpRequest, HttpResponse } from '../../../../presentation/controller/protocols/types';
import { httpResponseOk, httpUnAuthorized } from '../../../../presentation/controller/helper/http-response';

const accountData: AccountData = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password:  faker.internet.password()
}
class MakeSignInControllerStub implements Controller{
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return httpResponseOk(
            {
                id: 1,
                uuid: 'valid_uuid',
                groups:[],
                ...accountData
            })
    }
}

const makeSignInControllerStub = new MakeSignInControllerStub()

jest.mock('../../../../main/factories/sign-in.ts', () => ({
    makeSignInController: () => {
        const signInController = makeSignInControllerStub
        return signInController
    }
}))


describe('Sign in route test', () => {
    jest.spyOn(makeSignInControllerStub, 'handle').mockImplementationOnce(() => httpUnAuthorized())
    it('should return unauthorized when pass wrong token', async () => {
        await request(app)
            .post('/api/sign-in')           
            .send({
                email: 'valid_email',
                password: 'valid_password'
            })
            .expect(401)
    });

    it('should sign in using correct route and email and password', async () => {
        await request(app)
            .post('/api/sign-in')           
            .send({
                email: accountData.email,
                password:  accountData.password
            })
            .expect(200)
        
    });
});