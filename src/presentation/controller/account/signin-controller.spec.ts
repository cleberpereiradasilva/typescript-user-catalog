import { httpMissingParameter } from '../helper/http-response';
import { HttpRequest } from '../protocols/types';
import { SigninController } from './signin-controller'

describe('Signin Controller', () => {
    it('Ensure controller return 400 if email not provided', async () => {
        const sut = new SigninController()
        const httpRequest: HttpRequest = {
            body: {
                password: 'valid_password'
            }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse).toEqual(await httpMissingParameter('email'))
    });

});