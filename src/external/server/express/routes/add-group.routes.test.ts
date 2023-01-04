import request from 'supertest'
import app  from '../';
import { Controller } from '../../../../presentation/controller/protocols/interface';
import { HttpRequest, HttpResponse } from '../../../../presentation/controller/protocols/types';
import { httpResponseOk } from '../../../../presentation/controller/helper/http-response';
class MakeGroupControllerStub implements Controller{
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return httpResponseOk('')
    }
}

const makeGroupControllerStub = new MakeGroupControllerStub()
jest.mock('../../../../main/factories/group.ts', () => ({
    makeAddGroupController: () => makeGroupControllerStub
}))

describe('AddGroup route test', () => {
    it('should create a user group using correct route', async () => {
        await request(app)
            .post('/api/user-group')           
            .send({
                description: 'valid_description', 
            })
            .expect(200)
    });
});